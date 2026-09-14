// ============================================================
// Mock Post-Op Data – pre-seeded skin records & timeline events
// All data is simulated demo data for prototype purposes only.
// ============================================================

import type {
  SkinRecord,
  TimelineEvent,
} from '../types';

export const PATIENT_ID = 'OR-2026-001';

// ---------------------------------------------------------------------------
// Pre-seeded skin records (PACU + ICU already done, Ward ongoing)
// ---------------------------------------------------------------------------
export const INITIAL_SKIN_RECORDS: SkinRecord[] = [
  {
    id: 'sr-001',
    patientId: PATIENT_ID,
    site: 'sacrum',
    careSetting: 'PACU',
    timestamp: '2026/09/05 17:10',
    observations: ['redness'],
    nursingNote: '薦骨處輕微發紅，已通知主治醫師，持續觀察中。',
    photoPreviewUrl: undefined,
    photoFileName: 'PACU_sacrum_1710.jpg',
    recordedBy: '恢復室護理師',
  },
  {
    id: 'sr-002',
    patientId: PATIENT_ID,
    site: 'sacrum',
    careSetting: 'ICU',
    timestamp: '2026/09/05 20:30',
    observations: ['redness', 'persistent-erythema'],
    nursingNote: '薦骨發紅持續，已予以減壓敷料覆蓋，持續每2小時翻身評估。',
    photoPreviewUrl: undefined,
    photoFileName: 'ICU_sacrum_2030.jpg',
    recordedBy: 'ICU 護理師',
  },
  {
    id: 'sr-003',
    patientId: PATIENT_ID,
    site: 'sacrum',
    careSetting: 'Ward',
    timestamp: '2026/09/06 08:00',
    observations: ['redness'],
    nursingNote: '翌日早晨評估：薦骨輕微發紅，範圍未擴大，減壓措施持續執行。',
    photoPreviewUrl: undefined,
    photoFileName: 'Ward_sacrum_0800.jpg',
    recordedBy: '病房護理師',
  },
];

// ---------------------------------------------------------------------------
// Pre-seeded timeline events for patient OR-2026-001
// ---------------------------------------------------------------------------
export const INITIAL_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'te-001',
    patientId: PATIENT_ID,
    time: '13:32',
    type: 'surgery-start',
    careSetting: 'OR',
    title: '手術開始',
    description: '心臟手術開始，體位：仰臥位。開始術中壓力監測。',
    severity: 'info',
  },
  {
    id: 'te-002',
    patientId: PATIENT_ID,
    time: '14:08',
    type: 'pressure-alert',
    careSetting: 'OR',
    title: '薦骨壓力升高',
    description: '薦骨 (Sacrum) 壓力升高至 82 mmHg，持續受壓中。',
    relatedSite: 'sacrum',
    severity: 'high-risk',
  },
  {
    id: 'te-003',
    patientId: PATIENT_ID,
    time: '14:15',
    type: 'pressure-alert',
    careSetting: 'OR',
    title: '薦骨持續高壓',
    description: '系統提示薦骨持續受壓，建議醫療團隊評估減壓措施。',
    relatedSite: 'sacrum',
    severity: 'high-risk',
  },
  {
    id: 'te-004',
    patientId: PATIENT_ID,
    time: '14:18',
    type: 'intervention',
    careSetting: 'OR',
    title: '護理人員執行介入',
    description: '已確認減壓墊位置，調整減壓墊。介入前 82 mmHg → 介入後 43 mmHg，壓力下降 47.6%。',
    relatedSite: 'sacrum',
    severity: 'success',
  },
  {
    id: 'te-005',
    patientId: PATIENT_ID,
    time: '16:52',
    type: 'surgery-end',
    careSetting: 'OR',
    title: '手術結束',
    description: '手術結束，總手術時間 6 hr 12 min。轉送恢復室。',
    severity: 'info',
  },
  {
    id: 'te-006',
    patientId: PATIENT_ID,
    time: '2026/09/05 17:10',
    type: 'skin-assessment',
    careSetting: 'PACU',
    title: '恢復室術後皮膚評估',
    description: '薦骨輕微發紅，已通知主治醫師，持續觀察中。',
    relatedSite: 'sacrum',
    photoFileName: 'PACU_sacrum_1710.jpg',
    severity: 'caution',
  },
  {
    id: 'te-007',
    patientId: PATIENT_ID,
    time: '2026/09/05 20:30',
    type: 'skin-assessment',
    careSetting: 'ICU',
    title: 'ICU 皮膚追蹤',
    description: '薦骨持續性紅斑，已予以減壓敷料，每2小時翻身評估。',
    relatedSite: 'sacrum',
    photoFileName: 'ICU_sacrum_2030.jpg',
    severity: 'caution',
  },
  {
    id: 'te-008',
    patientId: PATIENT_ID,
    time: '2026/09/06 08:00',
    type: 'skin-assessment',
    careSetting: 'Ward',
    title: '一般病房皮膚評估',
    description: '薦骨輕微發紅，範圍未擴大，持續減壓。',
    relatedSite: 'sacrum',
    photoFileName: 'Ward_sacrum_0800.jpg',
    severity: 'caution',
  },
];
