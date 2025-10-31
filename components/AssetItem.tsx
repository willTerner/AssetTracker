import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { convertToCNY } from '../services/exchangeRate';
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
      const calculatedCnyValue = await convertToCNY(item.value, item.currency);

      if (calculatedCnyValue) {
        setCnyValue(calculatedCnyValue);
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
        asset.previousValue !== 0 ? ((change / asset.previousValue) * 100).toFixed(2) : '0';
      const color = change >= 0 ? '#4CAF50' : '#f44336';
      return (
        <Text style={[styles.changeText, { color }]}>
          {change >= 0 ? '+' : ''}
          {change.toFixed(2)} ({Number(changePercent) >= 0 ? '+' : ''}
          {changePercent}
          %)
        </Text>
      );
    }
    return null;
  };

  return (
    <TouchableOpacity
      style={styles.assetItem}
      onPress={() => onEdit(item)}
      onLongPress={() => onDelete(item)}
    >
      <View style={styles.assetHeader}>
        <Text style={styles.platform}>{item.platform}</Text>
        <Text style={styles.value}>
          {item.value.toFixed(2)} {item.currency}
        </Text>
      </View>
      <View style={styles.secondLineWrap}>
        <View>
          {getValueChangeDisplay(item)}
          <Text style={styles.date}>
            {item.updatedAt
              ? `更新于: ${new Date(item.updatedAt).toLocaleDateString('zh-CN')}`
              : `创建于: ${new Date(item.createdAt).toLocaleDateString('zh-CN')}`}
          </Text>
        </View>
        {item.currency !== 'CNY' && cnyValue && (
          <Text style={styles.cnyValue}>{cnyValue.toFixed(2)} CNY</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  assetItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  platform: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  secondLineWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  cnyValue: {
    fontSize: 14,
    color: '#999',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
});
