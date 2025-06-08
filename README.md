# React 19 - Video Highlight Tool
![image](https://img.shields.io/badge/node-v22.13.1-green.svg) 
![image](https://img.shields.io/badge/react-v19-blue.svg)   
![image](https://img.shields.io/badge/typescript-blue.svg) ![image](https://img.shields.io/badge/pnpm-985F2A.svg) 

使用 React 19 + TypeScript + Vite 搭配 TailwindCSS / DaisyUI、Zustand，打造的影片 Highlight 工具

## 功能說明
[原始題目在此](https://gist.github.com/vickyliin/879d4454bff348641c9c45298c2063ef)

1. **影片上傳**  
   - 使用者可上傳本機影片（可使用此[範例](https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4)測試）  
   - 上傳後以 `URL.createObjectURL` 預覽  
2. **Mock AI 處理**  
   - 模擬呼叫 API，延遲後回傳假 transcript  
   - 包含全文、分段、段落標題、建議 Highlight 的句子 
3. **編輯區（Editing Area）**  
   - 左側 40%：`TranscriptPanel` 顯示段落標題、句子、時間戳  
   - 勾選/取消勾選句子、點擊時間戳跳秒  
   - 播放時同步 Highlight 當前句子、滾動至可見  
4. **預覽區（Preview Area）**  
   - 右側 60%：影片播放器、字幕 Overlay  
   - 顯示使用者當前播放的句子文字  
   - 真實時間軸：段落範圍、刻度、Highlight 標記  
5. **Highlight 串段播放**  
   - 「▶️ 播放 Highlight」只依勾選句子自動串接播放  
   - 每段 4 秒、段尾淡出再淡入下一段  
6. **儲存下載**  
   - 「💾 儲存 Highlight」下載 JSON：包含 `segments`、`highlights`

## Component / Pages 說明
### TranscriptPanel  (Component)
![TranscriptPanel](https://user-images.githubusercontent.com/.../transcript-panel.png)  
- 顯示 `Section[]`  
- 勾選框、句子文字、時間戳  
- Props  

| 變數名稱    | 型別                        | 必填 | 描述                       |
|:-----------:|:---------------------------:|:----:|:---------------------------|
| `transcript`| `Section[]`                 | ✓    | 分段後的逐字稿             |
| `onToggle`  | `(secIdx, sentIdx) => void` | ✓    | 點勾選框切換該句 selected  |
| `onClickTime`| `(secIdx, sentIdx) => void`| ✓    | 點擊時間戳跳到影片該秒     |

### HomePage  (Pages)
- 檔案上傳：`<input type="file">`  
- 模擬 AI 延遲後透過 Zustand 存 `videoURL`、`transcript`，再導向 `/editor`

### Timeline  (Pages)
- 顯示整支影片的段落範圍（`start`–`end`）、0%–100% 刻度、各 Highlight 標記  
- 點擊標記也能跳秒  

| 變數名稱     | 型別                | 必填 | 描述                       |
|:------------:|:-------------------:|:----:|:---------------------------|
| `duration`   | `number`            | ✓    | 影片總長度（秒）          |
| `transcript` | `Section[]`         | ✓    | 用於計算段落範圍           |
| `highlights` | `{timestamp,text}[]`| ✓    | 每句被選中的時間與文字     |


## 技術需求

### 必需技術  
- React 19（函式元件 + Hooks）  
- TypeScript（型別安全）  
- Vite  
- TailwindCSS + DaisyUI  
- Zustand（狀態管理）  

### 選用技術  
- JSON Blob 下載（Highlight 儲存）  
- 原生 `<video>` + CSS 淡入/淡出過場  

## 安裝和運行說明
![image](https://img.shields.io/badge/node-v22.13.1-green.svg) ![image](https://img.shields.io/badge/pnpm-985F2A.svg) 
```bash
git clone <repository-url>
cd <project-name>
pnpm install
pnpm run dev
```

## 專案結構
```tree
react19-video-highlight-tool/
├─ src/
│  ├─ components/
│  │   └─ TranscriptPanel.tsx    
│  ├─ pages/
│  │   ├─ HomePage.tsx           
│  │   └─ EditorPage.tsx         
│  ├─ router/
│  │   └─ index.tsx              
│  ├─ store/
│  │   └─ videoStore.ts          
│  ├─ mock/
│  │   └─ transcript.ts          
│  ├─ types/
│  │   └─ transcript.d.ts        
│  ├─ App.tsx                    
│  └─ main.tsx                   
├─ public/                        
├─ index.html                    
├─ package.json                  
├─ tsconfig.json                 
└─ vite.config.ts                
```