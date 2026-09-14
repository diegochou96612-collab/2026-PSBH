// ============================================================
// Core domain types for the pressure monitoring prototype
// ============================================================

// ---------------------------------------------------------------------------
// Care Setting / Role types
// ---------------------------------------------------------------------------

export type CareSetting =
  | 'OR'
  | 'PACU'
  | 'ICU'
  | 'Ward'
  | 'Outpatient';

export interface CareSettingConfig {
  id: CareSetting;
  labelChinese: string;
  labelEnglish: string;
  roleLabel: string;       // e.g. "護理師"
  color: string;           // tailwind bg color class
  textColor: string;
  borderColor: string;
  order: number;           // position in care journey
}

export const CARE_SETTINGS: Record<CareSetting, CareSettingConfig> = {
  OR: {
    id: 'OR',
    labelChinese: '開刀房',
    labelEnglish: 'Operating Room',
    roleLabel: '手術室護理師',
    color: 'bg-blue-700',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-400',
    order: 1,
  },
  PACU: {
    id: 'PACU',
    labelChinese: '恢復室',
    labelEnglish: 'Post-Anesthesia Care Unit',
    roleLabel: '恢復室護理師',
    color: 'bg-teal-600',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-400',
    order: 2,
  },
  ICU: {
    id: 'ICU',
    labelChinese: '加護病房',
    labelEnglish: 'Intensive Care Unit',
    roleLabel: 'ICU 護理師',
    color: 'bg-violet-700',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-400',
    order: 3,
  },
  Ward: {
    id: 'Ward',
    labelChinese: '一般病房',
    labelEnglish: 'General Ward',
    roleLabel: '病房護理師',
    color: 'bg-emerald-600',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-400',
    order: 4,
  },
  Outpatient: {
    id: 'Outpatient',
    labelChinese: '門診',
    labelEnglish: 'Outpatient',
    roleLabel: '門診護理師',
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-400',
    order: 5,
  },
};

// RBAC – what each care setting can access
export interface RolePermissions {
  canViewLiveMonitoring: boolean;
  canViewOrSummary: boolean;
  canAddSkinRecord: boolean;
  canUploadPhoto: boolean;
  canAddNursingNote: boolean;
  canViewHistory: boolean;
  canViewTimeline: boolean;
}

export const ROLE_PERMISSIONS: Record<CareSetting, RolePermissions> = {
  OR: {
    canViewLiveMonitoring: true,
    canViewOrSummary: true,
    canAddSkinRecord: true,
    canUploadPhoto: true,
    canAddNursingNote: true,
    canViewHistory: true,
    canViewTimeline: true,
  },
  PACU: {
    canViewLiveMonitoring: false,
    canViewOrSummary: true,
    canAddSkinRecord: true,
    canUploadPhoto: true,
    canAddNursingNote: true,
    canViewHistory: false,
    canViewTimeline: true,
  },
  ICU: {
    canViewLiveMonitoring: false,
    canViewOrSummary: true,
    canAddSkinRecord: true,
    canUploadPhoto: true,
    canAddNursingNote: true,
    canViewHistory: false,
    canViewTimeline: true,
  },
  Ward: {
    canViewLiveMonitoring: false,
    canViewOrSummary: false,
    canAddSkinRecord: true,
    canUploadPhoto: true,
    canAddNursingNote: true,
    canViewHistory: true,
    canViewTimeline: true,
  },
  Outpatient: {
    canViewLiveMonitoring: false,
    canViewOrSummary: false,
    canAddSkinRecord: true,
    canUploadPhoto: true,
    canAddNursingNote: true,
    canViewHistory: true,
    canViewTimeline: true,
  },
};

// ---------------------------------------------------------------------------
// Post-op skin record types
// ---------------------------------------------------------------------------

export type PostOpBodySite =
  | 'occiput'
  | 'left-shoulder'
  | 'right-shoulder'
  | 'sacrum'
  | 'left-heel'
  | 'right-heel'
  | 'other';

export const POST_OP_BODY_SITE_LABELS: Record<PostOpBodySite, { zh: string; en: string }> = {
  occiput:         { zh: '後腦',   en: 'Occiput' },
  'left-shoulder': { zh: '左肩',   en: 'Left Shoulder' },
  'right-shoulder':{ zh: '右肩',   en: 'Right Shoulder' },
  sacrum:          { zh: '薦骨',   en: 'Sacrum' },
  'left-heel':     { zh: '左足跟', en: 'Left Heel' },
  'right-heel':    { zh: '右足跟', en: 'Right Heel' },
  other:           { zh: '其他',   en: 'Other' },
};

export type SkinObservation =
  | 'no-abnormality'
  | 'redness'
  | 'persistent-erythema'
  | 'skin-integrity-abnormal'
  | 'other';

export const SKIN_OBSERVATION_LABELS: Record<SkinObservation, string> = {
  'no-abnormality':       '無明顯異常',
  'redness':              '發紅',
  'persistent-erythema':  '持續性紅斑',
  'skin-integrity-abnormal': '皮膚完整性異常',
  'other':                '其他',
};

export const SKIN_OBSERVATION_COLORS: Record<SkinObservation, string> = {
  'no-abnormality':       'bg-green-100 text-green-700 border-green-300',
  'redness':              'bg-amber-100 text-amber-700 border-amber-300',
  'persistent-erythema':  'bg-orange-100 text-orange-700 border-orange-300',
  'skin-integrity-abnormal': 'bg-red-100 text-red-700 border-red-300',
  'other':                'bg-slate-100 text-slate-700 border-slate-300',
};

export interface SkinRecord {
  id: string;
  patientId: string;
  site: PostOpBodySite;
  careSetting: CareSetting;
  timestamp: string;          // ISO or formatted datetime
  observations: SkinObservation[];
  nursingNote: string;
  photoPreviewUrl?: string;   // local blob URL for prototype demo
  photoFileName?: string;
  recordedBy: string;         // role label
}

// ---------------------------------------------------------------------------
// Care journey timeline event types
// ---------------------------------------------------------------------------

export type TimelineEventType =
  | 'surgery-start'
  | 'pressure-alert'
  | 'intervention'
  | 'surgery-end'
  | 'skin-assessment'
  | 'photo-record'
  | 'nursing-note';

export interface TimelineEvent {
  id: string;
  patientId: string;
  time: string;               // e.g. "13:32" or "2026/09/05 17:10"
  type: TimelineEventType;
  careSetting: CareSetting;
  title: string;
  description: string;
  relatedSite?: PostOpBodySite | string;
  photoPreviewUrl?: string;
  photoFileName?: string;     // demo placeholder when no real photo
  severity?: 'info' | 'caution' | 'high-risk' | 'success';
}

export type PressureStatus = 'stable' | 'caution' | 'high-risk';

export type BodySite =
  | 'occiput'
  | 'left-scapula'
  | 'right-scapula'
  | 'sacrum'
  | 'left-heel'
  | 'right-heel';

export interface SiteData {
  site: BodySite;
  label: string;
  labelChinese: string;
  pressure: number; // mmHg
  status: PressureStatus;
  durationMin: number; // continuous pressure duration in minutes
  trend: 'rising' | 'stable' | 'falling';
  peakPressure: number;
  avgPressure: number;
}

export interface PressureDataPoint {
  time: string;       // e.g. "13:00"
  pressure: number;   // mmHg
  minutesAgo: number; // for x-axis display
}

export interface InterventionRecord {
  id: string;
  site: BodySite;
  timestamp: string;        // e.g. "14:32"
  interventionType: InterventionType;
  pressureBefore: number;
  pressureAfter: number;
  reduction: number;        // percentage
}

export type InterventionType =
  | 'adjust-pad'
  | 'add-protection'
  | 'micro-reposition'
  | 'other';

export const INTERVENTION_LABELS: Record<InterventionType, string> = {
  'adjust-pad': '調整減壓墊',
  'add-protection': '增加局部防護',
  'micro-reposition': '微調體位',
  'other': '其他',
};

export interface PatientInfo {
  id: string;
  age: number;
  bmi: number;
  position: string;
  surgeryType: string;
  estimatedHours: number;
  riskLevel: 'high' | 'medium' | 'low';
  riskFactors: string[];
}

// Demo scenario modes for simulation control
export type DemoScenario =
  | 'normal'
  | 'rising'
  | 'high-pressure'
  | 'post-intervention';

// Sensor data provider interface – swap MockSensorDataProvider for
// BLEPressureSensorProvider when hardware is available
export interface SensorDataProvider {
  getLatestSiteData(): SiteData[];
  getPressureHistory(site: BodySite): PressureDataPoint[];
}

export type PostOpSkinStatus =
  | 'normal'
  | 'redness'
  | 'suspected'
  | 'confirmed';

export const SKIN_STATUS_LABELS: Record<PostOpSkinStatus, string> = {
  normal: '無異常',
  redness: '發紅',
  suspected: '疑似壓傷',
  confirmed: '已確認壓傷',
};

export interface SurgicalCase {
  id: string;
  date: string;
  surgeryType: string;
  totalHours: string;
  highestRiskSite: string;
  peakPressure: number;
  highPressureDuration: number;
  interventions: number;
  pressureReduction: string;
  outcome: PostOpSkinStatus;
}

// ---------------------------------------------------------------------------
// Multi-patient database types
// All patients are SIMULATION DATA – not real patient data
// ---------------------------------------------------------------------------

export type SurgeryPosition =
  | 'Supine'
  | 'Prone'
  | 'Lateral'
  | 'Lithotomy'
  | 'BeachChair';

export const POSITION_LABELS: Record<SurgeryPosition, { zh: string; en: string }> = {
  Supine:     { zh: '仰臥位', en: 'Supine' },
  Prone:      { zh: '俯臥位', en: 'Prone' },
  Lateral:    { zh: '側臥位', en: 'Lateral' },
  Lithotomy:  { zh: '截石位 + 頭低腳高位', en: 'Lithotomy + Trendelenburg' },
  BeachChair: { zh: '沙灘椅位', en: 'Beach Chair' },
};

export type OverallRisk = 'Low' | 'Moderate' | 'High' | 'Critical';

export const OVERALL_RISK_CONFIG: Record<OverallRisk, {
  label: string; labelChinese: string;
  bg: string; text: string; border: string; dot: string;
}> = {
  Low:      { label: 'Low',      labelChinese: '低風險',  bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-300',  dot: 'bg-green-500' },
  Moderate: { label: 'Moderate', labelChinese: '注意',    bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-300',  dot: 'bg-amber-500' },
  High:     { label: 'High',     labelChinese: '高風險',  bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-300',    dot: 'bg-red-500' },
  Critical: { label: 'Critical', labelChinese: '極高風險',bg: 'bg-red-200',    text: 'text-red-900',    border: 'border-red-500',    dot: 'bg-red-700' },
};

// Generic pressure site (position-agnostic, for multi-patient db)
export interface PatientSiteData {
  siteId: string;           // e.g. "sacrum", "forehead"
  label: string;            // English
  labelChinese: string;     // Chinese
  pressure: number;
  status: PressureStatus;
  durationMin: number;
  trend: 'rising' | 'stable' | 'falling';
  peakPressure: number;
  avgPressure: number;
}

export type ASAGrade = 'I' | 'II' | 'III' | 'IV';

export type SimulationSpeed = 1 | 2 | 5;

export interface SimulationState {
  running: boolean;
  speed: SimulationSpeed;
  scenario: DemoScenario;
  interventions: InterventionRecord[];
  elapsedSeconds: number;
}

export interface MockPatient {
  patientId: string;
  age: number;
  sex: 'Male' | 'Female';
  bmi: number;
  asa: ASAGrade;
  surgeryNameEn: string;
  surgeryNameZh: string;
  position: SurgeryPosition;
  estimatedHours: number;        // total estimated hours
  elapsedSeconds: number;        // already elapsed
  riskFactors: string[];
  overallRisk: OverallRisk;
  careSetting: CareSetting;
  pressureSites: PatientSiteData[];
  simulation: SimulationState;
  // Linked post-op data (per patient)
  skinRecords: SkinRecord[];
  timelineEvents: TimelineEvent[];
}
