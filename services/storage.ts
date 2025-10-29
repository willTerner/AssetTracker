import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset, AssetData } from '../types';

const ASSETS_KEY = '@assets_storage';

// 获取所有资产
export const getAssets = async (): Promise<Asset[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(ASSETS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading assets:', e);
    return [];
  }
};

// 保存所有资产
export const saveAssets = async (assets: Asset[]): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(assets);
    await AsyncStorage.setItem(ASSETS_KEY, jsonValue);
    return true;
  } catch (e) {
    console.error('Error saving assets:', e);
    return false;
  }
};

// 添加资产
export const addAsset = async (asset: AssetData): Promise<Asset | null> => {
  try {
    const assets = await getAssets();
    const newAsset: Asset = {
      id: Date.now().toString(),
      ...asset,
      createdAt: new Date().toISOString(),
      previousValue: null, // 第一次记录没有上次价值
    };
    assets.push(newAsset);
    await saveAssets(assets);
    return newAsset;
  } catch (e) {
    console.error('Error adding asset:', e);
    return null;
  }
};

// 更新资产
export const updateAsset = async (
  id: string,
  updatedData: AssetData,
): Promise<Asset | null> => {
  try {
    const assets = await getAssets();
    const index = assets.findIndex((a) => a.id === id);
    if (index !== -1) {
      // 保存上次价值用于计算变化
      const previousValue = assets[index].value;
      assets[index] = {
        ...assets[index],
        ...updatedData,
        previousValue,
        updatedAt: new Date().toISOString(),
      };
      await saveAssets(assets);
      return assets[index];
    }
    return null;
  } catch (e) {
    console.error('Error updating asset:', e);
    return null;
  }
};

// 删除资产
export const deleteAsset = async (id: string): Promise<boolean> => {
  try {
    const assets = await getAssets();
    const filteredAssets = assets.filter((a) => a.id !== id);
    await saveAssets(filteredAssets);
    return true;
  } catch (e) {
    console.error('Error deleting asset:', e);
    return false;
  }
};
