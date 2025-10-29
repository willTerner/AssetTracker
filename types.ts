// Asset related types
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

// Currency types
export interface Currency {
  label: string;
  value: string;
}

export interface ExchangeRates {
  [key: string]: number;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  AssetForm: {
    asset?: Asset;
    onSave: (assetData: AssetData) => Promise<void>;
    type: 'ADD' | 'EDIT';
  };
};
