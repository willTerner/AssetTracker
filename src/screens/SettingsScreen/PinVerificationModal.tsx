import React, { useState } from 'react';
import { Alert, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { X } from 'lucide-react-native';
import { verifyPassword } from '../../services/passwordStorage';
import { usePreferences } from '../../context/PreferencesContext';
import { PinInput } from './ChangePasswordModal';
import { styles } from './SettingsModals.styles';

interface PinVerificationModalProps {
    visible: boolean;
    onClose: () => void;
    onVerified: () => void;
}

export function PinVerificationModal({ visible, onClose, onVerified }: PinVerificationModalProps) {
    const { theme } = usePreferences();
    const [pin, setPin] = useState('');
    const [checking, setChecking] = useState(false);

    const close = () => {
        setPin('');
        onClose();
    };

    const verify = async () => {
        setChecking(true);
        try {
            if (!(await verifyPassword(pin))) {
                Alert.alert('验证失败', '当前 PIN 不正确。');
                setPin('');
                return;
            }
            close();
            onVerified();
        } catch (error) {
            Alert.alert('验证失败', (error as Error).message || '请稍后重试。');
        } finally {
            setChecking(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
            <Pressable style={styles.overlay} onPress={close}>
                <Pressable style={[styles.dialog, { backgroundColor: theme.surfaceStrong }]} onPress={() => {}}>
                    <View style={styles.sheetHeader}>
                        <Text style={[styles.sheetTitle, { color: theme.text }]}>验证身份</Text>
                        <TouchableOpacity onPress={close} style={styles.closeButton}>
                            <X color={theme.secondaryText} size={20} />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.helperText, { color: theme.secondaryText }]}>请输入当前 6 位 PIN 以继续清除本机资产数据。</Text>
                    <PinInput label="当前 PIN" value={pin} onChange={setPin} theme={theme} />
                    <TouchableOpacity
                        onPress={verify}
                        disabled={checking || pin.length !== 6}
                        style={[styles.primaryButton, { backgroundColor: theme.blue, opacity: pin.length === 6 ? 1 : 0.5 }]}
                    >
                        <Text style={styles.primaryButtonText}>{checking ? '验证中…' : '验证并继续'}</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
