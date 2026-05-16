import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { setPassword } from '../../services/passwordStorage';
import { Colors } from '../../components/constants';

interface SetPasswordScreenProps {
    onPasswordSet: () => void;
}

function SetPasswordScreen({ onPasswordSet }: SetPasswordScreenProps) {
    const [password, setPasswordInput] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSetPassword = async () => {
        if (!password) {
            Alert.alert('错误', '请输入密码');
            return;
        }
        if (password.length < 4) {
            Alert.alert('错误', '密码至少需要4位数字');
            return;
        }
        if (!/^\d+$/.test(password)) {
            Alert.alert('错误', '密码只能包含数字');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('错误', '两次输入的密码不一致');
            return;
        }

        const success = await setPassword(password);
        if (success) {
            Alert.alert('成功', '密码设置成功', [
                { text: '确定', onPress: () => onPasswordSet() },
            ]);
        } else {
            Alert.alert('错误', '密码设置失败，请重试');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <View style={styles.iconInner}>
                        <Text style={styles.iconText}>¥</Text>
                    </View>
                </View>

                <Text style={styles.title}>设置密码</Text>
                <Text style={styles.subtitle}>请设置数字密码以保护您的资产信息</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>输入密码（4位以上数字）</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPasswordInput}
                        keyboardType="number-pad"
                        secureTextEntry
                        maxLength={6}
                        placeholder="请输入密码"
                        placeholderTextColor={Colors.warmBrown}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>确认密码</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        keyboardType="number-pad"
                        secureTextEntry
                        maxLength={6}
                        placeholder="请再次输入密码"
                        placeholderTextColor={Colors.warmBrown}
                    />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSetPassword}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>确定</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.offWhite,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    iconInner: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: Colors.coral,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.coral,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 8,
    },
    iconText: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: '800',
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: Colors.espresso,
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: Colors.warmBrown,
        textAlign: 'center',
        marginBottom: 36,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.espresso,
        marginBottom: 6,
    },
    input: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        letterSpacing: 6,
        textAlign: 'center',
        borderWidth: 1.5,
        borderColor: Colors.sand,
        color: Colors.espresso,
    },
    button: {
        backgroundColor: Colors.coral,
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: Colors.coral,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 6,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
});

export default SetPasswordScreen;
