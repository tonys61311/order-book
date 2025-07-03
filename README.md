# Order Book

## 程式設計概述

使用 **Vite + Vue 3 + TypeScript + Pinia** 開發即時行情看盤網頁，聚焦於「買 / 賣盤深度（Order Book）」與「最新成交價」的視覺化呈現。前端 UI 採用 **Tailwind CSS**，兼具 RWD 與暗黑主題擴充彈性。


## GitHub Pages 展示

[Demo](https://github.com/tonys61311/order-book)

## 專案結構

```
public/                          # 公開靜態資源資料夾
└── vite.svg                     # 預設 Vite 圖示

src/                              # 主要程式碼
├── assets/                       # 靜態資源（圖片、SVG）
│   ├── arrow-down.svg
│   └── vue.svg
│
├── components/                   # UI 元件模組
│   ├── common/                   # 通用元件
│   │   ├── ErrorScreen.vue       # 錯誤畫面
│   │   └── LoadingView.vue       # 載入畫面
│   │
│   ├── tableView/                # 表格相關元件
│   │   ├── TableCell.vue
│   │   ├── TableRow.vue
│   │   └── TableView.vue
│   │
│   └── LastPriceBar.vue          # 最後成交價元件
│
├── composable/                   # Composition API 封裝邏輯
│   └── useOrderBookRows.ts       # 處理委託簿資料邏輯
│
├── config/                       # 設定檔
│   └── ws.ts                     # WebSocket 相關設定
│
├── router/                       # 路由
│   └── index.ts
│
├── services/                     # WebSocket 服務層
│   ├── orderBookSocket.ts
│   ├── tradeHistorySocket.ts
│   └── updateOrderBookSocket.ts
│
├── stores/                       # Pinia 狀態管理
│   ├── orderBook.ts              # 委託簿狀態
│   └── price.ts                  # 價格狀態
│
├── types/                        # TypeScript 型別定義
│   ├── orderBook.ts
│   ├── svg.d.ts
│   ├── tableViewModel.ts
│   ├── trade.ts
│   └── wsPayload.ts
│
├── utils/                        # 工具方法
│   ├── baseSocket.ts             # 基礎 WebSocket 封裝
│   ├── number.ts                 # 數字格式處理
│   └── tradeSideTheme.ts         # 買賣方主題色設定
│
├── views/                        # 畫面元件
│   └── OrderBookPanel.vue        # 委託簿面板
│
├── App.vue                       # 根元件
└── main.ts                       # 入口檔案

./                                 # 專案根目錄
├── .env                           # 環境變數設定檔
├── .gitignore                     # Git 忽略檔案清單
├── env.d.ts                       # 環境變數型別定義
├── index.html                     # 應用入口 HTML
├── main.js                        # 主要程式進入點（Vite 預設）
├── package.json                   # 專案依賴與指令設定
├── package-lock.json              # 鎖定依賴版本
├── postcss.config.js              # PostCSS 設定
├── README.md                      # 專案說明文件
├── tailwind.config.ts             # Tailwind 設定
├── tsconfig.app.json              # TypeScript 應用程式設定
├── tsconfig.json                  # TypeScript 主設定檔
├── tsconfig.node.json             # Node.js 專用設定
└── vite.config.ts                 # Vite 打包與開發伺服器設定
```

### 核心技術

- **Vue 3 + Vite**：前端開發框架與打包工具
- **TypeScript**：靜態型別強化，提升開發穩定性與可維護性
- **Pinia**：狀態管理
- **Tailwind CSS**：CSS 框架
- **GitHub Pages**：靜態網站部署

### 核心特色
| 功能模組 | 說明 |
| -------- | ---- |
| **即時 Order Book** | 透過 WebSocket 訂閱 Snapshot / Delta，秒級更新前八檔買賣盤，並以動態背景條顯示累積量百分比。 |
| **最新成交價 (Ticker)** | 透過 WebSocket 訂閱追蹤最近成交價，依價格走勢自動變色並附箭頭旋轉動畫。 |
| **Pinia 狀態管理** | `orderBook` 與 `price` stores 分離資料層與 UI；getters 快取推導衍生值；actions 處理重連與錯誤監控。 |
| **可重用 Table 元件** | `TableCell`, `TableRow`, `TableView` 抽象化表格渲染；`TradeSideTheme` 統一 BUY / SELL 樣式。 |
| **Composable 拆分** | `useOrderBookRows` 等 hooks 將資料→UI 轉換邏輯封裝，保持元件簡潔。 |

---

## 程式邏輯與核心功能

### 1. 功能首頁 [`OrderBookPanel.vue`](#1-功能首頁-orderbookpanelvue)

整合委託簿資料、即時價格與買賣深度視覺呈現。

#### 核心流程：

- 透過 [`orderStore`](#2-狀態管理-pinia) 建立 WebSocket 連線，訂閱委託簿資料。
- 透過 [`priceStore`](#2-狀態管理-pinia) 建立 WebSocket 連線，取得最新成交價與漲跌趨勢。
- 呼叫 [`useOrderBookRows`](#4-組合式邏輯-composableuseorderbookrowsts) 封裝邏輯，轉換資料為 `TableCellModel` 陣列。
- 將資料傳入 [`TableView`](#5-表格呈現元件-tableview) 元件，渲染即時買賣盤。
- 當資料更新，畫面即時同步變化。

---

### 2. 狀態管理 (Pinia)

#### [`stores/orderBook.ts`](#2-狀態管理-pinia)

- 管理買賣盤資料：
  - 買方、賣方報價列表
  - 累積量計算
  - 委託簿更新時自動觸發資料轉換

#### [`stores/price.ts`](#2-狀態管理-pinia)

- 管理最新成交價格：
  - 計算價格漲跌趨勢
  - 決定最新價格的文字與背景顏色
  - 提供最後成交價給其他元件使用

---


## 3. WebSocket 架構設計

單一連線管理（自動重連、心跳保活）  
多 topic 資料分流與監聽  
各功能訂閱邏輯獨立，結構清晰  
**資料泛型 (Generics)** 設計，保留 TypeScript 型別安全  

### 架構優點

- **集中管理**：連線邏輯集中於 `utils`、`services`，避免分散於各元件。
- **高度型別安全**：泛型搭配明確型別定義，減少錯誤，提升開發體驗。
- **可重用性高**：`BaseSocket` 提供統一介面，其他場景可快速擴充新類別。

---

### 核心 `baseSocket.ts`

`BaseSocket` 為抽象基底類別，提供：

- 單一 WebSocket 連線管理
- Topic 資料分流機制
- 訂閱/退訂確認事件監聽
- 動態綁定 listener，可即時新增/移除監聽
- 心跳保活、斷線自動重連
- 減少資料處理錯誤。

---

### 功能封裝

#### `orderBookSocket.ts`

`OrderBookSocket` 繼承 `BaseSocket`，提供：

- `subscribe<T>(topic, listener)`：訂閱任意 topic，資料型別由泛型 `T` 決定
- `unsubscribe(topic)`：取消訂閱並清除對應 listener
- `resubscribe<T>(topic, listener)`：重新訂閱，常用於斷線重連或參數變更

---

#### `updateOrderBookSocket.ts`

專責處理「委託簿更新」資料：

- `subscribeUpdate(symbol, grouping, listener)`：訂閱指定商品委託簿更新，`listener` 收到 `OrderBookData` 型別資料
- `unsubscribeUpdate(symbol, grouping)`：取消更新訂閱
- `resubscribeUpdate(symbol, grouping, listener)`：重新訂閱更新資料

---

#### `tradeHistorySocket.ts`

專責處理「成交記錄」資料：

- `subscribeHistory(symbol, listener)`：訂閱指定商品成交記錄，`listener` 收到 `TradeItem[]` 型別資料
- `unsubscribeHistory(symbol)`：取消訂閱
- `resubscribeHistory(symbol, listener)`：重新訂閱

---

### 4. 組合式邏輯 [`composable/useOrderBookRows.ts`](#4-組合式邏輯-composableuseorderbookrowsts)

封裝委託簿資料轉換邏輯：

- 計算累積量與百分比。
- 結合 `tradeSideTheme` 主題色，標示買賣方不同顏色。
- 轉換為 `TableCellModel` 陣列，供 [`TableView`](#5-表格呈現元件-tableview) 使用。

**優點：**

- 邏輯與畫面分離
- 元件專注於 UI 呈現

---

### 5. 表格呈現元件 [`TableView`](#5-表格呈現元件-tableview)

專責資料列表呈現，完全不處理邏輯：

- 透過 `TableCellModel` 陣列決定每列顯示內容。
- 顯示項目：
  - 價格、數量、累積量百分比進度條
- 特點：
  - 自動更新資料
  - 滑鼠 hover 高亮
  - 百分比條輔助判讀深度

**設計理念：**

- 單一職責原則（SRP）
- 保持元件純粹，易於維護

---
## 安裝

1. Clone this repository:
   ```bash
   git clone https://github.com/tonys61311/order-book.git
   ```

2. Navigate into the project directory：
   ```bash
   cd order-book
   ```

3. Install dependencies：
   ```bash
   npm install
   ```

4. Start the local development server：
   ```bash
   npm run dev
   ```