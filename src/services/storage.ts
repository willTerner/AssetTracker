import { Asset, AssetData } from '../types';
import { readEncryptedAssets, writeEncryptedAssets } from './migration';

// 获取所有资产
export const getAssets = async (): Promise<Asset[]> => {
    try {
        const jsonValue = await readEncryptedAssets();
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error('Error reading encrypted assets:', error);
        throw error;
    }
};

// 保存所有资产
export const saveAssets = async (assets: Asset[]): Promise<boolean> => {
    try {
        await writeEncryptedAssets(JSON.stringify(assets));
        return true;
    } catch (error) {
        console.error('Error saving encrypted assets:', error);
        return false;
    }
};

export const addAsset = async (asset: AssetData): Promise<Asset | null> => {
    try {
        const assets = await getAssets();
        const newAsset: Asset = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            ...asset,
            createdAt: new Date().toISOString(),
            previousValue: null,
        };
        assets.push(newAsset);
        return (await saveAssets(assets)) ? newAsset : null;
    } catch (error) {
        console.error('Error adding asset:', error);
        return null;
    }
};

export const updateAsset = async (id: string, updatedData: AssetData): Promise<Asset | null> => {
    try {
        const assets = await getAssets();
        const index = assets.findIndex((asset) => asset.id === id);
        if (index < 0) return null;

        const previousValue = assets[index].currency === updatedData.currency ? assets[index].value : null;
        assets[index] = {
            ...assets[index],
            ...updatedData,
            previousValue,
            updatedAt: new Date().toISOString(),
        };
        return (await saveAssets(assets)) ? assets[index] : null;
    } catch (error) {
        console.error('Error updating asset:', error);
        return null;
    }
};

export const deleteAsset = async (id: string): Promise<boolean> => {
    try {
        const assets = await getAssets();
        return saveAssets(assets.filter((asset) => asset.id !== id));
    } catch (error) {
        console.error('Error deleting asset:', error);
        return false;
    }
};
