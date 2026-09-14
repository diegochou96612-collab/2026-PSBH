// ============================================================
// Mock Sensor Data – centralized simulation data source
// All values are simulated prototype data for demo purposes only.
// Replace MockSensorDataProvider with BLEPressureSensorProvider
// when real hardware sensors are connected.
// ============================================================

import type {
  SiteData,
  BodySite,
  PressureDataPoint,
  SensorDataProvider,
  DemoScenario,
  SurgicalCase,
} from '../types';

// ---------------------------------------------------------------------------
// Static patient info (demo only)
// ---------------------------------------------------------------------------
export const MOCK_PATIENT = {
  id: 'OR-2026-001',
  age: 72,
  bmi: 18.6,
  position: '仰臥位',
  surgeryType: '心臟手術',
  estimatedHours: 6,
  riskLevel: 'high' as const,
  riskFactors: ['高齡', '低 BMI', '長時間手術', '糖尿病'],
};

// ---------------------------------------------------------------------------
// Default site readings at the start of demo
// ---------------------------------------------------------------------------
export const INITIAL_SITE_DATA: SiteData[] = [
  {
    site: 'occiput',
    label: 'Occiput',
    labelChinese: '後腦',
    pressure: 28,
    status: 'stable',
    durationMin: 12,
    trend: 'stable',
    peakPressure: 32,
    avgPressure: 27,
  },
  {
    site: 'left-scapula',
    label: 'Left Scapula',
    labelChinese: '左肩胛',
    pressure: 24,
    status: 'stable',
    durationMin: 8,
    trend: 'stable',
    peakPressure: 30,
    avgPressure: 25,
  },
  {
    site: 'right-scapula',
    label: 'Right Scapula',
    labelChinese: '右肩胛',
    pressure: 48,
    status: 'caution',
    durationMin: 22,
    trend: 'rising',
    peakPressure: 52,
    avgPressure: 38,
  },
  {
    site: 'sacrum',
    label: 'Sacrum',
    labelChinese: '薦骨',
    pressure: 82,
    status: 'high-risk',
    durationMin: 36,
    trend: 'rising',
    peakPressure: 91,
    avgPressure: 57,
  },
  {
    site: 'left-heel',
    label: 'Left Heel',
    labelChinese: '左足跟',
    pressure: 22,
    status: 'stable',
    durationMin: 5,
    trend: 'stable',
    peakPressure: 26,
    avgPressure: 21,
  },
  {
    site: 'right-heel',
    label: 'Right Heel',
    labelChinese: '右足跟',
    pressure: 46,
    status: 'caution',
    durationMin: 18,
    trend: 'stable',
    peakPressure: 50,
    avgPressure: 35,
  },
];

// ---------------------------------------------------------------------------
// Generate 60-min pressure history for Sacrum (demo scenario)
// ---------------------------------------------------------------------------
export function generateSacrumHistory(
  scenario: DemoScenario,
  baseData: SiteData[]
): PressureDataPoint[] {
  const sacrumCurrent =
    baseData.find((s) => s.site === 'sacrum')?.pressure ?? 82;
  const points: PressureDataPoint[] = [];
  const now = new Date();
  now.setHours(14, 32, 0, 0); // fix demo clock time

  for (let i = 60; i >= 0; i -= 2) {
    const t = new Date(now.getTime() - i * 60 * 1000);
    const hh = String(t.getHours()).padStart(2, '0');
    const mm = String(t.getMinutes()).padStart(2, '0');

    let pressure: number;
    const progress = (60 - i) / 60; // 0 → 1

    if (scenario === 'normal') {
      pressure = 28 + Math.sin(progress * Math.PI * 2) * 4 + Math.random() * 2;
    } else if (scenario === 'rising') {
      pressure = 28 + progress * 32 + Math.random() * 3;
    } else if (scenario === 'high-pressure') {
      if (progress < 0.5) {
        pressure = 28 + progress * 2 * 54 + Math.random() * 3;
      } else {
        pressure = 82 + Math.sin(progress * Math.PI * 4) * 4 + Math.random() * 2;
      }
    } else {
      // post-intervention: history up to ~82 then drop
      if (progress < 0.6) {
        pressure = 28 + progress * (1 / 0.6) * 54 + Math.random() * 3;
      } else {
        const dropProgress = (progress - 0.6) / 0.4;
        pressure = 82 - dropProgress * 39 + Math.random() * 2;
      }
    }

    points.push({
      time: `${hh}:${mm}`,
      pressure: Math.round(Math.max(10, Math.min(110, pressure))),
      minutesAgo: i,
    });
  }

  // Override last point with current reading for continuity
  if (points.length > 0) {
    points[points.length - 1].pressure = sacrumCurrent;
  }

  return points;
}

// ---------------------------------------------------------------------------
// Site data per scenario
// ---------------------------------------------------------------------------
export function getSiteDataForScenario(scenario: DemoScenario): SiteData[] {
  if (scenario === 'normal') {
    return INITIAL_SITE_DATA.map((s) =>
      s.site === 'sacrum'
        ? { ...s, pressure: 30, status: 'stable', durationMin: 0, trend: 'stable', peakPressure: 34, avgPressure: 28 }
        : s.site === 'right-scapula'
        ? { ...s, pressure: 32, status: 'stable', trend: 'stable' }
        : s.site === 'right-heel'
        ? { ...s, pressure: 30, status: 'stable', trend: 'stable' }
        : s
    );
  }
  if (scenario === 'rising') {
    return INITIAL_SITE_DATA.map((s) =>
      s.site === 'sacrum'
        ? { ...s, pressure: 58, status: 'caution', durationMin: 18, trend: 'rising', peakPressure: 62, avgPressure: 42 }
        : s
    );
  }
  if (scenario === 'high-pressure') {
    return INITIAL_SITE_DATA; // default high-risk state
  }
  // post-intervention
  return INITIAL_SITE_DATA.map((s) =>
    s.site === 'sacrum'
      ? { ...s, pressure: 43, status: 'stable', durationMin: 0, trend: 'falling', peakPressure: 91, avgPressure: 57 }
      : s
  );
}

// ---------------------------------------------------------------------------
// MockSensorDataProvider – implements SensorDataProvider interface
// Future: replace with BLEPressureSensorProvider
// ---------------------------------------------------------------------------
export class MockSensorDataProvider implements SensorDataProvider {
  private scenario: DemoScenario;
  private siteData: SiteData[];

  constructor(scenario: DemoScenario = 'high-pressure') {
    this.scenario = scenario;
    this.siteData = getSiteDataForScenario(scenario);
  }

  setScenario(scenario: DemoScenario) {
    this.scenario = scenario;
    this.siteData = getSiteDataForScenario(scenario);
  }

  getLatestSiteData(): SiteData[] {
    return this.siteData;
  }

  getPressureHistory(site: BodySite): PressureDataPoint[] {
    if (site === 'sacrum') {
      return generateSacrumHistory(this.scenario, this.siteData);
    }
    // Generic flat history for other sites
    const siteInfo = this.siteData.find((s) => s.site === site);
    const base = siteInfo?.avgPressure ?? 30;
    const points: PressureDataPoint[] = [];
    const now = new Date();
    now.setHours(14, 32, 0, 0);
    for (let i = 60; i >= 0; i -= 2) {
      const t = new Date(now.getTime() - i * 60 * 1000);
      const hh = String(t.getHours()).padStart(2, '0');
      const mm = String(t.getMinutes()).padStart(2, '0');
      points.push({
        time: `${hh}:${mm}`,
        pressure: Math.round(base + Math.sin(i * 0.2) * 5 + Math.random() * 3),
        minutesAgo: i,
      });
    }
    return points;
  }
}

// ---------------------------------------------------------------------------
// Historical surgical cases – mock CQI data (demo only)
// ---------------------------------------------------------------------------
export const MOCK_SURGICAL_CASES: SurgicalCase[] = [
  {
    id: 'OR-2026-001',
    date: '2026-09-05',
    surgeryType: '心臟手術',
    totalHours: '6h 12m',
    highestRiskSite: '薦骨',
    peakPressure: 91,
    highPressureDuration: 36,
    interventions: 1,
    pressureReduction: '47.6%',
    outcome: 'normal',
  },
  {
    id: 'OR-2026-002',
    date: '2026-09-03',
    surgeryType: '脊椎手術',
    totalHours: '4h 30m',
    highestRiskSite: '薦骨',
    peakPressure: 78,
    highPressureDuration: 28,
    interventions: 1,
    pressureReduction: '38.5%',
    outcome: 'normal',
  },
  {
    id: 'OR-2026-003',
    date: '2026-08-29',
    surgeryType: '腹腔鏡手術',
    totalHours: '3h 15m',
    highestRiskSite: '薦骨',
    peakPressure: 65,
    highPressureDuration: 15,
    interventions: 0,
    pressureReduction: '—',
    outcome: 'normal',
  },
  {
    id: 'OR-2026-004',
    date: '2026-08-25',
    surgeryType: '骨科手術',
    totalHours: '5h 45m',
    highestRiskSite: '足跟',
    peakPressure: 88,
    highPressureDuration: 42,
    interventions: 2,
    pressureReduction: '52.3%',
    outcome: 'redness',
  },
  {
    id: 'OR-2026-005',
    date: '2026-08-20',
    surgeryType: '心臟手術',
    totalHours: '7h 20m',
    highestRiskSite: '薦骨',
    peakPressure: 95,
    highPressureDuration: 55,
    interventions: 3,
    pressureReduction: '44.2%',
    outcome: 'redness',
  },
  {
    id: 'OR-2026-006',
    date: '2026-08-18',
    surgeryType: '泌尿外科',
    totalHours: '2h 50m',
    highestRiskSite: '薦骨',
    peakPressure: 58,
    highPressureDuration: 10,
    interventions: 0,
    pressureReduction: '—',
    outcome: 'normal',
  },
  {
    id: 'OR-2026-007',
    date: '2026-08-15',
    surgeryType: '胸腔手術',
    totalHours: '6h 05m',
    highestRiskSite: '肩胛骨',
    peakPressure: 82,
    highPressureDuration: 38,
    interventions: 2,
    pressureReduction: '40.8%',
    outcome: 'normal',
  },
  {
    id: 'OR-2026-008',
    date: '2026-08-10',
    surgeryType: '神經外科',
    totalHours: '8h 10m',
    highestRiskSite: '薦骨',
    peakPressure: 102,
    highPressureDuration: 68,
    interventions: 3,
    pressureReduction: '35.3%',
    outcome: 'suspected',
  },
];

// ---------------------------------------------------------------------------
// Demo monthly stats
// ---------------------------------------------------------------------------
export const MONTHLY_STATS = {
  totalCases: 28,
  highRiskEvents: 9,
  interventionsPerformed: 7,
  pressureReductionSuccess: 6,
};
