# 多币账本

一个使用 React Native (Expo) 开发的资产管理应用，支持多货币资产记录和实时汇率转换。

## 功能特性

- ✅ **增加资产记录** - 添加新的资产记录，包括平台名称、价值和货币类型
- ✅ **更新资产记录** - 编辑现有资产，自动记录价值变化
- ✅ **删除资产记录** - 长按资产项可删除记录
- ✅ **查询资产记录** - 查看所有资产列表，下拉刷新
- ✅ **价值变化跟踪** - 自动计算并显示相对上次记录的价值变化及百分比
- ✅ **多货币支持** - 支持人民币、美元、欧元、英镑等10种常用货币
- ✅ **实时汇率转换** - 自动获取实时汇率，将所有资产转换为人民币计算总值
- ✅ **本地数据存储** - 使用 AsyncStorage 将数据安全存储在本地
- ✅ **友好的UI界面** - 简洁美观的用户界面，支持iOS和Android

## 技术栈

- **React Native** - 跨平台移动应用框架
- **Expo** - React Native 开发工具链
- **React Navigation** - 导航管理
- **AsyncStorage** - 本地数据持久化
- **Exchange Rate API** - 实时汇率查询

## 数据结构

每条资产记录包含以下字段：

```javascript
{
  id: string,              // 唯一标识
  platform: string,        // 平台名称（如：银行、支付宝等）
  value: number,           // 当前价值
  currency: string,        // 货币类型（CNY、USD等）
  previousValue: number,   // 上次记录的价值（用于计算变化）
  createdAt: string,       // 创建时间
  updatedAt: string        // 更新时间
}
```

## 安装和运行

### 前置要求

- Node.js 20+
- npm 或 yarn
- Expo Go App (用于手机测试)

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

### 在不同平台运行

- **iOS**: 按 `i` 或运行 `npm run ios` (需要 macOS 和 Xcode)
- **Android**: 按 `a` 或运行 `npm run android` (需要 Android Studio)
- **Web**: 按 `w` 或运行 `npm run web`
- **手机扫码**: 使用 Expo Go App 扫描终端显示的二维码

## 使用说明

### 添加资产

1. 点击右下角的蓝色 "+" 按钮
2. 填写平台名称（必填）
3. 填写资产价值（必填）
4. 选择货币类型
5. 点击"添加资产"按钮

### 编辑资产

1. 点击资产列表中的任意项
2. 修改相关信息
3. 系统会自动显示相对上次的价值变化
4. 点击"更新资产"保存

### 删除资产

1. 长按要删除的资产项
2. 在确认对话框中点击"删除"

### 刷新汇率

下拉资产列表即可刷新汇率并重新计算总资产

## 支持的货币

- 人民币 (CNY)
- 美元 (USD)
- 欧元 (EUR)
- 英镑 (GBP)
- 日元 (JPY)
- 港币 (HKD)
- 韩元 (KRW)
- 新加坡元 (SGD)
- 澳元 (AUD)
- 加元 (CAD)

## 汇率说明

- 使用免费的 Exchange Rate API 获取实时汇率
- 汇率数据缓存1小时，减少API请求
- 所有资产最终转换为人民币(CNY)显示总值
- 如果网络不可用，会使用缓存的汇率数据

## 项目结构

```
AssetTracker/
├── App.js                      # 应用入口和导航配置
├── screens/
│   └── HomeScreen.js           # 主屏幕（资产列表和总资产）
├── components/
│   └── AssetForm.js            # 资产表单组件（添加/编辑）
├── services/
│   ├── storage.js              # 本地存储服务
│   └── exchangeRate.js         # 汇率转换服务
└── package.json
```

## 注意事项

- 首次使用需要联网获取汇率数据
- 数据存储在本地，卸载应用会导致数据丢失
- 建议定期备份重要数据
- 汇率仅供参考，实际交易请以银行汇率为准

## License

MIT
