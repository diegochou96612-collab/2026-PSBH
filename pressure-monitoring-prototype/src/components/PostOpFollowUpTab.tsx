// ============================================================
// PostOpFollowUpTab – cross-setting post-op follow-up
// Main tab for "術後追蹤 Post-op Follow-up"
// Shows: add skin record, skin records list, event timeline
// ============================================================

import React, { useState } from 'react';
import SkinRecordForm from './SkinRecordForm';
import CareTimeline from './CareTimeline';
import { usePostOp } from '../context/PostOpContext';
import { useRole } from '../context/RoleContext';
import type { CareSetting } from '../types';
import { CARE_SETTINGS, SKIN_OBSERVATION_LABELS, SKIN_OBSERVATION_COLORS } from '../types';

type FollowUpSubTab = 'add-record' | 'records' | 'timeline';

const PostOpFollowUpTab: React.FC = () => {
  const { currentSetting } = useRole();
  const { skinRecords } = usePostOp();
  const [subTab, setSubTab] = useState<FollowUpSubTab>('add-record');

  const cfg = CARE_SETTINGS[currentSetting];
  const allRecords = skinRecords.slice().sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">術後追蹤 Post-op Follow-up</h2>
          <p className="text-sm text-slate-500">患者 OR-2026-001 · 跨場域連續照護紀錄</p>
        </div>
        {/* Current setting badge */}
        <div className={`flex items-center gap-2 ${cfg.color} text-white rounded-lg px-3 py-1.5 text-sm font-semibold`}>
          <span>{currentSetting}</span>
          <span>{cfg.labelChinese}</span>
        </div>
      </div>

      {/* Patient care context */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <div className="flex items-start gap-2">
          <span className="text-blue-500 text-base mt-0.5 flex-shrink-0">ℹ</span>
          <div>
            <p className="text-sm text-blue-700 font-semibold mb-0.5">跨照護場域連續追蹤</p>
            <p className="text-xs text-blue-600">
              術中壓力事件已記錄：薦骨最高 91 mmHg，持續 36 min，介入後降至 43 mmHg。
              以下紀錄將與術中資料串聯，形成完整照護時間軸。
            </p>
          </div>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex gap-0 border-b border-slate-200 bg-white rounded-t-xl px-4">
        <button
          onClick={() => setSubTab('add-record')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${subTab === 'add-record' ? 'tab-active' : 'tab-inactive'}`}
        >
          新增皮膚紀錄
        </button>
        <button
          onClick={() => setSubTab('records')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${subTab === 'records' ? 'tab-active' : 'tab-inactive'}`}
        >
          全部紀錄
          {allRecords.length > 0 && (
            <span className="ml-1.5 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {allRecords.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setSubTab('timeline')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${subTab === 'timeline' ? 'tab-active' : 'tab-inactive'}`}
        >
          照護時間軸
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-b-xl border border-slate-200 border-t-0 shadow-sm p-4">
        {subTab === 'add-record' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">新增術後皮膚紀錄</h3>
              <span className="text-xs text-slate-400">
                目前場域：{cfg.labelChinese} ({currentSetting})
              </span>
            </div>
            <SkinRecordForm
              defaultSite="sacrum"
              careSetting={currentSetting}
              onComplete={() => setSubTab('records')}
            />
          </div>
        )}

        {subTab === 'records' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">所有術後皮膚評估紀錄</h3>
              <button
                onClick={() => setSubTab('add-record')}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium"
              >
                ＋ 新增紀錄
              </button>
            </div>
            {allRecords.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <div className="text-3xl mb-2">📋</div>
                <div>尚無術後紀錄</div>
                <button
                  onClick={() => setSubTab('add-record')}
                  className="mt-3 text-blue-600 text-sm hover:underline"
                >
                  立即新增第一筆紀錄
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {allRecords.map((r) => (
                  <div key={r.id} className="border border-slate-200 rounded-xl p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${SETTING_COLOR[r.careSetting]}`}>
                          {r.careSetting}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">{r.site}</span>
                        <span className="text-[10px] text-slate-400">{r.recordedBy}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono flex-shrink-0">{r.timestamp}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap mb-1.5">
                      {r.observations.map((obs) => (
                        <span key={obs} className={`text-[10px] px-2 py-0.5 rounded border font-medium ${SKIN_OBSERVATION_COLORS[obs]}`}>
                          {SKIN_OBSERVATION_LABELS[obs]}
                        </span>
                      ))}
                    </div>
                    {r.nursingNote && (
                      <p className="text-xs text-slate-600 bg-slate-50 rounded px-2 py-1 border border-slate-100">
                        {r.nursingNote}
                      </p>
                    )}
                    {r.photoPreviewUrl && (
                      <img src={r.photoPreviewUrl} alt="皮膚照片" className="mt-2 w-16 h-16 object-cover rounded-lg border border-slate-200" />
                    )}
                    {r.photoFileName && !r.photoPreviewUrl && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400 italic">
                        <span>📷 {r.photoFileName}</span>
                        <span className="bg-slate-100 px-1 rounded">Demo Photo</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {subTab === 'timeline' && (
          <div>
            <p className="text-xs text-slate-400 mb-4">
              完整照護時間軸 — 從術中壓力事件到跨場域術後追蹤紀錄
            </p>
            <CareTimeline />
          </div>
        )}
      </div>

      {/* Data notice */}
      <div className="text-xs text-slate-400 text-center">
        * 所有紀錄為 Prototype Demo Data。照片僅本機預覽，不上傳至伺服器。
        Future HIS / EMR Integration 待開發。
      </div>
    </div>
  );
};

const SETTING_COLOR: Record<CareSetting, string> = {
  OR: 'bg-blue-700',
  PACU: 'bg-teal-600',
  ICU: 'bg-violet-700',
  Ward: 'bg-emerald-600',
  Outpatient: 'bg-orange-500',
};

export default PostOpFollowUpTab;
