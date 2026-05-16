import React, { ReactNode, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { verifyPassword } from '../../services/passwordStorage';
import { styles } from './styles';

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
        const dots: ReactNode[] = [];
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

export default UnlockScreen;
