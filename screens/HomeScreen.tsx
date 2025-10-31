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
  ListRenderItem,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { getAssets, addAsset, updateAsset, deleteAsset } from '../services/storage';
import { convertToCNY } from '../services/exchangeRate';
import { exportAssets, importAssets, ExportFormat } from '../services/importExport';
import AssetItem from '../components/AssetItem';
import { RootStackParamList, Asset } from '../types';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: HomeScreenProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [totalCNY, setTotalCNY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

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

  const calculateTotal = async (assetList: Asset[]) => {
    setLoading(true);
    try {
      let total = 0;
      for (const asset of assetList) {
        const cnyValue = await convertToCNY(asset.value, asset.currency);
        if (cnyValue) {
          total += cnyValue;
        }
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const handleAddAsset = () => {
    navigation.navigate('AssetForm', {
      onSave: async (assetData) => {
        await addAsset(assetData);
        await loadAssets();
      },
      type: 'ADD',
    });
  };

  const handleEditAsset = (asset: Asset) => {
    navigation.navigate('AssetForm', {
      asset,
      onSave: async (assetData) => {
        await updateAsset(asset.id, assetData);
        await loadAssets();
      },
      type: 'EDIT',
    });
  };

  const handleDeleteAsset = (asset: Asset) => {
    Alert.alert('确认删除', `确定要删除资产"${asset.platform}"吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          await deleteAsset(asset.id);
          await loadAssets();
        },
      },
    ]);
  };

  const handleImport = async () => {
    const success = await importAssets();
    if (success) {
      await loadAssets();
    }
  };

  const handleExport = async (format: ExportFormat) => {
    setShowExportMenu(false);
    await exportAssets(format);
  };

  const renderAssetItem: ListRenderItem<Asset> = ({ item }) => (
    <AssetItem item={item} onEdit={handleEditAsset} onDelete={handleDeleteAsset} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.headerButton} onPress={handleImport}>
            <Text style={styles.headerButtonText}>导入</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowExportMenu(true)}
          >
            <Text style={styles.headerButtonText}>导出</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.totalLabel}>总资产 (CNY)</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : (
          <Text style={styles.totalValue}>¥{totalCNY.toFixed(2)}</Text>
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddAsset}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={showExportMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExportMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowExportMenu(false)}
        >
          <View style={styles.exportMenu}>
            <Text style={styles.exportMenuTitle}>选择导出格式</Text>
            <TouchableOpacity
              style={styles.exportMenuItem}
              onPress={() => handleExport('json')}
            >
              <Text style={styles.exportMenuItemText}>JSON</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportMenuItem}
              onPress={() => handleExport('csv')}
            >
              <Text style={styles.exportMenuItemText}>CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportMenuItem}
              onPress={() => handleExport('xlsx')}
            >
              <Text style={styles.exportMenuItemText}>Excel (XLSX)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.exportMenuItem, styles.exportMenuCancel]}
              onPress={() => setShowExportMenu(false)}
            >
              <Text style={[styles.exportMenuItemText, styles.exportMenuCancelText]}>
                取消
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 16,
    gap: 8,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportMenu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    maxWidth: 300,
  },
  exportMenuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  exportMenuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#2196F3',
  },
  exportMenuItemText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
  exportMenuCancel: {
    backgroundColor: '#f5f5f5',
    marginTop: 8,
  },
  exportMenuCancelText: {
    color: '#666',
  },
});

export default HomeScreen;
