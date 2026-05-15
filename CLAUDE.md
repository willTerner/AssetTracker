# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

多币账本 (Multi-currency Asset Tracker) — a React Native (Expo) app for tracking assets across multiple currencies with real-time exchange rate conversion to CNY. Supports adding, editing, deleting assets and importing/exporting data in JSON, CSV, and XLSX formats. Includes numeric PIN-based password protection.

## Commands

```bash
npm start              # Start Expo dev server
npm run android        # Run on Android (needs Android Studio)
npm run ios            # Run on iOS (needs macOS + Xcode)
npm run web            # Run in browser
npm run lint           # Run ESLint
npm run lint:fix       # Auto-fix ESLint issues
npm run build:android  # EAS local Android build (production)
npm run build:test:android  # EAS local Android build (preview profile)
```

## Architecture

```
App.tsx                          # Entry: Sentry init, password gate, Stack navigator
  ├── SetPasswordScreen          # First-launch: set a numeric PIN (≥4 digits)
  ├── UnlockScreen               # Lock gate: enter PIN (5 attempts max)
  └── Stack.Navigator
        ├── HomeScreen            # Asset list + total CNY + import/export
        │     ├── AssetItem       # Single asset row with CNY conversion & value change
        │     └── AssetForm (navigate)  # Add/edit form
        └── AssetForm             # Platform, value, currency picker; shows value delta vs previous
```

### Data flow

- **Storage**: `services/storage.ts` — CRUD on a single `Asset[]` array persisted in AsyncStorage under key `@assets_storage`. Update preserves `previousValue` for change tracking.
- **Exchange rates**: `services/exchangeRate.ts` — fetches from `api.exchangerate-api.com/v4/latest/CNY`, 1-hour in-memory cache, stale cache returned on network failure.
- **Password**: `services/passwordStorage.ts` — plain-text PIN in AsyncStorage under key `@app_password` (not cryptographically secure; intended as a casual gate).
- **Import/Export**: `services/importExport.ts` — supports JSON, CSV (via PapaParse), and XLSX (via `xlsx`). Import merges by id (existing records take precedence). Export uses `expo-sharing` or falls back to `expo-file-system`.
- **Navigation params**: `AssetForm` receives `{ asset?, onSave, type: 'ADD'|'EDIT' }` via route params; `onSave` callbacks update HomeScreen's list.

### Key types (`types.ts`)

`Asset` has `id, platform, value, currency, createdAt, updatedAt?, previousValue: number | null`.
`RootStackParamList` defines the two routes: `Home` (no params) and `AssetForm` (asset, onSave, type).

### Sentry

Initialized in `App.tsx` with Mobile Replay integration, session replay sampling at 10%, logs enabled. The entire app is wrapped with `Sentry.wrap()`.

## Tooling

- **TypeScript** strict mode, `expo/tsconfig.base` extended
- **ESLint**: Airbnb config + Airbnb TypeScript + react-native plugin. Enforced 4-space indent. Console statements allowed (`no-console: off`).
- **Prettier**: 100 char width, single quotes, trailing commas (es5), 4-space tabs, LF line endings
- **Metro**: Sentry plugin wrapping the Expo config (`metro.config.js`)
- **Testing**: No test framework is configured yet. There are no existing tests.

## Native build

Android builds use EAS (`eas build --platform android --local`). No iOS build pipeline is configured in scripts. The `scripts/deploy.js` handles deployment (invoked via `npm run deploy`).
