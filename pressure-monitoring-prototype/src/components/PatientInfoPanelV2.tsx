// ============================================================
// PatientInfoPanelV2 – reads from PatientContext (multi-patient)
// ============================================================

import React from 'react';
import { usePatient } from '../context/PatientContext';
import { OVERALL_RISK_CONFIG, POSITION_LABELS } from '../types';

function formatElapsed(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h} hr ${m} min`;
}

const PatientInfoPanelV2: React.FC = () => {
  const { currentPatient, elapsedSeconds } = usePatient();
  const riskCfg = OVERALL_RISK_CONFIG[currentPatient.overallRisk];
  const posLabel = POSITION_LABELS[currentPatient.position];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          患者 / 手術資訊
        </h2>
        <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
          Simulation
        </span>
      </div>

      {/* Patient ID */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-3">
        <div className="text-xs text-blue-500 font-medium">患者編號</div>
        <div className="text-lg font-bold text-blue-800 font-mono">{currentPatient.patientId}</div>
        <div className="text-xs text-blue-600">
          {currentPatient.age}歲 · {currentPatient.sex === 'Male' ? '男 Male' : '女 Female'} · ASA {currentPatient.asa}
        </div>
      </div>

      {/* Grid info */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
        <InfoRow label="BMI" value={String(currentPatient.bmi)} />
        <InfoRow label="ASA 分級" value={`ASA ${currentPatient.asa}`} />
        <InfoRow
          label="手術體位"
          value={posLabel.zh}
          sub={posLabel.en}
        />
        <InfoRow label="預估時間" value={`${currentPatient.estimatedHours} hr`} />
      </div>

      {/* Surgery info */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-3">
        <div className="text-[10px] text-slate-400 mb-0.5">手術 Surgery</div>
        <div className="text-sm font-bold text-slate-800 leading-tight">{currentPatient.surgeryNameZh}</div>
        <div className="text-xs text-slate-500 mt-0.5">{currentPatient.surgeryNameEn}</div>
        <div className="mt-1.5 grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-slate-400">已進行</div>
            <div className="font-semibold text-slate-700">{formatElapsed(elapsedSeconds)}</div>
          </div>
          <div>
            <div className="text-slate-400">預估總時間</div>
            <div className="font-semibold text-slate-700">{currentPatient.estimatedHours} hr</div>
          </div>
        </div>
      </div>

      {/* Overall risk */}
      <div className={`rounded-lg px-3 py-2 mb-3 border ${riskCfg.bg} ${riskCfg.border}`}>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${riskCfg.dot}`} />
          <span className={`text-xs font-bold ${riskCfg.text}`}>
            術前風險評估：{riskCfg.labelChinese}
          </span>
        </div>
      </div>

      {/* Risk factors */}
      <div className="mb-3 flex-1">
        <div className="text-xs text-slate-500 mb-1.5">風險因子</div>
        <div className="flex flex-wrap gap-1.5">
          {currentPatient.riskFactors.map((f) => (
            <span
              key={f}
              className="bg-orange-100 text-orange-700 border border-orange-200 text-xs px-2 py-0.5 rounded-full"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* AI Future Module */}
      <div className="border border-dashed border-slate-300 rounded-lg px-3 py-2 bg-slate-50">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-xs font-semibold text-slate-500">AI 個人化風險分析</span>
          <span className="text-[9px] bg-slate-200 text-slate-500 px-1 py-0.5 rounded">Future Module</span>
        </div>
        <p className="text-[10px] text-slate-400 italic">Research Prototype — Not Clinically Validated</p>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string; sub?: string }> = ({ label, value, sub }) => (
  <div>
    <div className="text-[11px] text-slate-400">{label}</div>
    <div className="text-sm font-medium text-slate-700">{value}</div>
    {sub && <div className="text-[10px] text-slate-400">{sub}</div>}
  </div>
);

export default PatientInfoPanelV2;
