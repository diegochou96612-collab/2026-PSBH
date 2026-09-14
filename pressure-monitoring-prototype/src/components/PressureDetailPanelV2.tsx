// ============================================================
// PressureDetailPanelV2 – reads from PatientContext
// ============================================================

import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { usePatient } from '../context/PatientContext';
import type { PatientSiteData } from '../types';

const STATUS_CONFIG: Record<PatientSiteData['status'], {
  label: string; bg: string; text: string; border: string; dot: string; lineColor: string;
}> = {
  stable:     { label: '監測狀態穩定', bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500',  lineColor: '#22c55e' },
  caution:    { label: '注意',         bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-500',  lineColor: '#f59e0b' },
  'high-risk':{ label: '高風險提示',   bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500',    lineColor: '#ef4444' },
};

const TREND_ICON: Record<PatientSiteData['trend'], { icon: string; color: string; label: string }> = {
  rising:  { icon: '↑', color: 'text-red-500',   label: '持續上升' },
  stable:  { icon: '→', color: 'text-slate-500',  label: '穩定' },
  falling: { icon: '↓', color: 'text-green-500',  label: '下降中' },
};

// Generate a synthetic 60-min history from current site data
function generateHistory(site: PatientSiteData) {
  const points = [];
  const now = new Date();
  now.setSeconds(0, 0);
  const base = site.avgPressure;
  const current = site.pressure;

  for (let i = 60; i >= 0; i -= 2) {
    const t = new Date(now.getTime() - i * 60 * 1000);
    const hh = String(t.getHours()).padStart(2, '0');
    const mm = String(t.getMinutes()).padStart(2, '0');
    const progress = (60 - i) / 60;

    let pressure: number;
    if (site.trend === 'rising') {
      pressure = base + (current - base) * progress + (Math.random() - 0.5) * 3;
    } else if (site.trend === 'falling') {
      pressure = current + (base - current) * (1 - progress) + (Math.random() - 0.5) * 3;
    } else {
      pressure = base + Math.sin(progress * Math.PI * 3) * 4 + (Math.random() - 0.5) * 2;
    }
    points.push({
      time: `${hh}:${mm}`,
      pressure: Math.round(Math.max(10, Math.min(115, pressure))),
    });
  }
  if (points.length > 0) points[points.length - 1].pressure = Math.round(current);
  return points;
}

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

const PressureDetailPanelV2: React.FC = () => {
  const {
    getSelectedSite, liveSites,
    openIntervention, interventions, isAnimatingDrop,
  } = usePatient();

  const site = getSelectedSite();

  const history = useMemo(() => site ? generateHistory(site) : [], [
    site?.siteId, site?.pressure, site?.trend,
  ]);

  if (!site) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-full flex items-center justify-center text-slate-400 text-sm">
        請點擊人體圖部位查看詳細資料
      </div>
    );
  }

  const config = STATUS_CONFIG[site.status];
  const trendInfo = TREND_ICON[site.trend];
  const pressureColor = site.status === 'stable' ? '#16a34a' : site.status === 'caution' ? '#d97706' : '#dc2626';
  const hasIntervention = interventions.some((i) => i.siteId === site.siteId);
  const showInterventionBtn = site.status === 'high-risk' && !hasIntervention;
  const intervention = interventions.find((i) => i.siteId === site.siteId);

  // High risk sites for action card
  const highRiskSites = liveSites.filter((s) => s.status === 'high-risk');

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
        <div className="text-right">
          <div className="text-3xl font-bold tabular-nums" style={{ color: pressureColor }}>
            {Math.round(site.pressure)}
          </div>
          <div className="text-xs text-slate-400">mmHg</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <StatCard label="目前 Current" value={`${Math.round(site.pressure)}`} unit="mmHg" accent />
        <StatCard label="峰值 Peak" value={`${site.peakPressure}`} unit="mmHg" />
        <StatCard label="平均 Avg" value={`${site.avgPressure}`} unit="mmHg" />
        <StatCard label="持續" value={`${Math.round(site.durationMin)}`} unit="min" />
      </div>

      {/* Trend */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500">Pressure Trend:</span>
        <span className={`font-bold text-base ${trendInfo.color}`}>{trendInfo.icon}</span>
        <span className="font-semibold text-slate-700">{trendInfo.label}</span>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <div className="text-xs text-slate-500 mb-1">最近 60 分鐘壓力趨勢</div>
        <ResponsiveContainer width="100%" height={155}>
          <LineChart data={history} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} interval={6} />
            <YAxis domain={[0, 115]} tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={55} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1.2}
              label={{ value: '55', position: 'right', fontSize: 9, fill: '#f59e0b' }} />
            <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 3" strokeWidth={1.2}
              label={{ value: '80', position: 'right', fontSize: 9, fill: '#ef4444' }} />
            <Line type="monotone" dataKey="pressure" stroke={config.lineColor}
              strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="text-[9px] text-slate-300 italic mt-0.5">門檻數值為 Prototype 示意值</div>
      </div>

      {/* High-risk summary */}
      {highRiskSites.length > 0 && (
        <div className="border border-red-200 bg-red-50 rounded-xl p-3 slide-in">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-red-500 flex-shrink-0">⚠</span>
            <div>
              <div className="font-semibold text-red-700 text-sm">持續受壓風險上升</div>
              <div className="text-xs text-red-600 mt-0.5">
                高風險部位：{highRiskSites.map((s) => s.labelChinese).join('、')}
              </div>
            </div>
          </div>
          <ul className="text-xs text-red-600 space-y-0.5 mb-2 pl-2">
            <li>• 評估局部減壓墊位置</li>
            <li>• 若手術安全允許，考慮微調體位</li>
          </ul>
          <div className="text-[11px] text-slate-500 italic border-t border-red-200 pt-1.5">
            是否介入仍由醫療團隊依手術安全性判斷。
          </div>
        </div>
      )}

      {/* Post-intervention success */}
      {intervention && !isAnimatingDrop && (
        <div className="border border-green-200 bg-green-50 rounded-xl p-3 slide-in">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-green-600">✓</span>
            <span className="font-semibold text-green-700 text-sm">防護介入後壓力下降</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs mb-1">
            <div className="bg-white rounded border border-green-200 p-1.5">
              <div className="font-bold text-red-500">{intervention.pressureBefore}</div>
              <div className="text-slate-400">介入前</div>
            </div>
            <div className="flex items-center justify-center text-green-600 font-bold">→</div>
            <div className="bg-white rounded border border-green-200 p-1.5">
              <div className="font-bold text-green-600">{intervention.pressureAfter}</div>
              <div className="text-slate-400">介入後</div>
            </div>
          </div>
          <div className="text-center text-sm font-semibold text-green-700">
            壓力下降 {intervention.reduction}%
          </div>
        </div>
      )}

      {/* Intervention button */}
      {showInterventionBtn && (
        <button
          onClick={openIntervention}
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

const StatCard: React.FC<{ label: string; value: string; unit: string; accent?: boolean }> = ({
  label, value, unit, accent,
}) => (
  <div className={`rounded-lg p-2 text-center border ${accent ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
    <div className={`text-lg font-bold tabular-nums leading-tight ${accent ? 'text-blue-700' : 'text-slate-700'}`}>
      {value}
    </div>
    <div className="text-[10px] text-slate-400">{unit}</div>
    <div className="text-[10px] text-slate-500 leading-tight">{label}</div>
  </div>
);

export default PressureDetailPanelV2;
