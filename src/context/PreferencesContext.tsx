import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { AppPreferences, DEFAULT_PREFERENCES, savePreferences } from '../services/settings';
import { getPreferences } from '../services/settings';
import { AppTheme, darkTheme, lightTheme } from '../theme/colors';

interface PreferencesContextValue {
    preferences: AppPreferences;
    preferencesReady: boolean;
    theme: AppTheme;
    updatePreferences: (patch: Partial<AppPreferences>) => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
    const [preferences, setPreferences] = useState<AppPreferences>(DEFAULT_PREFERENCES);
    const [preferencesReady, setPreferencesReady] = useState(false);
    const systemScheme = useColorScheme();

    useEffect(() => {
        let mounted = true;
        getPreferences()
            .then((saved) => {
                if (mounted) setPreferences(saved);
            })
            .catch((error) => console.error('Unable to load app preferences:', error))
            .finally(() => {
                if (mounted) setPreferencesReady(true);
            });
        return () => {
            mounted = false;
        };
    }, []);

    const updatePreferences = useCallback(
        async (patch: Partial<AppPreferences>) => {
            const next = { ...preferences, ...patch };
            await savePreferences(next);
            setPreferences(next);
        },
        [preferences]
    );

    const effectiveMode =
        preferences.themeMode === 'system'
            ? systemScheme === 'dark'
                ? 'dark'
                : 'light'
            : preferences.themeMode;
    const theme = effectiveMode === 'dark' ? darkTheme : lightTheme;

    const contextValue = useMemo(
        () => ({ preferences, preferencesReady, theme, updatePreferences }),
        [preferences, preferencesReady, theme, updatePreferences]
    );

    return (
        <PreferencesContext.Provider value={contextValue}>
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences(): PreferencesContextValue {
    const context = useContext(PreferencesContext);
    if (!context) throw new Error('usePreferences must be used inside PreferencesProvider');
    return context;
}
