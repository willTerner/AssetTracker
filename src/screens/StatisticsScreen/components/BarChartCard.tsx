import React from 'react';
import { Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Colors } from '../../../constants';
import { styles } from '../styles';

interface BarDataItem {
    value: number;
    label: string;
    frontColor: string;
}

interface BarChartCardProps {
    barData: BarDataItem[];
}

function BarChartCard({ barData }: BarChartCardProps) {
    if (barData.length === 0) return null;

    return (
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
    );
}

export default BarChartCard;
