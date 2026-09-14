// ============================================================
// Header – system title, status indicator, surgery clock, role switcher
// ============================================================

import React from 'react';
import { useSensor } from '../context/SensorContext';
import RoleSwitcher from './RoleSwitcher';

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const Header: React.FC = () => {
  const { elapsedSeconds } = useSensor();

  return (
    <header className="bg-[#0f172a] text-white px-6 py-3 flex items-center justify-between shadow-md gap-4">
      {/* Logo + Title */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="14" height="14" rx="2" stroke="white" strokeWidth="1.5" />
            <circle cx="9" cy="9" r="3" fill="white" />
            <line x1="9" y1="2" x2="9" y2="5" stroke="white" strokeWidth="1.5" />
            <line x1="9" y1="13" x2="9" y2="16" stroke="white" strokeWidth="1.5" />
            <line x1="2" y1="9" x2="5" y2="9" stroke="white" strokeWidth="1.5" />
            <line x1="13" y1="9" x2="16" y2="9" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight tracking-tight">
            術中壓傷智慧監測系統
          </h1>
          <p className="text-xs text-blue-300 leading-tight">
            Smart Intraoperative Pressure Injury Monitoring
          </p>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* System status */}
        <div className="flex items-center gap-2 text-sm flex-shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span className="text-green-400 font-medium text-xs">系統監測中</span>
        </div>

        {/* Surgery elapsed */}
        <div className="text-right flex-shrink-0">
          <div className="text-[10px] text-slate-400">手術已進行</div>
          <div className="text-base font-mono font-semibold text-white tabular-nums">
            {formatElapsed(elapsedSeconds)}
          </div>
        </div>

        {/* Role switcher */}
        <RoleSwitcher />

        {/* Demo badge */}
        <div className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs px-2 py-1 rounded font-medium flex-shrink-0">
          DEMO
        </div>
      </div>
    </header>
  );
};

export default Header;
