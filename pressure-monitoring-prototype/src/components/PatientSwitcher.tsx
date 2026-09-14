// ============================================================
// PatientSwitcher – inline dropdown for fast patient switch
// ============================================================

import React from 'react';
import { usePatient } from '../context/PatientContext';
import { OVERALL_RISK_CONFIG, CARE_SETTINGS } from '../types';

const PatientSwitcher: React.FC = () => {
  const { patients, currentPatient, setCurrentPatientId } = usePatient();
  const riskCfg = OVERALL_RISK_CONFIG[currentPatient.overallRisk];

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="patient-select" className="text-xs text-slate-400 whitespace-nowrap font-medium">
        目前病人
      </label>
      <div className="relative">
        <select
          id="patient-select"
          value={currentPatient.patientId}
          onChange={(e) => setCurrentPatientId(e.target.value)}
          className="appearance-none bg-white border-2 border-blue-200 text-blue-800 text-sm font-bold pl-3 pr-8 py-1.5 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono"
        >
          {patients.map((p) => (
            <option key={p.patientId} value={p.patientId}>
              {p.patientId} · {p.age}歲 · {p.surgeryNameZh}
            </option>
          ))}
        </select>
        {/* Chevron */}
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5l3 3 3-3" stroke="#1e40af" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {/* Risk badge */}
      <span className={`text-xs font-bold px-2 py-1 rounded-full border ${riskCfg.bg} ${riskCfg.text} ${riskCfg.border}`}>
        {riskCfg.labelChinese}
      </span>
      {/* Care setting badge */}
      <span className={`text-xs font-bold px-2 py-1 rounded text-white ${CARE_SETTINGS[currentPatient.careSetting].color}`}>
        {currentPatient.careSetting}
      </span>
    </div>
  );
};

export default PatientSwitcher;
