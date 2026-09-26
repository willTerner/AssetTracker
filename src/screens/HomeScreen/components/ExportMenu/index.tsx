import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { FileDown, X } from 'lucide-react-native';
import { usePreferences } from '../../../../context/PreferencesContext';
import { ExportFormat } from '../../../../services/importExport';
import { styles } from './styles';

interface ExportMenuProps {
    visible: boolean;
    onClose: () => void;
    onExport: (format: ExportFormat) => void;
}

const FORMATS: Array<{ value: ExportFormat; label: string; detail: string }> = [
    { value: 'csv', label: 'CSV', detail: '适合表格软件' },
    { value: 'json', label: 'JSON', detail: '保留完整字段' },
    { value: 'xlsx', label: 'Excel', detail: '工作簿格式' },
];

export default function ExportMenu({ visible, onClose, onExport }: ExportMenuProps) {
    const { theme } = usePreferences();
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={[styles.sheet, { backgroundColor: theme.surfaceStrong }]} onPress={() => {}}>
                    <View style={styles.header}>
                        <View style={[styles.iconWrap, { backgroundColor: theme.blueSoft }]}><FileDown color={theme.blue} size={18} /></View>
                        <View style={styles.headerCopy}>
                            <Text style={[styles.title, { color: theme.text }]}>导出资产</Text>
                            <Text style={[styles.subtitle, { color: theme.tertiaryText }]}>文件不加密，可通过系统分享保存。</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}><X color={theme.secondaryText} size={19} /></TouchableOpacity>
                    </View>
                    {FORMATS.map((format) => (
                        <TouchableOpacity key={format.value} onPress={() => onExport(format.value)} style={[styles.option, { borderColor: theme.divider }]}>
                            <Text style={[styles.optionLabel, { color: theme.text }]}>{format.label}</Text>
                            <Text style={[styles.optionDetail, { color: theme.tertiaryText }]}>{format.detail}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                        <Text style={[styles.cancelText, { color: theme.secondaryText }]}>取消</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
