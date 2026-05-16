import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../../constants';
import { convertToCNY } from '../../../../services/exchangeRate';
import { Asset } from '../../../../types';
import { styles } from './styles';

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
