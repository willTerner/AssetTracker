import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../constants';
import { setPassword } from '../../services/passwordStorage';
import { styles } from './styles';

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

export default SetPasswordScreen;
