import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { ArrowUpRight, ChartNoAxesCombined, ShieldCheck, WalletCards } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './LaunchSplashScreen.styles';

const PREVIEW_BARS = [0.34, 0.48, 0.42, 0.63, 0.55, 0.77, 1];

function LaunchSplashScreen() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={[
                styles.content,
                { paddingTop: Math.max(insets.top, 22), paddingBottom: Math.max(insets.bottom, 18) },
            ]}
            bounces={false}
        >
            <View pointerEvents="none" style={styles.ambientTop} />
            <View pointerEvents="none" style={styles.ambientBottom} />
            <LinearGradient colors={['#0759D7', '#0A84FF', '#67B9FF']} style={styles.brandMark}>
                <WalletCards color="#FFFFFF" size={37} strokeWidth={1.8} />
                <View style={styles.brandBadge}>
                    <ArrowUpRight color="#FFFFFF" size={13} strokeWidth={2.8} />
                </View>
            </LinearGradient>
            <Text style={styles.brandName}>资产管家</Text>
            <Text style={styles.brandCaption}>让每份资产都清晰可见</Text>

            <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                    <View>
                        <Text style={styles.previewLabel}>总资产 · 示意</Text>
                        <Text style={styles.previewTotal}>¥128,456.32</Text>
                    </View>
                    <View style={styles.growthChip}>
                        <ArrowUpRight color="#FFFFFF" size={14} />
                        <Text style={styles.growthValue}>12.6%</Text>
                    </View>
                </View>
                <Text style={styles.previewSubtext}>近 7 个月资产趋势</Text>
                <View style={styles.chartArea}>
                    {PREVIEW_BARS.map((height, index) => (
                        <View key={index} style={styles.barSlot}>
                            <LinearGradient
                                colors={index === PREVIEW_BARS.length - 1 ? ['#0A84FF', '#67B9FF'] : ['#B6D7FF', '#DCEBFF']}
                                style={[styles.bar, { height: 20 + height * 76 }]}
                            />
                        </View>
                    ))}
                </View>
                <View style={styles.previewFooter}>
                    <Text style={styles.previewPeriod}>近 7 个月</Text>
                    <View style={styles.trendCaption}>
                        <ChartNoAxesCombined color="#34C759" size={14} />
                        <Text style={styles.trendCaptionText}>稳步增长</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.headline}>让资产一目了然</Text>
            <Text style={styles.description}>
                现金、基金与多币种资产轻松归集，{ '\n' }资产变化一处掌握。
            </Text>
            <View style={styles.featureRow}>
                <Feature Icon={WalletCards} label="资产总览" />
                <Feature Icon={ChartNoAxesCombined} label="趋势洞察" />
                <Feature Icon={ShieldCheck} label="本地加密" />
            </View>
            <View style={styles.loadingArea}>
                <ActivityIndicator size="small" color="#0A84FF" />
                <Text style={styles.loadingText}>正在准备你的资产空间…</Text>
                <View style={styles.progressTrack}>
                    <LinearGradient colors={['#0A84FF', '#67B9FF']} style={styles.progressFill} />
                </View>
            </View>
        </ScrollView>
    );
}

function Feature({ Icon, label }: { Icon: typeof WalletCards; label: string }) {
    return (
        <View style={styles.featureItem}>
            <Icon color="#0A84FF" size={15} strokeWidth={2.2} />
            <Text style={styles.featureLabel}>{label}</Text>
        </View>
    );
}

export default LaunchSplashScreen;

