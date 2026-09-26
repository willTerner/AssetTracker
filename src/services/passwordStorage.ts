import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const LEGACY_PASSWORD_KEY = '@app_password';
const CURRENT_PASSWORD_KEY = 'asset-tracker.pin-record.v1';

interface PinRecord {
    version: 1;
    salt: string;
    hash: string;
}

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
}

async function hashPin(pin: string, salt: string): Promise<string> {
    return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${pin}`);
}

function constantTimeEqual(left: string, right: string): boolean {
    if (left.length !== right.length) return false;
    let difference = 0;
    for (let index = 0; index < left.length; index += 1) {
        difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
    }
    return difference === 0;
}

export async function getCurrentPinRecord(): Promise<PinRecord | null> {
    const raw = await SecureStore.getItemAsync(CURRENT_PASSWORD_KEY);
    if (!raw) return null;

    let record: PinRecord;
    try {
        record = JSON.parse(raw) as PinRecord;
    } catch {
        throw new Error('本机 PIN 记录损坏，不能重置以免覆盖加密账本。');
    }
    if (record.version !== 1 || !record.salt || !record.hash) {
        throw new Error('本机 PIN 记录损坏，不能重置以免覆盖加密账本。');
    }
    return record;
}

export async function getLegacyPassword(): Promise<string | null> {
    return AsyncStorage.getItem(LEGACY_PASSWORD_KEY);
}

export async function hasPassword(): Promise<boolean> {
    return Boolean((await getCurrentPinRecord()) || (await getLegacyPassword()));
}

export async function verifyPassword(inputPassword: string): Promise<boolean> {
    const currentRecord = await getCurrentPinRecord();
    if (currentRecord) {
        const candidate = await hashPin(inputPassword, currentRecord.salt);
        return constantTimeEqual(candidate, currentRecord.hash);
    }

    const legacyPassword = await getLegacyPassword();
    return legacyPassword !== null && legacyPassword === inputPassword;
}

export async function setPassword(password: string): Promise<boolean> {
    if (!/^\d{6}$/.test(password)) return false;

    const salt = bytesToHex(await Crypto.getRandomBytesAsync(16));
    const record: PinRecord = {
        version: 1,
        salt,
        hash: await hashPin(password, salt),
    };
    await SecureStore.setItemAsync(CURRENT_PASSWORD_KEY, JSON.stringify(record));
    return true;
}

export async function removeCurrentPassword(): Promise<void> {
    await SecureStore.deleteItemAsync(CURRENT_PASSWORD_KEY);
}

export async function clearLegacyPassword(): Promise<void> {
    await AsyncStorage.removeItem(LEGACY_PASSWORD_KEY);
}
