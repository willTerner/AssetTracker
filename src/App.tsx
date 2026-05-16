import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Sentry from '@sentry/react-native';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import AssetForm from './components/AssetForm';
import StatisticsScreen from './screens/StatisticsScreen/StatisticsScreen';
import SetPasswordScreen from './screens/SetPasswordScreen/SetPasswordScreen';
import UnlockScreen from './screens/UnlockScreen/UnlockScreen';
import { hasPassword } from './services/passwordStorage';
import { RootStackParamList } from './types';

Sentry.init({
    dsn: 'https://b4c4cb5ef356c7021308290fa130b287@o1262612.ingest.us.sentry.io/4510289974657024',

    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,

    // Enable Logs
    enableLogs: true,

    // Configure Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.mobileReplayIntegration()],

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
});

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function AssetsStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#5C3D2E',
                },
                headerTintColor: '#F3BC8B',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AssetForm"
                component={AssetForm}
                options={{ title: '资产管理' }}
            />
        </Stack.Navigator>
    );
}

export default Sentry.wrap(() => {
    const [isLoading, setIsLoading] = useState(true);
    const [passwordExists, setPasswordExists] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        checkPassword();
    }, []);

    const checkPassword = async () => {
        const exists = await hasPassword();
        setPasswordExists(exists);
        setIsLoading(false);
    };

    const handlePasswordSet = async () => {
        setPasswordExists(true);
        setIsUnlocked(true);
    };

    const handleUnlock = () => {
        setIsUnlocked(true);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#E8956D" />
            </View>
        );
    }

    // 如果没有设置密码,显示设置密码页面
    if (!passwordExists) {
        return (
            <>
                <StatusBar style="dark" />
                <SetPasswordScreen onPasswordSet={handlePasswordSet} />
            </>
        );
    }

    // 如果已设置密码但未解锁，显示解锁页面
    if (!isUnlocked) {
        return (
            <>
                <StatusBar style="dark" />
                <UnlockScreen onUnlock={handleUnlock} />
            </>
        );
    }

    // 密码验证通过，显示主应用
    return (
        <NavigationContainer>
            <StatusBar style="light" />
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#FFFFFF',
                        borderTopColor: '#FDE4C5',
                        borderTopWidth: 1,
                        paddingTop: 4,
                        paddingBottom: 8,
                        height: 60,
                    },
                    tabBarActiveTintColor: '#E8956D',
                    tabBarInactiveTintColor: '#A08070',
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: '600',
                    },
                }}
            >
                <Tab.Screen
                    name="AssetsTab"
                    component={AssetsStack}
                    options={{
                        tabBarLabel: '资产',
                        tabBarIcon: ({ color, size }) => (
                            <Text style={{ fontSize: size, color }}>💰</Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="StatisticsTab"
                    component={StatisticsScreen}
                    options={{
                        tabBarLabel: '统计',
                        tabBarIcon: ({ color, size }) => (
                            <Text style={{ fontSize: size, color }}>📊</Text>
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
});

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFAF3',
    },
});
