import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from '../types';
import { getEncryptedValue, setEncryptedValues } from './database';
import { getCurrentPinRecord, getLegacyPassword, setPassword } from './passwordStorage';

export const LEGACY_ASSETS_KEY = '@assets_storage';
export const LEGACY_SNAPSHOTS_KEY = '@value_snapshots';
const ASSETS_KEY = '@assets_v1';
const SNAPSHOTS_KEY = '@snapshots_v1';
const LEGACY_PASSWORD_KEY = '@app_password';
const VAULT_INITIALIZED_KEY = '@vault_initialized';

type LegacySnapshot = { date: string; totalCNY: number };
export type SecurityState = 'new' | 'legacy' | 'current';

export async function getSecurityState(): Promise<SecurityState> {
    if (await getCurrentPinRecord()) return 'current';
    if (await getLegacyPassword()) return 'legacy';
    const initialized = await getEncryptedValue(VAULT_INITIALIZED_KEY);
    if (initialized === '1') throw new Error('本机加密账本缺少 PIN，无法安全恢复。');
    return 'new';
}

export async function cleanupLegacyStorage(): Promise<void> {
    await AsyncStorage.multiRemove([LEGACY_ASSETS_KEY, LEGACY_SNAPSHOTS_KEY, LEGACY_PASSWORD_KEY]);
}

function parseLegacyArray<T>(value: string | null, label: string): T[] {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value) as unknown;
        if (!Array.isArray(parsed)) throw new Error('预期为数组');
        return parsed as T[];
    } catch (error) {
        throw new Error(`旧版${label}数据无法读取：${(error as Error).message}`);
    }
}

export async function migrateLegacyDataAndSetPassword(newPassword: string): Promise<void> {
    const values = await AsyncStorage.multiGet([LEGACY_ASSETS_KEY, LEGACY_SNAPSHOTS_KEY]);
    const legacyAssets = values.find(([key]) => key === LEGACY_ASSETS_KEY)?.[1] ?? null;
    const legacySnapshots = values.find(([key]) => key === LEGACY_SNAPSHOTS_KEY)?.[1] ?? null;
    const assets = parseLegacyArray<Asset>(legacyAssets, '资产');
    const snapshots = parseLegacyArray<LegacySnapshot>(legacySnapshots, '历史快照');

    const encryptedEntries: Array<[string, string]> = [
        [ASSETS_KEY, JSON.stringify(assets)],
        [SNAPSHOTS_KEY, JSON.stringify(snapshots)],
    ];
    const existingPreferences = await getEncryptedValue('@preferences_v1');
    if (existingPreferences) encryptedEntries.push(['@preferences_v1', existingPreferences]);

    await setEncryptedValues(encryptedEntries);
    if (!(await setPassword(newPassword))) throw new Error('新的六位 PIN 保存失败');
    await setEncryptedValues([[VAULT_INITIALIZED_KEY, '1']]);
    await cleanupLegacyStorage();
}

export async function readEncryptedAssets(): Promise<string | null> {
    return getEncryptedValue(ASSETS_KEY);
}

export async function writeEncryptedAssets(value: string): Promise<void> {
    await setEncryptedValues([[ASSETS_KEY, value]]);
}

export async function readEncryptedSnapshots(): Promise<string | null> {
    return getEncryptedValue(SNAPSHOTS_KEY);
}

export async function writeEncryptedSnapshots(value: string): Promise<void> {
    await setEncryptedValues([[SNAPSHOTS_KEY, value]]);
}

export async function clearAssetsAndHistory(): Promise<void> {
    await setEncryptedValues([
        [ASSETS_KEY, '[]'],
        [SNAPSHOTS_KEY, '[]'],
    ]);
}


