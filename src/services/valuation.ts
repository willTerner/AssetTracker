import { Asset, ExchangeRates } from '../types';
import { convertCurrency } from './exchangeRate';

export interface AssetValuation {
    asset: Asset;
    displayValue: number | null;
    valueCNY: number | null;
}

export interface AssetSummary {
    items: AssetValuation[];
    displayTotal: number | null;
    totalCNY: number | null;
    unavailableCount: number;
}

export function summarizeAssets(
    assets: Asset[],
    displayCurrency: string,
    rates: ExchangeRates | null
): AssetSummary {
    const items = assets.map((asset) => ({
        asset,
        displayValue: convertCurrency(asset.value, asset.currency, displayCurrency, rates) ?? null,
        valueCNY: convertCurrency(asset.value, asset.currency, 'CNY', rates) ?? null,
    }));
    const unavailableCount = items.filter((item) => item.displayValue === null).length;

    return {
        items,
        displayTotal: unavailableCount === 0
            ? items.reduce((total, item) => total + (item.displayValue ?? 0), 0)
            : null,
        totalCNY: items.every((item) => item.valueCNY !== null)
            ? items.reduce((total, item) => total + (item.valueCNY ?? 0), 0)
            : null,
        unavailableCount,
    };
}
