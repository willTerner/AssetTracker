import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LockKeyhole, WalletCards } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePreferences } from '../../context/PreferencesContext';
import { styles } from './styles';

interface SetPasswordScreenProps {
    mode: 'initial' | 'migration';
    onComplete: (pin: string) => Promise<void>;
}

export default function SetPasswordScreen({ mode, onComplete }: SetPasswordScreenProps) {
    const { theme } = usePreferences();
    const insets = useSafeAreaInsets();
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [saving, setSaving] = useState(false);
    const isMigration = mode === 'migration';

    const submit = async () => {
        if (!/^\d{6}$/.test(pin)) {
            Alert.alert('密码格式不正确', '请设置 6 位数字 PIN。');
            return;
        }
        if (pin !== confirmPin) {
            Alert.alert('PIN 不一致', '两次输入的 PIN 不相同，请重新确认。');
            return;
        }

        setSaving(true);
        try {
            await onComplete(pin);
        } catch (error) {
            Alert.alert('保存失败', (error as Error).message || '请稍后重试。');
        } finally {
            setSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.root, { backgroundColor: theme.background }]}
            behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        >
            <ScrollView
                contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 28), paddingBottom: Math.max(insets.bottom, 24) }]}
                keyboardShouldPersistTaps="handled"
            >
                <View style={[styles.ambientBlue, { backgroundColor: theme.blueSoft }]} />
                <View style={[styles.ambientPurple, { backgroundColor: theme.purpleSoft }]} />
                <View style={[styles.brandMark, { backgroundColor: theme.blue }]}>
                    <WalletCards color="#FFFFFF" size={28} strokeWidth={1.9} />
                </View>
                <View style={[styles.card, { backgroundColor: theme.surfaceStrong, borderColor: theme.outline }]}>
                    <View style={[styles.lockBadge, { backgroundColor: theme.blueSoft }]}>
                        <LockKeyhole color={theme.blue} size={18} />
                    </View>
                    <Text style={[styles.title, { color: theme.text }]}>
                        {isMigration ? '升级账本保护' : '创建你的账本'}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
                        {isMigration
                            ? '旧密码已验证，请设置新的 6 位 PIN 完成加密迁移。'
                            : '设置一个 6 位数字 PIN，保护你的资产记录。'}
                    </Text>
                    <PinField
                        label="设置 PIN"
                        value={pin}
                        onChange={setPin}
                        placeholder="输入 6 位数字"
                        theme={theme}
                    />
                    <PinField
                        label="再次确认"
                        value={confirmPin}
                        onChange={setConfirmPin}
                        placeholder="再次输入 PIN"
                        theme={theme}
                    />
                    <View style={[styles.tip, { backgroundColor: theme.blueSoft }]}>
                        <LockKeyhole color={theme.blue} size={15} />
                        <Text style={[styles.tipText, { color: theme.secondaryText }]}>PIN 仅用于本机解锁 · 账本数据本机加密</Text>
                    </View>
                    <TouchableOpacity
                        disabled={saving}
                        onPress={submit}
                        style={[styles.primaryButton, { backgroundColor: theme.blue, opacity: saving ? 0.65 : 1 }]}
                    >
                        <Text style={styles.primaryButtonText}>{saving ? '正在加密…' : isMigration ? '加密并继续' : '开始使用'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function PinField({
    label,
    value,
    onChange,
    placeholder,
    theme,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    theme: ReturnType<typeof usePreferences>['theme'];
}) {
    return (
        <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, { color: theme.secondaryText }]}>{label}</Text>
            <View style={[styles.inputWrap, { backgroundColor: theme.backgroundSoft, borderColor: theme.divider }]}>
                <LockKeyhole size={17} color={theme.tertiaryText} />
                <TextInput
                    value={value}
                    onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, 6))}
                    placeholder={placeholder}
                    placeholderTextColor={theme.tertiaryText}
                    keyboardType="number-pad"
                    secureTextEntry
                    maxLength={6}
                    style={[styles.input, { color: theme.text }]}
                    accessibilityLabel={label}
                    textContentType="newPassword"
                />
            </View>
        </View>
    );
}
