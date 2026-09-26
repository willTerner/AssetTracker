export interface AppTheme {
    mode: 'light' | 'dark';
    background: string;
    backgroundSoft: string;
    surface: string;
    surfaceStrong: string;
    text: string;
    secondaryText: string;
    tertiaryText: string;
    blue: string;
    blueSoft: string;
    blueMuted: string;
    green: string;
    greenSoft: string;
    orange: string;
    orangeSoft: string;
    purple: string;
    purpleSoft: string;
    divider: string;
    outline: string;
    danger: string;
    shadow: string;
    white: string;
}

export const lightTheme: AppTheme = {
    mode: 'light',
    background: '#F3F6FC',
    backgroundSoft: '#EEF2F9',
    surface: '#FFFFFFB8',
    surfaceStrong: '#FFFFFF',
    text: '#1C1C1E',
    secondaryText: '#6E6E73',
    tertiaryText: '#8E8E93',
    blue: '#0A84FF',
    blueSoft: '#DCEBFF',
    blueMuted: '#EAF0F8',
    green: '#34C759',
    greenSoft: '#DDF7E5',
    orange: '#FF9F0A',
    orangeSoft: '#FFF0D5',
    purple: '#AF52DE',
    purpleSoft: '#F0E1FA',
    divider: '#1C1C1E12',
    outline: '#FFFFFFCC',
    danger: '#E45D65',
    shadow: '#2D4C7A1F',
    white: '#FFFFFF',
};

export const darkTheme: AppTheme = {
    mode: 'dark',
    background: '#10141B',
    backgroundSoft: '#171D26',
    surface: '#1B222D',
    surfaceStrong: '#222B37',
    text: '#F5F7FA',
    secondaryText: '#B0BAC8',
    tertiaryText: '#8793A3',
    blue: '#63AEFF',
    blueSoft: '#1D3B5C',
    blueMuted: '#263446',
    green: '#62D989',
    greenSoft: '#173D2A',
    orange: '#FFB74D',
    orangeSoft: '#48351D',
    purple: '#D093F1',
    purpleSoft: '#3B2948',
    divider: '#FFFFFF16',
    outline: '#FFFFFF20',
    danger: '#FF7A82',
    shadow: '#00000055',
    white: '#FFFFFF',
};
