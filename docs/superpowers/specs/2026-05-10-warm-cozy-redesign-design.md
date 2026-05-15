# Visual Redesign: 暖橙轻语 (Coral Whisper)

## Goal

Replace the current flat blue (#2196F3) design with a warm, cozy visual identity for a personal asset journal. Apply consistent styling across all screens and components.

## Design System

### Color Palette

| Role | Name | Hex |
|---|---|---|
| Primary text / headings | Espresso | #5C3D2E |
| Body text secondary | Warm Brown | #A08070 |
| Primary accent (cards, highlights) | Coral | #E8956D |
| Secondary accent (card border variant) | Honey | #F3BC8B |
| Background tint (form card, alert bg) | Sand | #FDE4C5 |
| Page background | Off-white | #FFFAF3 |
| Danger / delete / negative change | Deep Coral | #D4745E |
| Positive / gain | Sage | #7EB89B |
| Header card background | Espresso gradient | #5C3D2E → #6B4C3B |
| Button background | Coral gradient | #E8956D → #D4745E |

### Typography

- System font (React Native default)
- Large numbers: bold, 26-34px (totals)
- Card titles: semibold, 15-17px
- Body: regular, 14px
- Metadata/captions: regular, 10-11px

### Spacing & Shape

- Card border-radius: 12-14px (was 6-8px)
- Button border-radius: 12-14px
- Input border-radius: 10-12px
- Input border: 1.5px solid #FDE4C5 (was 1px #ddd)
- Card shadow: soft brown-tinted shadow (0 2px 10px rgba(92,61,46,0.05))
- Button shadow: warm glow (0 6px 20px rgba(232,149,109,0.3-0.4))

### Card Design

- White background, rounded corners, soft shadow
- Colored left border: 4px coral (#E8956D) for most, honey (#F3BC8B) as alternate
- Value displayed in coral, platform name in espresso

## Screen Changes

### HomeScreen

- **Header**: Gradient espresso card with gold (#F3BC8B) total number, pill-shaped import/export buttons
- **Asset cards**: White with left-border accent, soft shadows, two-line layout with CNY conversion
- **Value change**: Sage green for positive, deep coral for negative
- **FAB**: Coral gradient circle with warm glow shadow
- **Export modal**: White card with warm-tinted option rows, rounded corners, softer overlay

### AssetForm

- **Inputs**: White bg, warm sand border, larger border-radius, espresso text
- **Currency picker**: Styled consistently with other inputs
- **Value change indicator**: Dashed-border card with warm sand background
- **Submit button**: Coral gradient with glow shadow
- **Cancel**: Text-only, warm brown color

### UnlockScreen

- **Custom PIN keypad**: 3x4 grid replacing the generic TextInput. White rounded keys with espresso numbers
- **PIN dots**: Row of 6 filled/empty circles showing entered digits (coral filled, sand outline empty)
- **Background**: Warm gradient (off-white → sand → off-white)
- **App icon**: Coral gradient rounded square with ¥ symbol and shadow
- **Action row**: Cancel in warm brown, backspace in deep coral

### SetPasswordScreen

- Style to match UnlockScreen
- Uses same warm gradient background and input styling

## Implementation Scope

Files to modify:
- `App.tsx` — update StatusBar style
- `screens/HomeScreen.tsx` — header, cards, FAB, modal, empty state
- `screens/UnlockScreen.tsx` — custom PIN keypad, pin dots, gradient bg
- `screens/SetPasswordScreen.tsx` — matching style with UnlockScreen
- `components/AssetForm.tsx` — inputs, buttons, value change indicator
- `components/AssetItem.tsx` — card with left border, colors, CNY display
- `components/constants.ts` — color constants (new)

New dependency: `expo-linear-gradient` for header card and button gradients. Install via `npx expo install expo-linear-gradient`.

## What Does NOT Change

- Data flow (AsyncStorage services)
- Navigation structure (two Stack routes)
- Business logic (exchange rates, import/export, password storage)
- Type definitions
- Touch interactions (tap to edit, long-press to delete)
