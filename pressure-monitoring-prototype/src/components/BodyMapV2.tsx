// ============================================================
// BodyMapV2 – position-aware body diagram with PatientContext
// Supports: Supine, Prone, Lateral, Lithotomy, BeachChair
// ============================================================

import React, { useRef, useEffect, useState } from 'react';
import type { SurgeryPosition, PatientSiteData } from '../types';
import { usePatient } from '../context/PatientContext';

// ---------------------------------------------------------------------------
// SVG positions per surgery position
// Each record maps siteId → {x, y} within viewBox 700×900
// ---------------------------------------------------------------------------

type PositionMap = Record<string, { x: number; y: number }>;

const SUPINE_POSITIONS: PositionMap = {
  occiput:        { x: 350, y: 105 },
  'left-scapula': { x: 270, y: 230 },
  'right-scapula':{ x: 430, y: 230 },
  sacrum:         { x: 350, y: 530 },
  'left-heel':    { x: 278, y: 830 },
  'right-heel':   { x: 422, y: 830 },
  // Lithotomy extras
  'left-calf':    { x: 260, y: 760 },
  'right-calf':   { x: 440, y: 760 },
  'left-shoulder':{ x: 255, y: 200 },
  'right-shoulder':{ x: 445, y: 200 },
};

const PRONE_POSITIONS: PositionMap = {
  forehead:       { x: 350, y: 105 },
  chest:          { x: 350, y: 270 },
  'iliac-crest':  { x: 350, y: 480 },
  'left-knee':    { x: 280, y: 680 },
  'right-knee':   { x: 420, y: 680 },
  feet:           { x: 350, y: 840 },
  sacrum:         { x: 350, y: 530 },
};

const LATERAL_POSITIONS: PositionMap = {
  'right-ear':       { x: 350, y: 95 },
  'right-shoulder':  { x: 220, y: 230 },
  'left-shoulder':   { x: 480, y: 230 },
  'right-hip':       { x: 220, y: 500 },
  'right-knee':      { x: 230, y: 650 },
  'right-lat-mall':  { x: 240, y: 800 },
  // craniotomy extras
  'right-ear-high':  { x: 350, y: 80 },
};

const BEACHCHAIR_POSITIONS: PositionMap = {
  occiput:          { x: 350, y: 105 },
  'left-scapula':   { x: 270, y: 230 },
  'right-scapula':  { x: 430, y: 230 },
  sacrum:           { x: 350, y: 450 },
  'left-heel':      { x: 270, y: 780 },
  'right-heel':     { x: 430, y: 780 },
};

function getPositionMap(position: SurgeryPosition): PositionMap {
  switch (position) {
    case 'Prone':      return PRONE_POSITIONS;
    case 'Lateral':    return LATERAL_POSITIONS;
    case 'BeachChair': return BEACHCHAIR_POSITIONS;
    case 'Lithotomy':  return SUPINE_POSITIONS; // same base, calf added
    default:           return SUPINE_POSITIONS;
  }
}

// ---------------------------------------------------------------------------
// Status colors  (ring color kept for the static border stroke)
// ---------------------------------------------------------------------------
const STATUS_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  stable:     { fill: '#22c55e', stroke: '#86efac', text: '#15803d' },
  caution:    { fill: '#f59e0b', stroke: '#fcd34d', text: '#92400e' },
  'high-risk':{ fill: '#ef4444', stroke: '#fca5a5', text: '#991b1b' },
};

// ---------------------------------------------------------------------------
// Pressure marker – static by default, one-shot ring flash when newly high-risk
// ---------------------------------------------------------------------------
interface MarkerProps {
  siteId: string;
  data: PatientSiteData;
  pos: { x: number; y: number };
  isSelected: boolean;
  onClick: () => void;
  flashOnce: boolean;   // true for 1.2 s when site first becomes high-risk
}

const PressureMarker: React.FC<MarkerProps> = ({ data, pos, isSelected, onClick, flashOnce }) => {
  const colors = STATUS_COLORS[data.status];
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${data.labelChinese} ${data.pressure} mmHg`}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{ cursor: 'pointer' }}
    >
      {/* One-shot alert ring – only appears briefly when site newly becomes high-risk */}
      {flashOnce && (
        <circle
          cx={pos.x} cy={pos.y} r={20}
          fill="#fca5a5"
          opacity={0}
          className="alert-flash-once"
        />
      )}
      {/* Static outer border ring – no animation */}
      <circle
        cx={pos.x} cy={pos.y} r={18}
        fill="none"
        stroke={colors.stroke}
        strokeWidth={isSelected ? 2 : 1.5}
        opacity={isSelected ? 0.6 : 0.3}
      />
      {/* Main marker circle – fixed position, no animation */}
      <circle
        cx={pos.x} cy={pos.y} r={14}
        fill={colors.fill}
        stroke={isSelected ? '#1e40af' : 'white'}
        strokeWidth={isSelected ? 3 : 2}
      />
      <text
        x={pos.x} y={pos.y + 1}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="9" fontWeight="700" fill="white"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {Math.round(data.pressure)}
      </text>
      <text
        x={pos.x} y={pos.y + 26}
        textAnchor="middle"
        fontSize="9.5" fontWeight="600" fill={colors.text}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {data.labelChinese}
      </text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Body outlines per position
// ---------------------------------------------------------------------------
const SupineOutline: React.FC = () => (
  <g fill="none" stroke="#cbd5e1" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
    <ellipse cx="350" cy="80" rx="48" ry="55" fill="#f8fafc" stroke="#cbd5e1" />
    <path d="M320 130 L320 155 L380 155 L380 130" />
    <path d="M320 155 Q260 165 230 200 L215 280 L230 290 L240 250 Q258 230 280 225" />
    <path d="M380 155 Q440 165 470 200 L485 280 L470 290 L460 250 Q442 230 420 225" />
    <path d="M280 225 L270 440 Q268 480 270 520 L280 550 L350 555 L420 550 L430 520 Q432 480 430 440 L420 225" fill="#f8fafc" />
    <path d="M230 200 L210 340 L215 400 L230 410 L240 400 L242 340 L250 220" fill="#f8fafc" />
    <path d="M470 200 L490 340 L485 400 L470 410 L460 400 L458 340 L450 220" fill="#f8fafc" />
    <ellipse cx="218" cy="480" rx="14" ry="18" fill="#f8fafc" stroke="#cbd5e1" />
    <ellipse cx="482" cy="480" rx="14" ry="18" fill="#f8fafc" stroke="#cbd5e1" />
    <path d="M270 520 Q260 560 260 600 Q258 630 270 650 L350 660 L430 650 Q442 630 440 600 Q440 560 430 520" fill="#f8fafc" />
    <path d="M260 600 L250 700 L255 750 L280 755 L295 750 L295 700 L290 600" fill="#f8fafc" />
    <path d="M440 600 L450 700 L445 750 L420 755 L405 750 L405 700 L410 600" fill="#f8fafc" />
    <path d="M255 750 L252 800 L260 815 L275 815 L285 800 L280 755" fill="#f8fafc" />
    <path d="M445 750 L448 800 L440 815 L425 815 L415 800 L420 755" fill="#f8fafc" />
    <path d="M252 800 L248 845 L258 858 L282 856 L290 845 L285 800" fill="#f0f4ff" />
    <path d="M448 800 L452 845 L442 858 L418 856 L410 845 L415 800" fill="#f0f4ff" />
    <line x1="350" y1="155" x2="350" y2="520" strokeDasharray="6,4" stroke="#e2e8f0" strokeWidth="1.2" />
  </g>
);

const ProneOutline: React.FC = () => (
  <g fill="none" stroke="#c7d2fe" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
    {/* Label */}
    <text x="350" y="30" textAnchor="middle" fontSize="11" fill="#6366f1" fontWeight="600"
      style={{ userSelect: 'none' }}>俯臥位 Prone</text>
    {/* Head */}
    <ellipse cx="350" cy="85" rx="45" ry="52" fill="#f5f3ff" stroke="#c7d2fe" />
    {/* Neck */}
    <path d="M322 132 L322 158 L378 158 L378 132" />
    {/* Torso */}
    <path d="M285 210 L272 430 Q270 475 272 515 L282 548 L350 554 L418 548 L428 515 Q430 475 428 430 L415 210" fill="#f5f3ff" />
    {/* Shoulders */}
    <path d="M322 158 Q262 168 232 205 L218 285 L234 292 L242 255 Q260 235 285 228" />
    <path d="M378 158 Q438 168 468 205 L482 285 L466 292 L458 255 Q440 235 415 228" />
    {/* Arms */}
    <path d="M232 205 L212 345 L218 402 L232 412 L242 402 L244 345 L252 222" fill="#f5f3ff" />
    <path d="M468 205 L488 345 L482 402 L468 412 L458 402 L456 345 L448 222" fill="#f5f3ff" />
    <ellipse cx="220" cy="478" rx="13" ry="17" fill="#f5f3ff" stroke="#c7d2fe" />
    <ellipse cx="480" cy="478" rx="13" ry="17" fill="#f5f3ff" stroke="#c7d2fe" />
    {/* Glutes / hips */}
    <path d="M272 515 Q262 555 262 592 Q260 628 272 648 L350 658 L428 648 Q440 628 438 592 Q438 555 428 515" fill="#ede9fe" />
    {/* Legs */}
    <path d="M262 592 L252 698 L257 748 L282 752 L297 748 L297 698 L292 592" fill="#f5f3ff" />
    <path d="M438 592 L448 698 L443 748 L418 752 L403 748 L403 698 L408 592" fill="#f5f3ff" />
    {/* Lower legs */}
    <path d="M252 748 L250 820 L262 832 L278 832 L288 820 L282 752" fill="#f5f3ff" />
    <path d="M448 748 L450 820 L438 832 L422 832 L412 820 L418 752" fill="#f5f3ff" />
    {/* Feet */}
    <ellipse cx="268" cy="848" rx="20" ry="14" fill="#ede9fe" stroke="#c7d2fe" />
    <ellipse cx="432" cy="848" rx="20" ry="14" fill="#ede9fe" stroke="#c7d2fe" />
    {/* Spine */}
    <line x1="350" y1="158" x2="350" y2="515" strokeDasharray="6,4" stroke="#c7d2fe" strokeWidth="1.2" />
  </g>
);

const LateralOutline: React.FC = () => (
  <g fill="none" stroke="#ddd6fe" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
    <text x="350" y="30" textAnchor="middle" fontSize="11" fill="#7c3aed" fontWeight="600"
      style={{ userSelect: 'none' }}>側臥位 Lateral</text>
    {/* Head */}
    <ellipse cx="350" cy="90" rx="44" ry="50" fill="#f5f3ff" stroke="#ddd6fe" />
    {/* Neck */}
    <path d="M330 136 L325 165 L375 165 L370 136" />
    {/* Torso (side view – wider) */}
    <path d="M200 200 Q185 250 190 320 L195 450 Q198 500 205 530 L350 555 L495 530 Q502 500 505 450 L510 320 Q515 250 500 200 L350 185 Z" fill="#f5f3ff" />
    {/* Lower body */}
    <path d="M205 530 Q198 580 195 630 L205 700 L260 720 L290 710 L295 640 L280 580 L280 540" fill="#f5f3ff" />
    <path d="M495 530 Q502 580 505 630 L495 700 L440 720 L410 710 L405 640 L420 580 L420 540" fill="#f5f3ff" />
    {/* Lower legs */}
    <path d="M205 700 L202 800 L215 818 L252 818 L265 800 L260 720" fill="#f5f3ff" />
    <path d="M495 700 L498 800 L485 818 L448 818 L435 800 L440 720" fill="#f5f3ff" />
    {/* Feet */}
    <ellipse cx="235" cy="835" rx="32" ry="13" fill="#ede9fe" stroke="#ddd6fe" />
    <ellipse cx="465" cy="835" rx="32" ry="13" fill="#ede9fe" stroke="#ddd6fe" />
  </g>
);

// ---------------------------------------------------------------------------
// Main BodyMapV2 component
// ---------------------------------------------------------------------------
const BodyMapV2: React.FC = () => {
  const { currentPatient, liveSites, selectedSiteId, setSelectedSiteId } = usePatient();
  const posMap = getPositionMap(currentPatient.position);

  // Track which sites are flashing (newly became high-risk)
  const [flashingSites, setFlashingSites] = useState<Set<string>>(new Set());
  const prevStatusRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const newlyHighRisk: string[] = [];
    liveSites.forEach((s) => {
      const prev = prevStatusRef.current[s.siteId];
      if (s.status === 'high-risk' && prev !== 'high-risk') {
        newlyHighRisk.push(s.siteId);
      }
      prevStatusRef.current[s.siteId] = s.status;
    });

    if (newlyHighRisk.length > 0) {
      setFlashingSites((prev) => {
        const next = new Set(prev);
        newlyHighRisk.forEach((id) => next.add(id));
        return next;
      });
      // Remove flash class after animation completes (2 × 0.55 s + buffer)
      const timer = setTimeout(() => {
        setFlashingSites((prev) => {
          const next = new Set(prev);
          newlyHighRisk.forEach((id) => next.delete(id));
          return next;
        });
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [liveSites]);

  // Filter sites that have known positions in the map
  const renderableSites = liveSites.filter((s) => posMap[s.siteId]);

  const OutlineComponent = (() => {
    switch (currentPatient.position) {
      case 'Prone':      return <ProneOutline />;
      case 'Lateral':    return <LateralOutline />;
      default:           return <SupineOutline />;
    }
  })();

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
      <p className="text-[11px] text-slate-400 mb-1">
        {currentPatient.position === 'Prone' ? '俯臥位前側示意圖' :
         currentPatient.position === 'Lateral' ? '側臥位示意圖' :
         currentPatient.position === 'Lithotomy' ? '截石位示意圖' :
         currentPatient.position === 'BeachChair' ? '沙灘椅位示意圖' :
         '仰臥位後側示意圖'} · 點擊部位查看詳細資料
      </p>

      <div className="flex-1 flex items-center justify-center min-h-0">
        <svg
          viewBox="60 30 580 870"
          style={{ width: '100%', maxHeight: '420px' }}
          aria-label="人體壓力分佈示意圖"
          role="img"
        >
          {OutlineComponent}
          {renderableSites.map((s) => (
            <PressureMarker
              key={s.siteId}
              siteId={s.siteId}
              data={s}
              pos={posMap[s.siteId]}
              isSelected={s.siteId === selectedSiteId}
              onClick={() => setSelectedSiteId(s.siteId)}
              flashOnce={flashingSites.has(s.siteId)}
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

export default BodyMapV2;
