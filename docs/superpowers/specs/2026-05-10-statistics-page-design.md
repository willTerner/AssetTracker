# Statistics Page Design

## Goal

Add a statistics page with charts (table, pie/donut, bar) showing asset proportions and trends. Add bottom tab navigation.

## Navigation

Add bottom tabs with `@react-navigation/bottom-tabs`:
- "资产" (Assets) → existing HomeScreen
- "统计" (Statistics) → new StatisticsScreen

## Statistics Screen

Scrollable page with sections:
1. **Total header** — same espresso card as HomeScreen
2. **Donut chart** — asset proportion by platform (CNY-converted), with legend
3. **Bar chart** — value by platform in CNY
4. **Data table** — full breakdown: platform, value, CNY, percentage, change

## Charts Library

`react-native-gifted-charts` — PieChart and BarChart components.

## Chart Colors

Use warm theme palette: coral, honey, sage, gold, espresso.

## Files

- New: `screens/StatisticsScreen.tsx`
- Modify: `App.tsx` — add bottom tab navigator + new route
- Modify: `types.ts` — add Statistics route if needed
- Install: `react-native-gifted-charts`, `@react-navigation/bottom-tabs`
