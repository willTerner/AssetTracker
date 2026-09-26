import React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Banknote, FileDown, Fingerprint, LockKeyhole, RefreshCw, SunMoon, Timer, Trash2 } from 'lucide-react-native';
import { usePreferences } from '../../context/PreferencesContext';
import { formatRateUpdatedAt } from '../../services/exchangeRate';
import SettingsHeader from './components/SettingsHeader';
import SettingsProfileCard from './components/SettingsProfileCard';
import SettingsRow from './components/SettingsRow';
import { ChangePasswordModal } from './ChangePasswordModal';
import { PinVerificationModal } from './PinVerificationModal';
import SettingsPickerModal from './SettingsPickerModal';
import { styles } from './styles';
import { useSettingsActions } from './useSettingsActions';

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const { theme } = usePreferences();
    const actions = useSettingsActions();
    const showSettingsHelp = () => {
        Alert.alert(
            '设置帮助',
            '这里可设置账本解锁方式、自动锁定时间、默认币种与数据导出。账本数据加密保存在本机。'
        );
    };

    return (
        <View style={[styles.screen, { backgroundColor: theme.background }]}>
            <ScrollView
                contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: 112 + insets.bottom }]}
                showsVerticalScrollIndicator={false}
            >
                <View pointerEvents="none" style={[styles.ambientBlue, { backgroundColor: theme.blueSoft }]} />
                <View pointerEvents="none" style={[styles.ambientPurple, { backgroundColor: theme.purpleSoft }]} />
                <SettingsHeader theme={theme} onHelpPress={showSettingsHelp} />
                <SettingsProfileCard
                    theme={theme}
                    assetCount={actions.assets.length}
                    currency={actions.preferences.defaultCurrency}
                />

                <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>账户与安全</Text>
                <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
                    <SettingsRow title="修改密码" Icon={LockKeyhole} theme={theme} onPress={() => actions.setChangePasswordVisible(true)} />
                    <SettingsRow
                        title="生物识别解锁"
                        detail="使用设备指纹或人脸认证"
                        Icon={Fingerprint}
                        theme={theme}
                        iconBackgroundColor={theme.greenSoft}
                        iconColor={theme.green}
                        switchValue={actions.preferences.biometricEnabled}
                        onSwitchChange={(value) => void actions.toggleBiometric(value)}
                    />
                    <SettingsRow
                        title="自动锁定"
                        value={`${actions.preferences.autoLockMinutes} 分钟`}
                        Icon={Timer}
                        theme={theme}
                        iconBackgroundColor={theme.orangeSoft}
                        iconColor={theme.orange}
                        onPress={() => actions.setPicker('lock')}
                        showDivider={false}
                    />
                </View>

                <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>数据与偏好</Text>
                <View style={[styles.group, styles.preferencesGroup, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
                    <SettingsRow
                        title="默认币种"
                        value={actions.preferences.defaultCurrency}
                        Icon={Banknote}
                        theme={theme}
                        onPress={() => actions.setPicker('currency')}
                    />
                    <SettingsRow
                        title="导出数据"
                        value="CSV / JSON"
                        Icon={FileDown}
                        theme={theme}
                        iconBackgroundColor={theme.purpleSoft}
                        iconColor={theme.purple}
                        onPress={() => actions.setPicker('export')}
                    />
                    <SettingsRow
                        title="汇率更新"
                        value="每日自动"
                        detail={formatRateUpdatedAt(actions.rateState.updatedAt)}
                        Icon={RefreshCw}
                        theme={theme}
                        iconBackgroundColor={theme.orangeSoft}
                        iconColor={theme.orange}
                        onPress={actions.showRateDetails}
                    />
                    <SettingsRow
                        title="主题"
                        value={actions.themeLabel}
                        Icon={SunMoon}
                        theme={theme}
                        iconBackgroundColor={theme.greenSoft}
                        iconColor={theme.green}
                        onPress={() => actions.setPicker('theme')}
                        showDivider={false}
                    />
                </View>

                <View
                    style={[
                        styles.clearGroup,
                        {
                            backgroundColor: theme.mode === 'dark' ? '#3A2226' : '#FFF1F0B8',
                            borderColor: theme.mode === 'dark' ? `${theme.danger}55` : '#FFB8B2AA',
                        },
                    ]}
                >
                    <SettingsRow
                        title="清除本机数据"
                        detail="清空资产与历史，保留 PIN 和偏好"
                        Icon={Trash2}
                        theme={theme}
                        danger
                        showDivider={false}
                        onPress={() => actions.setVerifyClearVisible(true)}
                    />
                </View>
            </ScrollView>

            <SettingsPickerModal
                visible={actions.picker !== null}
                title={actions.pickerTitle}
                options={actions.pickerOptions}
                selected={actions.selectedOption}
                onClose={() => actions.setPicker(null)}
                onSelect={actions.selectOption}
            />
            <ChangePasswordModal
                visible={actions.changePasswordVisible}
                onClose={() => actions.setChangePasswordVisible(false)}
            />
            <PinVerificationModal
                visible={actions.verifyClearVisible}
                onClose={() => actions.setVerifyClearVisible(false)}
                onVerified={actions.confirmClearData}
            />
        </View>
    );
}

