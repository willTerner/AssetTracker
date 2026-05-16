import React from 'react';
import { Text, View } from 'react-native';
import { Colors } from '../../../constants';
import { Asset } from '../../../types';
import { styles } from '../styles';

interface CnyDataItem {
    platform: string;
    cnyValue: number;
    asset: Asset;
}

interface DataTableProps {
    data: CnyDataItem[];
    totalCNY: number;
    chartColors: string[];
    getValueChange: (asset: Asset) => { change: number; changePercent: string } | null;
}

function DataTable({ data, totalCNY, chartColors, getValueChange }: DataTableProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>资产明细</Text>
            <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.colPlatform]}>平台</Text>
                <Text style={[styles.tableHeaderCell, styles.colValue]}>价值</Text>
                <Text style={[styles.tableHeaderCell, styles.colCny]}>CNY</Text>
                <Text style={[styles.tableHeaderCell, styles.colPercent]}>占比</Text>
                <Text style={[styles.tableHeaderCell, styles.colChange]}>变化</Text>
            </View>
            {data.map((item, index) => {
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
                                { color: chartColors[index % chartColors.length] },
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
    );
}

export default DataTable;
