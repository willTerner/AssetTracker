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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';
import { CURRENCIES } from '../services/exchangeRate';
import { DEFAULT_PICKER_PLACEHOLDER, Colors } from './constants';
import { RootStackParamList } from '../types';

type AssetFormProps = NativeStackScreenProps<RootStackParamList, 'AssetForm'>;

function AssetForm({ navigation, route }: AssetFormProps) {
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

    const getValueChange = () => {
        if (isEdit && asset?.previousValue !== null && asset?.previousValue !== undefined) {
            const change = parseFloat(value) - asset.previousValue;
            const changePercent =
                asset.previousValue !== 0 ? ((change / asset.previousValue) * 100).toFixed(2) : '0';
            return { change, changePercent };
        }
        return null;
    };

    const valueChange = getValueChange();

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.form}>
                <Text style={styles.label}>平台名称</Text>
                <TextInput
                    style={styles.input}
                    value={platform}
                    onChangeText={setPlatform}
                    placeholder="例如：银行、支付宝、股票账户等"
                    placeholderTextColor={Colors.warmBrown}
                />

                <Text style={styles.label}>价值</Text>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={setValue}
                    placeholder="输入数值"
                    placeholderTextColor={Colors.warmBrown}
                    keyboardType="decimal-pad"
                />

                <Text style={styles.label}>货币</Text>

                {Platform.OS === 'ios' ? (
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={currency}
                            onValueChange={setCurrency}
                            enabled={!isEdit}
                        >
                            {CURRENCIES.map((item) => (
                                <Picker.Item
                                    label={item.label}
                                    value={item.value}
                                    key={item.value}
                                />
                            ))}
                        </Picker>
                    </View>
                ) : (
                    <View style={styles.pickerWrapper}>
                        <RNPickerSelect
                            value={currency}
                            onValueChange={setCurrency}
                            items={CURRENCIES}
                            placeholder={DEFAULT_PICKER_PLACEHOLDER}
                            disabled={isEdit}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
                        />
                    </View>
                )}

                {valueChange && (
                    <View style={styles.changeInfo}>
                        <Text style={styles.changeLabel}>相比上次价值变化</Text>
                        <Text
                            style={[
                                styles.changeValue,
                                valueChange.change >= 0 ? styles.positive : styles.negative,
                            ]}
                        >
                            {valueChange.change >= 0 ? '+' : ''}
                            {valueChange.change.toFixed(2)} {currency}(
                            {Number(valueChange.changePercent) >= 0 ? '+' : ''}
                            {valueChange.changePercent}
                            %)
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    activeOpacity={0.8}
                >
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
        backgroundColor: Colors.offWhite,
    },
    form: {
        padding: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.espresso,
        marginBottom: 6,
        marginTop: 16,
    },
    input: {
        backgroundColor: Colors.white,
        borderWidth: 1.5,
        borderColor: Colors.sand,
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: Colors.espresso,
    },
    pickerWrapper: {
        backgroundColor: Colors.white,
        borderWidth: 1.5,
        borderColor: Colors.sand,
        borderRadius: 12,
        overflow: 'hidden',
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    changeInfo: {
        marginTop: 20,
        padding: 14,
        backgroundColor: '#FFF0E5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.sand,
        borderStyle: 'dashed',
    },
    changeLabel: {
        fontSize: 11,
        color: Colors.warmBrown,
        marginBottom: 6,
    },
    changeValue: {
        fontSize: 17,
        fontWeight: '700',
    },
    positive: {
        color: Colors.sage,
    },
    negative: {
        color: Colors.coralDark,
    },
    saveButton: {
        backgroundColor: Colors.coral,
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 28,
        shadowColor: Colors.coral,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 6,
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    cancelButton: {
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: Colors.warmBrown,
        fontSize: 15,
        fontWeight: '600',
    },
});

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 15,
        color: Colors.espresso,
        paddingVertical: 14,
        paddingHorizontal: 14,
    },
    inputAndroid: {
        fontSize: 15,
        color: Colors.espresso,
        paddingVertical: 14,
        paddingHorizontal: 14,
    },
    placeholder: {
        color: Colors.warmBrown,
    },
    iconContainer: {
        top: 14,
        right: 14,
    },
};

export default AssetForm;
