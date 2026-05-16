import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Colors, DEFAULT_PICKER_PLACEHOLDER } from '../../constants';
import { CURRENCIES } from '../../services/exchangeRate';
import { RootStackParamList } from '../../types';
import { pickerSelectStyles, styles } from './styles';

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

export default AssetForm;
