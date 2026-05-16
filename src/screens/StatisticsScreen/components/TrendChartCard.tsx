import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Colors } from '../../../constants';
import { styles } from '../styles';

interface LineDataItem {
    value: number;
    label: string;
}

interface TrendChartCardProps {
    lineData: LineDataItem[];
    dateFilter: string;
    onDateFilterChange: (filter: 'week' | 'month' | 'year' | 'ytd' | 'all') => void;
}

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

function TrendChartCard({ lineData, dateFilter, onDateFilterChange }: TrendChartCardProps) {
    return (
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
                        onPress={() => onDateFilterChange(f.key)}
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
    );
}

export default TrendChartCard;
