import React, { useEffect, useRef, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { ArrowLeft, Delete, Fingerprint, LockKeyhole, WalletCards } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verifyPassword } from '../../services/passwordStorage';
import { usePreferences } from '../../context/PreferencesContext';
import { styles } from './styles';

interface UnlockScreenProps {
    onUnlock: () => void;
    title?: string;
    subtitle?: string;
    pinLength?: number;
    showBiometric?: boolean;
}

const KEYPAD_ROWS = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']];

export default function UnlockScreen({
    onUnlock,
    title = '解锁账本',
    subtitle = '输入密码查看你的资产与记录',
    pinLength = 6,
    showBiometric = false,
}: UnlockScreenProps) {
    const { theme } = usePreferences();
    const insets = useSafeAreaInsets();
    const [pin, setPin] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [authenticating, setAuthenticating] = useState(false);
    const submitting = useRef(false);

    useEffect(() => {
        if (pin.length === pinLength && !submitting.current) void verifyPin(pin);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pin, pinLength]);

    const verifyPin = async (candidate: string) => {
        if (submitting.current) return;
        submitting.current = true;
        try {
            const valid = await verifyPassword(candidate);
            if (valid) {
                setPin('');
                onUnlock();
                return;
            }
            const nextAttempts = attempts + 1;
            setAttempts(nextAttempts);
            setPin('');
            Alert.alert('PIN 不正确', `请重新输入 (${nextAttempts}/5)`);
        } catch (error) {
            Alert.alert('无法验证 PIN', (error as Error).message);
            setPin('');
        } finally {
            submitting.current = false;
        }
    };

    const pressKey = (key: string) => {
        if (key === 'delete') {
            setPin((value) => value.slice(0, -1));
            return;
        }
        if (key === 'clear') {
            setPin('');
            return;
        }
        setPin((value) => (value.length < pinLength ? value + key : value));
    };

    const unlockWithBiometrics = async () => {
        if (!showBiometric || authenticating) return;
        setAuthenticating(true);
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            if (!hasHardware || !enrolled) {
                Alert.alert('生物识别不可用', '请在系统设置中录入指纹或人脸，或使用 PIN 解锁。');
                return;
            }
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: '验证身份以解锁账本',
                promptSubtitle: '请使用设备生物识别',
                cancelLabel: '使用 PIN',
                disableDeviceFallback: true,
                biometricsSecurityLevel: 'weak',
            });
            if (result.success) onUnlock();
        } catch (error) {
            Alert.alert('生物识别失败', (error as Error).message || '请使用 PIN 解锁。');
        } finally {
            setAuthenticating(false);
        }
    };

    const renderNumber = (number: string) => (
        <TouchableOpacity key={number} style={styles.key} onPress={() => pressKey(number)}>
            <Text style={[styles.keyText, { color: theme.text }]}>{number}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.screen, { backgroundColor: theme.background }]}>
            <View pointerEvents="none" style={[styles.ambientBlue, { backgroundColor: theme.blueSoft }]} />
            <View pointerEvents="none" style={[styles.ambientGreen, { backgroundColor: theme.greenSoft }]} />
            <View style={[styles.brandMark, { backgroundColor: theme.blue }]}>
                <WalletCards color="#FFFFFF" size={26} strokeWidth={1.8} />
            </View>
            <View style={styles.heading}>
                <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                <Text style={[styles.subtitle, { color: theme.secondaryText }]}>{subtitle}</Text>
            </View>
            <View style={styles.dotsRow} accessibilityLabel={`${pin.length} of ${pinLength} digits entered`}>
                {Array.from({ length: pinLength }, (_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.pinDot,
                            { backgroundColor: index < pin.length ? theme.blue : theme.blueSoft },
                        ]}
                    />
                ))}
            </View>
            <View style={styles.keypad}>
                {KEYPAD_ROWS.map((row, index) => (
                    <View key={index} style={styles.keyRow}>{row.map(renderNumber)}</View>
                ))}
                <View style={styles.keyRow}>
                    <TouchableOpacity style={styles.key} onPress={unlockWithBiometrics} disabled={!showBiometric}>
                        {showBiometric
                            ? <Fingerprint color={theme.blue} size={25} />
                            : <View style={styles.invisibleKey} />}
                    </TouchableOpacity>
                    {renderNumber('0')}
                    <TouchableOpacity style={styles.key} onPress={() => pressKey('delete')}>
                        <Delete color={theme.secondaryText} size={23} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.privacyNote, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                <LockKeyhole color={theme.tertiaryText} size={13} />
                <Text style={[styles.privacyText, { color: theme.tertiaryText }]}>安全解锁 · 账本内容仅在本机</Text>
            </View>
            {attempts >= 5 && (
                <Text style={[styles.attemptMessage, { color: theme.danger }]}>连续输错较多，请稍后再试。</Text>
            )}
            <TouchableOpacity style={styles.backButton} onPress={() => pressKey('clear')}>
                <ArrowLeft color={theme.tertiaryText} size={18} />
                <Text style={[styles.backText, { color: theme.tertiaryText }]}>清空输入</Text>
            </TouchableOpacity>
        </View>
    );
}
