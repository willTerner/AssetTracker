import {File, Paths} from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Asset } from '../types';
import { getAssets, saveAssets } from './storage';

export type ExportFormat = 'json' | 'csv' | 'xlsx';

// 导出数据
export const exportAssets = async (format: ExportFormat): Promise<void> => {
  try {
    const assets = await getAssets();

    if (assets.length === 0) {
      Alert.alert('提示', '没有可导出的资产数据');
      return;
    }

    let fileUri: string;
    let mimeType: string;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `assets_${timestamp}`;

    switch (format) {
      case 'json':
        fileUri = await exportToJSON(assets, fileName);
        mimeType = 'application/json';
        break;
      case 'csv':
        fileUri = await exportToCSV(assets, fileName);
        mimeType = 'text/csv';
        break;
      case 'xlsx':
        fileUri = await exportToXLSX(assets, fileName);
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      default:
        throw new Error('不支持的导出格式');
    }

    // 分享文件
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType,
        dialogTitle: '导出资产数据',
        UTI: mimeType,
      });
    } else {
      Alert.alert('成功', `文件已保存到: ${fileUri}`);
    }
  } catch (error) {
    console.error('Export error:', error);
    Alert.alert('错误', `导出失败: ${(error as Error).message}`);
  }
};

// 导入数据
export const importAssets = async (): Promise<boolean> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/json',
        'text/csv',
        'text/comma-separated-values',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ],
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return false;
    }

    const fileUri = result.assets[0].uri;
    const fileName = result.assets[0].name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    let importedAssets: Asset[];

    switch (fileExtension) {
      case 'json':
        importedAssets = await importFromJSON(fileUri);
        break;
      case 'csv':
        importedAssets = await importFromCSV(fileUri);
        break;
      case 'xlsx':
      case 'xls':
        importedAssets = await importFromXLSX(fileUri);
        break;
      default:
        Alert.alert('错误', '不支持的文件格式');
        return false;
    }

    if (importedAssets.length === 0) {
      Alert.alert('提示', '文件中没有有效的资产数据');
      return false;
    }

    // 合并导入的数据
    const existingAssets = await getAssets();
    const mergedAssets = [...existingAssets];

    // 使用 Map 来去重，优先保留已存在的数据
    const assetMap = new Map<string, Asset>();
    existingAssets.forEach((asset) => assetMap.set(asset.id, asset));

    // 导入的资产可能有重复的 id，需要处理
    importedAssets.forEach((asset) => {
      if (!assetMap.has(asset.id)) {
        mergedAssets.push(asset);
      }
    });

    await saveAssets(mergedAssets);
    Alert.alert('成功', `成功导入 ${importedAssets.length} 条资产数据`);
    return true;
  } catch (error) {
    console.error('Import error:', error);
    Alert.alert('错误', `导入失败: ${(error as Error).message}`);
    return false;
  }
};

// JSON 导出
const exportToJSON = async (assets: Asset[], fileName: string): Promise<string> => {
  const jsonContent = JSON.stringify(assets, null, 2);

  const file = new File(Paths.document, `${fileName}.json`);
  file.create();
  file.write(jsonContent, {
    encoding: "utf8"
  })
  return file.uri;
};

// JSON 导入
const importFromJSON = async (fileUri: string): Promise<Asset[]> => {
    const file = new File(fileUri);

    if (!file.exists) {
        throw new Error(`文件不存在`);
    }

  const content = await file.text();
  const data = JSON.parse(content);

  if (!Array.isArray(data)) {
    throw new Error('JSON 文件格式不正确，应该是资产数组');
  }

  return validateAssets(data);
};

// CSV 导出
const exportToCSV = async (assets: Asset[], fileName: string): Promise<string> => {
  const csvContent = Papa.unparse(assets, {
    header: true,
  });

  const file = new File(Paths.document, `${fileName}.csv`)
  file.create();
  file.write(csvContent, {
      encoding: "utf8"
  })
  return file.uri;
};

// CSV 导入
const importFromCSV = async (fileUri: string): Promise<Asset[]> => {
  const file = new File(fileUri);

  if (!file.exists) {
      throw new Error("文件不存在");
  }

  const content = await file.text();

  return new Promise((resolve, reject) => {
    Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const assets = validateAssets(results.data);
          resolve(assets);
        } catch (error) {
          reject(error);
        }
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
};

// XLSX 导出
const exportToXLSX = async (assets: Asset[], fileName: string): Promise<string> => {
  const worksheet = XLSX.utils.json_to_sheet(assets);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Assets');

  const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

  const file = new File(Paths.document, `${fileName}.xlsx`);
  file.create();
  file.write(wbout, {
      encoding: "base64"
  });

  return file.uri;
};

// XLSX 导入
const importFromXLSX = async (fileUri: string): Promise<Asset[]> => {
  const file = new File(fileUri);
  const content = file.base64Sync();

  const workbook = XLSX.read(content, { type: 'base64' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  return validateAssets(data);
};

// 验证资产数据
const validateAssets = (data: any[]): Asset[] => {
  const validAssets: Asset[] = [];

  data.forEach((item, index) => {
    try {
      // 必填字段验证
      if (!item.id || !item.platform || !item.value || !item.currency || !item.createdAt) {
        console.warn(`跳过第 ${index + 1} 条记录: 缺少必填字段`, item);
        return;
      }

      // 类型转换和验证
      const asset: Asset = {
        id: String(item.id),
        platform: String(item.platform),
        value: parseFloat(item.value),
        currency: String(item.currency),
        createdAt: String(item.createdAt),
        updatedAt: item.updatedAt ? String(item.updatedAt) : undefined,
        previousValue: item.previousValue ? parseFloat(item.previousValue) : null,
      };

      // 验证数值
      if (Number.isNaN(asset.value)) {
        console.warn(`跳过第 ${index + 1} 条记录: value 不是有效数字`, item);
        return;
      }

      validAssets.push(asset);
    } catch (error) {
      console.warn(`跳过第 ${index + 1} 条记录: 解析错误`, error, item);
    }
  });

  return validAssets;
};
