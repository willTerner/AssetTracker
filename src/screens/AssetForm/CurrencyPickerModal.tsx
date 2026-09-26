import React from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { CURRENCIES } from '../../services/exchangeRate';
import { AppTheme } from '../../theme/colors';
import { styles } from './CurrencyPickerModal.styles';

interface CurrencyPickerModalProps {
    visible: boolean;
    selected: string;
    theme: AppTheme;
    onClose: () => void;
    onSelect: (currency: string) => void;
}

export default function CurrencyPickerModal({ visible, selected, theme, onClose, onSelect }: CurrencyPickerModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={[styles.sheet, { backgroundColor: theme.surfaceStrong }]} onPress={() => {}}>
                    <Text style={[styles.title, { color: theme.text }]}>选择币种</Text>
                    <ScrollView style={styles.list}>
                        {CURRENCIES.map((currency) => (
                            <TouchableOpacity
                                key={currency.value}
                                style={[styles.option, { borderBottomColor: theme.divider }]}
                                onPress={() => onSelect(currency.value)}
                            >
                                <Text style={[styles.optionText, { color: theme.text }]}>{currency.label}</Text>
                                {selected === currency.value && <Check color={theme.blue} size={19} />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
