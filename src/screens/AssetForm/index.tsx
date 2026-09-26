import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Check, ChevronDown, LockKeyhole, WalletCards } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePreferences } from '../../context/PreferencesContext';
import { addAsset, updateAsset } from '../../services/storage';
import { AssetsStackParamList } from '../../types';
import CurrencyPickerModal from './CurrencyPickerModal';
import { styles } from './styles';

type AssetFormProps = NativeStackScreenProps<AssetsStackParamList, 'AssetForm'>;

export default function AssetForm({ navigation, route }: AssetFormProps) {
    const { theme, preferences } = usePreferences();
    const insets = useSafeAreaInsets();
    const { asset, type } = route.params;
    const isEdit = type === 'EDIT' && !!asset;
    const [platform, setPlatform] = useState(asset?.platform ?? '');
    const [value, setValue] = useState(asset?.value?.toString() ?? '');
    const [currency, setCurrency] = useState(asset?.currency ?? preferences.defaultCurrency);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [saving, setSaving] = useState(false);

    const save = async () => {
        const numericValue = Number(value);
        if (!platform.trim()) {
            Alert.alert('还差一步', '请填写资产名称或平台名称。');
            return;
        }
        if (!value.trim() || !Number.isFinite(numericValue) || numericValue < 0) {
            Alert.alert('金额不正确', '请输入大于或等于 0 的有效金额。');
            return;
        }
        setSaving(true);
        try {
            const payload = { platform: platform.trim(), value: numericValue, currency };
            const saved = isEdit && asset
                ? await updateAsset(asset.id, payload)
                : await addAsset(payload);
            if (!saved) throw new Error('保存失败，请稍后重试。');
            navigation.goBack();
        } catch (error) {
            Alert.alert('保存失败', (error as Error).message || '请稍后重试。');
        } finally {
            setSaving(false);
        }
    };

    const valueChange = isEdit && asset?.currency === currency && asset?.previousValue !== null && asset?.previousValue !== undefined
        ? value.trim() ? Number(value) - asset.previousValue : null
        : null;

    return (
        <KeyboardAvoidingView style={[styles.screen, { backgroundColor: theme.background }]} behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[styles.content, { paddingTop: insets.top + 7, paddingBottom: Math.max(insets.bottom, 24) + 20 }]}
            >
                <View pointerEvents="none" style={[styles.ambientBlue, { backgroundColor: theme.blueSoft }]} />
                <View pointerEvents="none" style={[styles.ambientPurple, { backgroundColor: theme.purpleSoft }]} />
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: theme.surfaceStrong }]}>
                        <ArrowLeft color={theme.text} size={19} />
                    </TouchableOpacity>
                    <Text style={[styles.topBarTitle, { color: theme.text }]}>资产详情</Text>
                    <View style={styles.topBarSpacer} />
                </View>

                <View style={[styles.formCard, { backgroundColor: theme.surfaceStrong, borderColor: theme.outline }]}>
                    <View style={[styles.formIcon, { backgroundColor: theme.blueSoft }]}><WalletCards color={theme.blue} size={22} /></View>
                    <Text style={[styles.heading, { color: theme.text }]}>{isEdit ? '编辑资产' : '新增资产'}</Text>
                    <Text style={[styles.subheading, { color: theme.secondaryText }]}>记录资产余额，让资产变化更清晰。</Text>

                    <Text style={[styles.label, { color: theme.secondaryText }]}>资产名称 / 平台</Text>
                    <TextInput
                        value={platform}
                        onChangeText={setPlatform}
                        placeholder="例如：银行、支付宝、股票账户"
                        placeholderTextColor={theme.tertiaryText}
                        style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundSoft, borderColor: theme.divider }]}
                        maxLength={48}
                    />

                    <View style={styles.amountLabelRow}>
                        <Text style={[styles.label, { color: theme.secondaryText }]}>当前余额</Text>
                        {valueChange !== null && (
                            <Text style={[styles.changePreview, { color: valueChange >= 0 ? theme.green : theme.danger }]}>
                                {valueChange >= 0 ? '+' : ''}{valueChange.toFixed(2)} {currency}
                            </Text>
                        )}
                    </View>
                    <View style={[styles.amountInputWrap, { backgroundColor: theme.backgroundSoft, borderColor: theme.divider }]}>
                        <TextInput
                            value={value}
                            onChangeText={(text) => setValue(text.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1'))}
                            placeholder="0.00"
                            placeholderTextColor={theme.tertiaryText}
                            keyboardType="decimal-pad"
                            style={[styles.amountInput, { color: theme.text }]}
                        />
                        <Text style={[styles.currencyCode, { color: theme.secondaryText }]}>{currency}</Text>
                    </View>

                    <Text style={[styles.label, { color: theme.secondaryText }]}>币种</Text>
                    <TouchableOpacity
                        onPress={() => setPickerVisible(true)}
                        style={[styles.currencyField, { backgroundColor: theme.backgroundSoft, borderColor: theme.divider }]}
                    >
                        <Text style={[styles.currencyText, { color: theme.text }]}>
                            `${currency} · ${currencyName(currency)}`
                        </Text>
                        <ChevronDown color={theme.tertiaryText} size={17} />
                    </TouchableOpacity>

                    <TouchableOpacity disabled={saving} onPress={save} style={[styles.saveButton, { backgroundColor: theme.blue, opacity: saving ? 0.65 : 1 }]}>
                        <Check color="#FFFFFF" size={18} />
                        <Text style={styles.saveButtonText}>{saving ? '保存中…' : '保存资产'}</Text>
                    </TouchableOpacity>
                    <View style={styles.privacyNote}>
                        <LockKeyhole color={theme.tertiaryText} size={12} />
                        <Text style={[styles.privacyText, { color: theme.tertiaryText }]}>资产数据加密保存在本机</Text>
                    </View>
                </View>
            </ScrollView>
            <CurrencyPickerModal
                visible={pickerVisible}
                selected={currency}
                theme={theme}
                onClose={() => setPickerVisible(false)}
                onSelect={(selected) => { setCurrency(selected); setPickerVisible(false); }}
            />
        </KeyboardAvoidingView>
    );
}

function currencyName(code: string): string {
    return ({ CNY: '人民币', USD: '美元', EUR: '欧元', GBP: '英镑', JPY: '日元', HKD: '港币', KRW: '韩元', SGD: '新加坡元', AUD: '澳元', CAD: '加元' } as Record<string, string>)[code] ?? code;
}
