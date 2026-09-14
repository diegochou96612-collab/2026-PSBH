# 2026-PSBH
# 🩺 智慧術中壓力性損傷預防系統
### Smart Intraoperative Pressure Injury Prevention System

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

的完整壓傷風險管理流程。

---

# 🎯 Problem｜臨床問題

手術可能持續數小時，患者在麻醉狀態下無法自主改變姿勢。

特別是在：

- 長時間手術
- 特殊手術體位
- 高齡患者
- 高風險患者
- 無法任意調整體位的手術

特定骨突處可能持續受到壓迫。

因此，臨床上真正需要知道的不只是：

> 「現在壓力是多少？」

而是：

> 「哪個部位正在承受壓力？」  
> 「已經持續多久？」  
> 「累積風險有多高？」  
> 「什麼時候需要注意？」  
> 「術後是否真的出現皮膚損傷？」

---

# 💡 Solution｜我們的解決方案

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

Dashboard 將呈現：

- 📍 Body Location
- 📊 Pressure
- ⏱️ Duration
- 📈 Pressure × Time
- ⚠️ Risk Level
- 🚨 Warning Status

當特定部位累積風險升高時，系統提供視覺化警示，協助醫護人員評估是否需要調整減壓策略、墊材或進行其他適當處置。

> ⚠️ 本系統定位為 **Clinical Decision Support System（臨床決策輔助系統）**，提供風險資訊與提醒，不取代醫療人員的專業判斷。

---

# ✨ Key Innovations｜創新亮點

## 1️⃣ Pressure × Time

我們不只監測單一時間點的壓力值，而是將：

**Pressure + Duration**

進一步轉化為：

**Pressure × Time → Cumulative Risk**

同時考量壓力大小與持續時間，呈現長時間手術過程中的累積受壓風險。

---

## 2️⃣ Multi-site Pressure Monitoring

系統針對不同手術體位可能出現的高風險骨突部位進行多點監測，例如：

- Occiput｜枕骨
- Scapula｜肩胛
- Sacrum｜薦尾部
- Heel｜足跟

Dashboard 將資料對應至患者實際身體位置：

**Patient → Body Location → Pressure → Duration → Risk**

讓醫護人員快速辨識：

> 「哪一個部位正在累積風險？」

而不是只看到單純的感測器數值。

---

## 3️⃣ Perioperative Closed-loop Workflow

本專案不將系統限制在單一的術中壓力監測，而是建立：

```text
Pre-op Assessment
        ↓
Risk Prediction
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

形成從：

**術前 → 術中 → 術後**

的完整風險管理流程。

---

## 4️⃣ Data-driven Quality Improvement

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

> 哪種手術最容易出現高風險？

> 哪種體位容易產生特定壓力熱點？

> 哪些部位需要優先配置減壓措施？

> 哪些患者可能需要更積極的預防策略？

讓系統從單純的「監測工具」，進一步發展成：

**Clinical Quality Improvement Platform**

---

# 🖥️ Dashboard

Prototype Dashboard 主要規劃以下功能：

## 👤 Patient Overview

顯示：

- Patient Information
- Surgery Type
- Surgical Position
- Estimated Surgery Duration
- Risk Factors

---

## 📊 Pressure Monitoring

呈現不同身體部位的：

- Pressure
- Duration
- Pressure × Time
- Risk Level

---

## 🧍 Body Pressure Visualization

透過人體部位圖呈現患者不同位置的風險狀態，使醫護人員可以快速辨識高風險部位。

例如：

🟢 Low Risk  
🟡 Medium Risk  
🔴 High Risk

---

## 🚨 Alert System

當特定位置的累積受壓風險提高時，Dashboard 顯示警示資訊。

系統的目的不是直接要求醫護人員翻身，而是：

> **提供風險資訊，協助醫護人員依手術安全與患者狀況決定適當處置。**

因為部分特殊手術過程中，患者體位可能無法任意調整。

---

# 🏥 Clinical Workflow

## ① 術前｜Pre-operative

術前進行患者風險初步評估。

結合：

**Patient Risk + Surgery Type + Position + Expected Duration**

建立患者的初步受壓風險資訊。

---

## ② 術中｜Intraoperative

柔性壓力感測模組持續取得患者受壓資訊。

系統分析：

**Pressure × Time**

並於 Dashboard 呈現不同部位的風險狀態。

若風險升高，提供醫療人員警示。

---

## ③ 術後｜Post-operative

術後可紀錄患者皮膚狀況。

規劃支援：

- Skin Condition Record
- Pressure Injury Record
- Image Upload
- Intervention Record

藉此建立：

**術中受壓資訊 ↔ 術後皮膚結果**

之間的關聯。

---

# 👩‍⚕️ User Roles

系統依患者不同照護階段規劃角色：

- 🏥 Operating Room
- 🛏️ Recovery Room
- 🚑 ICU
- 🏨 General Ward
- 👩‍⚕️ Outpatient Clinic

讓患者的受壓風險與術後結果能夠延續至不同照護階段。

---

# 🧠 AI Integration｜為什麼需要 AI？

本專案中的 AI 並不是單純為了加入 AI 功能，也不是取代醫療人員。

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

也就是從固定門檻警示，逐步發展為依照：

> 「不同患者 × 不同手術 × 不同體位」

進行個人化風險分析。

---

# 🔄 Data Flow

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

# 💰 Business Model｜商業模式

本專案預計採用：

## B2B — Business to Hospital

主要客戶並非患者本人，而是：

**Hospitals / Medical Institutions**

---

## 🔹 Hardware

提供壓力感測相關硬體與資料接收設備。

可依未來產品設計採：

- Purchase
- Rental
- Hardware Package

等模式。

---

## 🔹 Consumables

依實際感測器設計、感染控制與法規需求，未來可規劃：

- Sensor Fixation Materials
- Isolation Materials
- Replaceable Components

形成持續性的耗材需求。

---

## 🔹 Software

Dashboard 與資料管理系統可規劃：

**Annual License / Subscription**

提供：

- Pressure Monitoring
- Risk Dashboard
- Patient Records
- Postoperative Records
- Data Analysis

等功能。

---

## 🔹 Data Analytics

透過適當去識別化的資料分析，可協助醫院了解：

- 高風險手術類型
- 常見受壓熱點
- 不同體位風險
- 減壓措施成效
- 臨床流程改善方向

讓醫院可以依據長期資料持續改善壓傷預防策略。

---

# 🚀 Go-to-Market Strategy

初期並不直接進行大規模醫院銷售。

預計採取：

```text
Prototype
   ↓
PoC
   ↓
Clinical Collaboration
   ↓
Validation
   ↓
Product Optimization
   ↓
Medical / Information System Partnership
   ↓
Hospital Adoption
```

首先與合作醫療單位進行：

**Proof of Concept（PoC）**

驗證系統可行性與實際臨床需求。

取得相關使用資料與成效後，再評估與：

- Medical Device Companies
- Healthcare IT Companies
- Hospital Information System Providers

合作推廣。

---

# 🛠️ Current Prototype

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

部分硬體、演算法及臨床功能仍屬未來開發與驗證方向。

> ⚠️ Current prototype is intended for research, education, and demonstration purposes only.

---

# 🔮 Future Work

未來預計進一步研究與開發：

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

# 👥 Team Members｜團隊成員

本專案由跨校、跨領域學生團隊共同開發，整合資訊工程、醫學、生化、資訊科學與數位媒體設計等不同專業背景。

| 學校 | 科系 | 年級 | 姓名 |
|---|---|---|---|
| 長榮大學 | 資訊工程學系 | 四年級 | **邱禹瑞** |
| 大同大學 | 生化相關科系 | 三年級 | **洪資淳** |
| 臺北醫學大學 | 醫學系 | 二年級 | **鄭佾庭** |
| 東吳大學 | 資料科學系 | 二年級 | **周子謙** |
| 大同大學 | 媒體設計相關科系 | 一年級 | **陳秋樺** |

---

# 🤝 Interdisciplinary Collaboration

本團隊透過不同領域的專業背景共同完成專案。

### 💻 Computer Science
系統架構、Dashboard、資料處理與系統整合。

### 🩺 Medicine
臨床需求、醫療情境、手術流程與實際使用情境評估。

### 🧪 Bioengineering / Biochemistry
生醫應用、材料與感測相關概念。

### 📊 Data Science
資料分析、風險模型與數據應用。

### 🎨 Media Design
UI/UX、視覺呈現與產品展示。

透過跨領域合作，將：

**Clinical Needs × Sensors × Software × Data × Design**

整合成完整的術中壓力性損傷預防概念。

---

# 🎯 Our Vision

我們希望讓原本難以直接觀察的：

**「長時間受壓風險」**

轉化為醫療人員可以：

**看見 → 理解 → 判斷 → 處置 → 追蹤**

的資訊。

最終目標不是只做一個壓力感測器，而是建立：

> **從 Pressure Monitoring 走向 Pressure Injury Prevention 的完整臨床決策支援系統。**

---

# ⚠️ Disclaimer

This project is currently a **research and prototype system**.

It is not intended for clinical diagnosis or treatment.

All pressure thresholds, Pressure × Time algorithms, sensor configurations, AI models, and clinical workflows require further technical and clinical validation before real-world deployment.

---

## ❤️ From Pressure Monitoring to Pressure Injury Prevention

**讓壓力被看見，讓傷害在發生之前被預防。**
