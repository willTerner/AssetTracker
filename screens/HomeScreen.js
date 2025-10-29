import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAssets, addAsset, updateAsset, deleteAsset } from '../services/storage';
import { convertToCNY } from '../services/exchangeRate';

const HomeScreen = ({ navigation }) => {
  const [assets, setAssets] = useState([]);
  const [totalCNY, setTotalCNY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadAssets = async () => {
    try {
      const loadedAssets = await getAssets();
      setAssets(loadedAssets);
      await calculateTotal(loadedAssets);
    } catch (error) {
      console.error('Error loading assets:', error);
      Alert.alert('错误', '加载资产失败');
    }
  };

  const calculateTotal = async (assetList) => {
    setLoading(true);
    try {
      let total = 0;
      for (const asset of assetList) {
        const cnyValue = await convertToCNY(asset.value, asset.currency);
        total += cnyValue;
      }
      setTotalCNY(total);
    } catch (error) {
      console.error('Error calculating total:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAssets();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadAssets();
    }, [])
  );

  const handleAddAsset = () => {
    navigation.navigate('AssetForm', {
      onSave: async (assetData) => {
        await addAsset(assetData);
        await loadAssets();
      },
    });
  };

  const handleEditAsset = (asset) => {
    navigation.navigate('AssetForm', {
      asset,
      onSave: async (assetData) => {
        await updateAsset(asset.id, assetData);
        await loadAssets();
      },
    });
  };

  const handleDeleteAsset = (asset) => {
    Alert.alert(
      '确认删除',
      `确定要删除资产"${asset.platform}"吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            await deleteAsset(asset.id);
            await loadAssets();
          },
        },
      ]
    );
  };

  const getValueChangeDisplay = (asset) => {
    if (asset.previousValue !== null && asset.previousValue !== undefined) {
      const change = asset.value - asset.previousValue;
      const changePercent = asset.previousValue !== 0 
        ? ((change / asset.previousValue) * 100).toFixed(2)
        : 0;
      const color = change >= 0 ? '#4CAF50' : '#f44336';
      return (
        <Text style={[styles.changeText, { color }]}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent >= 0 ? '+' : ''}{changePercent}%)
        </Text>
      );
    }
    return null;
  };

  const renderAssetItem = ({ item }) => (
    <TouchableOpacity
      style={styles.assetItem}
      onPress={() => handleEditAsset(item)}
      onLongPress={() => handleDeleteAsset(item)}
    >
      <View style={styles.assetHeader}>
        <Text style={styles.platform}>{item.platform}</Text>
        <Text style={styles.value}>
          {item.value.toFixed(2)} {item.currency}
        </Text>
      </View>
      {getValueChangeDisplay(item)}
      <Text style={styles.date}>
        {item.updatedAt
          ? `更新于: ${new Date(item.updatedAt).toLocaleDateString('zh-CN')}`
          : `创建于: ${new Date(item.createdAt).toLocaleDateString('zh-CN')}`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.totalLabel}>总资产 (CNY)</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : (
          <Text style={styles.totalValue}>¥ {totalCNY.toFixed(2)}</Text>
        )}
        <Text style={styles.subtitle}>基于实时汇率计算</Text>
      </View>

      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        renderItem={renderAssetItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无资产记录</Text>
            <Text style={styles.emptySubtext}>点击下方按钮添加资产</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddAsset}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 24,
    alignItems: 'center',
  },
  totalLabel: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  totalValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
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
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
  },
});

export default HomeScreen;
