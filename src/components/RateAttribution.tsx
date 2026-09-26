import React from 'react';
import { Linking, Text, TouchableOpacity } from 'react-native';
import { RATE_SOURCE_NAME, RATE_SOURCE_URL } from '../services/exchangeRate';
import { AppTheme } from '../theme/colors';
import { styles } from './RateAttribution.styles';

export default function RateAttribution({ theme }: { theme: AppTheme }) {
    const openSource = async () => {
        try {
            await Linking.openURL(RATE_SOURCE_URL);
        } catch (error) {
            console.error('Unable to open exchange-rate provider page:', error);
        }
    };

    return (
        <TouchableOpacity accessibilityRole="link" onPress={() => void openSource()}>
            <Text style={[styles.text, { color: theme.tertiaryText }]}>
                汇率来源：{RATE_SOURCE_NAME}
            </Text>
        </TouchableOpacity>
    );
}
