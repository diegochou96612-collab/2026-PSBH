// ============================================================
// ICUView – ICU nurse: continuous skin tracking
// Shows OR summary + PACU records + new skin record + timeline
// ============================================================

import React, { useState } from 'react';
import SkinRecordForm from '../SkinRecordForm';
import CareTimeline from '../CareTimeline';
import { usePostOp } from '../../context/PostOpContext';
import { SKIN_OBSERVATION_LABELS, SKIN_OBSERVATION_COLORS } from '../../types';

type IcuSubTab = 'tracking' | 'new-record' | 'timeline';

const ICUView: React.FC = () => {
  const { skinRecords } = usePostOp();
  const [subTab, setSubTab] = useState<IcuSubTab>('tracking');

  // PACU records
  const pacuRecords = skinRecords.filter((r) => r.careSetting === 'PACU');
  const icuRecords = skinRecords.filter((r) => r.careSetting === 'ICU');
  const latestRecord = [...pacuRecords, ...icuRecords].sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
      {/* Setting header */}
      <div className="flex items-center gap-3 bg-violet-700 text-white rounded-xl px-4 py-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
          ICU
        </div>
        <div>
          <div className="font-bold text-base">加護病房 Intensive Care Unit</div>
          <div className="text-violet-200 text-sm">持續皮膚追蹤 — 患者 OR-2026-001</div>
        </div>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* OR summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">術中高風險摘要</div>
          <div className="text-sm font-semibold text-slate-700 mb-1">薦骨 Sacrum</div>
          <div className="flex gap-1.5 flex-wrap">
            <Badge label="峰值 91 mmHg" color="red" />
            <Badge label="持續 36 min" color="amber" />
            <Badge label="介入後 -47.6%" color="green" />
          </div>
        </div>
        {/* PACU summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">PACU 評估結果</div>
          {pacuRecords.length > 0 ? (
            pacuRecords.slice(0, 1).map((r) => (
              <div key={r.id}>
                <div className="text-xs text-slate-500 mb-1">{r.timestamp}</div>
                <div className="flex gap-1 flex-wrap">
                  {r.observations.map((obs) => (
                    <span key={obs} className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${SKIN_OBSERVATION_COLORS[obs]}`}>
                      {SKIN_OBSERVATION_LABELS[obs]}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{r.nursingNote}</p>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400">尚無 PACU 紀錄</div>
          )}
        </div>
        {/* Latest status */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">最新皮膚狀態</div>
          {latestRecord ? (
            <div>
              <div className="text-xs text-slate-500 mb-1">
                {latestRecord.careSetting} · {latestRecord.timestamp}
              </div>
              <div className="flex gap-1 flex-wrap">
                {latestRecord.observations.map((obs) => (
                  <span key={obs} className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${SKIN_OBSERVATION_COLORS[obs]}`}>
                    {SKIN_OBSERVATION_LABELS[obs]}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400">尚無紀錄</div>
          )}
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex gap-0 border-b border-slate-200 bg-white rounded-t-xl px-4">
        {([
          ['tracking', '追蹤紀錄'],
          ['new-record', '新增評估'],
          ['timeline', '照護時間軸'],
        ] as [IcuSubTab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${subTab === id ? 'tab-active' : 'tab-inactive'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {subTab === 'tracking' && (
        <div className="bg-white rounded-b-xl border border-slate-200 border-t-0 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">歷次皮膚評估紀錄</h3>
          {[...pacuRecords, ...icuRecords].length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">尚無紀錄</p>
          ) : (
            <div className="space-y-3">
              {[...pacuRecords, ...icuRecords]
                .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
                .map((r) => (
                  <RecordCard key={r.id} record={r} />
                ))}
            </div>
          )}
        </div>
      )}

      {subTab === 'new-record' && (
        <div className="bg-white rounded-b-xl border border-slate-200 border-t-0 shadow-sm p-4">
          <SkinRecordForm
            defaultSite="sacrum"
            careSetting="ICU"
            onComplete={() => setSubTab('tracking')}
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

const Badge: React.FC<{ label: string; color: 'red' | 'amber' | 'green' | 'blue' }> = ({ label, color }) => {
  const cls = {
    red: 'bg-red-100 text-red-700',
    amber: 'bg-amber-100 text-amber-700',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
  }[color];
  return <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${cls}`}>{label}</span>;
};

const RecordCard: React.FC<{ record: import('../../types').SkinRecord }> = ({ record }) => (
  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
          record.careSetting === 'PACU' ? 'bg-teal-600' : 'bg-violet-600'
        }`}>
          {record.careSetting}
        </span>
        <span className="text-xs font-medium text-slate-700">{record.site}</span>
      </div>
      <span className="text-[11px] text-slate-400 font-mono">{record.timestamp}</span>
    </div>
    <div className="flex gap-1 flex-wrap mb-1.5">
      {record.observations.map((obs) => (
        <span key={obs} className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${SKIN_OBSERVATION_COLORS[obs]}`}>
          {SKIN_OBSERVATION_LABELS[obs]}
        </span>
      ))}
    </div>
    {record.nursingNote && (
      <p className="text-xs text-slate-600">{record.nursingNote}</p>
    )}
    {record.photoPreviewUrl && (
      <img src={record.photoPreviewUrl} alt="皮膚照片" className="mt-2 w-16 h-16 object-cover rounded-lg border border-slate-200" />
    )}
    {record.photoFileName && !record.photoPreviewUrl && (
      <div className="mt-1 text-[10px] text-slate-400 italic">📷 {record.photoFileName} (Demo)</div>
    )}
  </div>
);

export default ICUView;
