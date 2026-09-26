import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, WalletCards } from 'lucide-react-native';
import { usePreferences } from '../../../../context/PreferencesContext';
import { convertCurrency, formatMoney } from '../../../../services/exchangeRate';
import { Asset, ExchangeRates } from '../../../../types';
import { styles } from './styles';

interface AssetItemProps {
    item: Asset;
    displayCurrency: string;
    rates: ExchangeRates | null;
    onEdit: (asset: Asset) => void;
    onDelete: (asset: Asset) => void;
}

export default function AssetItem({
    item,
    displayCurrency,
    rates,
    onEdit,
    onDelete,
}: AssetItemProps) {
    const { theme } = usePreferences();
    const convertedValue = useMemo(
        () => convertCurrency(item.value, item.currency, displayCurrency, rates),
        [displayCurrency, item.currency, item.value, rates]
    );
    const change = item.previousValue === null ? null : item.value - item.previousValue;
    const changePercent =
        change !== null && item.previousValue
            ? ((change / item.previousValue) * 100).toFixed(1)
            : null;

    return (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`${item.platform}, ${formatMoney(item.value, item.currency)}`}
            accessibilityHint="轻触编辑，长按删除"
            activeOpacity={0.76}
            onPress={() => onEdit(item)}
            onLongPress={() => onDelete(item)}
            style={[
                styles.card,
                {
                    backgroundColor: theme.surface,
                    borderColor: theme.outline,
                    shadowColor: theme.shadow,
                },
            ]}
        >
            <View style={[styles.iconWrap, { backgroundColor: theme.blueSoft }]}>
                <WalletCards color={theme.blue} size={22} />
            </View>
            <View style={styles.copy}>
                <Text style={[styles.platform, { color: theme.text }]} numberOfLines={1}>
                    {item.platform}
                </Text>
                <Text style={[styles.meta, { color: theme.secondaryText }]} numberOfLines={1}>
                    {item.currency}
                    {item.updatedAt
                        ? ` · 更新于 ${new Date(item.updatedAt).toLocaleDateString('zh-CN')}`
                        : ''}
                </Text>
            </View>
            <View style={styles.amountWrap}>
                <Text
                    style={[styles.amount, { color: theme.text }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                >
                    {formatMoney(item.value, item.currency)}
                </Text>
                {displayCurrency !== item.currency && (
                    <Text
                        style={[styles.converted, { color: theme.secondaryText }]}
                        numberOfLines={1}
                    >
                        {convertedValue === undefined
                            ? '暂无法换算'
                            : `≈ ${formatMoney(convertedValue, displayCurrency)}`}
                    </Text>
                )}
                {change !== null && (
                    <Text
                        style={[styles.change, { color: change >= 0 ? theme.green : theme.danger }]}
                        numberOfLines={1}
                    >
                        {change >= 0 ? '+' : ''}
                        {formatMoney(change, item.currency)}
                        {changePercent
                            ? ` (${Number(changePercent) >= 0 ? '+' : ''}${changePercent}%)`
                            : ''}
                    </Text>
                )}
            </View>
            <ChevronRight color={theme.tertiaryText} size={16} />
        </TouchableOpacity>
    );
}
