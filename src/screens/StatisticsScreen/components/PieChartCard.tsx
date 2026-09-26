import React from 'react';
import { Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { AppTheme } from '../../../theme/colors';
import { formatMoney } from '../../../services/exchangeRate';
import { styles } from '../styles';

interface PieDataItem {
    value: number;
    color: string;
    text: string;
}
interface StatisticsValueItem {
    platform: string;
    displayValue: number;
}

interface PieChartCardProps {
    pieData: PieDataItem[];
    total: number;
    currency: string;
    data: StatisticsValueItem[];
    chartColors: string[];
    theme: AppTheme;
}

function PieChartCard({ pieData, total, currency, data, chartColors, theme }: PieChartCardProps) {
    if (pieData.length === 0) return null;
    return (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>资产构成</Text>
            <View style={styles.chartContainer}>
                <PieChart
                    data={pieData}
                    donut
                    showTooltip
                    focusOnPress
                    textColor={theme.text}
                    tooltipBackgroundColor="transparent"
                    radius={92}
                    innerRadius={58}
                    centerLabelComponent={() => (
                        <View style={styles.pieCenterWrap}>
                            <Text style={[styles.pieCenterValue, { color: theme.text }]}>
                                {formatMoney(total, currency, true)}
                            </Text>
                            <Text style={[styles.pieCenterLabel, { color: theme.tertiaryText }]}>
                                总资产
                            </Text>
                        </View>
                    )}
                    tooltipComponent={(index: number) => {
                        const item = pieData[index];
                        if (!item?.text) return null;
                        const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
                        return (
                            <View
                                style={[
                                    styles.pieTooltip,
                                    { backgroundColor: theme.surfaceStrong },
                                ]}
                            >
                                <Text
                                    style={[styles.pieTooltipText, { color: theme.text }]}
                                    numberOfLines={1}
                                >
                                    {item.text}
                                </Text>
                                <Text
                                    style={[
                                        styles.pieTooltipText,
                                        {
                                            color: item.color,
                                            fontSize: 11,
                                            fontWeight: '700',
                                            marginTop: 2,
                                        },
                                    ]}
                                >
                                    {percent}%
                                </Text>
                            </View>
                        );
                    }}
                />
            </View>
            <View style={styles.legendContainer}>
                {data.map((item, index) => {
                    const percent =
                        total > 0 ? ((item.displayValue / total) * 100).toFixed(1) : '0.0';
                    return (
                        <View key={`${item.platform}-${index}`} style={styles.legendItem}>
                            <View
                                style={[
                                    styles.legendDot,
                                    { backgroundColor: chartColors[index % chartColors.length] },
                                ]}
                            />
                            <Text
                                style={[styles.legendText, { color: theme.secondaryText }]}
                                numberOfLines={1}
                            >
                                {item.platform}
                            </Text>
                            <Text style={[styles.legendPercent, { color: theme.text }]}>
                                {percent}%
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

export default PieChartCard;
