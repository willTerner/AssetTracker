import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Text, TouchableOpacity, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChartNoAxesCombined, ChevronDown } from 'lucide-react-native';
import RateAttribution from '../../components/RateAttribution';
import { usePreferences } from '../../context/PreferencesContext';
import { ExchangeRateState, convertCurrency, formatMoney, getExchangeRateState, subscribeToExchangeRates } from '../../services/exchangeRate';
import { getAssets } from '../../services/storage';
import { getSnapshots, recordSnapshot, ValueSnapshot } from '../../services/valueHistory';
import { summarizeAssets } from '../../services/valuation';
import { Asset } from '../../types';
import { buildLineData } from './buildLineData';
import DataTable from './components/DataTable';
import PieChartCard from './components/PieChartCard';
import TrendChartCard from './components/TrendChartCard';
import { styles } from './styles';

const CHART_COLORS = ['#0A84FF', '#34C759', '#FF9F0A', '#AF52DE', '#63AEFF', '#7EB89B', '#D4745E', '#6E6E73'];
type DateFilter = 'week' | 'month' | 'quarter' | 'year' | 'ytd' | 'all';
const DATE_FILTERS: DateFilter[] = ['week', 'month', 'quarter', 'year', 'ytd', 'all'];
const DATE_FILTER_LABELS: Record<DateFilter, string> = { week: '本周', month: '本月', quarter: '本季度', year: '本年', ytd: '今年', all: '全部' };

export default function StatisticsScreen() {
    const insets = useSafeAreaInsets();
    const { theme, preferences } = usePreferences();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [snapshots, setSnapshots] = useState<ValueSnapshot[]>([]);
    const [rateState, setRateState] = useState<ExchangeRateState>({ rates: null, updatedAt: null, fetchedAt: null, error: null });
    const [dateFilter, setDateFilter] = useState<DateFilter>('month');
    const [loading, setLoading] = useState(true);
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
    const stickyDateLabel = DATE_FILTER_LABELS[dateFilter];
    const cycleDateFilter = () => {
        setDateFilter((current) => {
            const currentIndex = DATE_FILTERS.indexOf(current);
            return DATE_FILTERS[(currentIndex + 1) % DATE_FILTERS.length];
        });
    };
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

    const loadData = useCallback(async () => {
        try {
            const [loadedAssets, loadedSnapshots, savedRates] = await Promise.all([
                getAssets(), getSnapshots(), getExchangeRateState(),
            ]);
            setAssets(loadedAssets);
            setSnapshots(loadedSnapshots);
            setRateState(savedRates);
        } catch (error) {
            console.error('Error loading statistics:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            void loadData();
            return subscribeToExchangeRates(setRateState);
        }, [loadData, preferences.defaultCurrency])
    );

    const summary = useMemo(
        () => summarizeAssets(assets, preferences.defaultCurrency, rateState.rates),
        [assets, preferences.defaultCurrency, rateState.rates]
    );
    useEffect(() => {
        if (summary.totalCNY !== null && assets.length > 0) void recordSnapshot(summary.totalCNY);
    }, [assets.length, summary.totalCNY]);

    const canShowStats = summary.displayTotal !== null;
    const displayTotal = summary.displayTotal ?? 0;
    const data = canShowStats
        ? summary.items.flatMap(({ asset, displayValue }) => displayValue === null ? [] : [{ platform: asset.platform, displayValue, asset }])
        : [];
    const chartData = data.map((item, index) => ({
        value: item.displayValue,
        color: CHART_COLORS[index % CHART_COLORS.length],
        text: item.platform,
    }));
    const displaySnapshots = rateState.rates || preferences.defaultCurrency === 'CNY'
        ? snapshots.map((snapshot) => ({
            ...snapshot,
            totalCNY: convertCurrency(snapshot.totalCNY, 'CNY', preferences.defaultCurrency, rateState.rates) ?? NaN,
        })).filter((snapshot) => Number.isFinite(snapshot.totalCNY))
        : [];
    const lineData = buildLineData(displaySnapshots, dateFilter);
    const trendUnavailableMessage = preferences.defaultCurrency !== 'CNY' && !rateState.rates && snapshots.length > 0
        ? '汇率暂不可用，历史 CNY 快照无法按当前币种重算。'
        : undefined;
    const getValueChange = (asset: Asset) => {
        if (asset.previousValue === null) return null;
        const change = asset.value - asset.previousValue;
        const changePercent = asset.previousValue !== 0 ? ((change / asset.previousValue) * 100).toFixed(1) : '0';
        return { change, changePercent };
    };

    if (loading) {
        return <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}><ActivityIndicator color={theme.blue} size="large" /></View>;
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Animated.ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 8, paddingBottom: 112 + insets.bottom },
                ]}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={onScroll}
            >
                <>
                    <View style={styles.pageHeader}>
                        <View>
                            <Text style={[styles.pageEyebrow, { color: theme.tertiaryText }]}>资产趋势与构成</Text>
                            <Text style={[styles.pageTitle, { color: theme.text }]}>分析</Text>
                        </View>
                        <ChartNoAxesCombined color={theme.blue} size={23} />
                    </View>
                    <View style={[styles.headerCard, { backgroundColor: theme.surfaceStrong }]}>
                        <Text style={[styles.totalLabel, { color: theme.secondaryText }]}>总资产 · {preferences.defaultCurrency}</Text>
                        <Text style={[styles.totalValue, { color: theme.text }]}>
                            {summary.displayTotal === null ? '暂不可换算' : formatMoney(summary.displayTotal, preferences.defaultCurrency)}
                        </Text>
                        <Text style={[styles.totalSubtitle, { color: theme.tertiaryText }]}>
                            {summary.displayTotal === null ? '连接网络更新汇率后查看完整统计' : `共 ${assets.length} 条资产记录`}
                        </Text>
                        {rateState.rates && <RateAttribution theme={theme} />}
                    </View>
                    {summary.displayTotal === null && (
                        <Text style={[styles.noDataText, { color: theme.secondaryText }]}>当前汇率不可用，统计图表暂不展示不完整数据。</Text>
                    )}
                </>
                <TrendChartCard lineData={lineData} dateFilter={dateFilter} onDateFilterChange={setDateFilter} currency={preferences.defaultCurrency} theme={theme} unavailableMessage={trendUnavailableMessage} />
                {canShowStats && (
                    <>
                        <PieChartCard pieData={chartData} total={displayTotal} currency={preferences.defaultCurrency} data={data} chartColors={CHART_COLORS} theme={theme} />
                        <DataTable data={data} total={displayTotal} currency={preferences.defaultCurrency} chartColors={CHART_COLORS} getValueChange={getValueChange} theme={theme} />
                    </>
                )}
            </Animated.ScrollView>
            <Animated.View
                pointerEvents={showStickyHeader ? 'box-none' : 'none'}
                accessibilityElementsHidden={!showStickyHeader}
                importantForAccessibility={showStickyHeader ? 'auto' : 'no-hide-descendants'}
                style={[
                    styles.stickyOverlay,
                    {
                        height: insets.top + 76,
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
                            height: insets.top + 76,
                            paddingTop: insets.top,
                            backgroundColor: theme.surfaceStrong,
                            borderBottomColor: theme.divider,
                            shadowColor: theme.shadow,
                        },
                    ]}
                >
                    <View pointerEvents="box-none" style={styles.stickyHeaderContent}>
                        <Text style={[styles.stickyTitle, { color: theme.text }]}>分析</Text>
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityLabel={`选择统计周期，当前${stickyDateLabel}`}
                            onPress={cycleDateFilter}
                            style={[styles.stickyRangeChip, { backgroundColor: theme.surface }]}
                        >
                            <Text style={[styles.stickyRangeText, { color: theme.secondaryText }]}>
                                {stickyDateLabel}
                            </Text>
                            <ChevronDown color={theme.secondaryText} size={14} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}
