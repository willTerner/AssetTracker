import { useCallback, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import { usePreferences } from '../../context/PreferencesContext';
import { clearAssetsAndHistory } from '../../services/migration';
import {
    CURRENCIES,
    ExchangeRateState,
    RATE_SOURCE_NAME,
    RATE_SOURCE_URL,
    formatRateUpdatedAt,
    getExchangeRateState,
    refreshRatesIfNeeded,
    subscribeToExchangeRates,
} from '../../services/exchangeRate';
import { ExportFormat, exportAssets } from '../../services/importExport';
import { getAssets } from '../../services/storage';
import { Asset } from '../../types';
import { SelectOption } from './SettingsPickerModal';

export type PickerKind = 'currency' | 'theme' | 'lock' | 'export' | null;
export const THEME_OPTIONS: SelectOption<string>[] = [
    { value: 'system', label: '跟随系统' },
    { value: 'light', label: '浅色' },
    { value: 'dark', label: '深色' },
];

export function useSettingsActions() {
    const { preferences, updatePreferences } = usePreferences();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [rateState, setRateState] = useState<ExchangeRateState>({
        rates: null, updatedAt: null, fetchedAt: null, error: null,
    });
    const [picker, setPicker] = useState<PickerKind>(null);
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    const [verifyClearVisible, setVerifyClearVisible] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const [loadedAssets, savedRates] = await Promise.all([getAssets(), getExchangeRateState()]);
            setAssets(loadedAssets);
            setRateState(savedRates);
        } catch (error) {
            console.error('Unable to load settings summary:', error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void loadData();
            return subscribeToExchangeRates(setRateState);
        }, [loadData])
    );

    const currencyOptions: SelectOption<string>[] = CURRENCIES.map(({ value, label }) => ({ value, label }));
    const lockOptions: SelectOption<number>[] = [
        { value: 5, label: '5 分钟' },
        { value: 10, label: '10 分钟' },
        { value: 20, label: '20 分钟' },
    ];
    const exportOptions: SelectOption<string>[] = [
        { value: 'csv', label: 'CSV', detail: '适合表格软件查看' },
        { value: 'json', label: 'JSON', detail: '保留完整资产字段' },
    ];
    const pickerOptions: SelectOption<string | number>[] = picker === 'currency'
        ? currencyOptions
        : picker === 'theme'
          ? THEME_OPTIONS
          : picker === 'lock'
            ? lockOptions
            : exportOptions;
    const pickerTitle = picker === 'currency'
        ? '选择默认币种'
        : picker === 'theme'
          ? '选择主题'
          : picker === 'lock'
            ? '自动锁定时间'
            : '选择导出格式';
    const selectedOption: string | number = picker === 'currency'
        ? preferences.defaultCurrency
        : picker === 'theme'
          ? preferences.themeMode
          : picker === 'lock'
            ? preferences.autoLockMinutes
            : '';
    const themeLabel = THEME_OPTIONS.find((option) => option.value === preferences.themeMode)?.label ?? '跟随系统';

    const selectOption = async (value: string | number) => {
        const currentPicker = picker;
        setPicker(null);
        try {
            if (currentPicker === 'currency') await updatePreferences({ defaultCurrency: String(value) });
            if (currentPicker === 'theme') {
                await updatePreferences({ themeMode: value as 'system' | 'light' | 'dark' });
            }
            if (currentPicker === 'lock') {
                await updatePreferences({ autoLockMinutes: value as 5 | 10 | 20 });
            }
            if (currentPicker === 'export') await exportAssets(value as ExportFormat);
        } catch (error) {
            Alert.alert('设置失败', (error as Error).message || '请稍后重试。');
        }
    };

    const toggleBiometric = async (enabled: boolean) => {
        try {
            if (enabled) {
                const [hardware, enrolled] = await Promise.all([
                    LocalAuthentication.hasHardwareAsync(),
                    LocalAuthentication.isEnrolledAsync(),
                ]);
                if (!hardware || !enrolled) {
                    Alert.alert('无法开启生物识别', '请先在 Android 系统设置中录入指纹或人脸。');
                    return;
                }
            }
            await updatePreferences({ biometricEnabled: enabled });
        } catch (error) {
            Alert.alert('设置失败', (error as Error).message || '无法更新生物识别设置。');
        }
    };

    const refreshRatesManually = async () => {
        try {
            const next = await refreshRatesIfNeeded(true);
            setRateState(next);
            Alert.alert(
                next.rates ? '汇率已更新' : '暂无法换算',
                next.rates ? formatRateUpdatedAt(next.updatedAt) : '请检查网络后重试。'
            );
        } catch (error) {
            Alert.alert('汇率更新失败', (error as Error).message || '请检查网络后重试。');
        }
    };

    const showRateDetails = () => {
        Alert.alert(
            '汇率更新',
            `${formatRateUpdatedAt(rateState.updatedAt)}${rateState.error ? `\n${rateState.error}` : ''}\n汇率来源：${RATE_SOURCE_NAME}；每天打开 App 时自动检查。`,
            [
                { text: '关闭', style: 'cancel' },
                { text: `汇率来源：${RATE_SOURCE_NAME}`, onPress: () => void Linking.openURL(RATE_SOURCE_URL) },
                { text: '立即更新', onPress: () => void refreshRatesManually() },
            ]
        );
    };

    const confirmClearData = () => {
        setTimeout(() => {
            Alert.alert(
                '再次确认清除',
                '这会永久删除全部资产记录和历史快照；PIN 与偏好设置会保留。',
                [
                    { text: '取消', style: 'cancel' },
                    {
                        text: '清除数据',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await clearAssetsAndHistory();
                                setAssets([]);
                                Alert.alert('已清除', '资产记录与历史快照已删除。');
                            } catch (error) {
                                Alert.alert('清除失败', (error as Error).message || '请稍后重试。');
                            }
                        },
                    },
                ]
            );
        }, 160);
    };

    return {
        assets,
        rateState,
        preferences,
        picker,
        pickerOptions,
        pickerTitle,
        selectedOption,
        themeLabel,
        setPicker,
        selectOption,
        changePasswordVisible,
        setChangePasswordVisible,
        verifyClearVisible,
        setVerifyClearVisible,
        toggleBiometric,
        showRateDetails,
        confirmClearData,
    };
}

