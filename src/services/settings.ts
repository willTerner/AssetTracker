import { getEncryptedValue, setEncryptedValue } from './database';

export type ThemeMode = 'system' | 'light' | 'dark';
export type AutoLockMinutes = 5 | 10 | 20;

export interface AppPreferences {
    themeMode: ThemeMode;
    defaultCurrency: string;
    autoLockMinutes: AutoLockMinutes;
    biometricEnabled: boolean;
}

export const DEFAULT_PREFERENCES: AppPreferences = {
    themeMode: 'system',
    defaultCurrency: 'CNY',
    autoLockMinutes: 5,
    biometricEnabled: false,
};

const PREFERENCES_KEY = '@preferences_v1';

function isThemeMode(value: unknown): value is ThemeMode {
    return value === 'system' || value === 'light' || value === 'dark';
}

function isAutoLockMinutes(value: unknown): value is AutoLockMinutes {
    return value === 5 || value === 10 || value === 20;
}

export async function getPreferences(): Promise<AppPreferences> {
    try {
        const raw = await getEncryptedValue(PREFERENCES_KEY);
        if (!raw) return DEFAULT_PREFERENCES;

        const saved = JSON.parse(raw) as Partial<AppPreferences>;
        return {
            themeMode: isThemeMode(saved.themeMode)
                ? saved.themeMode
                : DEFAULT_PREFERENCES.themeMode,
            defaultCurrency:
                typeof saved.defaultCurrency === 'string'
                    ? saved.defaultCurrency
                    : DEFAULT_PREFERENCES.defaultCurrency,
            autoLockMinutes: isAutoLockMinutes(saved.autoLockMinutes)
                ? saved.autoLockMinutes
                : DEFAULT_PREFERENCES.autoLockMinutes,
            biometricEnabled:
                typeof saved.biometricEnabled === 'boolean'
                    ? saved.biometricEnabled
                    : DEFAULT_PREFERENCES.biometricEnabled,
        };
    } catch (error) {
        console.error('Error reading preferences:', error);
        return DEFAULT_PREFERENCES;
    }
}

export async function savePreferences(preferences: AppPreferences): Promise<void> {
    await setEncryptedValue(PREFERENCES_KEY, JSON.stringify(preferences));
}
