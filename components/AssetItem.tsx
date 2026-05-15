import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { convertToCNY } from '../services/exchangeRate';
import { Colors } from './constants';
import { Asset } from '../types';

interface AssetItemProps {
    item: Asset;
    onEdit: (asset: Asset) => void;
    onDelete: (asset: Asset) => void;
}

export default function AssetItem({ item, onEdit, onDelete }: AssetItemProps) {
    const [cnyValue, setCnyValue] = useState<number | undefined>(undefined);

    useEffect(() => {
        async function calculateCNY() {
            const cny = await convertToCNY(item.value, item.currency);
            if (cny) {
                setCnyValue(cny);
            } else {
                setCnyValue(undefined);
            }
        }
        calculateCNY();
    }, [item.value, item.currency]);

    const getValueChangeDisplay = (asset: Asset) => {
        if (asset.previousValue !== null && asset.previousValue !== undefined) {
            const change = asset.value - asset.previousValue;
            const changePercent =
                asset.previousValue !== 0
                    ? ((change / asset.previousValue) * 100).toFixed(2)
                    : '0';
            const isPositive = change >= 0;
            const color = isPositive ? Colors.sage : Colors.coralDark;
            return (
                <Text style={[styles.changeText, { color }]}>
                    {isPositive ? '+' : ''}
                    {change.toFixed(2)} ({Number(changePercent) >= 0 ? '+' : ''}
                    {changePercent}%)
                </Text>
            );
        }
        return null;
    };

    const borderColor = item.platform.length % 2 === 0 ? Colors.coral : Colors.honey;

    return (
        <TouchableOpacity
            style={[styles.assetItem, { borderLeftColor: borderColor }]}
            onPress={() => onEdit(item)}
            onLongPress={() => onDelete(item)}
            activeOpacity={0.7}
        >
            <View style={styles.topRow}>
                <Text style={styles.platform} numberOfLines={1}>
                    {item.platform}
                </Text>
                <Text style={styles.value}>
                    {item.value.toFixed(2)} {item.currency}
                </Text>
            </View>
            <View style={styles.bottomRow}>
                <View style={styles.bottomLeft}>
                    {getValueChangeDisplay(item)}
                    <Text style={styles.date}>
                        {item.updatedAt
                            ? `更新于: ${new Date(item.updatedAt).toLocaleDateString('zh-CN')}`
                            : `创建于: ${new Date(item.createdAt).toLocaleDateString('zh-CN')}`}
                    </Text>
                </View>
                {item.currency !== 'CNY' && cnyValue && (
                    <Text style={styles.cnyValue}>≈ {cnyValue.toFixed(2)} CNY</Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    assetItem: {
        backgroundColor: Colors.white,
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: Colors.coral,
        shadowColor: '#5C3D2E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    platform: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.espresso,
        flex: 1,
        marginRight: 8,
    },
    value: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.coral,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    bottomLeft: {
        flex: 1,
    },
    date: {
        fontSize: 10,
        color: Colors.warmBrown,
        marginTop: 2,
    },
    cnyValue: {
        fontSize: 10,
        color: Colors.warmBrown,
    },
    changeText: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 2,
    },
});
