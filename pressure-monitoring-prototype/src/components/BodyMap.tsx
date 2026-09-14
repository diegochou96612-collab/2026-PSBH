// ============================================================
// BodyMap – supine posterior body diagram with pressure markers
// ============================================================

import React from 'react';
import type { BodySite, SiteData } from '../types';
import { useSensor } from '../context/SensorContext';
// Marker positions as % of SVG viewBox (700 x 900)
const SITE_POSITIONS: Record<BodySite, { x: number; y: number }> = {
  occiput:        { x: 350, y: 105 },
  'left-scapula': { x: 270, y: 230 },
  'right-scapula':{ x: 430, y: 230 },
  sacrum:         { x: 350, y: 530 },
  'left-heel':    { x: 278, y: 830 },
  'right-heel':   { x: 422, y: 830 },
};

const STATUS_COLORS: Record<SiteData['status'], { fill: string; stroke: string; text: string }> = {
  stable:     { fill: '#22c55e', stroke: '#86efac', text: '#15803d' },
  caution:    { fill: '#f59e0b', stroke: '#fcd34d', text: '#92400e' },
  'high-risk':{ fill: '#ef4444', stroke: '#fca5a5', text: '#991b1b' },
};

interface MarkerProps {
  site: BodySite;
  data: SiteData;
  isSelected: boolean;
  onClick: () => void;
}

const PressureMarker: React.FC<MarkerProps> = ({ site, data, isSelected, onClick }) => {
  const pos = SITE_POSITIONS[site];
  const colors = STATUS_COLORS[data.status];

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${data.labelChinese} ${data.pressure} mmHg ${data.status}`}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{ cursor: 'pointer' }}
    >
      {/* Static border ring – no animation */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={18}
        fill="none"
        stroke={colors.stroke}
        strokeWidth={isSelected ? 2 : 1.5}
        opacity={isSelected ? 0.6 : 0.3}
      />
      {/* Main circle – fixed, no animation */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={14}
        fill={colors.fill}
        stroke={isSelected ? '#1e40af' : 'white'}
        strokeWidth={isSelected ? 3 : 2}
      />
      {/* Pressure value */}
      <text
        x={pos.x}
        y={pos.y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="9"
        fontWeight="700"
        fill="white"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {data.pressure}
      </text>
      {/* Label below */}
      <text
        x={pos.x}
        y={pos.y + 26}
        textAnchor="middle"
        fontSize="10"
        fontWeight="600"
        fill={colors.text}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {data.labelChinese}
      </text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Simplified posterior body outline – clean medical dashboard style
// ---------------------------------------------------------------------------
const BodyOutline: React.FC = () => (
  <g fill="none" stroke="#cbd5e1" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
    {/* Head */}
    <ellipse cx="350" cy="80" rx="48" ry="55" fill="#f8fafc" stroke="#cbd5e1" />
    {/* Neck */}
    <path d="M320 130 L320 155 L380 155 L380 130" />
    {/* Shoulders */}
    <path d="M320 155 Q260 165 230 200 L215 280 L230 290 L240 250 Q258 230 280 225" />
    <path d="M380 155 Q440 165 470 200 L485 280 L470 290 L460 250 Q442 230 420 225" />
    {/* Torso */}
    <path d="M280 225 L270 440 Q268 480 270 520 L280 550 L350 555 L420 550 L430 520 Q432 480 430 440 L420 225" fill="#f8fafc" />
    {/* Left arm */}
    <path d="M230 200 L210 340 L215 400 L230 410 L240 400 L242 340 L250 220" fill="#f8fafc" />
    {/* Right arm */}
    <path d="M470 200 L490 340 L485 400 L470 410 L460 400 L458 340 L450 220" fill="#f8fafc" />
    {/* Left forearm */}
    <path d="M215 400 L212 470 L222 475 L232 470 L230 410" fill="#f0f9f0" />
    {/* Right forearm */}
    <path d="M485 400 L488 470 L478 475 L468 470 L470 410" fill="#f0f9f0" />
    {/* Left hand */}
    <ellipse cx="218" cy="485" rx="14" ry="20" fill="#f8fafc" stroke="#cbd5e1" />
    {/* Right hand */}
    <ellipse cx="482" cy="485" rx="14" ry="20" fill="#f8fafc" stroke="#cbd5e1" />
    {/* Hips / Glutes */}
    <path d="M270 520 Q260 560 260 600 Q258 630 270 650 L350 660 L430 650 Q442 630 440 600 Q440 560 430 520" fill="#f8fafc" />
    {/* Left thigh */}
    <path d="M260 600 L250 700 L255 750 L280 755 L295 750 L295 700 L290 600" fill="#f8fafc" />
    {/* Right thigh */}
    <path d="M440 600 L450 700 L445 750 L420 755 L405 750 L405 700 L410 600" fill="#f8fafc" />
    {/* Left lower leg */}
    <path d="M255 750 L252 800 L260 815 L275 815 L285 800 L280 755" fill="#f8fafc" />
    {/* Right lower leg */}
    <path d="M445 750 L448 800 L440 815 L425 815 L415 800 L420 755" fill="#f8fafc" />
    {/* Left heel/foot */}
    <path d="M252 800 L248 845 L258 858 L282 856 L290 845 L285 800" fill="#f0f4ff" />
    {/* Right heel/foot */}
    <path d="M448 800 L452 845 L442 858 L418 856 L410 845 L415 800" fill="#f0f4ff" />
    {/* Spine line (dashed) */}
    <line x1="350" y1="155" x2="350" y2="520" strokeDasharray="6,4" stroke="#e2e8f0" strokeWidth="1.2" />
  </g>
);

// ---------------------------------------------------------------------------

const BodyMap: React.FC = () => {
  const { siteData, selectedSite, setSelectedSite } = useSensor();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          人體壓力分佈圖
        </h2>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <LegendDot color="#22c55e" label="穩定" />
          <LegendDot color="#f59e0b" label="注意" />
          <LegendDot color="#ef4444" label="高風險" />
        </div>
      </div>
      <p className="text-[11px] text-slate-400 mb-2">仰臥位後側示意圖 · 點擊部位查看詳細資料</p>

      <div className="flex-1 flex items-center justify-center min-h-0">
        <svg
          viewBox="60 30 580 870"
          style={{ width: '100%', maxHeight: '420px' }}
          aria-label="仰臥位後側人體壓力分佈圖"
          role="img"
        >
          <BodyOutline />
          {siteData.map((s) => (
            <PressureMarker
              key={s.site}
              site={s.site}
              data={s}
              isSelected={s.site === selectedSite}
              onClick={() => setSelectedSite(s.site)}
            />
          ))}
        </svg>
      </div>

      <p className="text-[10px] text-slate-400 text-center mt-1">
        圓圈數值 = 目前壓力 (mmHg) · 模擬感測資料
      </p>
    </div>
  );
};

const LegendDot: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <span className="flex items-center gap-1">
    <span style={{ backgroundColor: color }} className="w-2.5 h-2.5 rounded-full inline-block" />
    {label}
  </span>
);

export default BodyMap;
