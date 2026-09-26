import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { usePreferences } from '../../context/PreferencesContext';
import {
    convertCurrency,
    ExchangeRateState,
    formatRateUpdatedAt,
    getExchangeRateState,
    refreshRatesIfNeeded,
    subscribeToExchangeRates,
} from '../../services/exchangeRate';
import { ExportFormat, exportAssets, importAssets } from '../../services/importExport';
import { deleteAsset, getAssets, updateAsset } from '../../services/storage';
import { recordSnapshot } from '../../services/valueHistory';
import { summarizeAssets } from '../../services/valuation';
import { Asset, AssetsStackParamList } from '../../types';

type HomeNavigation = NativeStackScreenProps<AssetsStackParamList, 'Home'>['navigation'];

export function useHomeActions(navigation: HomeNavigation) {
    const { preferences } = usePreferences();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [rateState, setRateState] = useState<ExchangeRateState>({
        rates: null, updatedAt: null, fetchedAt: null, error: null,
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const loadAssets = useCallback(async () => {
        try {
            const [savedAssets, savedRates] = await Promise.all([getAssets(), getExchangeRateState()]);
            setAssets(savedAssets);
            setRateState(savedRates);
        } catch (error) {
            Alert.alert('加载失败', (error as Error).message || '无法读取加密账本。');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void loadAssets();
            return subscribeToExchangeRates(setRateState);
        }, [loadAssets, preferences.defaultCurrency])
    );

    const summary = useMemo(
        () => summarizeAssets(assets, preferences.defaultCurrency, rateState.rates),
        [assets, preferences.defaultCurrency, rateState.rates]
    );

    useEffect(() => {
        if (summary.totalCNY !== null && assets.length > 0) void recordSnapshot(summary.totalCNY);
    }, [assets.length, summary.totalCNY]);

    const latestChange = useMemo(() => {
        if (!summary.displayTotal || !rateState.rates) return null;
        let amount = 0;
        let count = 0;
        for (const { asset } of summary.items) {
            if (asset.previousValue === null) continue;
            const current = convertCurrency(asset.value, asset.currency, preferences.defaultCurrency, rateState.rates);
            const previous = convertCurrency(asset.previousValue, asset.currency, preferences.defaultCurrency, rateState.rates);
            if (current === undefined || previous === undefined) continue;
            amount += current - previous;
            count += 1;
        }
        if (count === 0) return null;
        const base = summary.displayTotal - amount;
        return { amount, percent: base === 0 ? 0 : (amount / base) * 100 };
    }, [preferences.defaultCurrency, rateState.rates, summary]);

    const refresh = async () => {
        setRefreshing(true);
        try {
            await refreshRatesIfNeeded(true);
            await loadAssets();
        } finally {
            setRefreshing(false);
        }
    };

    const editAsset = (asset: Asset) => {
        navigation.navigate('AssetForm', { type: 'EDIT', asset, defaultCurrency: preferences.defaultCurrency });
    };

    const removeAsset = (asset: Asset) => {
        Alert.alert('删除资产', `确定删除「${asset.platform}」吗？`, [
            { text: '取消', style: 'cancel' },
            {
                text: '删除',
                style: 'destructive',
                onPress: async () => {
                    const deleted = await deleteAsset(asset.id);
                    if (deleted) await loadAssets();
                    else Alert.alert('删除失败', '资产没有被删除，请稍后重试。');
                },
            },
        ]);
    };

    const importData = async () => {
        if (await importAssets()) await loadAssets();
    };

    const openDataMenu = () => {
        Alert.alert('资产数据', '选择一个操作。', [
            { text: '取消', style: 'cancel' },
            { text: '导入数据', onPress: () => void importData() },
            { text: '导出数据', onPress: () => setShowExportMenu(true) },
        ]);
    };

    const handleExport = async (format: ExportFormat) => {
        setShowExportMenu(false);
        await exportAssets(format);
    };

    return {
        assets,
        rateState,
        loading,
        refreshing,
        showExportMenu,
        setShowExportMenu,
        summary,
        latestChange,
        refresh,
        editAsset,
        removeAsset,
        openDataMenu,
        handleExport,
        statusText: summary.unavailableCount > 0
            ? `${summary.unavailableCount} 项资产暂无法换算`
            : formatRateUpdatedAt(rateState.updatedAt),
    };
}

