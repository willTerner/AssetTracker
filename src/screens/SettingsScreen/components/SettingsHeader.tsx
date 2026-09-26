import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CircleHelp, Settings2 } from 'lucide-react-native';
import { AppTheme } from '../../../theme/colors';
import { styles } from './SettingsHeader.styles';

interface SettingsHeaderProps {
    theme: AppTheme;
    onHelpPress: () => void;
}

export default function SettingsHeader({ theme, onHelpPress }: SettingsHeaderProps) {
    return (
        <View
            style={[
                styles.header,
                { backgroundColor: theme.surfaceStrong, borderColor: theme.outline },
            ]}
        >
            <View style={styles.titleGroup}>
                <View style={[styles.iconWrap, { backgroundColor: theme.blueSoft }]}>
                    <Settings2 color={theme.blue} size={17} />
                </View>
                <Text style={[styles.title, { color: theme.text }]}>设置</Text>
            </View>
            <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="设置帮助"
                onPress={onHelpPress}
                style={styles.helpButton}
            >
                <CircleHelp color={theme.secondaryText} size={20} />
            </TouchableOpacity>
        </View>
    );
}
