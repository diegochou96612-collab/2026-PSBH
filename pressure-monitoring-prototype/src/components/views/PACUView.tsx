// ============================================================
// PACUView – PACU nurse: first post-op skin assessment
// Shows OR summary + priority assessment guide + skin record form
// ============================================================

import React, { useState } from 'react';
import SkinRecordForm from '../SkinRecordForm';
import CareTimeline from '../CareTimeline';

const OR_SUMMARY = {
  surgeryType: '心臟手術',
  position: '仰臥位',
  totalTime: '6 hr 12 min',
  highRiskSites: ['薦骨 Sacrum'],
  peakPressure: 91,
  highPressureDuration: 36,
  interventions: 1,
  pressureReduction: '47.6%',
};

type PacuSubTab = 'assessment' | 'timeline';

const PACUView: React.FC = () => {
  const [subTab, setSubTab] = useState<PacuSubTab>('assessment');
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
      {/* Setting header */}
      <div className="flex items-center gap-3 bg-teal-700 text-white rounded-xl px-4 py-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
          PACU
        </div>
        <div>
          <div className="font-bold text-base">恢復室 Post-Anesthesia Care Unit</div>
          <div className="text-teal-200 text-sm">術後首次皮膚評估 — 患者 OR-2026-001</div>
        </div>
      </div>

      {/* OR handoff summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-700 text-sm">術中摘要 Intraoperative Summary</h3>
          <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-medium">OR 交班資訊</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <InfoCard label="手術類型" value={OR_SUMMARY.surgeryType} />
          <InfoCard label="手術體位" value={OR_SUMMARY.position} />
          <InfoCard label="總手術時間" value={OR_SUMMARY.totalTime} />
          <InfoCard label="術中介入" value={`${OR_SUMMARY.interventions} 次`} />
        </div>
        {/* High risk alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
          <div className="flex items-start gap-2">
            <span className="text-amber-600 text-sm mt-0.5 flex-shrink-0">⚠</span>
            <div>
              <div className="font-semibold text-amber-700 text-sm mb-1">請優先評估以下部位：</div>
              <div className="flex gap-2 flex-wrap">
                {OR_SUMMARY.highRiskSites.map((site) => (
                  <span key={site} className="bg-red-100 text-red-700 border border-red-300 text-xs font-bold px-3 py-1 rounded-full">
                    {site}
                  </span>
                ))}
              </div>
              <div className="text-xs text-amber-600 mt-1.5">
                術中最高壓力 {OR_SUMMARY.peakPressure} mmHg · 持續高壓 {OR_SUMMARY.highPressureDuration} min
                · 已介入後下降 {OR_SUMMARY.pressureReduction}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex gap-0 border-b border-slate-200 bg-white rounded-t-xl px-4">
        {([['assessment', '皮膚評估'], ['timeline', '照護時間軸']] as [PacuSubTab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${subTab === id ? 'tab-active' : 'tab-inactive'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {subTab === 'assessment' && (
        <div className="bg-white rounded-b-xl border border-slate-200 border-t-0 shadow-sm p-4">
          {!showForm ? (
            <div className="flex flex-col items-center py-6 gap-4">
              <div className="text-slate-500 text-sm text-center">
                <div className="text-2xl mb-2">👁</div>
                <div className="font-semibold text-slate-700 mb-1">開始術後皮膚評估</div>
                <div className="text-slate-400">請評估薦骨及其他高風險部位的皮膚狀態</div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>進行術後皮膚評估</span>
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <rect x="1" y="2" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
                    <circle cx="5" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M2 11l2.5-2.5 1.5 1.5 2.5-3 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  拍照 / 上傳照片
                </button>
              </div>
            </div>
          ) : (
            <SkinRecordForm
              defaultSite="sacrum"
              careSetting="PACU"
              onComplete={() => setSubTab('timeline')}
            />
          )}
        </div>
      )}

      {subTab === 'timeline' && (
        <div className="bg-white rounded-b-xl border border-slate-200 border-t-0 shadow-sm p-4">
          <p className="text-xs text-slate-400 mb-4">
            顯示病人 OR-2026-001 的完整照護事件時間軸（含術中與術後）
          </p>
          <CareTimeline />
        </div>
      )}
    </div>
  );
};

const InfoCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-slate-50 rounded-lg p-2.5">
    <div className="text-[10px] text-slate-400 mb-0.5">{label}</div>
    <div className="text-sm font-semibold text-slate-700">{value}</div>
  </div>
);

export default PACUView;
