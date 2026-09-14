// ============================================================
// InterventionModal – record protective intervention
// ============================================================

import React, { useState } from 'react';
import { useSensor } from '../context/SensorContext';
import type { InterventionType } from '../types';

const INTERVENTION_OPTIONS: { id: InterventionType; label: string; desc: string }[] = [
  { id: 'adjust-pad',       label: '調整減壓墊',    desc: '重新定位或調整現有減壓墊' },
  { id: 'add-protection',   label: '增加局部防護',  desc: '在高壓部位增加防護材料' },
  { id: 'micro-reposition', label: '微調體位',      desc: '在手術安全允許範圍內微調' },
  { id: 'other',            label: '其他',          desc: '依醫療團隊判斷' },
];

const InterventionModal: React.FC = () => {
  const { isInterventionModalOpen, closeInterventionModal, confirmIntervention, siteData } = useSensor();
  const [selected, setSelected] = useState<InterventionType>('adjust-pad');

  const sacrumPressure = siteData.find((s) => s.site === 'sacrum')?.pressure ?? 82;

  if (!isInterventionModalOpen) return null;

  const handleConfirm = () => {
    confirmIntervention(selected);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 id="modal-title" className="text-white font-bold text-lg">
              紀錄防護介入
            </h2>
            <button
              onClick={closeInterventionModal}
              className="text-blue-200 hover:text-white transition-colors"
              aria-label="關閉"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-0.5">
            薦骨 (Sacrum) · 目前壓力：
            <span className="font-bold text-white">{sacrumPressure} mmHg</span>
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Info row */}
          <div className="bg-slate-50 rounded-lg px-3 py-2 mb-4 grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-400">介入時間</div>
              <div className="font-semibold text-slate-700">14:32</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">介入前壓力</div>
              <div className="font-semibold text-red-600">{sacrumPressure} mmHg</div>
            </div>
          </div>

          {/* Intervention type */}
          <div className="mb-4">
            <div className="text-sm font-semibold text-slate-700 mb-2">介入方式</div>
            <div className="space-y-2">
              {INTERVENTION_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    selected === opt.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="intervention"
                    value={opt.id}
                    checked={selected === opt.id}
                    onChange={() => setSelected(opt.id)}
                    className="mt-0.5 accent-blue-600"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-700">{opt.label}</div>
                    <div className="text-xs text-slate-500">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Safety notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
            <p className="text-xs text-amber-700">
              ⚠ 是否介入仍由醫療團隊依手術安全性判斷。本系統僅提供資料記錄支持。
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={closeInterventionModal}
              className="flex-1 border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium text-sm py-2.5 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
            >
              確認介入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterventionModal;
