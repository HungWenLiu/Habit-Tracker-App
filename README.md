# Habit Tracker App

一個功能豐富的習慣追蹤應用程式，使用 React 和 Vite 建構，支援拖拽排序、GitHub 風格熱力圖和連續完成天數統計。

## 功能特色

-  **任務管理**：新增、編輯、刪除習慣任務
-  **分類篩選**：支援自定義分類和篩選功能
-  **拖拽排序**：直覺的拖拽介面重新排列任務順序
-  **連續天數統計**：顯示每個習慣的連續完成天數
-  **GitHub 風格熱力圖**：視覺化習慣完成情況
-  **統計圖表**：完成率分析和分類統計
-  **本地儲存**：資料自動保存在瀏覽器本地

## 專案結構

```
Habit-Tracker-App/
├── public/
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   ├── Octocat.png
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Charts/
│   │   │   ├── HabitHeatmap.jsx          # GitHub 風格熱力圖
│   │   │   └── HabitHeatmap.module.css   # 熱力圖樣式
│   │   ├── TaskList/
│   │   │   ├── DraggableTaskList.jsx     # 可拖拽任務列表
│   │   │   └── TaskItem.jsx              # 單個任務項目
│   │   └── StatsChart.jsx                # 統計圖表組件
│   ├── utils/
│   │   ├── dateUtils.js                  # 日期工具和連續天數計算
│   │   └── storageUtils.js               # 本地儲存工具
│   ├── App.jsx                           # 主應用程式組件
│   ├── App.css                           # 主要樣式
│   ├── index.jsx                         # 應用程式入口點
│   └── index.css                         # 全域樣式
├── index.html                            # HTML 模板
├── package.json                          # 專案配置和相依性
├── vite.config.js                        # Vite 配置
└── README.md                             # 專案說明文件
```

## 技術棧

### 核心框架
- **React 18.2.0** - 前端框架
- **Vite 4.5.9** - 建構工具和開發伺服器

### 主要相依性
- **react-beautiful-dnd 13.1.1** - 拖拽功能實現
- **react-calendar-heatmap 1.10.0** - GitHub 風格熱力圖
- **recharts 3.1.0** - 圖表庫（圓餅圖、長條圖）
- **date-fns 4.1.0** - 日期處理工具

### 開發工具
- **@vitejs/plugin-react 4.2.1** - React 支援
- **eslint 8.55.0** - 程式碼檢查
- **@testing-library/react 13.4.0** - 測試工具

## 安裝和使用

### 安裝相依性
```bash
npm install
```

### 啟動開發伺服器
```bash
npm run dev
```

### 建構生產版本
```bash
npm run build
```

### 預覽建構結果
```bash
npm run preview
```

## 主要功能說明

### 1. 任務管理
- 新增任務：輸入任務名稱、設定到期日和分類
- 編輯任務：點擊任務可進行編輯
- 刪除任務：一鍵刪除不需要的任務
- 完成標記：點擊核取方塊標記完成

### 2. 拖拽排序
- 使用 React Beautiful DND 實現
- 支援滑鼠拖拽重新排列任務順序
- 自動保存新的排序順序

### 3. 熱力圖視覺化
- GitHub 風格的年度熱力圖
- 顏色深淺表示完成任務的頻率
- 支援查看個別習慣的完成情況

### 4. 統計分析
- 總體完成率統計
- 分類別完成情況分析
- 連續完成天數追蹤

### 5. 資料持久化
- 使用 localStorage 保存任務和歷史記錄
- 瀏覽器關閉後資料不會遺失
- 支援匯出和備份功能

## 開發筆記

### 已知問題和解決方案
- **React Beautiful DND + React 18 StrictMode**：由於相容性問題，已移除 StrictMode
- **拖拽性能優化**：使用 memo 和 callback 優化重新渲染

### 未來規劃
- [ ] 資料雲端同步
- [ ] 自定義主題
- [ ] 更多統計圖表類型
- [ ] 行動裝置 App 版本
- [ ] 社群分享功能

## 授權

MIT License  Habit Tracker - 每日任務習慣追蹤器 


##  功能介紹

###  **智能任務管理**
-  新增 / 編輯 / 刪除習慣任務
-  分類標籤（健康、學習、工作、其他）
-  截止日期設定與逾期提醒
-  可勾選任務完成狀態
-  **拖拽排序** - 自由調整任務優先順序

###  **連續天數追蹤**
-  計算每個習慣的連續完成天數
-  連續天數排行榜
-  視覺化連續打卡成就

###  **多元統計圖表**
-  圓餅圖顯示今日完成狀況
-  分類完成率長條圖
-  今日完成率百分比
-  連續天數排行榜

###  **GitHub 風格熱力圖**
-  **習慣熱力圖** - 類似 GitHub 貢獻圖
-  顏色深淺代表完成程度
-  年度習慣完成一覽
-  個別習慣詳細熱力圖

###  **智能資料儲存**
-  使用 localStorage 本地儲存
-  自動記錄習慣歷史數據
-  即時同步更新



##  使用技術

| 技術 | 版本 | 用途 |
|------|------|------|
| **React** | 18.2.0 | 前端框架 |
| **Vite** | 4.5.9 | 建構工具 |
| **Recharts** | 3.1.0 | 圓餅圖、長條圖 |
| **React Calendar Heatmap** | 1.10.0 | GitHub 風格熱力圖 |
| **React Beautiful DND** | 13.1.1 | 拖拽排序功能 |
| **Chart.js** | 4.5.0 | 進階圖表 |
| **React ChartJS 2** | 5.3.0 | Chart.js React 包裝器 |
| **date-fns** | 4.1.0 | 日期處理工具 |



