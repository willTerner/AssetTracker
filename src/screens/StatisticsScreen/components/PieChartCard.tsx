import React from 'react';
import { Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Colors } from '../../../constants';
import { styles } from '../styles';

interface PieDataItem {
    value: number;
    color: string;
    text: string;
}

interface PieChartCardProps {
    pieData: PieDataItem[];
    totalCNY: number;
    cnyData: { platform: string; cnyValue: number }[];
    chartColors: string[];
}

function renderPieCenter(totalCNY: number) {
    const displayValue =
        totalCNY >= 10000
            ? `${(totalCNY / 10000).toFixed(1)}万`
            : totalCNY.toFixed(0);
    return (
        <View style={styles.pieCenterWrap}>
            <Text style={styles.pieCenterValue}>¥{displayValue}</Text>
            <Text style={styles.pieCenterLabel}>总值</Text>
        </View>
    );
}

function PieChartCard({ pieData, totalCNY, cnyData, chartColors }: PieChartCardProps) {
    if (pieData.length === 0) return null;

    return (
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
            <View style={styles.legendContainer}>
                {cnyData.map((item, index) => {
                    const percent = totalCNY > 0 ? ((item.cnyValue / totalCNY) * 100).toFixed(1) : '0';
                    return (
                        <View key={item.platform} style={styles.legendItem}>
                            <View
                                style={[
                                    styles.legendDot,
                                    { backgroundColor: chartColors[index % chartColors.length] },
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
        </View>
    );
}

export default PieChartCard;
