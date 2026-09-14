// ============================================================
// WardView – Ward nurse: ongoing skin care tracking
// No live pressure monitoring. Focus on follow-up skin records.
// ============================================================

import React, { useState } from 'react';
import SkinRecordForm from '../SkinRecordForm';
import CareTimeline from '../CareTimeline';
import { usePostOp } from '../../context/PostOpContext';
import { SKIN_OBSERVATION_LABELS, SKIN_OBSERVATION_COLORS } from '../../types';

type WardSubTab = 'records' | 'new-record' | 'timeline';

const WardView: React.FC = () => {
  const { skinRecords } = usePostOp();
  const [subTab, setSubTab] = useState<WardSubTab>('records');

  const allRecords = skinRecords.slice().sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
      {/* Setting header */}
      <div className="flex items-center gap-3 bg-emerald-700 text-white rounded-xl px-4 py-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
          Ward
        </div>
        <div>
          <div className="font-bold text-base">一般病房 General Ward</div>
          <div className="text-emerald-200 text-sm">後續皮膚照護追蹤 — 患者 OR-2026-001</div>
        </div>
      </div>

      {/* High risk history banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <div className="text-sm font-semibold text-blue-700 mb-1">歷史高風險部位提醒</div>
        <div className="flex items-center gap-3 flex-wrap text-xs text-blue-600">
          <span className="bg-red-100 text-red-700 border border-red-300 px-2 py-0.5 rounded font-semibold">
            薦骨 Sacrum
          </span>
          <span>術中最高壓力 91 mmHg · 持續 36 min</span>
          <span className="text-blue-400">|</span>
          <span>PACU 評估：輕微發紅 · ICU 評估：持續性紅斑</span>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex gap-0 border-b border-slate-200 bg-white rounded-t-xl px-4">
        {([
          ['records', '皮膚紀錄'],
          ['new-record', '新增追蹤'],
          ['timeline', '照護時間軸'],
        ] as [WardSubTab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${subTab === id ? 'tab-active' : 'tab-inactive'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {subTab === 'records' && (
        <div className="bg-white rounded-b-xl border border-slate-200 border-t-0 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">皮膚評估紀錄</h3>
            <button
              onClick={() => setSubTab('new-record')}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              ＋ 新增紀錄
            </button>
          </div>
          {allRecords.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">尚無紀錄</p>
          ) : (
            <div className="space-y-3">
              {allRecords.map((r) => (
                <div key={r.id} className="border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
                        r.careSetting === 'OR' ? 'bg-blue-700' :
                        r.careSetting === 'PACU' ? 'bg-teal-600' :
                        r.careSetting === 'ICU' ? 'bg-violet-700' :
                        r.careSetting === 'Ward' ? 'bg-emerald-600' : 'bg-orange-500'
                      }`}>
                        {r.careSetting}
                      </span>
                      <span className="text-xs font-medium text-slate-700">{r.site}</span>
                      <span className="text-[10px] text-slate-400">{r.recordedBy}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{r.timestamp}</span>
                  </div>
                  <div className="flex gap-1 flex-wrap mb-1">
                    {r.observations.map((obs) => (
                      <span key={obs} className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${SKIN_OBSERVATION_COLORS[obs]}`}>
                        {SKIN_OBSERVATION_LABELS[obs]}
                      </span>
                    ))}
                  </div>
                  {r.nursingNote && <p className="text-xs text-slate-500">{r.nursingNote}</p>}
                  {r.photoPreviewUrl && (
                    <img src={r.photoPreviewUrl} alt="皮膚照片" className="mt-2 w-14 h-14 object-cover rounded-lg" />
                  )}
                  {r.photoFileName && !r.photoPreviewUrl && (
                    <div className="mt-1 text-[10px] text-slate-400 italic">📷 {r.photoFileName} (Demo)</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {subTab === 'new-record' && (
        <div className="bg-white rounded-b-xl border border-slate-200 border-t-0 shadow-sm p-4">
          <SkinRecordForm
            defaultSite="sacrum"
            careSetting="Ward"
            onComplete={() => setSubTab('records')}
          />
        </div>
      )}

      {subTab === 'timeline' && (
        <div className="bg-white rounded-b-xl border border-slate-200 border-t-0 shadow-sm p-4">
          <CareTimeline />
        </div>
      )}
    </div>
  );
};

export default WardView;
