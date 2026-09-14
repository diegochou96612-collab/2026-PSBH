// ============================================================
// CurrentPatientBanner – prominent patient status bar
// Always visible at top of main content area
// ============================================================

import React, { useState } from 'react';
import { usePatient } from '../context/PatientContext';
import { OVERALL_RISK_CONFIG, POSITION_LABELS, CARE_SETTINGS } from '../types';
import PatientSwitcher from './PatientSwitcher';
import PatientListDrawer from './PatientListDrawer';

function formatElapsed(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h} hr ${m} min` : `${m} min`;
}

const CurrentPatientBanner: React.FC = () => {
  const { currentPatient, elapsedSeconds } = usePatient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const riskCfg = OVERALL_RISK_CONFIG[currentPatient.overallRisk];
  const settingCfg = CARE_SETTINGS[currentPatient.careSetting];

  return (
    <>
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap">
          {/* Patient switcher */}
          <PatientSwitcher />

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          {/* Current patient detail */}
          <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-800 text-sm">{currentPatient.surgeryNameZh}</span>
                <span className="text-slate-400 text-xs">{currentPatient.surgeryNameEn}</span>
              </div>
              <div className="text-xs text-slate-500">
                {currentPatient.age}歲 · {currentPatient.sex === 'Male' ? '男' : '女'} ·
                {' '}BMI {currentPatient.bmi} · ASA {currentPatient.asa} ·
                {' '}體位：{POSITION_LABELS[currentPatient.position].zh} ·
                {' '}已進行 {formatElapsed(elapsedSeconds)} / {currentPatient.estimatedHours} hr
              </div>
            </div>

            {/* Risk */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border font-bold text-sm ${riskCfg.bg} ${riskCfg.text} ${riskCfg.border} flex-shrink-0`}>
              <span className={`w-2 h-2 rounded-full ${riskCfg.dot}`} />
              {riskCfg.labelChinese}
            </div>

            {/* Setting */}
            <span className={`text-xs font-bold px-2 py-1 rounded text-white ${settingCfg.color} flex-shrink-0`}>
              {settingCfg.labelChinese}
            </span>
          </div>

          {/* Patient list button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="1" y="2" width="12" height="2" rx="1" fill="currentColor" />
              <rect x="1" y="6" width="12" height="2" rx="1" fill="currentColor" />
              <rect x="1" y="10" width="12" height="2" rx="1" fill="currentColor" />
            </svg>
            病人清單
          </button>

          {/* Demo data notice */}
          <div className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded font-medium flex-shrink-0">
            SIMULATION DATA
          </div>
        </div>
      </div>

      <PatientListDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default CurrentPatientBanner;
