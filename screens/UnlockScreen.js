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
import { verifyPassword } from '../services/passwordStorage';

function UnlockScreen({ onUnlock }) {
    const [password, setPassword] = useState('');
    const [attempts, setAttempts] = useState(0);

    const handleUnlock = async () => {
        if (!password) {
            Alert.alert('错误', '请输入密码');
            return;
        }

        const isValid = await verifyPassword(password);
        if (isValid) {
            onUnlock();
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            setPassword('');
            Alert.alert('错误', `密码错误，请重试 (${newAttempts}/5)`);

            if (newAttempts >= 5) {
                Alert.alert('提示', '密码错误次数过多，请稍后再试');
            }
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                <Text style={styles.title}>资产统计</Text>
                <Text style={styles.subtitle}>请输入密码解锁应用</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        keyboardType="number-pad"
                        secureTextEntry
                        maxLength={6}
                        placeholder="请输入密码"
                        autoFocus
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, attempts >= 5 && styles.buttonDisabled]}
                    onPress={handleUnlock}
                    disabled={attempts >= 5}
                >
                    <Text style={styles.buttonText}>解锁</Text>
                </TouchableOpacity>

                {attempts > 0 && (
                    <Text style={styles.attemptText}>密码错误次数: {attempts}/5</Text>
                )}
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
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2196F3',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        fontSize: 24,
        letterSpacing: 12,
        textAlign: 'center',
        borderWidth: 2,
        borderColor: '#2196F3',
    },
    button: {
        backgroundColor: '#2196F3',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    attemptText: {
        marginTop: 16,
        textAlign: 'center',
        color: '#f44336',
        fontSize: 14,
    },
});

export default UnlockScreen;
