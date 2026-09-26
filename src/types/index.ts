export interface Asset {
    id: string;
    platform: string;
    value: number;
    currency: string;
    createdAt: string;
    updatedAt?: string;
    previousValue: number | null;
}

export interface AssetData {
    platform: string;
    value: number;
    currency: string;
}

export interface Currency {
    label: string;
    value: string;
}

export interface ExchangeRates {
    [key: string]: number;
}

export type AssetsStackParamList = {
    Home: undefined;
    AssetForm: {
        asset?: Asset;
        type: 'ADD' | 'EDIT';
        defaultCurrency?: string;
    };
};

export type RootStackParamList = AssetsStackParamList;

export type MainTabParamList = {
    AssetsTab: undefined;
    StatisticsTab: undefined;
    SettingsTab: undefined;
};
