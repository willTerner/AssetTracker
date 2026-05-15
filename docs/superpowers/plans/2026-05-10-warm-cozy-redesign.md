# Warm Cozy Redesign (暖橙轻语) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat blue (#2196F3) design with a warm coral/espresso visual identity across all screens and components.

**Architecture:** Introduce a shared color constants file consumed by all components. Rewrite screen-level styles in-place — no new screen or component files. Install expo-linear-gradient for gradient header cards and buttons. Business logic, navigation structure, and data services remain untouched.

**Tech Stack:** React Native 0.81, Expo 54, TypeScript, expo-linear-gradient

---

### Task 1: Install dependency and add color constants

**Files:**
- Modify: `components/constants.ts`
- Install: `expo-linear-gradient`

- [ ] **Step 1: Install expo-linear-gradient**

```
npx expo install expo-linear-gradient
```

- [ ] **Step 2: Update `components/constants.ts` with full color palette**

Replace file content:

```typescript
// Color palette — 暖橙轻语 (Coral Whisper)
export const Colors = {
  espresso: '#5C3D2E',
  espressoDark: '#4A3728',
  warmBrown: '#A08070',
  coral: '#E8956D',
  coralDark: '#D4745E',
  honey: '#F3BC8B',
  sand: '#FDE4C5',
  offWhite: '#FFFAF3',
  sage: '#7EB89B',
  white: '#FFFFFF',
} as const;

interface PickerPlaceholder {
  label: string;
  value: null;
}

export const DEFAULT_PICKER_PLACEHOLDER: PickerPlaceholder = {
  label: '请选择货币',
  value: null,
};
```

- [ ] **Step 3: Verify TypeScript compiles**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/constants.ts package.json package-lock.json
git commit -m "feat: add color constants and expo-linear-gradient

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 2: Redesign AssetItem component

**Files:**
- Modify: `components/AssetItem.tsx`

- [ ] **Step 1: Rewrite `components/AssetItem.tsx`**

```typescript
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { convertToCNY } from '../services/exchangeRate';
import { Colors } from './constants';
import { Asset } from '../types';

interface AssetItemProps {
  item: Asset;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
}

export default function AssetItem({ item, onEdit, onDelete }: AssetItemProps) {
  const [cnyValue, setCnyValue] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function calculateCNY() {
      const cny = await convertToCNY(item.value, item.currency);
      if (cny) {
        setCnyValue(cny);
      } else {
        setCnyValue(undefined);
      }
    }
    calculateCNY();
  }, [item.value, item.currency]);

  const getValueChangeDisplay = (asset: Asset) => {
    if (asset.previousValue !== null && asset.previousValue !== undefined) {
      const change = asset.value - asset.previousValue;
      const changePercent =
        asset.previousValue !== 0 ? ((change / asset.previousValue) * 100).toFixed(2) : '0';
      const isPositive = change >= 0;
      const color = isPositive ? Colors.sage : Colors.coralDark;
      return (
        <Text style={[styles.changeText, { color }]}>
          {isPositive ? '+' : ''}
          {change.toFixed(2)} ({Number(changePercent) >= 0 ? '+' : ''}
          {changePercent}%)
        </Text>
      );
    }
    return null;
  };

  // Alternate left-border color: coral for odd-index feel, or honey for variety
  // Using a simple hash on platform name for consistent coloring
  const borderColor = item.platform.length % 2 === 0 ? Colors.coral : Colors.honey;

  return (
    <TouchableOpacity
      style={[styles.assetItem, { borderLeftColor: borderColor }]}
      onPress={() => onEdit(item)}
      onLongPress={() => onDelete(item)}
      activeOpacity={0.7}
    >
      <View style={styles.topRow}>
        <Text style={styles.platform} numberOfLines={1}>{item.platform}</Text>
        <Text style={styles.value}>
          {item.value.toFixed(2)} {item.currency}
        </Text>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.bottomLeft}>
          {getValueChangeDisplay(item)}
          <Text style={styles.date}>
            {item.updatedAt
              ? `更新于: ${new Date(item.updatedAt).toLocaleDateString('zh-CN')}`
              : `创建于: ${new Date(item.createdAt).toLocaleDateString('zh-CN')}`}
          </Text>
        </View>
        {item.currency !== 'CNY' && cnyValue && (
          <Text style={styles.cnyValue}>≈ {cnyValue.toFixed(2)} CNY</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  assetItem: {
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    // Default border color — overridden inline
    borderLeftColor: Colors.coral,
    shadowColor: '#5C3D2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  platform: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.espresso,
    flex: 1,
    marginRight: 8,
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.coral,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bottomLeft: {
    flex: 1,
  },
  date: {
    fontSize: 10,
    color: Colors.warmBrown,
    marginTop: 2,
  },
  cnyValue: {
    fontSize: 10,
    color: Colors.warmBrown,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
});
```

- [ ] **Step 2: TypeScript check**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/AssetItem.tsx
git commit -m "feat: redesign AssetItem with warm coral theme

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 3: Redesign UnlockScreen with custom PIN keypad

**Files:**
- Modify: `screens/UnlockScreen.tsx`

- [ ] **Step 1: Rewrite `screens/UnlockScreen.tsx`**

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { verifyPassword } from '../services/passwordStorage';
import { Colors } from '../components/constants';

interface UnlockScreenProps {
  onUnlock: () => void;
}

const PIN_LENGTH = 6;
const KEYPAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'cancel', '0', 'backspace'];

function UnlockScreen({ onUnlock }: UnlockScreenProps) {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleKeyPress = (key: string) => {
    if (key === 'cancel') {
      setPin('');
      return;
    }
    if (key === 'backspace') {
      setPin((prev) => prev.slice(0, -1));
      return;
    }
    if (pin.length < PIN_LENGTH) {
      setPin((prev) => prev + key);
    }
  };

  const handleUnlock = async () => {
    if (pin.length === 0) {
      Alert.alert('提示', '请输入密码');
      return;
    }

    const isValid = await verifyPassword(pin);
    if (isValid) {
      setPin('');
      onUnlock();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin('');
      Alert.alert('密码错误', `请重试 (${newAttempts}/5)`);

      if (newAttempts >= 5) {
        Alert.alert('提示', '密码错误次数过多，请稍后再试');
      }
    }
  };

  // Auto-submit when pin reaches max length
  React.useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      handleUnlock();
    }
  }, [pin]);

  const renderPinDots = () => {
    const dots = [];
    for (let i = 0; i < PIN_LENGTH; i++) {
      const filled = i < pin.length;
      dots.push(
        <View
          key={i}
          style={[
            styles.pinDot,
            filled ? styles.pinDotFilled : styles.pinDotEmpty,
          ]}
        />
      );
    }
    return dots;
  };

  const renderKey = (key: string) => {
    if (key === 'cancel') {
      return (
        <TouchableOpacity
          key={key}
          style={styles.keypadKey}
          onPress={() => handleKeyPress(key)}
          activeOpacity={0.6}
        >
          <Text style={styles.keypadKeyTextSecondary}>取消</Text>
        </TouchableOpacity>
      );
    }
    if (key === 'backspace') {
      return (
        <TouchableOpacity
          key={key}
          style={styles.keypadKey}
          onPress={() => handleKeyPress(key)}
          activeOpacity={0.6}
        >
          <Text style={styles.keypadKeyTextDanger}>←</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        key={key}
        style={styles.keypadKey}
        onPress={() => handleKeyPress(key)}
        activeOpacity={0.4}
      >
        <Text style={styles.keypadKeyText}>{key}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* App icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconInner}>
            <Text style={styles.iconText}>¥</Text>
          </View>
        </View>

        <Text style={styles.title}>资产统计</Text>
        <Text style={styles.subtitle}>输入密码继续</Text>

        {/* PIN dots */}
        <View style={styles.pinDotsContainer}>{renderPinDots()}</View>

        {/* Keypad */}
        <View style={styles.keypadContainer}>
          {KEYPAD_KEYS.map((key) => renderKey(key))}
        </View>

        {attempts > 0 && (
          <Text style={styles.attemptText}>密码错误次数: {attempts}/5</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconInner: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  iconText: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.espresso,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.warmBrown,
    textAlign: 'center',
    marginBottom: 28,
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  pinDotFilled: {
    backgroundColor: Colors.coral,
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  pinDotEmpty: {
    backgroundColor: Colors.sand,
    borderWidth: 2,
    borderColor: Colors.coral,
  },
  keypadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 280,
    alignSelf: 'center',
    gap: 8,
  },
  keypadKey: {
    width: 76,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.espresso,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  keypadKeyText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.espresso,
  },
  keypadKeyTextSecondary: {
    fontSize: 13,
    color: Colors.warmBrown,
  },
  keypadKeyTextDanger: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.coralDark,
  },
  attemptText: {
    marginTop: 20,
    textAlign: 'center',
    color: Colors.coralDark,
    fontSize: 13,
  },
});

export default UnlockScreen;
```

- [ ] **Step 2: TypeScript check**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add screens/UnlockScreen.tsx
git commit -m "feat: redesign UnlockScreen with custom PIN keypad

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 4: Redesign SetPasswordScreen

**Files:**
- Modify: `screens/SetPasswordScreen.tsx`

- [ ] **Step 1: Rewrite `screens/SetPasswordScreen.tsx`**

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { setPassword } from '../services/passwordStorage';
import { Colors } from '../components/constants';

interface SetPasswordScreenProps {
  onPasswordSet: () => void;
}

function SetPasswordScreen({ onPasswordSet }: SetPasswordScreenProps) {
  const [password, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSetPassword = async () => {
    if (!password) {
      Alert.alert('错误', '请输入密码');
      return;
    }
    if (password.length < 4) {
      Alert.alert('错误', '密码至少需要4位数字');
      return;
    }
    if (!/^\d+$/.test(password)) {
      Alert.alert('错误', '密码只能包含数字');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('错误', '两次输入的密码不一致');
      return;
    }

    const success = await setPassword(password);
    if (success) {
      Alert.alert('成功', '密码设置成功', [
        { text: '确定', onPress: () => onPasswordSet() },
      ]);
    } else {
      Alert.alert('错误', '密码设置失败，请重试');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* App icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconInner}>
            <Text style={styles.iconText}>¥</Text>
          </View>
        </View>

        <Text style={styles.title}>设置密码</Text>
        <Text style={styles.subtitle}>请设置数字密码以保护您的资产信息</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>输入密码（4位以上数字）</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPasswordInput}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            placeholder="请输入密码"
            placeholderTextColor={Colors.warmBrown}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>确认密码</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            placeholder="请再次输入密码"
            placeholderTextColor={Colors.warmBrown}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSetPassword} activeOpacity={0.8}>
          <Text style={styles.buttonText}>确定</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconInner: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  iconText: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.espresso,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.warmBrown,
    textAlign: 'center',
    marginBottom: 36,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.espresso,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    letterSpacing: 6,
    textAlign: 'center',
    borderWidth: 1.5,
    borderColor: Colors.sand,
    color: Colors.espresso,
  },
  button: {
    backgroundColor: Colors.coral,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default SetPasswordScreen;
```

- [ ] **Step 2: TypeScript check**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add screens/SetPasswordScreen.tsx
git commit -m "feat: redesign SetPasswordScreen with warm theme

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 5: Redesign AssetForm

**Files:**
- Modify: `components/AssetForm.tsx`

- [ ] **Step 1: Rewrite `components/AssetForm.tsx`**

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';
import { CURRENCIES } from '../services/exchangeRate';
import { DEFAULT_PICKER_PLACEHOLDER, Colors } from './constants';
import { RootStackParamList } from '../types';

type AssetFormProps = NativeStackScreenProps<RootStackParamList, 'AssetForm'>;

function AssetForm({ navigation, route }: AssetFormProps) {
  const { asset, onSave, type } = route.params || {};
  const isEdit = !!asset && type === 'EDIT';

  const [platform, setPlatform] = useState(asset?.platform || '');
  const [value, setValue] = useState(asset?.value?.toString() || '');
  const [currency, setCurrency] = useState(asset?.currency || 'CNY');

  const handleSave = () => {
    if (!platform.trim()) {
      Alert.alert('错误', '请输入平台名称');
      return;
    }
    if (!value.trim() || isNaN(parseFloat(value))) {
      Alert.alert('错误', '请输入有效的价值');
      return;
    }
    if (value === asset?.value?.toString()) {
      navigation.goBack();
      return;
    }

    const assetData = {
      platform: platform.trim(),
      value: parseFloat(value),
      currency,
    };

    onSave(assetData);
    navigation.goBack();
  };

  const getValueChange = () => {
    if (isEdit && asset?.previousValue !== null && asset?.previousValue !== undefined) {
      const change = parseFloat(value) - asset.previousValue;
      const changePercent =
        asset.previousValue !== 0 ? ((change / asset.previousValue) * 100).toFixed(2) : '0';
      return { change, changePercent };
    }
    return null;
  };

  const valueChange = getValueChange();

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <Text style={styles.label}>平台名称</Text>
        <TextInput
          style={styles.input}
          value={platform}
          onChangeText={setPlatform}
          placeholder="例如：银行、支付宝、股票账户等"
          placeholderTextColor={Colors.warmBrown}
        />

        <Text style={styles.label}>价值</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder="输入数值"
          placeholderTextColor={Colors.warmBrown}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>货币</Text>

        {Platform.OS === 'ios' ? (
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={currency} onValueChange={setCurrency} enabled={!isEdit}>
              {CURRENCIES.map((item) => (
                <Picker.Item label={item.label} value={item.value} key={item.value} />
              ))}
            </Picker>
          </View>
        ) : (
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              value={currency}
              onValueChange={setCurrency}
              items={CURRENCIES}
              useNativeAndroidPickerStyle
              placeholder={DEFAULT_PICKER_PLACEHOLDER}
              disabled={isEdit}
            />
          </View>
        )}

        {valueChange && (
          <View style={styles.changeInfo}>
            <Text style={styles.changeLabel}>相比上次价值变化</Text>
            <Text
              style={[
                styles.changeValue,
                valueChange.change >= 0 ? styles.positive : styles.negative,
              ]}
            >
              {valueChange.change >= 0 ? '+' : ''}
              {valueChange.change.toFixed(2)} {currency}
              ({Number(valueChange.changePercent) >= 0 ? '+' : ''}
              {valueChange.changePercent}%)
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>
            {isEdit ? '更新资产' : '添加资产'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.espresso,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.sand,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.espresso,
  },
  pickerWrapper: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.sand,
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  changeInfo: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#FFF0E5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.sand,
    borderStyle: 'dashed',
  },
  changeLabel: {
    fontSize: 11,
    color: Colors.warmBrown,
    marginBottom: 6,
  },
  changeValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  positive: {
    color: Colors.sage,
  },
  negative: {
    color: Colors.coralDark,
  },
  saveButton: {
    backgroundColor: Colors.coral,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: Colors.warmBrown,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default AssetForm;
```

- [ ] **Step 2: TypeScript check**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/AssetForm.tsx
git commit -m "feat: redesign AssetForm with warm coral theme

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 6: Redesign HomeScreen with gradient header

**Files:**
- Modify: `screens/HomeScreen.tsx`

- [ ] **Step 1: Rewrite `screens/HomeScreen.tsx`**

```typescript
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
  ListRenderItem,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAssets, addAsset, updateAsset, deleteAsset } from '../services/storage';
import { convertToCNY } from '../services/exchangeRate';
import { exportAssets, importAssets, ExportFormat } from '../services/importExport';
import AssetItem from '../components/AssetItem';
import { Colors } from '../components/constants';
import { RootStackParamList, Asset } from '../types';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: HomeScreenProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [totalCNY, setTotalCNY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const loadAssets = async () => {
    try {
      const loadedAssets = await getAssets();
      setAssets(loadedAssets);
      await calculateTotal(loadedAssets);
    } catch (error) {
      console.error('Error loading assets:', error);
      Alert.alert('错误', '加载资产失败');
    }
  };

  const calculateTotal = async (assetList: Asset[]) => {
    setLoading(true);
    try {
      let total = 0;
      for (const asset of assetList) {
        const cnyValue = await convertToCNY(asset.value, asset.currency);
        if (cnyValue) {
          total += cnyValue;
        }
      }
      setTotalCNY(total);
    } catch (error) {
      console.error('Error calculating total:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAssets();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadAssets();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const handleAddAsset = () => {
    navigation.navigate('AssetForm', {
      onSave: async (assetData) => {
        await addAsset(assetData);
        await loadAssets();
      },
      type: 'ADD',
    });
  };

  const handleEditAsset = (asset: Asset) => {
    navigation.navigate('AssetForm', {
      asset,
      onSave: async (assetData) => {
        await updateAsset(asset.id, assetData);
        await loadAssets();
      },
      type: 'EDIT',
    });
  };

  const handleDeleteAsset = (asset: Asset) => {
    Alert.alert('确认删除', `确定要删除资产"${asset.platform}"吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          await deleteAsset(asset.id);
          await loadAssets();
        },
      },
    ]);
  };

  const handleImport = async () => {
    const success = await importAssets();
    if (success) {
      await loadAssets();
    }
  };

  const handleExport = async (format: ExportFormat) => {
    setShowExportMenu(false);
    await exportAssets(format);
  };

  const renderAssetItem: ListRenderItem<Asset> = ({ item }) => (
    <AssetItem item={item} onEdit={handleEditAsset} onDelete={handleDeleteAsset} />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.espressoDark, Colors.espresso]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.headerButton} onPress={handleImport}>
            <Text style={styles.headerButtonText}>导入</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowExportMenu(true)}
          >
            <Text style={styles.headerButtonText}>导出</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.totalLabel}>总资产 · CNY</Text>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.honey} />
        ) : (
          <Text style={styles.totalValue}>¥{totalCNY.toFixed(2)}</Text>
        )}
        <Text style={styles.subtitle}>基于实时汇率计算</Text>
      </LinearGradient>

      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        renderItem={renderAssetItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💰</Text>
            <Text style={styles.emptyText}>暂无资产记录</Text>
            <Text style={styles.emptySubtext}>点击下方按钮添加第一笔资产</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.coral}
            colors={[Colors.coral]}
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={handleAddAsset} activeOpacity={0.8}>
        <LinearGradient
          colors={[Colors.coral, Colors.coralDark]}
          style={styles.fabGradient}
        >
          <Text style={styles.fabText}>+</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Export Modal */}
      <Modal
        visible={showExportMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExportMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowExportMenu(false)}
        >
          <View style={styles.exportMenu}>
            <Text style={styles.exportMenuTitle}>选择导出格式</Text>
            <Text style={styles.exportMenuSubtitle}>将资产数据导出为文件</Text>

            {(['json', 'csv', 'xlsx'] as ExportFormat[]).map((format) => {
              const label = format === 'xlsx' ? 'Excel (XLSX)' : format.toUpperCase();
              return (
                <TouchableOpacity
                  key={format}
                  style={styles.exportMenuItem}
                  onPress={() => handleExport(format)}
                >
                  <Text style={styles.exportMenuItemText}>{label}</Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.exportMenuCancel}
              onPress={() => setShowExportMenu(false)}
            >
              <Text style={styles.exportMenuCancelText}>取消</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  header: {
    padding: 24,
    paddingTop: 8,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.espressoDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 16,
    gap: 8,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerButtonText: {
    color: Colors.honey,
    fontSize: 12,
    fontWeight: '600',
  },
  totalLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  totalValue: {
    color: Colors.honey,
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.warmBrown,
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    color: Colors.warmBrown,
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    shadowColor: Colors.coral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  fabGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportMenu: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    width: '82%',
    maxWidth: 320,
    shadowColor: Colors.espressoDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
    elevation: 12,
  },
  exportMenuTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.espresso,
    textAlign: 'center',
    marginBottom: 2,
  },
  exportMenuSubtitle: {
    fontSize: 11,
    color: Colors.warmBrown,
    textAlign: 'center',
    marginBottom: 16,
  },
  exportMenuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: Colors.offWhite,
    borderWidth: 1.5,
    borderColor: Colors.sand,
  },
  exportMenuItemText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.espresso,
  },
  exportMenuCancel: {
    paddingVertical: 10,
    marginTop: 4,
  },
  exportMenuCancelText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.warmBrown,
  },
});

export default HomeScreen;
```

- [ ] **Step 2: TypeScript check**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add screens/HomeScreen.tsx
git commit -m "feat: redesign HomeScreen with warm gradient header and FAB

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 7: Update App.tsx StatusBar and final verification

**Files:**
- Modify: `App.tsx`

- [ ] **Step 1: Update StatusBar in `App.tsx`**

Change the two `<StatusBar style="light" />` instances to `<StatusBar style="dark" />` for the password screens (they now have light backgrounds), and leave the main app's StatusBar as `light` since the home screen header is dark espresso.

In `App.tsx`:
- Line 71: `<StatusBar style="light" />` → `<StatusBar style="dark" />` (SetPasswordScreen has light bg)
- Line 81: `<StatusBar style="light" />` → `<StatusBar style="dark" />` (UnlockScreen has light bg)
- Line 90: Keep `<StatusBar style="light" />` (HomeScreen has dark header)

- [ ] **Step 2: TypeScript check**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add App.tsx
git commit -m "fix: adjust StatusBar style for warm theme screens

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 8: Final verification — run lint

- [ ] **Step 1: Run ESLint**

```
npm run lint
```

Expected: no errors. If there are errors (unlikely since only styles changed), fix them.

- [ ] **Step 2: Run TypeScript check one final time**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit any fixes if needed**

If lint required fixes, commit them:

```bash
git add -A
git commit -m "chore: fix lint issues after redesign

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```
