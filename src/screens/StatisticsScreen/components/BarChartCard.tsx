import React from 'react';
import { Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { AppTheme } from '../../../theme/colors';
import { formatMoney } from '../../../services/exchangeRate';
import { styles } from '../styles';

interface BarDataItem { value: number; label: string; frontColor: string }
interface BarChartCardProps { barData: BarDataItem[]; currency: string; theme: AppTheme }

function BarChartCard({ barData, currency, theme }: BarChartCardProps) {
    if (barData.length === 0) return null;
    const maximum = Math.max(...barData.map((item) => item.value), 1);
    return (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>各资产价值 · {currency}</Text>
            <View style={styles.chartContainer}>
                <BarChart
                    data={barData}
                    barWidth={27}
                    spacing={18}
                    roundedTop
                    hideRules
                    xAxisColor={theme.divider}
                    yAxisColor="transparent"
                    yAxisTextStyle={{ color: theme.tertiaryText, fontSize: 9 }}
                    xAxisLabelTextStyle={{ color: theme.secondaryText, fontSize: 9 }}
                    noOfSections={4}
                    maxValue={maximum * 1.2}
                    minHeight={6}
                    showValuesAsTopLabel
                    topLabelTextStyle={{ color: theme.secondaryText, fontSize: 8, fontWeight: '600' }}
                    formatYLabel={(value: string) => formatMoney(Number(value), currency, true)}
                />
            </View>
        </View>
    );
}

export default BarChartCard;
