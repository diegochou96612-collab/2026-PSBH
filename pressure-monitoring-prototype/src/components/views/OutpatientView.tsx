// ============================================================
// OutpatientView – outpatient nurse: post-op follow-up summary
// Focus on summary timeline, photo history, latest status.
// No live monitoring or complex OR data.
// ============================================================

import React, { useState } from 'react';
import CareTimeline from '../CareTimeline';
import SkinRecordForm from '../SkinRecordForm';
import { usePostOp } from '../../context/PostOpContext';
import { SKIN_OBSERVATION_LABELS, SKIN_OBSERVATION_COLORS } from '../../types';

type OpSubTab = 'summary' | 'new-record' | 'timeline';

const OutpatientView: React.FC = () => {
  const { skinRecords } = usePostOp();
  const [subTab, setSubTab] = useState<OpSubTab>('summary');

  const allRecords = skinRecords.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const latestRecord = allRecords[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
      {/* Setting header */}
      <div className="flex items-center gap-3 bg-orange-600 text-white rounded-xl px-4 py-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
          OP
        </div>
        <div>
          <div className="font-bold text-base">門診 Outpatient</div>
          <div className="text-orange-200 text-sm">術後追蹤摘要 — 患者 OR-2026-001</div>
        </div>
      </div>

      {/* Surgery summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="font-semibold text-slate-700 text-sm mb-3">手術摘要</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <SummaryItem label="手術日期" value="2026/09/05" />
          <SummaryItem label="手術時間" value="6 hr 12 min" />
          <SummaryItem label="主要受壓部位" value="薦骨 Sacrum" />
          <SummaryItem label="最新追蹤狀態" value={latestRecord ? latestRecord.careSetting : '—'} />
        </div>
        {/* Photo records overview */}
        {allRecords.some((r) => r.photoPreviewUrl || r.photoFileName) && (
          <div>
            <div className="text-xs font-medium text-slate-500 mb-2">歷次照片記錄</div>
            <div className="flex gap-2 flex-wrap">
              {allRecords
                .filter((r) => r.photoPreviewUrl || r.photoFileName)
                .map((r) => (
                  <div key={r.id} className="flex flex-col items-center gap-1">
                    {r.photoPreviewUrl ? (
                      <img src={r.photoPreviewUrl} alt="皮膚照片" className="w-14 h-14 object-cover rounded-lg border border-slate-200" />
                    ) : (
                      <div className="w-14 h-14 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                        <span className="text-xl">📷</span>
                      </div>
                    )}
                    <span className="text-[9px] text-slate-400">{r.careSetting}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Sub tabs */}
      <div className="flex gap-0 border-b border-slate-200 bg-white rounded-t-xl px-4">
        {([
          ['summary', '追蹤摘要'],
          ['new-record', '門診評估'],
          ['timeline', '完整時間軸'],
        ] as [OpSubTab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${subTab === id ? 'tab-active' : 'tab-inactive'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {subTab === 'summary' && (
        <div className="bg-white rounded-b-xl border border-slate-200 border-t-0 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">術後追蹤記錄</h3>
          </div>
          {allRecords.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">尚無術後紀錄</p>
          ) : (
            <div className="space-y-3">
              {allRecords.map((r) => (
                <div key={r.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
                      r.careSetting === 'OR' ? 'bg-blue-700' :
                      r.careSetting === 'PACU' ? 'bg-teal-600' :
                      r.careSetting === 'ICU' ? 'bg-violet-700' :
                      r.careSetting === 'Ward' ? 'bg-emerald-600' : 'bg-orange-500'
                    }`}>
                      {r.careSetting}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">{r.site}</span>
                    <span className="text-[10px] text-slate-400 ml-auto font-mono">{r.timestamp}</span>
                  </div>
                  <div className="flex gap-1 flex-wrap mb-1">
                    {r.observations.map((obs) => (
                      <span key={obs} className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${SKIN_OBSERVATION_COLORS[obs]}`}>
                        {SKIN_OBSERVATION_LABELS[obs]}
                      </span>
                    ))}
                  </div>
                  {r.nursingNote && <p className="text-xs text-slate-500">{r.nursingNote}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {subTab === 'new-record' && (
        <div className="bg-white rounded-b-xl border border-slate-200 border-t-0 shadow-sm p-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 mb-4">
            <p className="text-xs text-orange-700">
              門診皮膚評估記錄將加入病人照護時間軸，供跨科別查閱參考。
            </p>
          </div>
          <SkinRecordForm
            defaultSite="sacrum"
            careSetting="Outpatient"
            onComplete={() => setSubTab('summary')}
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

const SummaryItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
    <div className="text-[10px] text-slate-400 mb-0.5">{label}</div>
    <div className="text-sm font-semibold text-slate-700">{value}</div>
  </div>
);

export default OutpatientView;
