// 使用免费的汇率API获取实时汇率
const API_URL = 'https://api.exchangerate-api.com/v4/latest/CNY';

let cachedRates = null;
let lastFetchTime = null;
const CACHE_DURATION = 3600000; // 1小时缓存

// 获取汇率（以CNY为基准）
export const getExchangeRates = async () => {
  try {
    // 检查缓存
    if (cachedRates && lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION)) {
      return cachedRates;
    }

    const response = await fetch(API_URL);
    const data = await response.json();
    
    if (data && data.rates) {
      cachedRates = data.rates;
      lastFetchTime = Date.now();
      return data.rates;
    }
    
    return null;
  } catch (e) {
    console.error('Error fetching exchange rates:', e);
    // 如果有缓存，即使过期也返回
    if (cachedRates) {
      return cachedRates;
    }
    return null;
  }
};

// 将任意货币转换为人民币
export const convertToCNY = async (amount, currency) => {
  if (currency === 'CNY') {
    return amount;
  }

  try {
    const rates = await getExchangeRates();
    if (!rates || !rates[currency]) {
      return amount; // 如果获取失败，返回原值
    }

    // 从CNY到目标货币的汇率，需要反向计算
    // 例如：1 CNY = 0.14 USD，要将1 USD转为CNY，需要 1 / 0.14
    const cnyAmount = amount / rates[currency];
    return cnyAmount;
  } catch (e) {
    console.error('Error converting currency:', e);
    return null;
  }
};

// 常用货币列表
export const CURRENCIES = [
  { label: '人民币 (CNY)', value: 'CNY' },
  { label: '美元 (USD)', value: 'USD' },
  { label: '欧元 (EUR)', value: 'EUR' },
  { label: '英镑 (GBP)', value: 'GBP' },
  { label: '日元 (JPY)', value: 'JPY' },
  { label: '港币 (HKD)', value: 'HKD' },
  { label: '韩元 (KRW)', value: 'KRW' },
  { label: '新加坡元 (SGD)', value: 'SGD' },
  { label: '澳元 (AUD)', value: 'AUD' },
  { label: '加元 (CAD)', value: 'CAD' },
];
