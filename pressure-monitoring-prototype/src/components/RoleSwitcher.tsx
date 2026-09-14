// ============================================================
// RoleSwitcher – dropdown in header to switch care setting
// Demo-only component; not a real authentication system.
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import type { CareSetting } from '../types';
import { CARE_SETTINGS } from '../types';
import { useRole } from '../context/RoleContext';

const JOURNEY: CareSetting[] = ['OR', 'PACU', 'ICU', 'Ward', 'Outpatient'];

const RoleSwitcher: React.FC = () => {
  const { currentSetting, setCurrentSetting, config } = useRole();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-1.5 text-sm transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {/* Colored dot */}
        <span className={`w-2 h-2 rounded-full ${config.color} flex-shrink-0`} />
        <div className="text-left leading-tight">
          <div className="text-white text-xs font-semibold">{config.roleLabel}</div>
          <div className="text-blue-300 text-[10px]">{currentSetting} · {config.labelChinese}</div>
        </div>
        {/* Chevron */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`text-blue-300 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
          role="listbox"
        >
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Demo 角色切換
            </span>
          </div>
          {JOURNEY.map((setting) => {
            const cfg = CARE_SETTINGS[setting];
            const isActive = setting === currentSetting;
            return (
              <button
                key={setting}
                role="option"
                aria-selected={isActive}
                onClick={() => { setCurrentSetting(setting); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 transition-colors ${
                  isActive ? 'bg-blue-50' : ''
                }`}
              >
                <span className={`w-8 h-8 rounded-lg ${cfg.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {setting.slice(0, 2)}
                </span>
                <div>
                  <div className={`text-sm font-semibold ${isActive ? cfg.textColor : 'text-slate-700'}`}>
                    {cfg.roleLabel}
                  </div>
                  <div className="text-xs text-slate-400">
                    {setting} · {cfg.labelChinese}
                  </div>
                </div>
                {isActive && (
                  <span className="ml-auto text-blue-600 text-xs">✓</span>
                )}
              </button>
            );
          })}
          <div className="px-3 py-2 bg-amber-50 border-t border-amber-200">
            <p className="text-[10px] text-amber-600">
              Demo Role Switcher · 非真實帳號系統
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;
