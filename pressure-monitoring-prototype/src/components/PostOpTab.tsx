// ============================================================
// PostOpTab – post-operative outcome summary
// ============================================================

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { useSensor } from '../context/SensorContext';
import type { PostOpSkinStatus } from '../types';
import { SKIN_STATUS_LABELS } from '../types';
import { generateSacrumHistory, getSiteDataForScenario } from '../data/mockSensorData';

const SKIN_OPTIONS: PostOpSkinStatus[] = ['normal', 'redness', 'suspected', 'confirmed'];

const SKIN_COLORS: Record<PostOpSkinStatus, string> = {
  normal: 'text-green-700 border-green-400 bg-green-50',
  redness: 'text-amber-700 border-amber-400 bg-amber-50',
  suspected: 'text-orange-700 border-orange-400 bg-orange-50',
  confirmed: 'text-red-700 border-red-400 bg-red-50',
};

const PostOpTab: React.FC = () => {
  const { interventions } = useSensor();
  const [skinStatus, setSkinStatus] = useState<PostOpSkinStatus>('normal');
  const [submitted, setSubmitted] = useState(false);

  const lastIntervention = interventions[0];

  // Full surgery history for sacrum (post-intervention scenario)
  const fullHistory = generateSacrumHistory(
    'post-intervention',
    getSiteDataForScenario('post-intervention')
  );

  // Find intervention point index (~60% through)
  const interventionIdx = Math.floor(fullHistory.length * 0.6);
  const interventionTime = fullHistory[interventionIdx]?.time ?? '14:32';

  const CustomTooltip: React.FC<{ active?: boolean; payload?: { value: number }[]; label?: string }> = ({
    active, payload, label,
  }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
        <div className="text-slate-500">{label}</div>
        <div className="font-semibold text-slate-800">{payload[0].value} mmHg</div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard label="總手術時間" value="6 hr 12 min" color="blue" />
        <SummaryCard label="最高風險部位" value="薦骨 Sacrum" color="red" />
        <SummaryCard label="最高壓力" value="91 mmHg" color="red" />
        <SummaryCard label="高壓持續時間" value="36 分鐘" color="amber" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard label="介入次數" value="1 次" color="blue" />
        <SummaryCard label="介入方式" value={lastIntervention ? INTERVENTION_TYPE_LABELS[lastIntervention.interventionType] : '調整減壓墊'} color="blue" />
        <SummaryCard label="介入前壓力" value={`${lastIntervention?.pressureBefore ?? 82} mmHg`} color="red" />
        <SummaryCard label="介入後壓力" value={`${lastIntervention?.pressureAfter ?? 43} mmHg`} color="green" />
      </div>

      {/* Full pressure × time chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-1">
          薦骨 Sacrum — 術中完整壓力記錄 (mmHg)
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          包含介入前壓力上升趨勢及介入後壓力下降記錄
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={fullHistory} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} interval={5} />
            <YAxis domain={[0, 110]} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 3" strokeWidth={1.2} />
            <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1.2} />
            <ReferenceLine
              x={interventionTime}
              stroke="#3b82f6"
              strokeWidth={2}
              label={{ value: '介入', position: 'top', fontSize: 10, fill: '#3b82f6' }}
            />
            <Line
              type="monotone"
              dataKey="pressure"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-1 text-[10px] text-slate-400 flex-wrap">
          <span><span className="text-amber-500">— —</span> 注意 60 mmHg</span>
          <span><span className="text-red-500">— —</span> 高風險 80 mmHg</span>
          <span><span className="text-blue-500">│</span> 防護介入時間點</span>
          <span className="italic text-slate-300">數值為模擬資料</span>
        </div>
      </div>

      {/* Skin status + submit */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">術後皮膚狀態紀錄</h3>

        {!submitted ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {SKIN_OPTIONS.map((s) => (
                <label
                  key={s}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border-2 cursor-pointer transition-colors ${
                    skinStatus === s
                      ? `border-current ${SKIN_COLORS[s]}`
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="skin-status"
                    value={s}
                    checked={skinStatus === s}
                    onChange={() => setSkinStatus(s)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm font-medium">{SKIN_STATUS_LABELS[s]}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setSubmitted(true)}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
            >
              完成術後紀錄
            </button>
          </>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 slide-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600 text-lg">✓</span>
              <span className="font-semibold text-green-700">術後紀錄已完成</span>
            </div>
            <div className="text-sm text-slate-600 mb-2">
              皮膚狀態：
              <span className={`font-semibold ml-1 ${SKIN_COLORS[skinStatus]}`}>
                {SKIN_STATUS_LABELS[skinStatus]}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              本次資料將作為後續品質改善與個人化風險模型研究資料。
            </p>
          </div>
        )}
      </div>

      {/* Data notice */}
      <div className="text-xs text-slate-400 text-center">
        * 所有資料為 Demo 模擬資料，不作為臨床診斷依據
      </div>
    </div>
  );
};

const INTERVENTION_TYPE_LABELS: Record<string, string> = {
  'adjust-pad': '調整減壓墊',
  'add-protection': '增加局部防護',
  'micro-reposition': '微調體位',
  'other': '其他',
};

const COLOR_MAP: Record<string, string> = {
  blue: 'border-blue-200 bg-blue-50 text-blue-800',
  red: 'border-red-200 bg-red-50 text-red-800',
  amber: 'border-amber-200 bg-amber-50 text-amber-800',
  green: 'border-green-200 bg-green-50 text-green-800',
};

const SummaryCard: React.FC<{ label: string; value: string; color: string }> = ({
  label, value, color,
}) => (
  <div className={`rounded-xl border p-3 ${COLOR_MAP[color] ?? COLOR_MAP.blue}`}>
    <div className="text-xs opacity-70 mb-0.5">{label}</div>
    <div className="text-base font-bold">{value}</div>
  </div>
);

export default PostOpTab;
