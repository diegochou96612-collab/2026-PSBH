// ============================================================
// PressureDetailPanel – selected site readings + trend chart
// ============================================================

import React from 'react';
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
import type { SiteData } from '../types';

const STATUS_CONFIG: Record<SiteData['status'], {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
  lineColor: string;
}> = {
  stable: {
    label: '監測狀態穩定',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
    lineColor: '#22c55e',
  },
  caution: {
    label: '注意',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    lineColor: '#f59e0b',
  },
  'high-risk': {
    label: '高風險提示',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
    lineColor: '#ef4444',
  },
};

const TREND_ICON: Record<SiteData['trend'], { icon: string; color: string }> = {
  rising:  { icon: '↑', color: 'text-red-500' },
  stable:  { icon: '→', color: 'text-slate-500' },
  falling: { icon: '↓', color: 'text-green-500' },
};

const TREND_LABEL: Record<SiteData['trend'], string> = {
  rising:  '持續上升',
  stable:  '穩定',
  falling: '下降中',
};

// Custom tooltip for chart
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

const PressureDetailPanel: React.FC = () => {
  const { getSelectedSiteData, pressureHistory, interventions, scenario, openInterventionModal } = useSensor();
  const site = getSelectedSiteData();

  if (!site) return null;

  const config = STATUS_CONFIG[site.status];
  const trendInfo = TREND_ICON[site.trend];

  const showInterventionButton =
    site.site === 'sacrum' && site.status === 'high-risk';

  const lastIntervention = interventions.find((i) => i.site === site.site);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-full flex flex-col gap-3">
      {/* Site header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            {site.labelChinese}
            <span className="ml-2 text-sm font-normal text-slate-400">{site.label}</span>
          </h2>
          <div className={`inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </div>
        </div>

        {/* Current pressure */}
        <div className="text-right">
          <div className="text-3xl font-bold tabular-nums" style={{ color: site.status === 'stable' ? '#16a34a' : site.status === 'caution' ? '#d97706' : '#dc2626' }}>
            {site.pressure}
          </div>
          <div className="text-xs text-slate-400">mmHg</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        <StatCard label="目前壓力" value={`${site.pressure}`} unit="mmHg" accent />
        <StatCard label="最高壓力 Peak" value={`${site.peakPressure}`} unit="mmHg" />
        <StatCard label="平均壓力 Avg" value={`${site.avgPressure}`} unit="mmHg" />
        <StatCard label="持續受壓" value={`${site.durationMin}`} unit="min" />
      </div>

      {/* Trend row */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500">Pressure Trend:</span>
        <span className={`font-bold text-base ${trendInfo.color}`}>{trendInfo.icon}</span>
        <span className="font-semibold text-slate-700">{TREND_LABEL[site.trend]}</span>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <div className="text-xs text-slate-500 mb-1">
          最近 60 分鐘壓力趨勢 (mmHg)
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={pressureHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              interval={5}
            />
            <YAxis
              domain={[0, 110]}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Caution threshold reference */}
            <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1.2}
              label={{ value: '60', position: 'right', fontSize: 9, fill: '#f59e0b' }} />
            {/* High risk threshold reference */}
            <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 3" strokeWidth={1.2}
              label={{ value: '80', position: 'right', fontSize: 9, fill: '#ef4444' }} />
            <Line
              type="monotone"
              dataKey="pressure"
              stroke={config.lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-1 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="inline-block w-4 h-px bg-amber-400" style={{ borderTop: '1.5px dashed #f59e0b', display: 'inline-block', width: 16 }} />
            注意門檻 60 mmHg
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-4 border-t border-dashed border-red-400" />
            高風險門檻 80 mmHg
          </span>
          <span className="text-[9px] italic text-slate-300">門檻數值為 Prototype 示意值</span>
        </div>
      </div>

      {/* Action Card – high risk alert */}
      {site.site === 'sacrum' && site.status === 'high-risk' && !lastIntervention && (
        <ActionCard onIntervention={openInterventionModal} />
      )}

      {/* Post intervention success */}
      {lastIntervention && scenario === 'post-intervention' && (
        <InterventionSuccessCard record={lastIntervention} />
      )}

      {/* Intervention button */}
      {showInterventionButton && !lastIntervention && (
        <button
          onClick={openInterventionModal}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <line x1="8" y1="5" x2="8" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          執行減壓介入
        </button>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------

const StatCard: React.FC<{
  label: string;
  value: string;
  unit: string;
  accent?: boolean;
}> = ({ label, value, unit, accent }) => (
  <div className={`rounded-lg p-2 text-center border ${accent ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
    <div className={`text-lg font-bold tabular-nums leading-tight ${accent ? 'text-blue-700' : 'text-slate-700'}`}>
      {value}
    </div>
    <div className="text-[10px] text-slate-400">{unit}</div>
    <div className="text-[10px] text-slate-500 leading-tight">{label}</div>
  </div>
);

// ---------------------------------------------------------------------------

const ActionCard: React.FC<{ onIntervention: () => void }> = (_props) => (
  <div className="border border-red-200 bg-red-50 rounded-xl p-3 slide-in">
    <div className="flex items-start gap-2 mb-2">
      <span className="text-red-500 text-base flex-shrink-0">⚠</span>
      <div>
        <div className="font-semibold text-red-700 text-sm">持續受壓風險上升</div>
        <div className="text-xs text-red-600 mt-0.5">
          系統提示：薦骨區域持續受壓，建議醫療團隊評估局部防護措施。
        </div>
      </div>
    </div>
    <div className="text-xs text-red-700 font-medium mb-1">可評估：</div>
    <ul className="text-xs text-red-600 space-y-0.5 mb-2 pl-2">
      <li>• 調整局部減壓墊位置</li>
      <li>• 檢查防護材料</li>
      <li>• 若手術安全允許，評估微調體位</li>
    </ul>
    <div className="text-[11px] text-slate-500 italic border-t border-red-200 pt-1.5">
      是否介入仍由醫療團隊依手術安全性判斷。
    </div>
  </div>
);

// ---------------------------------------------------------------------------

const InterventionSuccessCard: React.FC<{ record: { pressureBefore: number; pressureAfter: number; reduction: number; interventionType: string } }> = ({
  record,
}) => (
  <div className="border border-green-200 bg-green-50 rounded-xl p-3 slide-in">
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-green-600 text-base">✓</span>
      <span className="font-semibold text-green-700 text-sm">防護介入後壓力下降</span>
    </div>
    <div className="grid grid-cols-3 gap-2 text-center mb-1.5">
      <div className="bg-white rounded-lg p-1.5 border border-green-200">
        <div className="text-sm font-bold text-red-500">{record.pressureBefore}</div>
        <div className="text-[10px] text-slate-500">介入前 mmHg</div>
      </div>
      <div className="flex items-center justify-center text-green-600 font-bold text-lg">→</div>
      <div className="bg-white rounded-lg p-1.5 border border-green-200">
        <div className="text-sm font-bold text-green-600">{record.pressureAfter}</div>
        <div className="text-[10px] text-slate-500">介入後 mmHg</div>
      </div>
    </div>
    <div className="text-center text-sm font-semibold text-green-700">
      壓力下降 {record.reduction}%
    </div>
    <div className="text-xs text-slate-500 text-center mt-1">
      持續監測中
    </div>
  </div>
);

export default PressureDetailPanel;
