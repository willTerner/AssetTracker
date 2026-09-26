import React, { useState } from 'react';
import { Alert, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import { usePreferences } from '../../context/PreferencesContext';
import { setPassword, verifyPassword } from '../../services/passwordStorage';
import { styles } from './SettingsModals.styles';

interface ChangePasswordModalProps {
    visible: boolean;
    onClose: () => void;
}

export function ChangePasswordModal({ visible, onClose }: ChangePasswordModalProps) {
    const { theme } = usePreferences();
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [saving, setSaving] = useState(false);

    const close = () => {
        setCurrentPin('');
        setNewPin('');
        setConfirmPin('');
        onClose();
    };

    const save = async () => {
        if (!/^\d{6}$/.test(newPin)) {
            Alert.alert('PIN 格式不正确', '新 PIN 必须是 6 位数字。');
            return;
        }
        if (newPin !== confirmPin) {
            Alert.alert('PIN 不一致', '两次输入的新 PIN 不相同。');
            return;
        }
        setSaving(true);
        try {
            if (!(await verifyPassword(currentPin))) {
                Alert.alert('验证失败', '当前 PIN 不正确。');
                return;
            }
            if (!(await setPassword(newPin))) throw new Error('新 PIN 保存失败');
            Alert.alert('修改成功', '新的 6 位 PIN 已启用。', [{ text: '完成', onPress: close }]);
        } catch (error) {
            Alert.alert('修改失败', (error as Error).message || '请稍后重试。');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
            <Pressable style={styles.overlay} onPress={close}>
                <Pressable style={[styles.dialog, { backgroundColor: theme.surfaceStrong }]} onPress={() => {}}>
                    <View style={styles.sheetHeader}>
                        <Text style={[styles.sheetTitle, { color: theme.text }]}>修改密码</Text>
                        <TouchableOpacity onPress={close} style={styles.closeButton}>
                            <X color={theme.secondaryText} size={20} />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.helperText, { color: theme.secondaryText }]}>先验证当前 PIN，再设置新的 6 位数字 PIN。</Text>
                    <PinInput label="当前 PIN" value={currentPin} onChange={setCurrentPin} theme={theme} />
                    <PinInput label="新 PIN" value={newPin} onChange={setNewPin} theme={theme} />
                    <PinInput label="确认新 PIN" value={confirmPin} onChange={setConfirmPin} theme={theme} />
                    <TouchableOpacity onPress={save} disabled={saving} style={[styles.primaryButton, { backgroundColor: theme.blue }]}>
                        <Text style={styles.primaryButtonText}>{saving ? '保存中…' : '保存新 PIN'}</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

export function PinInput({
    label,
    value,
    onChange,
    theme,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    theme: ReturnType<typeof usePreferences>['theme'];
}) {
    return (
        <View style={styles.pinInputWrap}>
            <Text style={[styles.pinInputLabel, { color: theme.secondaryText }]}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, 6))}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={6}
                placeholder="6 位数字"
                placeholderTextColor={theme.tertiaryText}
                style={[styles.pinInput, { color: theme.text, borderColor: theme.divider, backgroundColor: theme.backgroundSoft }]}
            />
        </View>
    );
}
