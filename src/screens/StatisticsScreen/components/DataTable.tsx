import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AppTheme } from '../../../theme/colors';
import { formatMoney } from '../../../services/exchangeRate';
import { Asset } from '../../../types';
import { styles } from '../styles';

interface StatisticsValueItem {
    platform: string;
    displayValue: number;
    asset: Asset;
}

interface DataTableProps {
    data: StatisticsValueItem[];
    total: number;
    currency: string;
    chartColors: string[];
    getValueChange: (asset: Asset) => { change: number; changePercent: string } | null;
    theme: AppTheme;
}

type SortOrder = 'asc' | 'desc' | null;

export default function DataTable({
    data,
    total,
    currency,
    chartColors,
    getValueChange,
    theme,
}: DataTableProps) {
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const sortedData = useMemo(() => {
        if (!sortOrder) return data;
        return [...data].sort((left, right) => {
            const leftShare = total > 0 ? left.displayValue / total : 0;
            const rightShare = total > 0 ? right.displayValue / total : 0;
            return sortOrder === 'desc' ? rightShare - leftShare : leftShare - rightShare;
        });
    }, [data, sortOrder, total]);
    const sortIndicator = sortOrder === 'desc' ? ' ▼' : sortOrder === 'asc' ? ' ▲' : '';

    return (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>资产明细</Text>
            <View style={{ alignSelf: 'stretch' }}>
                <View style={[styles.tableHeader, { borderBottomColor: theme.divider }]}>
                    <Text
                        style={[
                            styles.tableHeaderCell,
                            styles.colPlatform,
                            { color: theme.tertiaryText },
                        ]}
                    >
                        资产
                    </Text>
                    <Text
                        style={[
                            styles.tableHeaderCell,
                            styles.colValue,
                            { color: theme.tertiaryText },
                        ]}
                    >
                        原币金额
                    </Text>
                    <Text
                        style={[
                            styles.tableHeaderCell,
                            styles.colConverted,
                            { color: theme.tertiaryText },
                        ]}
                    >
                        {currency}
                    </Text>
                    <TouchableOpacity
                        style={styles.colPercent}
                        accessibilityRole="button"
                        accessibilityLabel={`按占比${sortOrder === 'desc' ? '升序' : '降序'}排序`}
                        onPress={() => setSortOrder((value) => (value === 'desc' ? 'asc' : 'desc'))}
                    >
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                { color: theme.blue, textAlign: 'right' },
                            ]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            minimumFontScale={0.8}
                        >
                            占比{sortIndicator}
                        </Text>
                    </TouchableOpacity>
                    <Text
                        style={[
                            styles.tableHeaderCell,
                            styles.colChange,
                            { color: theme.tertiaryText },
                        ]}
                    >
                        变化
                    </Text>
                </View>
                {sortedData.map((item, index) => {
                    const percent =
                        total > 0 ? ((item.displayValue / total) * 100).toFixed(1) : '0.0';
                    const change = getValueChange(item.asset);

                    return (
                        <View
                            key={item.asset.id}
                            style={[styles.tableRow, { borderBottomColor: theme.divider }]}
                        >
                            <Text
                                style={[
                                    styles.tableCell,
                                    styles.colPlatform,
                                    { color: theme.text },
                                ]}
                                numberOfLines={1}
                            >
                                {item.platform}
                            </Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    styles.colValue,
                                    { color: theme.secondaryText },
                                ]}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.8}
                            >
                                {formatMoney(item.asset.value, item.asset.currency)}
                            </Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    styles.colConverted,
                                    { color: theme.text },
                                ]}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.8}
                            >
                                {formatMoney(item.displayValue, currency, true)}
                            </Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    styles.colPercent,
                                    { color: chartColors[index % chartColors.length] },
                                ]}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.8}
                            >
                                {percent}%
                            </Text>
                            <Text
                                style={[
                                    styles.tableCell,
                                    styles.colChange,
                                    {
                                        color: change
                                            ? change.change >= 0
                                                ? theme.green
                                                : theme.danger
                                            : theme.tertiaryText,
                                    },
                                ]}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.8}
                            >
                                {change
                                    ? `${change.change >= 0 ? '+' : ''}${change.changePercent}%`
                                    : '—'}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
