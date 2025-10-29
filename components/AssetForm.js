import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';
import { CURRENCIES } from '../services/exchangeRate';
import { DEFAULT_PICKER_PLACEHOLDER } from './constants';

function AssetForm({ navigation, route }) {
    const { asset, onSave, type } = route.params || {};
    const isEdit = !!asset && type === 'EDIT';

    const [platform, setPlatform] = useState(asset?.platform || '');
    const [value, setValue] = useState(asset?.value?.toString() || '');
    const [currency, setCurrency] = useState(asset?.currency || 'CNY');

    const handleSave = () => {
        if (!platform.trim()) {
            Alert.alert('错误', '请输入平台名称');
            return;
        }

        if (!value.trim() || isNaN(parseFloat(value))) {
            Alert.alert('错误', '请输入有效的价值');
            return;
        }

        if (value === asset?.value?.toString()) {
            navigation.goBack();
            return;
        }

        const assetData = {
            platform: platform.trim(),
            value: parseFloat(value),
            currency,
        };

        onSave(assetData);
        navigation.goBack();
    };

    // 计算价值变化
    const getValueChange = () => {
        if (isEdit && asset?.previousValue !== null && asset?.previousValue !== undefined) {
            const change = parseFloat(value) - asset.previousValue;
            const changePercent =
                asset.previousValue !== 0 ? ((change / asset.previousValue) * 100).toFixed(2) : 0;
            return { change, changePercent };
        }
        return null;
    };

    const valueChange = getValueChange();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>平台名称 *</Text>
                <TextInput
                    style={styles.input}
                    value={platform}
                    onChangeText={setPlatform}
                    placeholder="例如：银行、支付宝、股票账户等"
                    placeholderTextColor="#999"
                />

                <Text style={styles.label}>价值 *</Text>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={setValue}
                    placeholder="输入数值"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                />

                <Text style={styles.label}>货币 *</Text>

                {Platform.OS === 'ios' ? (
                    <Picker selectedValue={currency} onValueChange={setCurrency} enabled={isEdit}>
                        {CURRENCIES.map((item) => (
                            <Picker.Item label={item.label} value={item.value} key={item.label} />
                        ))}
                    </Picker>
                ) : (
                    <View style={styles.pickerContainer}>
                        <RNPickerSelect
                            value={currency}
                            onValueChange={setCurrency}
                            items={CURRENCIES}
                            useNativeAndroidPickerStyle
                            placeholder={DEFAULT_PICKER_PLACEHOLDER}
                            disabled={isEdit}
                        />
                    </View>
                )}

                {valueChange && (
                    <View style={styles.changeInfo}>
                        <Text style={styles.changeLabel}>相比上次价值变化：</Text>
                        <Text
                            style={[
                                styles.changeValue,
                                valueChange.change >= 0 ? styles.positive : styles.negative,
                            ]}
                        >
                            {valueChange.change >= 0 ? '+' : ''}
                            {valueChange.change.toFixed(2)} {currency}(
                            {valueChange.changePercent >= 0 ? '+' : ''}
                            {valueChange.changePercent}
                            %)
                        </Text>
                    </View>
                )}

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>{isEdit ? '更新资产' : '添加资产'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    form: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    changeInfo: {
        marginTop: 20,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    changeLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    changeValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    positive: {
        color: '#4CAF50',
    },
    negative: {
        color: '#f44336',
    },
    saveButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 32,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AssetForm;
