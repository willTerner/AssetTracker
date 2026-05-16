import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { Colors } from '../../constants';
import { convertToCNY } from '../../services/exchangeRate';
import { getAssets } from '../../services/storage';
import { getSnapshots, recordSnapshot, ValueSnapshot } from '../../services/valueHistory';
import { Asset } from '../../types';
import { buildLineData } from './buildLineData';
import BarChartCard from './components/BarChartCard';
import DataTable from './components/DataTable';
import PieChartCard from './components/PieChartCard';
import TrendChartCard from './components/TrendChartCard';
import { styles } from './styles';

const CHART_COLORS = [
    Colors.coral,
    Colors.honey,
    Colors.sage,
    '#D4A843',
    Colors.espresso,
    Colors.coralDark,
    '#C8963C',
    '#8B7355',
];

function StatisticsScreen() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [cnyData, setCnyData] = useState<
    { platform: string; cnyValue: number; asset: Asset }[]
    >([]);
    const [totalCNY, setTotalCNY] = useState(0);
    const [loading, setLoading] = useState(true);
    const [snapshots, setSnapshots] = useState<ValueSnapshot[]>([]);
    const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'year' | 'ytd' | 'all'>('month');

    const loadData = async () => {
        setLoading(true);
        try {
            const loadedAssets = await getAssets();
            setAssets(loadedAssets);

            const results: { platform: string; cnyValue: number; asset: Asset }[] = [];
            let total = 0;

            for (const asset of loadedAssets) {
                const cny = await convertToCNY(asset.value, asset.currency);
                if (cny) {
                    results.push({ platform: asset.platform, cnyValue: cny, asset });
                    total += cny;
                }
            }

            setCnyData(results);
            setTotalCNY(total);

            await recordSnapshot(total);
            const loadedSnapshots = await getSnapshots();
            setSnapshots(loadedSnapshots);
        } catch (error) {
            console.error('Error loading statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.coral} />
            </View>
        );
    }

    const pieData = cnyData.map((item, index) => ({
        value: parseFloat(item.cnyValue.toFixed(2)),
        color: CHART_COLORS[index % CHART_COLORS.length],
        text: item.platform,
    }));

    const barData = cnyData.map((item, index) => ({
        value: parseFloat(item.cnyValue.toFixed(2)),
        label: item.platform.length > 4 ? item.platform.slice(0, 4) : item.platform,
        frontColor: CHART_COLORS[index % CHART_COLORS.length],
    }));

    const getValueChange = (asset: Asset) => {
        if (asset.previousValue !== null && asset.previousValue !== undefined) {
            const change = asset.value - asset.previousValue;
            const changePercent =
                asset.previousValue !== 0
                    ? ((change / asset.previousValue) * 100).toFixed(1)
                    : '0';
            return { change, changePercent };
        }
        return null;
    };

    const lineData = buildLineData(snapshots, dateFilter);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={[
                styles.scrollContent,
                { paddingTop: Constants.statusBarHeight },
            ]}
        >
            <View style={styles.headerCard}>
                <Text style={styles.totalLabel}>总资产 · CNY</Text>
                <Text style={styles.totalValue}>
                    ¥{totalCNY.toFixed(2)}
                </Text>
                <Text style={styles.totalSubtitle}>共 {assets.length} 项资产</Text>
            </View>

            <PieChartCard
                pieData={pieData}
                totalCNY={totalCNY}
                cnyData={cnyData.map((item) => ({ platform: item.platform, cnyValue: item.cnyValue }))}
                chartColors={CHART_COLORS}
            />

            <BarChartCard barData={barData} />

            <TrendChartCard
                lineData={lineData}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
            />

            <DataTable
                data={cnyData}
                totalCNY={totalCNY}
                chartColors={CHART_COLORS}
                getValueChange={getValueChange}
            />
        </ScrollView>
    );
}

export default StatisticsScreen;
