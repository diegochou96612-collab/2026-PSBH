// ============================================================
// PreopRiskEngine – Rule-based Pre-operative Risk Engine
//
// ⚠ RESEARCH PROTOTYPE
// This is a demo rule-based engine, NOT a clinically validated
// AI prediction model. Results are for demonstration only.
// Future: replace with ML model trained on clinical outcomes.
// ============================================================

export type SurgicalPositionInput = 'Supine' | 'Prone' | 'Lateral' | 'Lithotomy' | 'BeachChair';
export type ASAInput = 'I' | 'II' | 'III' | 'IV';
export type SiteRiskLevel = 'high' | 'moderate' | 'low';

export interface PreopInput {
  age: number;
  bmi: number;
  diabetes: boolean;
  mobilityImpaired: boolean;
  skinConditionAbnormal: boolean;
  surgeryType: string;
  position: SurgicalPositionInput;
  estimatedHours: number;
  asa: ASAInput;
  highBloodLossRisk: boolean;
}

export interface SiteRiskResult {
  siteId: string;
  label: string;
  labelChinese: string;
  risk: SiteRiskLevel;
  reasons: string[];
}

export interface PreopRiskResult {
  overallRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  riskScore: number;           // 0–100 (demo only)
  primaryFactors: string[];
  siteRisks: SiteRiskResult[];
  priorityList: { rank: number; siteId: string; labelChinese: string; label: string; risk: SiteRiskLevel; action: string }[];
}

// ---------------------------------------------------------------------------
// Site definitions per position
// ---------------------------------------------------------------------------
const SITES_BY_POSITION: Record<SurgicalPositionInput, { siteId: string; label: string; labelChinese: string }[]> = {
  Supine: [
    { siteId: 'occiput',        label: 'Occiput',       labelChinese: '後腦' },
    { siteId: 'left-scapula',   label: 'Left Scapula',  labelChinese: '左肩胛' },
    { siteId: 'right-scapula',  label: 'Right Scapula', labelChinese: '右肩胛' },
    { siteId: 'sacrum',         label: 'Sacrum',        labelChinese: '薦骨' },
    { siteId: 'left-heel',      label: 'Left Heel',     labelChinese: '左足跟' },
    { siteId: 'right-heel',     label: 'Right Heel',    labelChinese: '右足跟' },
  ],
  Prone: [
    { siteId: 'forehead',       label: 'Forehead',      labelChinese: '額頭' },
    { siteId: 'chest',          label: 'Chest',         labelChinese: '胸部' },
    { siteId: 'iliac-crest',    label: 'Iliac Crest',   labelChinese: '髂嵴' },
    { siteId: 'left-knee',      label: 'Left Knee',     labelChinese: '左膝' },
    { siteId: 'right-knee',     label: 'Right Knee',    labelChinese: '右膝' },
    { siteId: 'feet',           label: 'Feet / Toes',   labelChinese: '足部' },
  ],
  Lateral: [
    { siteId: 'ear',            label: 'Ear',           labelChinese: '耳部' },
    { siteId: 'shoulder',       label: 'Shoulder',      labelChinese: '肩部' },
    { siteId: 'greater-trochanter', label: 'Greater Trochanter', labelChinese: '大轉子' },
    { siteId: 'knee',           label: 'Knee',          labelChinese: '膝部' },
    { siteId: 'lateral-malleolus', label: 'Lateral Malleolus', labelChinese: '外踝' },
  ],
  Lithotomy: [
    { siteId: 'occiput',        label: 'Occiput',       labelChinese: '後腦' },
    { siteId: 'scapula',        label: 'Scapula',       labelChinese: '肩胛' },
    { siteId: 'sacrum',         label: 'Sacrum',        labelChinese: '薦骨' },
    { siteId: 'calf',           label: 'Calf',          labelChinese: '小腿' },
    { siteId: 'heel',           label: 'Heel',          labelChinese: '足跟' },
  ],
  BeachChair: [
    { siteId: 'occiput',        label: 'Occiput',       labelChinese: '後腦' },
    { siteId: 'scapula',        label: 'Scapula',       labelChinese: '肩胛' },
    { siteId: 'sacrum',         label: 'Sacrum',        labelChinese: '薦骨' },
    { siteId: 'heel',           label: 'Heel',          labelChinese: '足跟' },
  ],
};

// ---------------------------------------------------------------------------
// Site-specific base risk by position (anatomical pressure points)
// Higher base = more anatomically prone in that position
// ---------------------------------------------------------------------------
const SITE_BASE_RISK: Record<string, number> = {
  // Supine
  occiput: 30, 'left-scapula': 25, 'right-scapula': 25, sacrum: 55, 'left-heel': 40, 'right-heel': 40,
  // Prone
  forehead: 45, chest: 35, 'iliac-crest': 50, 'left-knee': 35, 'right-knee': 35, feet: 30,
  // Lateral
  ear: 40, shoulder: 45, 'greater-trochanter': 55, knee: 40, 'lateral-malleolus': 45,
  // Lithotomy / Beach Chair
  scapula: 25, calf: 40, heel: 40,
};

// ---------------------------------------------------------------------------
// Main risk engine
// ---------------------------------------------------------------------------
export function analyzePreopRisk(input: PreopInput): PreopRiskResult {
  // ---- 1. Calculate patient risk score multiplier ----
  let patientMultiplier = 1.0;
  const primaryFactors: string[] = [];

  if (input.age >= 70) {
    patientMultiplier += 0.30;
    primaryFactors.push('高齡（≥70歲）');
  } else if (input.age >= 60) {
    patientMultiplier += 0.15;
    primaryFactors.push('年齡偏高（60-69歲）');
  }

  if (input.bmi < 18.5) {
    patientMultiplier += 0.30;
    primaryFactors.push(`低 BMI（${input.bmi}）— 骨突部位缺乏脂肪保護`);
  } else if (input.bmi > 30) {
    patientMultiplier += 0.20;
    primaryFactors.push(`BMI 偏高（${input.bmi}）— 體重增加局部壓力`);
  }

  if (input.diabetes) {
    patientMultiplier += 0.25;
    primaryFactors.push('糖尿病 — 微血管循環受損，皮膚抵抗力降低');
  }

  if (input.mobilityImpaired) {
    patientMultiplier += 0.20;
    primaryFactors.push('活動能力受限 — 術後自我減壓能力降低');
  }

  if (input.skinConditionAbnormal) {
    patientMultiplier += 0.25;
    primaryFactors.push('術前皮膚狀況異常 — 需特別注意');
  }

  if (input.asa === 'III' || input.asa === 'IV') {
    patientMultiplier += 0.20;
    primaryFactors.push(`ASA ${input.asa} — 全身狀況影響組織耐受力`);
  }

  if (input.highBloodLossRisk) {
    patientMultiplier += 0.15;
    primaryFactors.push('預期出血量高 — 組織灌流影響壓傷風險');
  }

  // ---- 2. Surgical duration factor ----
  let durationMultiplier = 1.0;
  if (input.estimatedHours >= 6) {
    durationMultiplier = 1.5;
    primaryFactors.push(`預估手術時間長（${input.estimatedHours} hr）— 持續受壓風險顯著增加`);
  } else if (input.estimatedHours >= 4) {
    durationMultiplier = 1.3;
    primaryFactors.push(`預估手術時間較長（${input.estimatedHours} hr）`);
  } else if (input.estimatedHours >= 2) {
    durationMultiplier = 1.1;
  }

  // ---- 3. Position-specific factor ----
  const positionNote: Record<SurgicalPositionInput, string> = {
    Supine:     '仰臥位長時間固定 — 薦骨、足跟為主要受壓點',
    Prone:      '俯臥位 — 額頭、胸部、髂嵴、膝部為主要受壓點',
    Lateral:    '側臥位 — 耳部、大轉子、外踝為主要受壓點',
    Lithotomy:  '截石位 — 薦骨、小腿、足跟長時間受壓',
    BeachChair: '沙灘椅位 — 後腦、薦骨、足跟長時間固定',
  };
  primaryFactors.push(positionNote[input.position]);

  // ---- 4. Calculate per-site risk ----
  const sites = SITES_BY_POSITION[input.position];
  const siteRisks: SiteRiskResult[] = sites.map((s) => {
    const base = SITE_BASE_RISK[s.siteId] ?? 30;
    const score = Math.min(100, base * patientMultiplier * durationMultiplier);
    const reasons: string[] = [];

    // Add relevant reasons for this site
    if (s.siteId === 'sacrum' || s.siteId === 'greater-trochanter') {
      reasons.push(`${s.labelChinese}為 ${input.position} 體位主要骨突受壓點`);
    }
    if (s.siteId === 'left-heel' || s.siteId === 'right-heel' || s.siteId === 'heel') {
      reasons.push('足跟骨突明顯，受壓面積小、壓力集中');
    }
    if (s.siteId === 'forehead' || s.siteId === 'ear') {
      reasons.push('頭面部組織薄，俯臥/側臥時血液循環易受阻');
    }
    if (input.bmi < 18.5) reasons.push(`低 BMI（${input.bmi}）— 骨突部位缺乏軟組織保護`);
    if (input.age >= 70) reasons.push('高齡 — 皮膚彈性與組織耐受度降低');
    if (input.diabetes) reasons.push('糖尿病 — 末梢循環受損');
    if (input.estimatedHours >= 4) reasons.push(`預估手術 ${input.estimatedHours} hr — 持續受壓時間長`);

    const risk: SiteRiskLevel = score >= 70 ? 'high' : score >= 45 ? 'moderate' : 'low';
    return { siteId: s.siteId, label: s.label, labelChinese: s.labelChinese, risk, reasons };
  });

  // ---- 5. Overall risk ----
  const highCount = siteRisks.filter((s) => s.risk === 'high').length;
  const modCount  = siteRisks.filter((s) => s.risk === 'moderate').length;
  const overallScore = Math.min(100, (highCount * 25 + modCount * 10) * patientMultiplier * (durationMultiplier * 0.6));
  const overallRisk =
    overallScore >= 70 ? 'Critical' :
    overallScore >= 45 ? 'High' :
    overallScore >= 25 ? 'Moderate' : 'Low';

  // ---- 6. Priority list ----
  const sorted = [...siteRisks].sort((a, b) => {
    const order: Record<SiteRiskLevel, number> = { high: 0, moderate: 1, low: 2 };
    return order[a.risk] - order[b.risk];
  });

  const ACTION: Record<SiteRiskLevel, string> = {
    high:     '優先防護 ＋ 術中持續監測',
    moderate: '建議防護 ＋ 定時評估',
    low:      '常規觀察',
  };

  const priorityList = sorted
    .filter((s) => s.risk !== 'low')
    .map((s, i) => ({
      rank: i + 1,
      siteId: s.siteId,
      label: s.label,
      labelChinese: s.labelChinese,
      risk: s.risk,
      action: ACTION[s.risk],
    }));

  return {
    overallRisk,
    riskScore: Math.round(overallScore),
    primaryFactors,
    siteRisks,
    priorityList,
  };
}

// Default demo input matching the 10-patient database P01
export const DEFAULT_PREOP_INPUT: PreopInput = {
  age: 72,
  bmi: 18.6,
  diabetes: true,
  mobilityImpaired: false,
  skinConditionAbnormal: false,
  surgeryType: 'Cardiac Surgery（心臟手術）',
  position: 'Supine',
  estimatedHours: 6,
  asa: 'III',
  highBloodLossRisk: false,
};
