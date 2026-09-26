import React from 'react';
import { Text, View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { AppTheme } from '../../../theme/colors';
import { styles } from './SettingsProfileCard.styles';

interface SettingsProfileCardProps {
    theme: AppTheme;
    assetCount: number;
    currency: string;
}

export default function SettingsProfileCard({
    theme,
    assetCount,
    currency,
}: SettingsProfileCardProps) {
    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: theme.surfaceStrong,
                    borderColor: theme.outline,
                    shadowColor: theme.shadow,
                },
            ]}
        >
            <View style={styles.mainRow}>
                <View style={[styles.avatar, { backgroundColor: theme.blue }]}>
                    <ShieldCheck color={theme.white} size={22} />
                </View>
                <View style={styles.copy}>
                    <Text style={[styles.name, { color: theme.text }]}>资产守护者</Text>
                    <Text style={[styles.status, { color: theme.secondaryText }]}>
                        本机账本 · 已开启密码保护
                    </Text>
                </View>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, { color: theme.secondaryText }]}>账户</Text>
                    <Text style={[styles.metaValue, { color: theme.text }]}>{assetCount} 个</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={[styles.metaLabel, { color: theme.secondaryText }]}>默认币种</Text>
                    <Text style={[styles.metaValue, { color: theme.blue }]}>{currency}</Text>
                </View>
            </View>
        </View>
    );
}
