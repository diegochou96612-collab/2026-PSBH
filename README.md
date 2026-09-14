# 🩺 智慧術中壓力性損傷預防系統
## Smart Intraoperative Pressure Injury Prevention System

> **讓壓力被看見，讓傷害在發生之前被預防。**  
> From Pressure Monitoring to Pressure Injury Prevention.

---

## 📌 專案介紹｜Project Overview

長時間手術過程中，患者因麻醉而無法自主移動，枕骨、肩胛、薦尾部、足跟等骨突處可能長時間承受壓力，增加術中壓力性損傷（Pressure Injury）的風險。

本專案提出一套 **智慧術中壓力性損傷預防系統**，透過柔性壓力感測概念持續監測患者不同身體部位的受壓狀況，並結合：

**Pressure × Time（壓力 × 時間）**

進行累積風險判斷。

系統將患者各部位的壓力、受壓時間與風險狀態整合至 Dashboard，以視覺化方式協助醫護人員掌握患者受壓情況。

我們希望解決的不只是「偵測壓力」，而是建立：

**術前評估 → 術中監測 → 風險警示 → 臨床處置 → 術後追蹤 → 數據回饋**

的完整壓力性損傷風險管理流程。

---

## 🎬 Demo Video｜專案成果影片

### 2026 PSBH — Group 03

▶️ [Watch Demo Video on YouTube](https://youtu.be/fOEeXjtcKoQ)

影片展示本團隊提出的智慧術中壓力性損傷預防系統概念、臨床應用情境與 Prototype 操作流程。

---

## 🎯 Problem｜臨床問題

手術可能持續數小時，患者在麻醉狀態下無法自主改變姿勢。

特別是在以下情況：

- 長時間手術
- 特殊手術體位
- 高齡患者
- 高風險患者
- 無法任意調整體位的手術

特定骨突處可能持續受到壓迫。

因此，臨床上真正需要知道的不只是：

> 「現在的壓力是多少？」

還包括：

- 哪個部位正在承受壓力？
- 已經持續多久？
- 累積風險有多高？
- 哪些部位需要優先注意？
- 術後是否真的出現皮膚損傷？

---

# 💡 Solution｜解決方案

本系統以多部位柔性壓力感測概念監測患者高風險受壓位置。

```text
Patient
   ↓
Flexible Pressure Sensors
   ↓
Signal Processing & Calibration
   ↓
Wireless Communication
   ↓
Hospital Computer / Tablet
   ↓
Dashboard
   ↓
Pressure × Time Analysis
   ↓
Risk Alert
   ↓
Clinical Intervention
   ↓
Postoperative Assessment
```

Dashboard 規劃呈現：

- 📍 Body Location
- 📊 Pressure
- ⏱️ Duration
- 📈 Pressure × Time
- ⚠️ Risk Level
- 🚨 Warning Status

當特定部位累積風險升高時，系統提供視覺化警示，協助醫護人員評估是否需要調整減壓策略、墊材或採取其他適當措施。

> ⚠️ 本系統定位為 **Clinical Decision Support System（臨床決策輔助系統）**，提供風險資訊與輔助提醒，不取代醫療人員的專業判斷。

---

# ✨ Key Innovations｜創新亮點

## 1. Pressure × Time Risk Assessment

本系統不只監測單一時間點的壓力值，而是同時考量：

**Pressure + Duration**

並進一步形成：

**Pressure × Time → Cumulative Risk**

將「壓力大小」與「持續時間」共同納入風險評估，以呈現長時間手術過程中的累積受壓風險。

---

## 2. Multi-site Pressure Monitoring

針對不同手術體位可能產生的高風險骨突部位進行多點監測，例如：

- Occiput｜枕骨
- Scapula｜肩胛
- Sacrum｜薦尾部
- Heel｜足跟

Dashboard 將感測資訊與實際身體部位對應：

**Patient → Body Location → Pressure → Duration → Risk**

使醫護人員能快速辨識：

> **哪一個部位正在累積風險？**

而不是只能看到單純的感測器數值。

---

## 3. Perioperative Closed-loop Workflow

本系統不將功能限制於術中壓力監測，而是建立完整的圍手術期風險管理流程：

```text
Pre-op Assessment
        ↓
Risk Assessment
        ↓
Intraoperative Monitoring
        ↓
Pressure × Time Analysis
        ↓
Risk Alert
        ↓
Clinical Intervention
        ↓
Post-op Skin Assessment
        ↓
Data Analysis
        ↓
Clinical Feedback
```

形成：

**術前 → 術中 → 術後**

的完整風險管理概念。

---

## 4. Data-driven Quality Improvement

系統未來可累積：

- Patient Risk Factors
- Surgery Type
- Surgical Position
- Pressure Location
- Pressure Value
- Pressure Duration
- Intervention Record
- Postoperative Outcome

經適當去識別化及資料治理後，可進一步分析：

- 哪種手術較容易出現高風險？
- 哪種體位容易產生特定壓力熱點？
- 哪些部位需要優先配置減壓措施？
- 哪些患者可能需要更積極的預防策略？

讓系統從單純的 Pressure Monitoring Tool，進一步發展成：

**Clinical Quality Improvement Platform**

---

# 🖥️ Dashboard｜系統介面

Prototype Dashboard 主要規劃以下功能：

### 👤 Patient Overview

顯示：

- Patient Information
- Surgery Type
- Surgical Position
- Estimated Surgery Duration
- Risk Factors

### 📊 Pressure Monitoring

呈現不同身體部位的：

- Pressure
- Duration
- Pressure × Time
- Risk Level

### 🧍 Body Pressure Visualization

透過人體部位圖呈現不同位置的風險狀態，使醫護人員可以快速辨識高風險部位。

- 🟢 Low Risk
- 🟡 Medium Risk
- 🔴 High Risk

### 🚨 Alert System

當特定位置的累積受壓風險提高時，Dashboard 顯示警示資訊。

系統的目的不是直接要求醫療人員翻動患者，而是：

> **提供即時風險資訊，協助醫療人員依手術安全與患者實際狀況決定適當處置。**

部分特殊手術過程中，患者體位可能無法任意調整，因此系統以「輔助決策」而非「自動控制」為核心。

---

# 🏥 Clinical Workflow｜臨床流程

### ① 術前｜Pre-operative

術前進行患者風險初步評估。

結合：

**Patient Risk + Surgery Type + Position + Expected Duration**

建立患者的初步受壓風險資訊。

### ② 術中｜Intraoperative

柔性壓力感測模組持續取得患者受壓資訊。

系統分析：

**Pressure × Time**

並於 Dashboard 呈現不同部位的風險狀態。

若風險升高，提供醫療人員警示資訊。

### ③ 術後｜Post-operative

術後可記錄患者皮膚狀況，規劃支援：

- Skin Condition Record
- Pressure Injury Record
- Image Upload
- Intervention Record

藉此建立：

**術中受壓資訊 ↔ 術後皮膚結果**

之間的關聯。

---

# 👩‍⚕️ User Roles｜使用角色

系統依患者不同照護階段規劃角色：

- 🏥 Operating Room
- 🛏️ Recovery Room
- 🚑 ICU
- 🏨 General Ward
- 👩‍⚕️ Outpatient Clinic

讓患者的受壓風險資訊與術後結果能延續至不同照護階段。

---

# 🧠 AI Integration｜AI 應用

本專案中的 AI 並非用來取代醫療人員。

當未來累積足夠資料後，可將：

```text
Patient Risk Factors
        +
Surgery Type
        +
Surgical Position
        +
Pressure × Time
        +
Clinical Intervention
        +
Postoperative Outcome
```

作為風險模型的資料基礎。

未來可進一步研究：

**Personalized Pressure Injury Risk Prediction**

使系統從固定門檻警示，逐步發展為依照：

**不同患者 × 不同手術 × 不同體位**

進行個人化風險分析。

---

# 🔄 Data Flow｜資料流程

```text
Flexible Pressure Sensor
          ↓
Signal Acquisition
          ↓
Signal Processing
          ↓
Calibration
          ↓
Wireless Communication
          ↓
Receiver
          ↓
Hospital Computer / Tablet
          ↓
Dashboard
          ↓
Pressure × Time Analysis
          ↓
Risk Visualization
          ↓
Clinical Decision Support
```

---

# 🛠️ Tech Stack｜技術架構

目前 Prototype 主要使用：

- **React**
- **TypeScript**
- **Vite**
- HTML / CSS
- Front-end Dashboard Prototype

---

# 💻 Run Locally｜本機執行

### 1. Clone Repository

```bash
git clone https://github.com/imyujui/2026-PSBH.git
```

### 2. 進入 Prototype

```bash
cd 2026-PSBH/pressure-monitoring-prototype
```

### 3. 安裝 Dependencies

```bash
npm install
```

### 4. 啟動 Development Server

```bash
npm run dev
```

啟動成功後，開啟 Terminal 顯示的 Local URL。

Vite 預設通常為：

```text
http://localhost:5173/
```

---

# 🛠️ Current Prototype｜目前完成內容

目前 Prototype 主要展示：

- ✅ Patient Database
- ✅ Surgery Information
- ✅ Surgical Position
- ✅ Pressure Monitoring Dashboard
- ✅ Body-location Visualization
- ✅ Pressure × Time Concept
- ✅ Risk Alert
- ✅ User Role Switching
- ✅ Postoperative Records

目前系統主要作為概念驗證與成果展示使用，部分硬體、演算法與臨床功能仍屬未來開發及驗證方向。

---

# 💰 Business Model｜商業模式

本專案預計以：

## B2B — Business to Hospital

作為主要商業模式。

主要客戶為：

**Hospitals / Medical Institutions**

### Hardware

提供壓力感測相關硬體與資料接收設備。

未來可依產品設計採用：

- Purchase
- Rental
- Hardware Package

### Consumables

依實際感測器設計、感染控制與法規需求，未來可規劃：

- Sensor Fixation Materials
- Isolation Materials
- Replaceable Components

### Software

Dashboard 與資料管理系統可規劃：

**Annual License / Subscription**

提供：

- Pressure Monitoring
- Risk Dashboard
- Patient Records
- Postoperative Records
- Data Analysis

### Data Analytics

透過適當去識別化的資料分析，可協助醫院了解：

- 高風險手術類型
- 常見受壓熱點
- 不同體位風險
- 減壓措施成效
- 臨床流程改善方向

---

# 🚀 Go-to-Market Strategy｜市場導入

初期預計採取：

```text
Prototype
   ↓
Proof of Concept
   ↓
Clinical Collaboration
   ↓
Validation
   ↓
Product Optimization
   ↓
Industry Partnership
   ↓
Hospital Adoption
```

首先透過合作醫療單位進行 **Proof of Concept（PoC）**，驗證系統可行性與實際臨床需求。

取得相關使用資料與成效後，再評估與：

- Medical Device Companies
- Healthcare IT Companies
- Hospital Information System Providers

進行合作推廣。

---

# 🔮 Future Work｜未來發展

- [ ] Flexible Pressure Sensor Integration
- [ ] Sensor Calibration
- [ ] Wireless / BLE Communication
- [ ] Receiver Integration
- [ ] Pressure × Time Algorithm Validation
- [ ] Clinical Threshold Validation
- [ ] Personalized Risk Prediction
- [ ] EMR Integration
- [ ] Clinical Pilot Study
- [ ] Data Security & Privacy Validation
- [ ] Medical Device Regulatory Evaluation

---

# 👥 Team Members｜團隊成員與分工

本專案由五位來自不同學校與專業領域的學生共同完成，透過資訊工程、醫學、化工生技、資訊科學與數位媒體設計的跨領域合作，將臨床需求轉化為術中壓力性損傷預防系統 Prototype。

| 成員 | 學校／科系 | 年級 | 主要分工 |
|---|---|---|---|
| **邱禹瑞** | 長榮大學 資訊工程學系 | 四年級 | 系統 Prototype 開發、Dashboard 介面實作、Pressure × Time 風險監測流程設計、病患情境模擬、系統功能整合、GitHub 專案建置 |
| **洪資淳** | 大同大學 化工生技學系 | 三年級 | 生醫應用、材料與感測概念討論、跨領域方案設計、成果影片製作與影片剪輯 |
| **鄭佾庭** | 臺北醫學大學 醫學系 | 二年級 | 臨床需求分析、醫療情境與手術流程討論、Pressure × Time 風險監測流程設計、病患情境模擬、簡報製作、成果發表與上台報告 |
| **周子謙** | 東吳大學 資科相關科系 | 二年級 | 資料分析、資訊技術討論、系統功能規劃、感測器模型試作、文件撰寫 |
| **陳秋樺** | 大同大學 數媒相關科系 | 一年級 | UI/UX 與視覺設計、成果影片製作與影片剪輯、多媒體成果呈現 |

---

# 🤝 Interdisciplinary Collaboration｜跨領域合作

團隊成員依據不同專業背景，共同參與問題定義、方案設計、Prototype 實作與成果展示。

整體合作流程：

**Clinical Needs → System Design → Sensor Prototype → System Development → Visual Presentation → Final Presentation**

透過跨領域合作，將：

**Clinical Needs × Sensors × Software × Data × Design**

整合成完整的術中壓力性損傷預防方案。

---

# 🎯 Our Vision｜專案願景

我們希望讓原本難以直接觀察的：

**「長時間受壓風險」**

轉化為醫療人員可以：

**看見 → 理解 → 判斷 → 處置 → 追蹤**

的資訊。

最終目標不是只做一個壓力感測器，而是建立：

> **From Pressure Monitoring to Pressure Injury Prevention.**

從壓力監測走向完整的術中壓力性損傷預防與臨床決策支援。

---

# ⚠️ Disclaimer

This project is currently a **research and prototype system**.

It is not intended for clinical diagnosis or treatment.

All pressure thresholds, Pressure × Time algorithms, sensor configurations, AI models, and clinical workflows require further technical and clinical validation before real-world deployment.

---

## ❤️ From Pressure Monitoring to Pressure Injury Prevention

**讓壓力被看見，讓傷害在發生之前被預防。**
