import AsyncStorage from '@react-native-async-storage/async-storage';

const PASSWORD_KEY = '@app_password';

// 获取密码
export const getPassword = async () => {
    try {
        const password = await AsyncStorage.getItem(PASSWORD_KEY);
        return password;
    } catch (e) {
        console.error('Error reading password:', e);
        return null;
    }
};

// 设置密码
export const setPassword = async (password) => {
    try {
        await AsyncStorage.setItem(PASSWORD_KEY, password);
        return true;
    } catch (e) {
        console.error('Error saving password:', e);
        return false;
    }
};

// 验证密码
export const verifyPassword = async (inputPassword) => {
    try {
        const storedPassword = await getPassword();
        return storedPassword === inputPassword;
    } catch (e) {
        console.error('Error verifying password:', e);
        return false;
    }
};

// 检查是否已设置密码
export const hasPassword = async () => {
    try {
        const password = await getPassword();
        return password !== null && password !== '';
    } catch (e) {
        console.error('Error checking password:', e);
        return false;
    }
};
