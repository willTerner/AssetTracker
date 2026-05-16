import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { ExportFormat } from '../../../../services/importExport';
import { styles } from './styles';

interface ExportMenuProps {
    visible: boolean;
    onClose: () => void;
    onExport: (format: ExportFormat) => void;
}

function ExportMenu({ visible, onClose, onExport }: ExportMenuProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.exportMenu}>
                    <Text style={styles.exportMenuTitle}>选择导出格式</Text>
                    <Text style={styles.exportMenuSubtitle}>将资产数据导出为文件</Text>

                    {(['json', 'csv', 'xlsx'] as ExportFormat[]).map((format) => {
                        const label =
                            format === 'xlsx' ? 'Excel (XLSX)' : format.toUpperCase();
                        return (
                            <TouchableOpacity
                                key={format}
                                style={styles.exportMenuItem}
                                onPress={() => onExport(format)}
                            >
                                <Text style={styles.exportMenuItemText}>{label}</Text>
                            </TouchableOpacity>
                        );
                    })}

                    <TouchableOpacity
                        style={styles.exportMenuCancel}
                        onPress={onClose}
                    >
                        <Text style={styles.exportMenuCancelText}>取消</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

export default ExportMenu;
