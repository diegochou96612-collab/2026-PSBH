// ============================================================
// HistoryTab – surgical history & CQI dashboard
// ============================================================

import React from 'react';
import { MOCK_SURGICAL_CASES, MONTHLY_STATS } from '../data/mockSensorData';
import type { PostOpSkinStatus } from '../types';
import { SKIN_STATUS_LABELS } from '../types';

const OUTCOME_STYLE: Record<PostOpSkinStatus, string> = {
  normal:    'bg-green-100 text-green-700',
  redness:   'bg-amber-100 text-amber-700',
  suspected: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-red-100 text-red-700',
};

const HistoryTab: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Monthly stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="本月監測病例"
          value={String(MONTHLY_STATS.totalCases)}
          unit="件"
          color="bg-blue-50 border-blue-200 text-blue-800"
        />
        <StatCard
          label="高風險事件"
          value={String(MONTHLY_STATS.highRiskEvents)}
          unit="件"
          color="bg-red-50 border-red-200 text-red-800"
        />
        <StatCard
          label="執行防護介入"
          value={String(MONTHLY_STATS.interventionsPerformed)}
          unit="次"
          color="bg-amber-50 border-amber-200 text-amber-800"
        />
        <StatCard
          label="介入後壓力下降"
          value={String(MONTHLY_STATS.pressureReductionSuccess)}
          unit="次"
          color="bg-green-50 border-green-200 text-green-800"
        />
      </div>

      {/* CQI message */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <div className="flex items-start gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5 text-blue-600" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="#2563eb" strokeWidth="1.5" />
            <line x1="8" y1="7" x2="8" y2="12" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="5" r="0.8" fill="#2563eb" />
          </svg>
          <p className="text-sm text-blue-700">
            <span className="font-semibold">持續品質改善 (CQI)</span>：術中資料不是用完就消失，
            每筆感測與介入記錄均可回饋至醫院品質改善流程，
            支持個人化風險模型未來訓練。
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">手術記錄列表</h3>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Demo Data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <Th>病例</Th>
                <Th>手術日期</Th>
                <Th>手術類型</Th>
                <Th>總時間</Th>
                <Th>最高風險部位</Th>
                <Th>最高壓力</Th>
                <Th>高壓持續</Th>
                <Th>介入次數</Th>
                <Th>介入後改善</Th>
                <Th>術後 Outcome</Th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SURGICAL_CASES.map((c, i) => (
                <tr
                  key={c.id}
                  className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${
                    i === 0 ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <td className="px-4 py-2.5 font-mono text-xs text-blue-700 font-medium">
                    {c.id}
                    {i === 0 && (
                      <span className="ml-1.5 bg-blue-200 text-blue-700 text-[10px] px-1 py-0.5 rounded">
                        本次
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-600">{c.date}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-700">{c.surgeryType}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-600">{c.totalHours}</td>
                  <td className="px-4 py-2.5 text-xs font-medium text-slate-700">{c.highestRiskSite}</td>
                  <td className="px-4 py-2.5 text-xs">
                    <span className={`font-bold ${c.peakPressure >= 80 ? 'text-red-600' : c.peakPressure >= 60 ? 'text-amber-600' : 'text-green-600'}`}>
                      {c.peakPressure}
                    </span>
                    <span className="text-slate-400 ml-0.5">mmHg</span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-600">{c.highPressureDuration} min</td>
                  <td className="px-4 py-2.5 text-xs text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${c.interventions > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                      {c.interventions} 次
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs font-medium text-center">
                    {c.pressureReduction === '—' ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <span className="text-green-700">↓ {c.pressureReduction}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-xs">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${OUTCOME_STYLE[c.outcome as PostOpSkinStatus]}`}>
                      {SKIN_STATUS_LABELS[c.outcome as PostOpSkinStatus]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-slate-400 text-center">
        * 全部歷史資料為 Demo Data，不作為臨床診斷依據
      </div>
    </div>
  );
};

const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
    {children}
  </th>
);

const StatCard: React.FC<{ label: string; value: string; unit: string; color: string }> = ({
  label, value, unit, color,
}) => (
  <div className={`rounded-xl border p-3 ${color}`}>
    <div className="text-xs opacity-70 mb-1">{label}</div>
    <div className="flex items-end gap-1">
      <span className="text-2xl font-bold tabular-nums">{value}</span>
      <span className="text-sm opacity-70 mb-0.5">{unit}</span>
    </div>
  </div>
);

export default HistoryTab;
