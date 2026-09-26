import { Currency, ExchangeRates } from '../types';
import { getEncryptedValue, setEncryptedValue } from './database';

export const RATE_SOURCE_NAME = 'ExchangeRate-API';
export const RATE_SOURCE_URL = 'https://www.exchangerate-api.com';
const API_URL = 'https://open.er-api.com/v6/latest/CNY';
const RATE_CACHE_KEY = '@exchange_rates_v1';
const DAILY_REFRESH_MS = 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 10000;

export interface ExchangeRateState {
    rates: ExchangeRates | null;
    updatedAt: number | null;
    fetchedAt: number | null;
    error: string | null;
}

const EMPTY_STATE: ExchangeRateState = {
    rates: null,
    updatedAt: null,
    fetchedAt: null,
    error: null,
};
let cachedState: ExchangeRateState | null = null;
let pendingRefresh: Promise<ExchangeRateState> | null = null;
const listeners = new Set<(state: ExchangeRateState) => void>();

function notifyListeners(state: ExchangeRateState): void {
    listeners.forEach((listener) => listener(state));
}

export function subscribeToExchangeRates(listener: (state: ExchangeRateState) => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export async function getExchangeRateState(): Promise<ExchangeRateState> {
    if (cachedState) return cachedState;
    try {
        const raw = await getEncryptedValue(RATE_CACHE_KEY);
        if (!raw) {
            cachedState = EMPTY_STATE;
            return cachedState;
        }
        const saved = JSON.parse(raw) as Partial<ExchangeRateState>;
        cachedState = {
            rates: saved.rates && typeof saved.rates === 'object' ? saved.rates : null,
            updatedAt: typeof saved.updatedAt === 'number' ? saved.updatedAt : null,
            fetchedAt: typeof saved.fetchedAt === 'number'
                ? saved.fetchedAt
                : typeof saved.updatedAt === 'number' ? saved.updatedAt : null,
            error: null,
        };
        return cachedState;
    } catch (error) {
        console.error('Unable to read saved exchange rates:', error);
        cachedState = EMPTY_STATE;
        return cachedState;
    }
}

async function fetchAndSaveRates(previous: ExchangeRateState): Promise<ExchangeRateState> {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
        const controller = new AbortController();
        timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`汇率服务响应异常 (${response.status})`);

        const data = (await response.json()) as {
            result?: string;
            base_code?: string;
            rates?: ExchangeRates;
            time_last_update_unix?: number;
            'error-type'?: string;
        };
        if (data.result !== 'success' || !data.rates || typeof data.rates !== 'object') {
            throw new Error(data['error-type'] ?? '汇率服务未返回有效数据');
        }
        if (data.base_code && data.base_code !== 'CNY') {
            throw new Error('汇率服务返回的基准币种不是 CNY');
        }

        const fetchedAt = Date.now();
        const updatedAt = typeof data.time_last_update_unix === 'number'
            ? data.time_last_update_unix * 1000
            : fetchedAt;
        const next: ExchangeRateState = {
            rates: { ...data.rates, CNY: 1 },
            updatedAt,
            fetchedAt,
            error: null,
        };
        await setEncryptedValue(RATE_CACHE_KEY, JSON.stringify(next));
        cachedState = next;
        notifyListeners(next);
        return next;
    } catch (error) {
        const next: ExchangeRateState = {
            ...previous,
            error: (error as Error).name === 'AbortError' ? '汇率更新超时' : '汇率更新失败',
        };
        cachedState = next;
        notifyListeners(next);
        return next;
    } finally {
        if (timeout) clearTimeout(timeout);
    }
}

export async function refreshRatesIfNeeded(force = false): Promise<ExchangeRateState> {
    const current = await getExchangeRateState();
    const isFresh = current.rates !== null && current.fetchedAt !== null &&
        Date.now() - current.fetchedAt < DAILY_REFRESH_MS;
    if (!force && isFresh) return current;
    if (pendingRefresh) return pendingRefresh;

    pendingRefresh = fetchAndSaveRates(current).finally(() => {
        pendingRefresh = null;
    });
    if (!force && current.rates) {
        void pendingRefresh;
        return current;
    }
    return pendingRefresh;
}

export function convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    rates: ExchangeRates | null
): number | undefined {
    if (fromCurrency === toCurrency) return amount;
    if (!rates) return undefined;
    const fromRate = fromCurrency === 'CNY' ? 1 : rates[fromCurrency];
    const toRate = toCurrency === 'CNY' ? 1 : rates[toCurrency];
    if (!fromRate || !toRate) return undefined;
    return (amount / fromRate) * toRate;
}

export async function convertToCNY(amount: number, currency: string): Promise<number | undefined> {
    const state = await getExchangeRateState();
    return convertCurrency(amount, currency, 'CNY', state.rates);
}

export async function convertFromCNY(amount: number, currency: string): Promise<number | undefined> {
    const state = await getExchangeRateState();
    return convertCurrency(amount, 'CNY', currency, state.rates);
}

export function formatMoney(amount: number, currency: string, compact = false): string {
    const symbols: Record<string, string> = {
        CNY: '¥', USD: '$', EUR: '€', GBP: '£', JPY: '¥', HKD: 'HK$',
        KRW: '₩', SGD: 'S$', AUD: 'A$', CAD: 'C$',
    };
    const symbol = symbols[currency] ?? `${currency} `;
    if (compact && Math.abs(amount) >= 10000) return `${symbol}${(amount / 10000).toFixed(1)}万`;
    return `${symbol}${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatRateUpdatedAt(updatedAt: number | null): string {
    if (!updatedAt) return '尚未更新';
    return `更新于 ${new Date(updatedAt).toLocaleString('zh-CN', {
        month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })}`;
}

export const CURRENCIES: Currency[] = [
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
