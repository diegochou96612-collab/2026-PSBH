// ============================================================
// mockPatients.ts – Simulation Patient Database
// 10 demo patients with unique pressure profiles & surgery positions
//
// ⚠ ALL DATA IS SIMULATION / DEMO DATA
// NOT REAL PATIENT DATA – NOT CLINICALLY VALIDATED
// Patient IDs: OR-2026-001 ~ OR-2026-010
// ============================================================

import type {
  MockPatient,
  PatientSiteData,
  PressureStatus,
  SkinRecord,
  TimelineEvent,
} from '../types';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function site(
  siteId: string, label: string, labelChinese: string,
  pressure: number, status: PressureStatus,
  durationMin: number, trend: PatientSiteData['trend'],
  peakPressure: number, avgPressure: number
): PatientSiteData {
  return { siteId, label, labelChinese, pressure, status, durationMin, trend, peakPressure, avgPressure };
}

// ---------------------------------------------------------------------------
// Patient 01 – OR-2026-001
// Lumbar Spine Decompression · Prone · High
// ---------------------------------------------------------------------------
const p01_skinRecords: SkinRecord[] = [
  {
    id: 'sr-p01-001',
    patientId: 'OR-2026-001',
    site: 'sacrum',
    careSetting: 'PACU',
    timestamp: '2026/09/05 17:10',
    observations: ['redness'],
    nursingNote: '薦骨處輕微發紅，持續觀察中。',
    photoFileName: 'PACU_sacrum_1710.jpg',
    recordedBy: '恢復室護理師',
  },
];

const p01_timeline: TimelineEvent[] = [
  { id: 'te-p01-1', patientId: 'OR-2026-001', time: '10:15', type: 'surgery-start', careSetting: 'OR', title: '手術開始', description: '腰椎減壓手術開始，體位：俯臥位。', severity: 'info' },
  { id: 'te-p01-2', patientId: 'OR-2026-001', time: '12:08', type: 'pressure-alert', careSetting: 'OR', title: '薦骨壓力警示', description: '薦骨壓力升高至 82 mmHg，持續受壓 36 min。', relatedSite: 'sacrum', severity: 'high-risk' },
  { id: 'te-p01-3', patientId: 'OR-2026-001', time: '12:18', type: 'intervention', careSetting: 'OR', title: '執行減壓介入', description: '調整減壓墊，介入後壓力降至 43 mmHg (-47.6%)。', relatedSite: 'sacrum', severity: 'success' },
  { id: 'te-p01-4', patientId: 'OR-2026-001', time: '16:00', type: 'surgery-end', careSetting: 'OR', title: '手術結束', description: '總手術時間 5h 45m。', severity: 'info' },
  { id: 'te-p01-5', patientId: 'OR-2026-001', time: '2026/09/05 17:10', type: 'skin-assessment', careSetting: 'PACU', title: 'PACU 皮膚評估', description: '薦骨輕微發紅。', relatedSite: 'sacrum', photoFileName: 'PACU_sacrum_1710.jpg', severity: 'caution' },
];

// ---------------------------------------------------------------------------
// Patient 02 – OR-2026-002
// Total Knee Arthroplasty · Supine · Moderate
// ---------------------------------------------------------------------------
const p02_timeline: TimelineEvent[] = [
  { id: 'te-p02-1', patientId: 'OR-2026-002', time: '08:30', type: 'surgery-start', careSetting: 'PACU', title: '手術開始', description: '全膝關節置換術，仰臥位。', severity: 'info' },
  { id: 'te-p02-2', patientId: 'OR-2026-002', time: '2026/09/04 11:00', type: 'skin-assessment', careSetting: 'PACU', title: 'PACU 皮膚評估', description: '足跟輕微壓紅，已墊高。', relatedSite: 'left-heel', severity: 'caution' },
];

// ---------------------------------------------------------------------------
// Patient 03 – OR-2026-003
// Total Hip Arthroplasty · Lateral · High
// ---------------------------------------------------------------------------
const p03_timeline: TimelineEvent[] = [
  { id: 'te-p03-1', patientId: 'OR-2026-003', time: '09:00', type: 'surgery-start', careSetting: 'ICU', title: '手術開始', description: '全髖關節置換術，側臥位。', severity: 'info' },
  { id: 'te-p03-2', patientId: 'OR-2026-003', time: '11:45', type: 'pressure-alert', careSetting: 'ICU', title: '右髖壓力警示', description: '右側大轉子壓力升高至 85 mmHg。', relatedSite: 'right-hip', severity: 'high-risk' },
  { id: 'te-p03-3', patientId: 'OR-2026-003', time: '11:55', type: 'intervention', careSetting: 'ICU', title: '執行介入', description: '調整側臥墊，壓力降至 52 mmHg。', relatedSite: 'right-hip', severity: 'success' },
];

// ---------------------------------------------------------------------------
// Patient 04 – OR-2026-004
// Laparoscopic Cholecystectomy · Supine · Low
// ---------------------------------------------------------------------------
const p04_timeline: TimelineEvent[] = [
  { id: 'te-p04-1', patientId: 'OR-2026-004', time: '13:00', type: 'surgery-start', careSetting: 'Ward', title: '手術開始', description: '腹腔鏡膽囊切除術，仰臥位。', severity: 'info' },
  { id: 'te-p04-2', patientId: 'OR-2026-004', time: '2026/09/02 15:30', type: 'skin-assessment', careSetting: 'Ward', title: '術後皮膚評估', description: '皮膚完整無異常。', severity: 'info' },
];

// ---------------------------------------------------------------------------
// Patient 05 – OR-2026-005
// Posterior Cervical Fusion · Prone · Critical
// ---------------------------------------------------------------------------
const p05_timeline: TimelineEvent[] = [
  { id: 'te-p05-1', patientId: 'OR-2026-005', time: '07:30', type: 'surgery-start', careSetting: 'OR', title: '手術開始', description: '頸椎後路融合手術，俯臥位。', severity: 'info' },
  { id: 'te-p05-2', patientId: 'OR-2026-005', time: '09:15', type: 'pressure-alert', careSetting: 'OR', title: '髂嵴壓力警示', description: '髂嵴壓力升高至 91 mmHg，持續 45 min。', relatedSite: 'iliac-crest', severity: 'high-risk' },
  { id: 'te-p05-3', patientId: 'OR-2026-005', time: '09:20', type: 'pressure-alert', careSetting: 'OR', title: '額頭壓力警示', description: '額頭壓力 78 mmHg，需評估頭架位置。', relatedSite: 'forehead', severity: 'high-risk' },
];

// ---------------------------------------------------------------------------
// Patient 06 – OR-2026-006
// CABG · Supine · Critical
// ---------------------------------------------------------------------------
const p06_timeline: TimelineEvent[] = [
  { id: 'te-p06-1', patientId: 'OR-2026-006', time: '08:00', type: 'surgery-start', careSetting: 'OR', title: '手術開始', description: '冠狀動脈繞道手術，仰臥位。', severity: 'info' },
  { id: 'te-p06-2', patientId: 'OR-2026-006', time: '11:30', type: 'pressure-alert', careSetting: 'OR', title: '薦骨持續高壓', description: '薦骨壓力 94 mmHg，持續 52 min。', relatedSite: 'sacrum', severity: 'high-risk' },
  { id: 'te-p06-3', patientId: 'OR-2026-006', time: '11:38', type: 'intervention', careSetting: 'OR', title: '執行減壓介入', description: '調整減壓墊，壓力降至 51 mmHg。', relatedSite: 'sacrum', severity: 'success' },
];

// ---------------------------------------------------------------------------
// Patient 07 – OR-2026-007
// Robotic Hysterectomy · Lithotomy · Moderate
// ---------------------------------------------------------------------------
const p07_timeline: TimelineEvent[] = [
  { id: 'te-p07-1', patientId: 'OR-2026-007', time: '10:00', type: 'surgery-start', careSetting: 'OR', title: '手術開始', description: '機器人輔助子宮切除術，截石位。', severity: 'info' },
  { id: 'te-p07-2', patientId: 'OR-2026-007', time: '11:45', type: 'pressure-alert', careSetting: 'OR', title: '右肩壓力警示', description: '右肩壓力 68 mmHg，Trendelenburg 體位持續。', relatedSite: 'right-shoulder', severity: 'caution' },
];

// ---------------------------------------------------------------------------
// Patient 08 – OR-2026-008
// Craniotomy · Lateral · High
// ---------------------------------------------------------------------------
const p08_timeline: TimelineEvent[] = [
  { id: 'te-p08-1', patientId: 'OR-2026-008', time: '08:00', type: 'surgery-start', careSetting: 'OR', title: '手術開始', description: '開顱手術，右側側臥位。', severity: 'info' },
  { id: 'te-p08-2', patientId: 'OR-2026-008', time: '10:15', type: 'pressure-alert', careSetting: 'OR', title: '右耳壓力警示', description: '右耳壓力 76 mmHg，持續 58 min。', relatedSite: 'right-ear', severity: 'high-risk' },
  { id: 'te-p08-3', patientId: 'OR-2026-008', time: '11:00', type: 'pressure-alert', careSetting: 'OR', title: '右肩壓力持續', description: '右肩壓力 82 mmHg，建議評估。', relatedSite: 'right-shoulder', severity: 'high-risk' },
];

// ---------------------------------------------------------------------------
// Patient 09 – OR-2026-009
// Shoulder Arthroscopy · Beach Chair · Moderate
// ---------------------------------------------------------------------------
const p09_timeline: TimelineEvent[] = [
  { id: 'te-p09-1', patientId: 'OR-2026-009', time: '14:00', type: 'surgery-start', careSetting: 'OR', title: '手術開始', description: '肩關節鏡手術，沙灘椅位。', severity: 'info' },
  { id: 'te-p09-2', patientId: 'OR-2026-009', time: '15:10', type: 'pressure-alert', careSetting: 'OR', title: '後腦壓力警示', description: '後腦壓力 72 mmHg，頭架固定時間較長。', relatedSite: 'occiput', severity: 'caution' },
];

// ---------------------------------------------------------------------------
// Patient 10 – OR-2026-010
// Emergency Abdominal Surgery · Supine · Critical
// ---------------------------------------------------------------------------
const p10_timeline: TimelineEvent[] = [
  { id: 'te-p10-1', patientId: 'OR-2026-010', time: '02:15', type: 'surgery-start', careSetting: 'OR', title: '緊急手術開始', description: '緊急腹部手術，仰臥位，ASA IV。', severity: 'info' },
  { id: 'te-p10-2', patientId: 'OR-2026-010', time: '04:00', type: 'pressure-alert', careSetting: 'OR', title: '薦骨持續高壓', description: '薦骨壓力 98 mmHg，持續 62 min。', relatedSite: 'sacrum', severity: 'high-risk' },
  { id: 'te-p10-3', patientId: 'OR-2026-010', time: '04:05', type: 'pressure-alert', careSetting: 'OR', title: '左足跟高壓', description: '左足跟壓力 84 mmHg，需即刻評估。', relatedSite: 'left-heel', severity: 'high-risk' },
  { id: 'te-p10-4', patientId: 'OR-2026-010', time: '04:12', type: 'intervention', careSetting: 'OR', title: '執行雙部位介入', description: '薦骨 + 足跟同步調整減壓墊。', severity: 'success' },
];

// ---------------------------------------------------------------------------
// Main patient database
// ---------------------------------------------------------------------------
export const MOCK_PATIENTS: MockPatient[] = [
  // ------------------------------------------------------------------ P01
  {
    patientId: 'OR-2026-001',
    age: 72, sex: 'Male', bmi: 18.6, asa: 'III',
    surgeryNameEn: 'Lumbar Spine Decompression',
    surgeryNameZh: '腰椎減壓手術',
    position: 'Prone',
    estimatedHours: 6,
    elapsedSeconds: 3 * 3600 + 42 * 60 + 18,
    riskFactors: ['高齡', '低 BMI', '長時間手術', '糖尿病'],
    overallRisk: 'High',
    careSetting: 'OR',
    pressureSites: [
      site('forehead',    'Forehead',    '額頭', 52, 'caution',    22, 'rising',  60, 41),
      site('chest',       'Chest',       '胸部', 38, 'stable',     10, 'stable',  44, 35),
      site('iliac-crest', 'Iliac Crest', '髂嵴', 45, 'caution',   18, 'stable',  51, 40),
      site('sacrum',      'Sacrum',      '薦骨', 82, 'high-risk', 36, 'rising',  91, 57),
      site('left-knee',   'Left Knee',   '左膝', 31, 'stable',     8, 'stable',  36, 28),
      site('right-knee',  'Right Knee',  '右膝', 34, 'stable',    10, 'stable',  40, 30),
    ],
    simulation: { running: false, speed: 1, scenario: 'high-pressure', interventions: [], elapsedSeconds: 3 * 3600 + 42 * 60 + 18 },
    skinRecords: p01_skinRecords,
    timelineEvents: p01_timeline,
  },
  // ------------------------------------------------------------------ P02
  {
    patientId: 'OR-2026-002',
    age: 58, sex: 'Female', bmi: 28.4, asa: 'II',
    surgeryNameEn: 'Total Knee Arthroplasty',
    surgeryNameZh: '全膝關節置換術',
    position: 'Supine',
    estimatedHours: 3,
    elapsedSeconds: 1 * 3600 + 50 * 60,
    riskFactors: ['BMI 偏高', '手術時間較長'],
    overallRisk: 'Moderate',
    careSetting: 'PACU',
    pressureSites: [
      site('occiput',       'Occiput',      '後腦',  35, 'stable',  20, 'stable',  40, 32),
      site('left-scapula',  'Left Scapula', '左肩胛', 28, 'stable',  12, 'stable',  33, 26),
      site('right-scapula', 'Right Scapula','右肩胛', 31, 'stable',  14, 'stable',  38, 28),
      site('sacrum',        'Sacrum',       '薦骨',  62, 'caution', 28, 'rising',  68, 48),
      site('left-heel',     'Left Heel',    '左足跟', 55, 'caution', 22, 'rising',  60, 42),
      site('right-heel',    'Right Heel',   '右足跟', 48, 'caution', 18, 'stable',  54, 38),
    ],
    simulation: { running: false, speed: 1, scenario: 'rising', interventions: [], elapsedSeconds: 1 * 3600 + 50 * 60 },
    skinRecords: [],
    timelineEvents: p02_timeline,
  },
  // ------------------------------------------------------------------ P03
  {
    patientId: 'OR-2026-003',
    age: 65, sex: 'Male', bmi: 25.1, asa: 'III',
    surgeryNameEn: 'Total Hip Arthroplasty',
    surgeryNameZh: '全髖關節置換術',
    position: 'Lateral',
    estimatedHours: 4,
    elapsedSeconds: 3 * 3600 + 10 * 60,
    riskFactors: ['高齡', '糖尿病', '側臥位'],
    overallRisk: 'High',
    careSetting: 'ICU',
    pressureSites: [
      site('right-ear',        'Right Ear',       '右耳',   42, 'stable',   15, 'stable',  48, 36),
      site('right-shoulder',   'Right Shoulder',  '右肩',   58, 'caution',  28, 'rising',  65, 46),
      site('right-hip',        'Right Hip (GT)',   '右大轉子',85,'high-risk',38, 'rising',  92, 64),
      site('right-knee',       'Right Knee',      '右膝',   52, 'caution',  22, 'stable',  58, 44),
      site('right-lat-mall',   'Lateral Malleolus','右外踝', 63, 'caution',  30, 'rising',  70, 51),
    ],
    simulation: { running: false, speed: 1, scenario: 'high-pressure', interventions: [], elapsedSeconds: 3 * 3600 + 10 * 60 },
    skinRecords: [],
    timelineEvents: p03_timeline,
  },
  // ------------------------------------------------------------------ P04
  {
    patientId: 'OR-2026-004',
    age: 47, sex: 'Female', bmi: 21.7, asa: 'II',
    surgeryNameEn: 'Laparoscopic Cholecystectomy',
    surgeryNameZh: '腹腔鏡膽囊切除術',
    position: 'Supine',
    estimatedHours: 2,
    elapsedSeconds: 55 * 60,
    riskFactors: ['無明顯高風險因子'],
    overallRisk: 'Low',
    careSetting: 'Ward',
    pressureSites: [
      site('occiput',       'Occiput',      '後腦',  22, 'stable',  5,  'stable', 26, 20),
      site('left-scapula',  'Left Scapula', '左肩胛', 18, 'stable',  4,  'stable', 24, 17),
      site('right-scapula', 'Right Scapula','右肩胛', 21, 'stable',  4,  'stable', 26, 19),
      site('sacrum',        'Sacrum',       '薦骨',  30, 'stable',  8,  'stable', 35, 27),
      site('left-heel',     'Left Heel',    '左足跟', 19, 'stable',  3,  'stable', 23, 17),
      site('right-heel',    'Right Heel',   '右足跟', 20, 'stable',  3,  'stable', 24, 18),
    ],
    simulation: { running: false, speed: 1, scenario: 'normal', interventions: [], elapsedSeconds: 55 * 60 },
    skinRecords: [],
    timelineEvents: p04_timeline,
  },
  // ------------------------------------------------------------------ P05
  {
    patientId: 'OR-2026-005',
    age: 76, sex: 'Female', bmi: 19.2, asa: 'III',
    surgeryNameEn: 'Posterior Cervical Fusion',
    surgeryNameZh: '頸椎後路融合手術',
    position: 'Prone',
    estimatedHours: 5.5,
    elapsedSeconds: 4 * 3600 + 15 * 60,
    riskFactors: ['高齡', '低 BMI', '長時間手術', '循環風險'],
    overallRisk: 'Critical',
    careSetting: 'OR',
    pressureSites: [
      site('forehead',    'Forehead',    '額頭', 78, 'high-risk', 45, 'rising',  85, 61),
      site('chest',       'Chest',       '胸部', 55, 'caution',   35, 'stable',  62, 48),
      site('iliac-crest', 'Iliac Crest', '髂嵴', 91, 'high-risk', 48, 'rising',  98, 72),
      site('left-knee',   'Left Knee',   '左膝', 64, 'caution',   30, 'stable',  70, 55),
      site('right-knee',  'Right Knee',  '右膝', 66, 'caution',   32, 'stable',  72, 56),
      site('feet',        'Feet/Toes',   '足部', 42, 'stable',    18, 'stable',  48, 36),
    ],
    simulation: { running: false, speed: 1, scenario: 'high-pressure', interventions: [], elapsedSeconds: 4 * 3600 + 15 * 60 },
    skinRecords: [],
    timelineEvents: p05_timeline,
  },
  // ------------------------------------------------------------------ P06
  {
    patientId: 'OR-2026-006',
    age: 63, sex: 'Male', bmi: 31.5, asa: 'III',
    surgeryNameEn: 'Coronary Artery Bypass Grafting',
    surgeryNameZh: '冠狀動脈繞道手術',
    position: 'Supine',
    estimatedHours: 7,
    elapsedSeconds: 5 * 3600 + 30 * 60,
    riskFactors: ['BMI 高', '心血管疾病', '長時間手術', '低體溫風險'],
    overallRisk: 'Critical',
    careSetting: 'OR',
    pressureSites: [
      site('occiput',       'Occiput',      '後腦',  58, 'caution',   32, 'rising',  65, 46),
      site('left-scapula',  'Left Scapula', '左肩胛', 48, 'caution',   28, 'stable',  54, 40),
      site('right-scapula', 'Right Scapula','右肩胛', 51, 'caution',   30, 'stable',  58, 42),
      site('sacrum',        'Sacrum',       '薦骨',  94, 'high-risk', 52, 'rising',  102, 73),
      site('left-heel',     'Left Heel',    '左足跟', 72, 'high-risk', 40, 'rising',  79, 58),
      site('right-heel',    'Right Heel',   '右足跟', 68, 'caution',   36, 'rising',  74, 55),
    ],
    simulation: { running: false, speed: 1, scenario: 'high-pressure', interventions: [], elapsedSeconds: 5 * 3600 + 30 * 60 },
    skinRecords: [],
    timelineEvents: p06_timeline,
  },
  // ------------------------------------------------------------------ P07
  {
    patientId: 'OR-2026-007',
    age: 39, sex: 'Female', bmi: 23.0, asa: 'II',
    surgeryNameEn: 'Robotic Hysterectomy',
    surgeryNameZh: '機器人輔助子宮切除術',
    position: 'Lithotomy',
    estimatedHours: 4,
    elapsedSeconds: 2 * 3600 + 45 * 60,
    riskFactors: ['Trendelenburg 體位', '長時間固定姿勢'],
    overallRisk: 'Moderate',
    careSetting: 'OR',
    pressureSites: [
      site('occiput',         'Occiput',       '後腦',  38, 'stable',  18, 'rising',  45, 32),
      site('left-shoulder',   'Left Shoulder', '左肩',  52, 'caution', 24, 'rising',  58, 42),
      site('right-shoulder',  'Right Shoulder','右肩',  68, 'caution', 28, 'rising',  74, 55),
      site('sacrum',          'Sacrum',        '薦骨',  44, 'caution', 20, 'rising',  50, 36),
      site('left-calf',       'Left Calf',     '左小腿',35, 'stable',  15, 'stable',  40, 30),
      site('right-calf',      'Right Calf',    '右小腿',36, 'stable',  15, 'stable',  41, 31),
    ],
    simulation: { running: false, speed: 1, scenario: 'rising', interventions: [], elapsedSeconds: 2 * 3600 + 45 * 60 },
    skinRecords: [],
    timelineEvents: p07_timeline,
  },
  // ------------------------------------------------------------------ P08
  {
    patientId: 'OR-2026-008',
    age: 69, sex: 'Male', bmi: 17.8, asa: 'III',
    surgeryNameEn: 'Craniotomy',
    surgeryNameZh: '開顱手術',
    position: 'Lateral',
    estimatedHours: 6,
    elapsedSeconds: 4 * 3600 + 50 * 60,
    riskFactors: ['高齡', 'BMI 過低', '長時間手術'],
    overallRisk: 'High',
    careSetting: 'OR',
    pressureSites: [
      site('right-ear',       'Right Ear',       '右耳',   76, 'high-risk', 58, 'rising',  84, 62),
      site('right-shoulder',  'Right Shoulder',  '右肩',   82, 'high-risk', 50, 'rising',  90, 68),
      site('right-hip',       'Right Hip (GT)',   '右大轉子',61,'caution',   38, 'stable',  68, 52),
      site('right-knee',      'Right Knee',      '右膝',   48, 'caution',   28, 'stable',  54, 40),
      site('right-lat-mall',  'Lateral Malleolus','右外踝', 55, 'caution',   32, 'rising',  62, 46),
    ],
    simulation: { running: false, speed: 1, scenario: 'high-pressure', interventions: [], elapsedSeconds: 4 * 3600 + 50 * 60 },
    skinRecords: [],
    timelineEvents: p08_timeline,
  },
  // ------------------------------------------------------------------ P09
  {
    patientId: 'OR-2026-009',
    age: 54, sex: 'Male', bmi: 26.2, asa: 'II',
    surgeryNameEn: 'Shoulder Arthroscopy',
    surgeryNameZh: '肩關節鏡手術',
    position: 'BeachChair',
    estimatedHours: 3,
    elapsedSeconds: 2 * 3600 + 10 * 60,
    riskFactors: ['頭頸固定', '特殊體位'],
    overallRisk: 'Moderate',
    careSetting: 'OR',
    pressureSites: [
      site('occiput',       'Occiput',      '後腦',  72, 'high-risk', 35, 'rising',  78, 56),
      site('left-scapula',  'Left Scapula', '左肩胛', 38, 'stable',   15, 'stable',  44, 32),
      site('right-scapula', 'Right Scapula','右肩胛', 42, 'caution',  18, 'stable',  48, 36),
      site('sacrum',        'Sacrum',       '薦骨',  34, 'stable',   10, 'stable',  40, 30),
      site('left-heel',     'Left Heel',    '左足跟', 28, 'stable',    8, 'stable',  32, 24),
      site('right-heel',    'Right Heel',   '右足跟', 29, 'stable',    8, 'stable',  34, 25),
    ],
    simulation: { running: false, speed: 1, scenario: 'rising', interventions: [], elapsedSeconds: 2 * 3600 + 10 * 60 },
    skinRecords: [],
    timelineEvents: p09_timeline,
  },
  // ------------------------------------------------------------------ P10
  {
    patientId: 'OR-2026-010',
    age: 81, sex: 'Female', bmi: 20.1, asa: 'IV',
    surgeryNameEn: 'Emergency Abdominal Surgery',
    surgeryNameZh: '緊急腹部手術',
    position: 'Supine',
    estimatedHours: 5,
    elapsedSeconds: 4 * 3600,
    riskFactors: ['高齡', 'ASA IV', '緊急手術', '循環狀況差', '長時間手術'],
    overallRisk: 'Critical',
    careSetting: 'OR',
    pressureSites: [
      site('occiput',       'Occiput',      '後腦',  64, 'caution',   35, 'rising',  70, 52),
      site('left-scapula',  'Left Scapula', '左肩胛', 58, 'caution',   30, 'rising',  65, 48),
      site('right-scapula', 'Right Scapula','右肩胛', 61, 'caution',   32, 'rising',  68, 50),
      site('sacrum',        'Sacrum',       '薦骨',  98, 'high-risk', 62, 'rising',  106, 78),
      site('left-heel',     'Left Heel',    '左足跟', 84, 'high-risk', 48, 'rising',  91, 66),
      site('right-heel',    'Right Heel',   '右足跟', 79, 'high-risk', 44, 'rising',  86, 62),
    ],
    simulation: { running: false, speed: 1, scenario: 'high-pressure', interventions: [], elapsedSeconds: 4 * 3600 },
    skinRecords: [],
    timelineEvents: p10_timeline,
  },
];

// Lookup map for fast access
export const PATIENT_MAP: Record<string, MockPatient> = Object.fromEntries(
  MOCK_PATIENTS.map((p) => [p.patientId, p])
);
