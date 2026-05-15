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

import Constants from 'expo-constants';
import { getAssets, addAsset, updateAsset, deleteAsset } from '../services/storage';
import { convertToCNY } from '../services/exchangeRate';
import { recordSnapshot } from '../services/valueHistory';
import { exportAssets, importAssets, ExportFormat } from '../services/importExport';
import AssetItem from '../components/AssetItem';
import { Colors } from '../components/constants';
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
                        <Text style={styles.exportMenuSubtitle}>将资产数据导出为文件</Text>

                        {(['json', 'csv', 'xlsx'] as ExportFormat[]).map((format) => {
                            const label =
                                format === 'xlsx' ? 'Excel (XLSX)' : format.toUpperCase();
                            return (
                                <TouchableOpacity
                                    key={format}
                                    style={styles.exportMenuItem}
                                    onPress={() => handleExport(format)}
                                >
                                    <Text style={styles.exportMenuItemText}>{label}</Text>
                                </TouchableOpacity>
                            );
                        })}

                        <TouchableOpacity
                            style={styles.exportMenuCancel}
                            onPress={() => setShowExportMenu(false)}
                        >
                            <Text style={styles.exportMenuCancelText}>取消</Text>
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
        backgroundColor: Colors.offWhite,
    },
    header: {
        backgroundColor: Colors.espresso,
        padding: 24,
        paddingTop: Constants.statusBarHeight,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: Colors.espressoDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        marginBottom: 16,
        gap: 8,
    },
    headerButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    headerButtonText: {
        color: Colors.honey,
        fontSize: 12,
        fontWeight: '600',
    },
    totalLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    totalValue: {
        color: Colors.honey,
        fontSize: 34,
        fontWeight: '800',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 10,
        marginTop: 4,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.warmBrown,
        marginBottom: 6,
    },
    emptySubtext: {
        fontSize: 13,
        color: Colors.warmBrown,
        opacity: 0.6,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 24,
        width: 52,
        height: 52,
        borderRadius: 26,
        shadowColor: Colors.coral,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 8,
    },
    fabInner: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.coral,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fabText: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: '300',
        lineHeight: 30,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    exportMenu: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        width: '82%',
        maxWidth: 320,
        shadowColor: Colors.espressoDark,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 40,
        elevation: 12,
    },
    exportMenuTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.espresso,
        textAlign: 'center',
        marginBottom: 2,
    },
    exportMenuSubtitle: {
        fontSize: 11,
        color: Colors.warmBrown,
        textAlign: 'center',
        marginBottom: 16,
    },
    exportMenuItem: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: Colors.offWhite,
        borderWidth: 1.5,
        borderColor: Colors.sand,
    },
    exportMenuItemText: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        color: Colors.espresso,
    },
    exportMenuCancel: {
        paddingVertical: 10,
        marginTop: 4,
    },
    exportMenuCancelText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        color: Colors.warmBrown,
    },
});

export default HomeScreen;
