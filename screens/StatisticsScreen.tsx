import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart, BarChart, LineChart } from 'react-native-gifted-charts';
import Constants from 'expo-constants';
import { getAssets } from '../services/storage';
import { convertToCNY } from '../services/exchangeRate';
import { getSnapshots, recordSnapshot, ValueSnapshot } from '../services/valueHistory';
import { Colors } from '../components/constants';
import { Asset } from '../types';

const CHART_COLORS = [
    Colors.coral,
    Colors.honey,
    Colors.sage,
    '#D4A843',
    Colors.espresso,
    Colors.coralDark,
    '#C8963C',
    '#8B7355',
];

function renderPieCenter(totalCNY: number) {
    const displayValue =
        totalCNY >= 10000
            ? `${(totalCNY / 10000).toFixed(1)}万`
            : totalCNY.toFixed(0);
    return (
        <View style={pieStyles.centerWrap}>
            <Text style={pieStyles.centerValue}>¥{displayValue}</Text>
            <Text style={pieStyles.centerLabel}>总值</Text>
        </View>
    );
}

function StatisticsScreen() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [cnyData, setCnyData] = useState<
    { platform: string; cnyValue: number; asset: Asset }[]
    >([]);
    const [totalCNY, setTotalCNY] = useState(0);
    const [loading, setLoading] = useState(true);
    const [snapshots, setSnapshots] = useState<ValueSnapshot[]>([]);
    const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'year' | 'ytd' | 'all'>('month');

    const loadData = async () => {
        setLoading(true);
        try {
            const loadedAssets = await getAssets();
            setAssets(loadedAssets);

            const results: { platform: string; cnyValue: number; asset: Asset }[] = [];
            let total = 0;

            for (const asset of loadedAssets) {
                const cny = await convertToCNY(asset.value, asset.currency);
                if (cny) {
                    results.push({ platform: asset.platform, cnyValue: cny, asset });
                    total += cny;
                }
            }

            setCnyData(results);
            setTotalCNY(total);

            await recordSnapshot(total);
            const loadedSnapshots = await getSnapshots();
            setSnapshots(loadedSnapshots);
        } catch (error) {
            console.error('Error loading statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.coral} />
            </View>
        );
    }

    // Pie chart data
    const pieData = cnyData.map((item, index) => ({
        value: parseFloat(item.cnyValue.toFixed(2)),
        color: CHART_COLORS[index % CHART_COLORS.length],
        text: item.platform,
    }));

    // Bar chart data
    const barData = cnyData.map((item, index) => ({
        value: parseFloat(item.cnyValue.toFixed(2)),
        label: item.platform.length > 4 ? item.platform.slice(0, 4) : item.platform,
        frontColor: CHART_COLORS[index % CHART_COLORS.length],
    }));

    const renderLegend = () => (
        <View style={styles.legendContainer}>
            {cnyData.map((item, index) => {
                const percent = totalCNY > 0 ? ((item.cnyValue / totalCNY) * 100).toFixed(1) : '0';
                return (
                    <View key={item.platform} style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendDot,
                                { backgroundColor: CHART_COLORS[index % CHART_COLORS.length] },
                            ]}
                        />
                        <Text style={styles.legendText} numberOfLines={1}>
                            {item.platform}
                        </Text>
                        <Text style={styles.legendPercent}>{percent}%</Text>
                    </View>
                );
            })}
        </View>
    );

    const getValueChange = (asset: Asset) => {
        if (asset.previousValue !== null && asset.previousValue !== undefined) {
            const change = asset.value - asset.previousValue;
            const changePercent =
                asset.previousValue !== 0
                    ? ((change / asset.previousValue) * 100).toFixed(1)
                    : '0';
            return { change, changePercent };
        }
        return null;
    };

    const buildLineData = () => {
        if (snapshots.length === 0) return [];

        const now = new Date();
        const today = now.toISOString().slice(0, 10);

        let startDate: string;
        switch (dateFilter) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10);
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 86400000).toISOString().slice(0, 10);
                break;
            case 'year':
                startDate = new Date(now.getTime() - 365 * 86400000).toISOString().slice(0, 10);
                break;
            case 'ytd':
                startDate = `${now.getFullYear()}-01-01`;
                break;
            case 'all':
            default:
                startDate = snapshots[0].date;
                break;
        }

        const start = new Date(startDate);
        const end = new Date(today);
        const rangeDays = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;
        const step = Math.max(1, Math.ceil(rangeDays / 10));

        // Build a sorted list of snapshot dates for fast "most recent before" lookup
        const sorted = [...snapshots].sort((a, b) => a.date.localeCompare(b.date));
        const snapVals = sorted.map((s) => s.totalCNY);
        const snapDates = sorted.map((s) => s.date);

        const getValueAt = (dateStr: string): number => {
            // Find the most recent snapshot on or before dateStr
            for (let i = snapDates.length - 1; i >= 0; i -= 1) {
                if (snapDates[i] <= dateStr) return snapVals[i];
            }
            return 0;
        };

        const formatLabel = (d: Date): string => {
            const m = d.getMonth() + 1;
            const day = d.getDate();
            const mm = String(m).padStart(2, '0');
            const dd = String(day).padStart(2, '0');
            if (step <= 2) return `${mm}/${dd}`;
            if (step <= 7) return `${mm}/${dd}`;
            return `${d.getFullYear()}/${mm}`;
        };

        const result: { value: number; label: string }[] = [];
        const cursor = new Date(start);
        while (cursor <= end) {
            const dateStr = cursor.toISOString().slice(0, 10);
            result.push({
                value: getValueAt(dateStr),
                label: formatLabel(cursor),
            });
            cursor.setDate(cursor.getDate() + step);
        }

        // Always ensure the last point is today
        if (result.length > 0 && result[result.length - 1].label !== formatLabel(end)) {
            const todayStr = end.toISOString().slice(0, 10);
            result.push({
                value: getValueAt(todayStr),
                label: formatLabel(end),
            });
        }

        return result;
    };

    const lineData = buildLineData();

    const DATE_FILTERS = [
        { key: 'week' as const, label: '近一周' },
        { key: 'month' as const, label: '近一月' },
        { key: 'year' as const, label: '近一年' },
        { key: 'ytd' as const, label: '年初至今' },
        { key: 'all' as const, label: '全部' },
    ];

    const formatYLabel = (label: string): string => {
        const val = parseFloat(label);
        if (val >= 10000) return `${(val / 10000).toFixed(1)}万`;
        return val.toFixed(0);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {/* Total Header */}
            <View style={styles.headerCard}>
                <Text style={styles.totalLabel}>总资产 · CNY</Text>
                <Text style={styles.totalValue}>
                    ¥{totalCNY.toFixed(2)}
                </Text>
                <Text style={styles.totalSubtitle}>共 {assets.length} 项资产</Text>
            </View>

            {/* Donut Chart */}
            {pieData.length > 0 && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>资产占比</Text>
                    <View style={styles.chartContainer}>
                        <PieChart
                            data={pieData}
                            donut
                            showTooltip
                            focusOnPress
                            textColor={Colors.espresso}
                            tooltipBackgroundColor="transparent"
                            radius={110}
                            innerRadius={55}
                            /* eslint-disable-next-line react/no-unstable-nested-components */
                            centerLabelComponent={() => renderPieCenter(totalCNY)}
                            /* eslint-disable-next-line react/no-unstable-nested-components */
                            tooltipComponent={(index: number) => {
                                const item = pieData[index];
                                if (!item?.text) return null;
                                return (
                                    <View style={styles.pieTooltip}>
                                        <Text style={styles.pieTooltipText}>{item.text}</Text>
                                    </View>
                                );
                            }}
                        />
                    </View>
                    {renderLegend()}
                </View>
            )}

            {/* Bar Chart */}
            {barData.length > 0 && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>各平台资产价值 (CNY)</Text>
                    <View style={styles.chartContainer}>
                        <BarChart
                            data={barData}
                            barWidth={38}
                            spacing={24}
                            roundedTop
                            roundedBottom
                            hideRules
                            xAxisColor={Colors.sand}
                            yAxisColor="transparent"
                            yAxisTextStyle={{ color: Colors.warmBrown, fontSize: 10 }}
                            xAxisLabelTextStyle={{ color: Colors.warmBrown, fontSize: 10 }}
                            noOfSections={4}
                            maxValue={Math.max(...barData.map((d) => d.value)) * 1.2}
                            showValuesAsTopLabel
                            topLabelTextStyle={{ color: Colors.espresso, fontSize: 10, fontWeight: '600' }}
                        />
                    </View>
                </View>
            )}

            {/* Trend Chart */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>资产趋势</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                >
                    {DATE_FILTERS.map((f) => (
                        <TouchableOpacity
                            key={f.key}
                            style={[
                                styles.filterChip,
                                dateFilter === f.key && styles.filterChipActive,
                            ]}
                            onPress={() => setDateFilter(f.key)}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    dateFilter === f.key && styles.filterChipTextActive,
                                ]}
                            >
                                {f.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                {lineData.length >= 2 ? (
                    <View style={styles.chartContainer}>
                        <LineChart
                            data={lineData}
                            areaChart
                            curved
                            color={Colors.coral}
                            startFillColor={Colors.coral}
                            endFillColor={Colors.offWhite}
                            startOpacity={0.6}
                            endOpacity={0.05}
                            hideDataPoints
                            thickness={2.5}
                            initialSpacing={20}
                            endSpacing={20}
                            spacing={55}
                            xAxisLabelTextStyle={{
                                color: Colors.warmBrown,
                                fontSize: 9,
                            }}
                            yAxisTextStyle={{
                                color: Colors.warmBrown,
                                fontSize: 10,
                            }}
                            xAxisColor={Colors.sand}
                            yAxisColor="transparent"
                            hideRules
                            noOfSections={3}
                            isAnimated
                            formatYLabel={formatYLabel}
                        />
                    </View>
                ) : (
                    <Text style={styles.noDataText}>
                        数据不足，随时间积累更多数据后显示趋势
                    </Text>
                )}
            </View>

            {/* Data Table */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>资产明细</Text>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, styles.colPlatform]}>平台</Text>
                    <Text style={[styles.tableHeaderCell, styles.colValue]}>价值</Text>
                    <Text style={[styles.tableHeaderCell, styles.colCny]}>CNY</Text>
                    <Text style={[styles.tableHeaderCell, styles.colPercent]}>占比</Text>
                    <Text style={[styles.tableHeaderCell, styles.colChange]}>变化</Text>
                </View>
                {/* Table Rows */}
                {cnyData.map((item, index) => {
                    const percent = totalCNY > 0 ? ((item.cnyValue / totalCNY) * 100).toFixed(1) : '0';
                    const change = getValueChange(item.asset);
                    return (
                        <View key={item.platform} style={styles.tableRow}>
                            <Text
                                style={[styles.tableCell, styles.colPlatform]}
                                numberOfLines={1}
                            >
                                {item.platform}
                            </Text>
                            <Text style={[styles.tableCell, styles.colValue]}>
                                {item.asset.value.toFixed(0)} {item.asset.currency}
                            </Text>
                            <Text style={[styles.tableCell, styles.colCny]}>
                                ¥{item.cnyValue.toFixed(0)}
                            </Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    styles.colPercent,
                                    { color: CHART_COLORS[index % CHART_COLORS.length] },
                                ]}
                            >
                                {percent}%
                            </Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    styles.colChange,
                                    change
                                        ? {
                                            color:
                                                change.change >= 0
                                                    ? Colors.sage
                                                    : Colors.coralDark,
                                        }
                                        : { color: Colors.warmBrown },
                                ]}
                            >
                                {change
                                    ? `${change.change >= 0 ? '+' : ''}${change.changePercent}%`
                                    : '-'}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.offWhite,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
        paddingTop: Constants.statusBarHeight,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.offWhite,
    },
    headerCard: {
        backgroundColor: Colors.espresso,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: Colors.espressoDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    totalLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    totalValue: {
        color: Colors.honey,
        fontSize: 34,
        fontWeight: '800',
    },
    totalSubtitle: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 10,
        marginTop: 4,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: Colors.espresso,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.espresso,
        marginBottom: 16,
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    pieCenterWrap: {
        alignItems: 'center',
    },
    pieCenterValue: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.espresso,
    },
    pieCenterLabel: {
        fontSize: 10,
        color: Colors.warmBrown,
    },
    legendContainer: {
        gap: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 3,
    },
    legendText: {
        flexShrink: 1,
        minWidth: 0,
        fontSize: 12,
        color: Colors.espresso,
        fontWeight: '500',
    },
    legendPercent: {
        flexShrink: 0,
        fontSize: 12,
        color: Colors.warmBrown,
        fontWeight: '600',
    },
    pieTooltip: {
        backgroundColor: Colors.espresso,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    pieTooltipText: {
        color: Colors.honey,
        fontSize: 12,
        fontWeight: '600',
    },
    filterRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: Colors.sand,
        backgroundColor: Colors.white,
    },
    filterChipActive: {
        backgroundColor: Colors.coral,
        borderColor: Colors.coral,
    },
    filterChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.warmBrown,
    },
    filterChipTextActive: {
        color: Colors.white,
    },
    noDataText: {
        fontSize: 13,
        color: Colors.warmBrown,
        textAlign: 'center',
        paddingVertical: 20,
        opacity: 0.6,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1.5,
        borderBottomColor: Colors.sand,
    },
    tableHeaderCell: {
        fontSize: 11,
        color: Colors.warmBrown,
        fontWeight: '600',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
    },
    tableCell: {
        fontSize: 12,
        color: Colors.espresso,
    },
    colPlatform: {
        flex: 2.5,
    },
    colValue: {
        flex: 2.5,
        textAlign: 'right',
    },
    colCny: {
        flex: 2,
        textAlign: 'right',
    },
    colPercent: {
        flex: 1.5,
        textAlign: 'right',
        fontWeight: '600',
    },
    colChange: {
        flex: 1.5,
        textAlign: 'right',
        fontWeight: '600',
    },
});

const pieStyles = StyleSheet.create({
    centerWrap: {
        alignItems: 'center',
    },
    centerValue: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.espresso,
    },
    centerLabel: {
        fontSize: 10,
        color: Colors.warmBrown,
    },
});

export default StatisticsScreen;
