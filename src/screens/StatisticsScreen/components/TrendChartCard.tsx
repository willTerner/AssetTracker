import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { AppTheme } from '../../../theme/colors';
import { formatMoney } from '../../../services/exchangeRate';
import { styles } from '../styles';

type DateFilter = 'week' | 'month' | 'quarter' | 'year' | 'ytd' | 'all';
interface LineDataItem { value: number | undefined; label: string }
interface TrendChartCardProps {
    lineData: LineDataItem[];
    dateFilter: DateFilter;
    onDateFilterChange: (filter: DateFilter) => void;
    currency: string;
    theme: AppTheme;
    unavailableMessage?: string;
    showFilters?: boolean;
}

const DATE_FILTERS: Array<{ key: DateFilter; label: string }> = [
    { key: 'week', label: '周' },
    { key: 'month', label: '月' },
    { key: 'quarter', label: '季' },
    { key: 'year', label: '年' },
    { key: 'ytd', label: '今年' },
    { key: 'all', label: '全部' },
];
const CHART_TARGET_WIDTH = 330;
const CHART_PADDING = 48;

export default function TrendChartCard({
    lineData,
    dateFilter,
    onDateFilterChange,
    currency,
    theme,
    unavailableMessage,
    showFilters = true,
}: TrendChartCardProps) {
    const spacing = lineData.length > 1
        ? Math.max(28, Math.floor((CHART_TARGET_WIDTH - CHART_PADDING) / (lineData.length - 1)))
        : 55;
    const definedValues = lineData.map((point) => point.value).filter((value): value is number => value !== undefined);
    let rangeChange: { percent: number; label: string } | null = null;
    if (definedValues.length >= 2 && definedValues[0] !== 0) {
        const percent = ((definedValues[definedValues.length - 1] - definedValues[0]) / definedValues[0]) * 100;
        rangeChange = { percent, label: `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%` };
    }

    return (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
            <View style={styles.trendHeader}>
                <Text style={[styles.cardTitle, styles.trendTitle, { color: theme.text }]}>资产趋势</Text>
                {rangeChange && (
                    <View style={styles.trendChangeRow}>
                        <Text style={[styles.trendChangeLabel, { color: theme.tertiaryText }]}>区间变化</Text>
                        <Text style={[styles.trendChangeValue, { color: rangeChange.percent >= 0 ? theme.green : theme.danger }]}>{rangeChange.label}</Text>
                    </View>
                )}
            </View>
            {showFilters && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                    {DATE_FILTERS.map((filter) => {
                        const active = dateFilter === filter.key;
                        return (
                            <TouchableOpacity
                                key={filter.key}
                                style={[styles.filterChip, { borderColor: active ? theme.blue : theme.divider, backgroundColor: active ? theme.blue : theme.surfaceStrong }]}
                                onPress={() => onDateFilterChange(filter.key)}
                            >
                                <Text style={[styles.filterChipText, { color: active ? '#FFFFFF' : theme.secondaryText }]}>{filter.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}
            {lineData.length >= 2 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.chartContainer}>
                        <LineChart
                            data={lineData}
                            areaChart
                            color={theme.blue}
                            startFillColor={theme.blue}
                            endFillColor={theme.background}
                            startOpacity={0.22}
                            endOpacity={0.015}
                            hideDataPoints
                            thickness={2.5}
                            initialSpacing={17}
                            endSpacing={20}
                            spacing={spacing}
                            xAxisLabelTextStyle={{ color: theme.tertiaryText, fontSize: 9 }}
                            yAxisTextStyle={{ color: theme.tertiaryText, fontSize: 9 }}
                            xAxisColor={theme.divider}
                            yAxisColor="transparent"
                            hideRules
                            noOfSections={3}
                            isAnimated
                            formatYLabel={(value: string) => formatMoney(Number(value), currency, true)}
                        />
                    </View>
                </ScrollView>
            ) : (
                <Text style={[styles.noDataText, { color: theme.tertiaryText }]}>
                    {unavailableMessage ?? '数据不足，随时间积累更多记录后显示趋势。'}
                </Text>
            )}
        </View>
    );
}
