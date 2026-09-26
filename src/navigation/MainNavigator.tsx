import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTabBar from '../components/AppTabBar';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import AssetForm from '../screens/AssetForm';
import { AssetsStackParamList, MainTabParamList } from '../types';

const Stack = createNativeStackNavigator<AssetsStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function AssetsStack() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AssetForm" component={AssetForm} />
        </Stack.Navigator>
    );
}

function TabNavigator() {
    const insets = useSafeAreaInsets();
    return (
        <Tabs.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    height: 74 + Math.max(insets.bottom, 8),
                    borderTopWidth: 0,
                    backgroundColor: 'transparent',
                    elevation: 0,
                },
            }}
            tabBar={(props) => <AppTabBar {...props} />}
        >
            <Tabs.Screen name="AssetsTab" component={AssetsStack} options={{ title: '概览' }} />
            <Tabs.Screen
                name="StatisticsTab"
                component={StatisticsScreen}
                options={{ title: '分析' }}
            />
            <Tabs.Screen
                name="SettingsTab"
                component={SettingsScreen}
                options={{ title: '设置' }}
            />
        </Tabs.Navigator>
    );
}

export default function MainNavigator() {
    return (
        <NavigationContainer>
            <TabNavigator />
        </NavigationContainer>
    );
}
