import * as Sentry from '@sentry/react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PreferencesProvider, usePreferences } from './context/PreferencesContext';
import { styles } from './App.styles';
import LaunchSplashScreen from './screens/LaunchSplashScreen';
import SetPasswordScreen from './screens/SetPasswordScreen';
import UnlockScreen from './screens/UnlockScreen';
import { getDatabase } from './services/database';
import { cleanupLegacyStorage, getSecurityState, migrateLegacyDataAndSetPassword } from './services/migration';
import { getLegacyPassword } from './services/passwordStorage';
import { refreshRatesIfNeeded } from './services/exchangeRate';
import { AutoLockMinutes } from './services/settings';
import MainNavigator from './navigation/MainNavigator';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

Sentry.init({
    dsn: 'https://b4c4cb5ef356c7021308290fa130b287@o1262612.ingest.us.sentry.io/4510289974657024',
    sendDefaultPii: false,
    enableLogs: false,
});

type SecurityState = 'new' | 'legacy' | 'current';
const COLD_SPLASH_MIN_MS = 900;

function AppShell() {
    const { theme, preferences, preferencesReady } = usePreferences();
    const [securityState, setSecurityState] = useState<SecurityState>('new');
    const [bootstrapReady, setBootstrapReady] = useState(false);
    const [splashVisible, setSplashVisible] = useState(false);
    const [legacyVerified, setLegacyVerified] = useState(false);
    const [legacyPinLength, setLegacyPinLength] = useState(6);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [bootError, setBootError] = useState<string | null>(null);
    const [bootstrapAttempt, setBootstrapAttempt] = useState(0);
    const unlockedRef = useRef(false);
    const backgroundedAt = useRef<number | null>(null);
    const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lockMinutesRef = useRef<AutoLockMinutes>(preferences.autoLockMinutes);
    const appStateRef = useRef(AppState.currentState);

    useEffect(() => {
        unlockedRef.current = isUnlocked;
    }, [isUnlocked]);

    useEffect(() => {
        lockMinutesRef.current = preferences.autoLockMinutes;
        if (backgroundedAt.current !== null && unlockedRef.current) {
            if (lockTimer.current) clearTimeout(lockTimer.current);
            const elapsed = Date.now() - backgroundedAt.current;
            const remaining = lockMinutesRef.current * 60_000 - elapsed;
            lockTimer.current = setTimeout(() => setIsUnlocked(false), Math.max(remaining, 0));
        }
    }, [preferences.autoLockMinutes]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextState) => {
            const previousState = appStateRef.current;
            appStateRef.current = nextState;
            if (nextState === 'background' && previousState !== 'background' && unlockedRef.current) {
                backgroundedAt.current = Date.now();
                if (lockTimer.current) clearTimeout(lockTimer.current);
                lockTimer.current = setTimeout(
                    () => setIsUnlocked(false),
                    lockMinutesRef.current * 60_000
                );
            } else if (nextState === 'active' && previousState === 'background') {
                if (lockTimer.current) clearTimeout(lockTimer.current);
                if (backgroundedAt.current !== null && Date.now() - backgroundedAt.current >= lockMinutesRef.current * 60_000) {
                    setIsUnlocked(false);
                }
                backgroundedAt.current = null;
                void refreshRatesIfNeeded(false);
            }
        });
        return () => {
            subscription.remove();
            if (lockTimer.current) clearTimeout(lockTimer.current);
        };
    }, []);

    useEffect(() => {
        if (!preferencesReady) return undefined;
        let mounted = true;
        const startedAt = Date.now();
        const bootstrap = async () => {
            try {
                await getDatabase();
                const status = await getSecurityState();
                if (status === 'current') await cleanupLegacyStorage();
                if (status === 'legacy') {
                    const oldPassword = await getLegacyPassword();
                    setLegacyPinLength(Math.min(6, Math.max(4, oldPassword?.length ?? 6)));
                }
                if (!mounted) return;
                setSecurityState(status);
                setBootstrapReady(true);
                void refreshRatesIfNeeded(false);
                if (Platform.OS === 'android') {
                    setSplashVisible(true);
                    await SplashScreen.hideAsync().catch(() => undefined);
                    const remaining = COLD_SPLASH_MIN_MS - (Date.now() - startedAt);
                    if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
                    if (mounted) setSplashVisible(false);
                } else {
                    await SplashScreen.hideAsync().catch(() => undefined);
                }
            } catch (error) {
                if (!mounted) return;
                setBootError((error as Error).message || '无法打开加密账本。');
                setBootstrapReady(true);
                await SplashScreen.hideAsync().catch(() => undefined);
            }
        };
        void bootstrap();
        return () => { mounted = false; };
    }, [bootstrapAttempt, preferencesReady]);

    const completeSetup = async (pin: string) => {
        await migrateLegacyDataAndSetPassword(pin);
        setSecurityState('current');
        setLegacyVerified(false);
        setIsUnlocked(true);
    };

    const retryBootstrap = () => {
        setBootError(null);
        setBootstrapReady(false);
        setBootstrapAttempt((attempt) => attempt + 1);
    };

    if (!bootstrapReady) return null;
    if (splashVisible) return <><StatusBar style="dark" /><LaunchSplashScreen /></>;
    if (bootError) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
                <Text style={[styles.errorTitle, { color: theme.text }]}>账本暂时无法打开</Text>
                <Text style={[styles.errorMessage, { color: theme.secondaryText }]}>{bootError}</Text>
                <TouchableOpacity onPress={retryBootstrap} style={[styles.retryButton, { backgroundColor: theme.blue }]}>
                    <Text style={styles.retryButtonText}>重试</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (securityState === 'new' || (securityState === 'legacy' && legacyVerified)) {
        return (
            <>
                <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
                <SetPasswordScreen mode={securityState === 'legacy' ? 'migration' : 'initial'} onComplete={completeSetup} />
            </>
        );
    }

    if (!isUnlocked) {
        const isLegacy = securityState === 'legacy';
        return (
            <>
                <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
                <UnlockScreen
                    title={isLegacy ? '验证旧密码' : '解锁账本'}
                    subtitle={isLegacy ? '验证后设置新 PIN 并加密迁移旧数据' : '输入 PIN 查看你的资产与记录'}
                    pinLength={isLegacy ? legacyPinLength : 6}
                    showBiometric={!isLegacy && preferences.biometricEnabled}
                    onUnlock={() => isLegacy ? setLegacyVerified(true) : setIsUnlocked(true)}
                />
            </>
        );
    }

    return (
        <>
            <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
            <MainNavigator />
        </>
    );
}

function App() {
    return (
        <SafeAreaProvider>
            <PreferencesProvider>
                <AppShell />
            </PreferencesProvider>
        </SafeAreaProvider>
    );
}

export default Sentry.wrap(App);
