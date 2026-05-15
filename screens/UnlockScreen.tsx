import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { verifyPassword } from '../services/passwordStorage';
import { Colors } from '../components/constants';

interface UnlockScreenProps {
    onUnlock: () => void;
}

const PIN_LENGTH = 6;
const KEYPAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'cancel', '0', 'backspace'];

function UnlockScreen({ onUnlock }: UnlockScreenProps) {
    const [pin, setPin] = useState('');
    const [attempts, setAttempts] = useState(0);

    const handleKeyPress = (key: string) => {
        if (key === 'cancel') {
            setPin('');
            return;
        }
        if (key === 'backspace') {
            setPin((prev) => prev.slice(0, -1));
            return;
        }
        if (pin.length < PIN_LENGTH) {
            setPin((prev) => prev + key);
        }
    };

    const handleUnlock = async () => {
        if (pin.length === 0) {
            Alert.alert('提示', '请输入密码');
            return;
        }

        const isValid = await verifyPassword(pin);
        if (isValid) {
            setPin('');
            onUnlock();
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            setPin('');
            Alert.alert('密码错误', `请重试 (${newAttempts}/5)`);

            if (newAttempts >= 5) {
                Alert.alert('提示', '密码错误次数过多，请稍后再试');
            }
        }
    };

    React.useEffect(() => {
        if (pin.length === PIN_LENGTH) {
            handleUnlock();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pin]);

    const renderPinDots = () => {
        const dots = [];
        for (let i = 0; i < PIN_LENGTH; i += 1) {
            const filled = i < pin.length;
            dots.push(
                <View
                    key={i}
                    style={[styles.pinDot, filled ? styles.pinDotFilled : styles.pinDotEmpty]}
                />
            );
        }
        return dots;
    };

    const renderKey = (key: string) => {
        if (key === 'cancel') {
            return (
                <TouchableOpacity
                    key={key}
                    style={styles.keypadKey}
                    onPress={() => handleKeyPress(key)}
                    activeOpacity={0.6}
                >
                    <Text style={styles.keypadKeyTextSecondary}>取消</Text>
                </TouchableOpacity>
            );
        }
        if (key === 'backspace') {
            return (
                <TouchableOpacity
                    key={key}
                    style={styles.keypadKey}
                    onPress={() => handleKeyPress(key)}
                    activeOpacity={0.6}
                >
                    <Text style={styles.keypadKeyTextDanger}>←</Text>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity
                key={key}
                style={styles.keypadKey}
                onPress={() => handleKeyPress(key)}
                activeOpacity={0.4}
            >
                <Text style={styles.keypadKeyText}>{key}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <View style={styles.iconInner}>
                        <Text style={styles.iconText}>¥</Text>
                    </View>
                </View>

                <Text style={styles.title}>资产统计</Text>
                <Text style={styles.subtitle}>输入密码继续</Text>

                <View style={styles.pinDotsContainer}>{renderPinDots()}</View>

                <View style={styles.keypadContainer}>
                    {KEYPAD_KEYS.map((key) => renderKey(key))}
                </View>

                {attempts > 0 && (
                    <Text style={styles.attemptText}>密码错误次数: {attempts}/5</Text>
                )}
            </View>
        </View>
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
        marginBottom: 28,
    },
    pinDotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 32,
    },
    pinDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    pinDotFilled: {
        backgroundColor: Colors.coral,
        shadowColor: Colors.coral,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
    },
    pinDotEmpty: {
        backgroundColor: Colors.sand,
        borderWidth: 2,
        borderColor: Colors.coral,
    },
    keypadContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: 280,
        alignSelf: 'center',
        gap: 8,
    },
    keypadKey: {
        width: 76,
        paddingVertical: 14,
        backgroundColor: Colors.white,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.espresso,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    keypadKeyText: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.espresso,
    },
    keypadKeyTextSecondary: {
        fontSize: 13,
        color: Colors.warmBrown,
    },
    keypadKeyTextDanger: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.coralDark,
    },
    attemptText: {
        marginTop: 20,
        textAlign: 'center',
        color: Colors.coralDark,
        fontSize: 13,
    },
});

export default UnlockScreen;
