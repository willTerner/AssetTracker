import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ArrowDownRight,
    ArrowUpRight,
    Ellipsis,
    Minus,
    RefreshCw,
    WalletCards,
} from 'lucide-react-native';
import RateAttribution from '../../components/RateAttribution';
import { usePreferences } from '../../context/PreferencesContext';
import { formatMoney } from '../../services/exchangeRate';
import { AssetsStackParamList } from '../../types';
import AssetItem from './components/AssetItem';
import ExportMenu from './components/ExportMenu';
import { useHomeActions } from './useHomeActions';
import { styles } from './styles';

type HomeScreenProps = NativeStackScreenProps<AssetsStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const insets = useSafeAreaInsets();
    const { theme, preferences } = usePreferences();
    const home = useHomeActions(navigation);
    const [showStickyHeader, setShowStickyHeader] = useState(false);
    const stickyVisibleRef = useRef(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const stickyThreshold = Math.max(8, insets.top - 8);
    const stickyProgress = scrollY.interpolate({
        inputRange: [stickyThreshold, stickyThreshold + 48],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });
    const stickyTranslateY = scrollY.interpolate({
        inputRange: [stickyThreshold, stickyThreshold + 48],
        outputRange: [-10, 0],
        extrapolate: 'clamp',
    });
    const { assets, rateState, summary, latestChange } = home;

    const changeColor = latestChange
        ? latestChange.amount >= 0
            ? theme.green
            : theme.danger
        : theme.secondaryText;
    const changeBackgroundColor = latestChange
        ? latestChange.amount >= 0
            ? theme.greenSoft
            : `${theme.danger}1A`
        : theme.blueMuted;
    const changePercent = latestChange
        ? `${latestChange.percent >= 0 ? '+' : ''}${latestChange.percent.toFixed(1)}%`
        : '—';
    const changeAmount = latestChange
        ? `${latestChange.amount >= 0 ? '+' : ''}${formatMoney(latestChange.amount, preferences.defaultCurrency)}`
        : '暂无记录';
    const unavailableLabel = !rateState.rates && assets.length === 0
        ? '等待汇率'
        : summary.unavailableCount === 0
          ? '全部可用'
          : `${summary.unavailableCount} 项`;
    const unavailableColor = summary.unavailableCount > 0
        ? theme.orange
        : rateState.rates
          ? theme.green
          : theme.secondaryText;

    const changeBadge = (
        <View style={[styles.changeBadge, { backgroundColor: changeBackgroundColor }]}>
            {latestChange ? (
                latestChange.amount >= 0 ? (
                    <ArrowUpRight color={changeColor} size={13} strokeWidth={2.5} />
                ) : (
                    <ArrowDownRight color={changeColor} size={13} strokeWidth={2.5} />
                )
            ) : (
                <Minus color={changeColor} size={13} strokeWidth={2.5} />
            )}
            <Text style={[styles.changeValue, { color: changeColor }]}>{changePercent}</Text>
        </View>
    );
    const summaryFooter = (
        <View style={styles.summaryFooter}>
            <View style={styles.changeBlock}>
                {changeBadge}
                <Text style={[styles.changeCaption, { color: theme.secondaryText }]} numberOfLines={1}>
                    {latestChange ? '较上次更新' : '暂无变化记录'}
                </Text>
            </View>
            <Text style={[styles.updatedText, { color: theme.tertiaryText }]} numberOfLines={1}>
                {home.statusText}
            </Text>
        </View>
    );
    const summaryStats = (
        <View style={styles.summaryStats}>
            <View style={[styles.summaryStat, { backgroundColor: theme.surface }]}>
                <Text style={[styles.statLabel, { color: theme.secondaryText }]}>变化金额</Text>
                <Text
                    style={[styles.statValue, { color: theme.text }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                >
                    {changeAmount}
                </Text>
            </View>
            <View style={[styles.summaryStat, { backgroundColor: theme.surface }]}>
                <Text style={[styles.statLabel, { color: theme.secondaryText }]}>待换算资产</Text>
                <Text style={[styles.statValue, { color: unavailableColor }]} numberOfLines={1}>
                    {unavailableLabel}
                </Text>
            </View>
        </View>
    );
    const rateAttribution = rateState.rates ? (
        <View style={styles.attributionRow}>
            <RateAttribution theme={theme} />
        </View>
    ) : null;

    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const shouldShowStickyHeader = event.nativeEvent.contentOffset.y > stickyThreshold;
        if (shouldShowStickyHeader !== stickyVisibleRef.current) {
            stickyVisibleRef.current = shouldShowStickyHeader;
            setShowStickyHeader(shouldShowStickyHeader);
        }
    }, [stickyThreshold]);
    const onScroll = useMemo(
        () => Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true, listener: handleScroll }
        ),
        [handleScroll, scrollY]
    );

    return (
        <View style={[styles.screen, { backgroundColor: theme.background }]}>
            <Animated.ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={home.refreshing}
                        onRefresh={home.refresh}
                        tintColor={theme.blue}
                    />
                }
                contentContainerStyle={[
                    styles.content,
                    { paddingTop: insets.top + 7, paddingBottom: 112 + insets.bottom },
                ]}
                scrollEventThrottle={16}
                onScroll={onScroll}
                showsVerticalScrollIndicator={false}
            >
                <View
                    pointerEvents="none"
                    style={[styles.ambientBlue, { backgroundColor: theme.blueSoft }]}
                />
                <View
                    pointerEvents="none"
                    style={[styles.ambientPurple, { backgroundColor: theme.purpleSoft }]}
                />

                <View
                    style={[
                        styles.summaryCard,
                        {
                            backgroundColor: theme.surfaceStrong,
                            borderColor: theme.outline,
                            shadowColor: theme.shadow,
                        },
                    ]}
                >
                        <View style={styles.summaryHeader}>
                            <Text style={[styles.summaryTitle, { color: theme.text }]}>我的账本</Text>
                            <View style={styles.headerActions}>
                                <TouchableOpacity
                                    accessibilityRole="button"
                                    accessibilityLabel="刷新汇率"
                                    onPress={() => void home.refresh()}
                                    style={styles.headerButton}
                                >
                                    <RefreshCw color={theme.blue} size={19} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    accessibilityRole="button"
                                    accessibilityLabel="导入或导出资产数据"
                                    onPress={home.openDataMenu}
                                    style={styles.headerButton}
                                >
                                    <Ellipsis color={theme.secondaryText} size={21} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={[styles.totalLabel, { color: theme.secondaryText }]}>
                            总资产 · {preferences.defaultCurrency}
                        </Text>
                        <Text
                            style={[styles.totalValue, { color: theme.text }]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {home.loading
                                ? '正在计算…'
                                : summary.displayTotal === null
                                  ? '暂不可换算'
                                  : formatMoney(summary.displayTotal, preferences.defaultCurrency)}
                        </Text>
                        {summaryFooter}
                        <View style={[styles.summaryDivider, { backgroundColor: theme.divider }]} />
                        {summaryStats}
                        {rateAttribution}
                </View>

                <View
                    style={styles.sectionHeader}
                >
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>资产账户</Text>
                    <Text style={[styles.sectionCount, { color: theme.secondaryText }]}>
                        {assets.length} 个账户
                    </Text>
                </View>

                {assets.length === 0 ? (
                    <View
                        style={[
                            styles.emptyCard,
                            { backgroundColor: theme.surfaceStrong, borderColor: theme.outline },
                        ]}
                    >
                        <View style={[styles.emptyIcon, { backgroundColor: theme.blueSoft }]}>
                            <WalletCards color={theme.blue} size={23} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: theme.text }]}>还没有资产记录</Text>
                        <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
                            点底部的「+」添加第一条资产。
                        </Text>
                    </View>
                ) : (
                    <View style={styles.assetList}>
                        {summary.items.map(({ asset }) => (
                            <AssetItem
                                key={asset.id}
                                item={asset}
                                displayCurrency={preferences.defaultCurrency}
                                rates={rateState.rates}
                                onEdit={home.editAsset}
                                onDelete={home.removeAsset}
                            />
                        ))}
                    </View>
                )}
            </Animated.ScrollView>
            <Animated.View
                pointerEvents={showStickyHeader ? 'box-none' : 'none'}
                accessibilityElementsHidden={!showStickyHeader}
                importantForAccessibility={showStickyHeader ? 'auto' : 'no-hide-descendants'}
                style={[
                    styles.stickyOverlay,
                    {
                        height: insets.top + 84,
                        opacity: stickyProgress,
                        transform: [{ translateY: stickyTranslateY }],
                    },
                ]}
                >
                <View
                    pointerEvents="box-none"
                    style={[
                        styles.stickyHeader,
                        {
                            height: insets.top + 84,
                            paddingTop: insets.top,
                            backgroundColor: theme.surfaceStrong,
                            borderBottomColor: theme.divider,
                            shadowColor: theme.shadow,
                        },
                    ]}
                >
                    <View pointerEvents="box-none" style={styles.stickyHeaderContent}>
                        <View style={styles.stickyGreetingRow}>
                            <Text style={[styles.stickyTitle, { color: theme.text }]}>我的账本</Text>
                            <View style={styles.headerActions}>
                                <TouchableOpacity
                                    accessibilityRole="button"
                                    accessibilityLabel="刷新汇率"
                                    onPress={() => void home.refresh()}
                                    style={styles.headerButton}
                                >
                                    <RefreshCw color={theme.blue} size={19} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    accessibilityRole="button"
                                    accessibilityLabel="导入或导出资产数据"
                                    onPress={home.openDataMenu}
                                    style={styles.headerButton}
                                >
                                    <Ellipsis color={theme.secondaryText} size={21} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.stickyBalanceRow}>
                            <Text style={[styles.stickyBalanceLabel, { color: theme.secondaryText }]}>总资产</Text>
                            <Text
                                style={[styles.stickyBalanceValue, { color: theme.text }]}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                            >
                                {home.loading
                                    ? '正在计算…'
                                    : summary.displayTotal === null
                                      ? '暂不可换算'
                                      : formatMoney(summary.displayTotal, preferences.defaultCurrency)}
                            </Text>
                        </View>
                    </View>
                </View>
            </Animated.View>
            <ExportMenu
                visible={home.showExportMenu}
                onClose={() => home.setShowExportMenu(false)}
                onExport={home.handleExport}
            />
        </View>
    );
}
