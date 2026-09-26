# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

多币账本 (Multi-currency Asset Tracker) — a React Native (Expo) app for tracking assets across multiple currencies with real-time exchange rate conversion to CNY. Supports adding, editing, deleting assets and importing/exporting data in JSON, CSV, and XLSX formats. Includes numeric PIN-based password protection and a statistics dashboard with pie, bar, and trend charts.

## Commands

```bash
npm start              # Start Expo dev server
npm run android        # Run on Android (needs Android Studio)
npm run ios            # Run on iOS (needs macOS + Xcode)
npm run web            # Run in browser
npm run lint           # Run ESLint
npm run lint:fix       # Auto-fix ESLint issues
npm run build:android  # EAS local Android build — runs prebuild-check.sh first, requires SENTRY_AUTH_TOKEN
npm run build:test:android  # Same as above, but uses the "preview" EAS profile
npm run deploy         # Run scripts/deploy.js
```

Both `build:android` and `build:test:android` run `scripts/prebuild-check.sh` beforehand, which: (1) enforces npm as the package manager, (2) runs `expo-doctor`, and (3) requires `SENTRY_AUTH_TOKEN` to be set.

### ABI split APKs

Android release builds produce **two per-ABI APKs** (`app-arm64-v8a-release.apk`, `app-armeabi-v7a-release.apk`) instead of one universal APK, to reduce package size. This is driven by:

- `plugins/abiSplitPlugin.js` — a config plugin that appends a Gradle `splits { abi }` block (arm64-v8a + armeabi-v7a, `universalApk false`) to `android/app/build.gradle` during prebuild.
- `ABI_SPLIT=true` — set in the `preview`/`production` profiles in `eas.json`. Splits are only enabled when this env var is set, so local `expo run:android` debug builds (e.g. on x86_64 emulators) stay universal. Keep `reactNativeArchitectures` in `android/gradle.properties` with all 4 ABIs for the same reason.

Note: `android/` is gitignored (CNG/managed workflow) — EAS re-runs prebuild from the `app.json` plugins on every build, so native build changes must be made via config plugins, not by editing `android/` directly.

## Architecture

```
App.tsx                                 # Entry: Sentry init → password gate → Tab Navigator
  ├── SetPasswordScreen                 # First launch: set numeric PIN (≥4 digits, ≤6)
  ├── UnlockScreen                      # Lock gate: 6-digit PIN keypad (5 attempts max)
  └── Tab.Navigator
        ├── AssetsTab (Stack.Navigator)
        │     ├── HomeScreen             # Asset list, total CNY, import/export, pull-to-refresh
        │     │     ├── AssetItem        # Single asset row (CNY conversion, value change badge)
        │     │     └── ExportMenu       # Bottom sheet: pick JSON/CSV/XLSX for export
        │     └── AssetForm              # Add/edit form: platform, value, currency picker; shows delta vs previousValue
        └── StatisticsTab
              └── StatisticsScreen       # Charts dashboard: total CNY header card
                    ├── PieChartCard     # Asset distribution pie (react-native-gifted-charts)
                    ├── BarChartCard     # Per-asset bar chart
                    ├── TrendChartCard   # Line chart with date filters (week/month/year/ytd/all)
                    └── DataTable        # Sorted breakdown table with % of total
```

### Data flow

- **Storage** (`services/storage.ts`): CRUD on `Asset[]` in AsyncStorage under `@assets_storage`. Update preserves `previousValue` for change tracking. Create generates id via `Date.now().toString()`.
- **Exchange rates** (`services/exchangeRate.ts`): Fetches from `api.exchangerate-api.com/v4/latest/CNY`, 1-hour in-memory cache. Stale cache returned on network failure. API returns rates with CNY as base — conversion to CNY divides by `rates[currency]`.
- **Password** (`services/passwordStorage.ts`): Plain-text PIN in AsyncStorage under `@app_password` (not cryptographically secure; intended as a casual gate).
- **Value snapshots** (`services/valueHistory.ts`): Records one `{ date, totalCNY }` snapshot per day under `@value_snapshots`. Used by StatisticsScreen for the trend line chart (`buildLineData.ts` samples ~10 evenly-spaced points across the selected date range).
- **Import/Export** (`services/importExport.ts`): Supports JSON, CSV (via PapaParse), and XLSX (via `xlsx`). Import merges by id — existing records take precedence. Export writes to `FileSystem.documentDirectory` then shares via `expo-sharing`.

### Key types (`src/types/index.ts`)

- `Asset`: `id, platform, value, currency, createdAt, updatedAt?, previousValue: number | null`
- `AssetData`: `platform, value, currency` — used for create/update payloads
- `RootStackParamList`: `Home` (no params) and `AssetForm` (`{ asset?, onSave, type: 'ADD'|'EDIT' }`)

### Constants (`src/constants/index.ts`)

`Colors` object defining the "暖橙轻语 (Coral Whisper)" palette: `espresso` (#5C3D2E), `coral` (#E8956D), `honey` (#F3BC8B), `sand` (#FDE4C5), `offWhite` (#FFFAF3), `sage` (#7EB89B), etc. Import from here rather than hardcoding color values.

### Sentry

Initialized in `App.tsx` with Mobile Replay integration, session replay sampling at 10%, logs enabled. The entire app is wrapped with `Sentry.wrap()`.

## Tooling

- **TypeScript** strict mode with `noImplicitAny: false`. Extends `expo/tsconfig.base`. Module resolution: `nodenext`.
- **ESLint**: Uses `@stylistic/eslint-plugin` for semicolon and JSX indentation enforcement. Run via `eslint.config.js`.
- **Prettier**: 100 char width, single quotes, trailing commas (es5), 4-space tab width, LF line endings.
- **Metro**: Sentry plugin wrapping the Expo config (`metro.config.js`).
- **Testing**: No test framework is configured yet.

## Code Style

- **Styles separation**: `StyleSheet.create()` must be in a separate `styles.ts` file alongside the component, never inline in component files.
- **File length limit**: Single files must not exceed 200 lines. When approaching this limit, split into smaller components or extract logic into separate modules (e.g., utility functions, hooks).
- **Component directory pattern**: Each component lives in its own directory with `index.tsx` and `styles.ts`. Sub-components go in a `components/` subdirectory following the same pattern.
- **No inline color values**: Use the `Colors` constant from `src/constants/index.ts`.
- **Navigation params**: `AssetForm` receives callbacks via route params (`onSave`) rather than using a global state manager — pass `loadAssets`-style callbacks that re-fetch after mutation.
