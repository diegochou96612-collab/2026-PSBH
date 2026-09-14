// ============================================================
// PatientInfoPanel – patient & surgery metadata
// ============================================================

import React from 'react';
import { MOCK_PATIENT } from '../data/mockSensorData';

const PatientInfoPanel: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-full">
      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          患者 / 手術資訊
        </h2>
        <span className="text-xs text-slate-400">Demo Data</span>
      </div>

      {/* Patient ID badge */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-3">
        <div className="text-xs text-blue-500 font-medium">患者編號</div>
        <div className="text-lg font-bold text-blue-800 font-mono">{MOCK_PATIENT.id}</div>
      </div>

      {/* Grid info */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
        <InfoRow label="年齡" value={`${MOCK_PATIENT.age} 歲`} />
        <InfoRow label="BMI" value={String(MOCK_PATIENT.bmi)} />
        <InfoRow label="手術體位" value={MOCK_PATIENT.position} />
        <InfoRow label="手術類型" value={MOCK_PATIENT.surgeryType} />
        <InfoRow label="預估手術時間" value={`${MOCK_PATIENT.estimatedHours} hr`} />
        <InfoRow label="目前手術時間" value="3 hr 42 min" />
      </div>

      {/* Risk assessment */}
      <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-xs font-semibold text-red-700">術前風險評估：高風險</span>
        </div>
        <div className="text-xs text-red-600">Pre-operative Risk Assessment</div>
      </div>

      {/* Risk factor tags */}
      <div className="mb-2">
        <div className="text-xs text-slate-500 mb-1.5">風險因子</div>
        <div className="flex flex-wrap gap-1.5">
          {MOCK_PATIENT.riskFactors.map((factor) => (
            <span
              key={factor}
              className="bg-orange-100 text-orange-700 border border-orange-200 text-xs px-2 py-0.5 rounded-full"
            >
              {factor}
            </span>
          ))}
        </div>
      </div>

      {/* AI future module note */}
      <div className="mt-3 border border-dashed border-slate-300 rounded-lg px-3 py-2 bg-slate-50">
        <div className="flex items-center gap-1.5 mb-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="5" stroke="#64748b" strokeWidth="1.2" />
            <path d="M4.5 4.5C4.5 3.7 5.1 3 6 3s1.5.7 1.5 1.5c0 1-1.5 1.5-1.5 2.5" stroke="#64748b" strokeWidth="1.1" strokeLinecap="round" />
            <circle cx="6" cy="9" r="0.6" fill="#64748b" />
          </svg>
          <span className="text-xs font-semibold text-slate-500">
            AI 個人化風險分析
          </span>
          <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-medium">
            Future Module
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          未來預計整合年齡、BMI、病史、手術類型及歷史壓力資料，
          輸出個人化高風險部位預測。
        </p>
        <p className="text-[10px] text-slate-400 mt-1 italic">
          Research Prototype — not clinically validated
        </p>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-[11px] text-slate-400">{label}</div>
    <div className="text-sm font-medium text-slate-700">{value}</div>
  </div>
);

export default PatientInfoPanel;
