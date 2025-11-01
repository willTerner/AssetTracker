import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Sentry from '@sentry/react-native';
import HomeScreen from './screens/HomeScreen';
import AssetForm from './components/AssetForm';
import SetPasswordScreen from './screens/SetPasswordScreen';
import UnlockScreen from './screens/UnlockScreen';
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
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  // 如果没有设置密码,显示设置密码页面
  if (!passwordExists) {
    return (
      <>
        <StatusBar style="light" />
        <SetPasswordScreen onPasswordSet={handlePasswordSet} />
      </>
    );
  }

  // 如果已设置密码但未解锁，显示解锁页面
  if (!isUnlocked) {
    return (
      <>
        <StatusBar style="light" />
        <UnlockScreen onUnlock={handleUnlock} />
      </>
    );
  }

  // 密码验证通过，显示主应用
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '资产统计' }} />
        <Stack.Screen
          name="AssetForm"
          component={AssetForm}
          options={{ title: '资产管理' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
});

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
