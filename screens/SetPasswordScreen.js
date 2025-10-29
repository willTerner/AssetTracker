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
import { setPassword } from '../services/passwordStorage';

function SetPasswordScreen({ onPasswordSet }) {
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
                {
                    text: '确定',
                    onPress: () => onPasswordSet(),
                },
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
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSetPassword}>
                    <Text style={styles.buttonText}>确定</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2196F3',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        fontSize: 18,
        letterSpacing: 8,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#2196F3',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SetPasswordScreen;
