import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ListRenderItem,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Constants from 'expo-constants';
import { Colors } from '../../constants';
import { convertToCNY } from '../../services/exchangeRate';
import { ExportFormat, exportAssets, importAssets } from '../../services/importExport';
import { addAsset, deleteAsset, getAssets, updateAsset } from '../../services/storage';
import { recordSnapshot } from '../../services/valueHistory';
import { Asset, RootStackParamList } from '../../types';
import AssetItem from './components/AssetItem';
import ExportMenu from './components/ExportMenu';
import { styles } from './styles';

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
            await recordSnapshot(total);
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
        }, [])
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
            <View style={[styles.header, { paddingTop: Constants.statusBarHeight }]}>
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
                <Text style={styles.totalLabel}>总资产 · CNY</Text>
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.honey} />
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
                        <Text style={styles.emptyIcon}>💰</Text>
                        <Text style={styles.emptyText}>暂无资产记录</Text>
                        <Text style={styles.emptySubtext}>点击下方按钮添加第一笔资产</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.coral}
                        colors={[Colors.coral]}
                    />
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={handleAddAsset}
                activeOpacity={0.8}
            >
                <View style={styles.fabInner}>
                    <Text style={styles.fabText}>+</Text>
                </View>
            </TouchableOpacity>

            <ExportMenu
                visible={showExportMenu}
                onClose={() => setShowExportMenu(false)}
                onExport={handleExport}
            />
        </View>
    );
}

export default HomeScreen;
