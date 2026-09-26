import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ChartNoAxesCombined, House, Plus, Settings2 } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePreferences } from '../context/PreferencesContext';
import { styles } from './AppTabBar.styles';

const TAB_ITEMS = [
    { route: 'AssetsTab', label: '概览', Icon: House },
    { route: 'StatisticsTab', label: '分析', Icon: ChartNoAxesCombined },
    { route: 'SettingsTab', label: '设置', Icon: Settings2 },
] as const;

export default function AppTabBar({ state, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const { theme } = usePreferences();

    const openAddForm = () => {
        navigation.navigate({
            name: 'AssetsTab',
            params: { screen: 'AssetForm', params: { type: 'ADD' } },
        } as never);
    };

    const renderTab = (route: (typeof TAB_ITEMS)[number]) => {
        const routeIndex = state.routes.findIndex((item) => item.name === route.route);
        const focused = state.index === routeIndex;
        const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: state.routes[routeIndex]?.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.route as never);
        };
        const Icon = route.Icon;
        return (
            <TouchableOpacity
                key={route.route}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                onPress={onPress}
                style={styles.tabButton}
            >
                <Icon size={21} color={focused ? theme.blue : theme.tertiaryText} />
                <Text style={[styles.tabLabel, { color: focused ? theme.blue : theme.tertiaryText }]}>{route.label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View pointerEvents="box-none" style={[styles.dockPosition, { paddingBottom: Math.max(insets.bottom, 8) }]}>
            <View style={[styles.dock, { backgroundColor: theme.surfaceStrong, borderColor: theme.outline, shadowColor: theme.shadow }]}>
                {renderTab(TAB_ITEMS[0])}
                {renderTab(TAB_ITEMS[1])}
                <TouchableOpacity accessibilityRole="button" accessibilityLabel="新增资产" onPress={openAddForm} style={[styles.addButton, { backgroundColor: theme.blue }]}>
                    <Plus color="#FFFFFF" size={25} strokeWidth={2.5} />
                </TouchableOpacity>
                {renderTab(TAB_ITEMS[2])}
            </View>
        </View>
    );
}
