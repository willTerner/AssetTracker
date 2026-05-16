import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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

type SortOrder = 'asc' | 'desc' | null;

function DataTable({ data, totalCNY, chartColors, getValueChange }: DataTableProps) {
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const sortedData = useMemo(() => {
        if (!sortOrder) return data;
        return [...data].sort((a, b) => {
            const pctA = totalCNY > 0 ? a.cnyValue / totalCNY : 0;
            const pctB = totalCNY > 0 ? b.cnyValue / totalCNY : 0;
            return sortOrder === 'desc' ? pctB - pctA : pctA - pctB;
        });
    }, [data, totalCNY, sortOrder]);

    const toggleSort = () => {
        setSortOrder((prev) => ( prev === 'desc' ? 'asc' : 'desc'));
    };

    const sortIndicator = sortOrder === 'desc' ? ' ▼' : sortOrder === 'asc' ? ' ▲' : '';

    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>资产明细</Text>
            <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.colPlatform]}>平台</Text>
                <Text style={[styles.tableHeaderCell, styles.colValue]}>价值</Text>
                <Text style={[styles.tableHeaderCell, styles.colCny]}>CNY</Text>
                <TouchableOpacity
                    style={[styles.colPercent, { alignItems: 'flex-end' }]}
                    onPress={toggleSort}
                    activeOpacity={0.6}
                >
                    <Text style={[styles.tableHeaderCell, { color: sortOrder ? Colors.coral : Colors.warmBrown }]}>
                        占比{sortIndicator}
                    </Text>
                </TouchableOpacity>
                <Text style={[styles.tableHeaderCell, styles.colChange]}>变化</Text>
            </View>
            {sortedData.map((item, index) => {
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
