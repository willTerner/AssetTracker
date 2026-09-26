import React from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { usePreferences } from '../../context/PreferencesContext';
import { styles } from './SettingsModals.styles';

export interface SelectOption<T extends string | number> {
    value: T;
    label: string;
    detail?: string;
}

interface SettingsPickerModalProps<T extends string | number> {
    visible: boolean;
    title: string;
    options: SelectOption<T>[];
    selected: T;
    onClose: () => void;
    onSelect: (value: T) => void;
}

export default function SettingsPickerModal<T extends string | number>({
    visible,
    title,
    options,
    selected,
    onClose,
    onSelect,
}: SettingsPickerModalProps<T>) {
    const { theme } = usePreferences();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={[styles.sheet, { backgroundColor: theme.surfaceStrong }]} onPress={() => {}}>
                    <View style={styles.sheetHeader}>
                        <Text style={[styles.sheetTitle, { color: theme.text }]}>{title}</Text>
                        <TouchableOpacity accessibilityLabel="关闭" onPress={onClose} style={styles.closeButton}>
                            <X color={theme.secondaryText} size={20} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.optionsList}>
                        {options.map((option) => {
                            const active = option.value === selected;
                            return (
                                <TouchableOpacity
                                    key={String(option.value)}
                                    onPress={() => onSelect(option.value)}
                                    style={[styles.option, { borderBottomColor: theme.divider }]}
                                >
                                    <View style={styles.optionCopy}>
                                        <Text style={[styles.optionLabel, { color: theme.text }]}>{option.label}</Text>
                                        {option.detail && (
                                            <Text style={[styles.optionDetail, { color: theme.tertiaryText }]}>{option.detail}</Text>
                                        )}
                                    </View>
                                    {active && <Check color={theme.blue} size={20} />}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
