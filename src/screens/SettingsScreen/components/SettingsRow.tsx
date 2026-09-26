import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import { AppTheme } from '../../../theme/colors';
import { styles } from './SettingsRow.styles';

interface SettingsRowProps {
    title: string;
    value?: string;
    Icon: LucideIcon;
    theme: AppTheme;
    onPress?: () => void;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    danger?: boolean;
    detail?: string;
    iconColor?: string;
    iconBackgroundColor?: string;
    showDivider?: boolean;
}

export default function SettingsRow({
    title,
    value,
    Icon,
    theme,
    onPress,
    switchValue,
    onSwitchChange,
    danger = false,
    detail,
    iconColor,
    iconBackgroundColor,
    showDivider = true,
}: SettingsRowProps) {
    const rowStyle = [
        styles.row,
        detail && styles.rowWithDetail,
        { borderBottomColor: theme.divider, borderBottomWidth: showDivider ? 1 : 0 },
    ];
    const content = (
        <>
            <View
                style={[
                    styles.iconWrap,
                    {
                        backgroundColor: danger
                            ? theme.mode === 'dark'
                                ? '#4A2528'
                                : '#FFE8E8'
                            : (iconBackgroundColor ?? theme.blueSoft),
                    },
                ]}
            >
                <Icon
                    color={danger ? theme.danger : (iconColor ?? theme.blue)}
                    size={18}
                    strokeWidth={2}
                />
            </View>
            <View style={styles.copy}>
                <Text style={[styles.title, { color: danger ? theme.danger : theme.text }]}>
                    {title}
                </Text>
                {detail && (
                    <Text style={[styles.detail, { color: theme.tertiaryText }]}>{detail}</Text>
                )}
            </View>
            {onSwitchChange ? (
                <Switch
                    value={Boolean(switchValue)}
                    onValueChange={onSwitchChange}
                    trackColor={{ false: theme.backgroundSoft, true: theme.green }}
                    thumbColor={theme.white}
                />
            ) : (
                <>
                    {value && (
                        <Text style={[styles.value, { color: theme.secondaryText }]}>{value}</Text>
                    )}
                    <ChevronRight color={theme.tertiaryText} size={17} />
                </>
            )}
        </>
    );

    return onPress ? (
        <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.75}
            onPress={onPress}
            style={rowStyle}
        >
            {content}
        </TouchableOpacity>
    ) : (
        <View style={rowStyle}>{content}</View>
    );
}
