// ============================================================
// CareJourneyBar – shows patient's position in care pathway
// OR → PACU → ICU → Ward → Outpatient
// ============================================================

import React from 'react';
import type { CareSetting } from '../types';
import { CARE_SETTINGS } from '../types';
import { useRole } from '../context/RoleContext';

const JOURNEY: CareSetting[] = ['OR', 'PACU', 'ICU', 'Ward', 'Outpatient'];

const CareJourneyBar: React.FC = () => {
  const { currentSetting } = useRole();
  const currentOrder = CARE_SETTINGS[currentSetting].order;

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-2">
      <div className="flex items-center gap-0 max-w-7xl mx-auto">
        <span className="text-[11px] text-slate-400 mr-3 whitespace-nowrap flex-shrink-0">照護流程</span>
        <div className="flex items-center gap-0 overflow-x-auto">
          {JOURNEY.map((setting, idx) => {
            const cfg = CARE_SETTINGS[setting];
            const settingOrder = cfg.order;
            const isCurrent = setting === currentSetting;
            const isDone = settingOrder < currentOrder;

            return (
              <React.Fragment key={setting}>
                {/* Step */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Circle */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                      isCurrent
                        ? `${cfg.color} text-white border-transparent ring-2 ring-offset-1 ring-blue-400`
                        : isDone
                        ? 'bg-slate-300 text-white border-transparent'
                        : 'bg-white text-slate-400 border-slate-300'
                    }`}
                  >
                    {isDone ? '✓' : cfg.order}
                  </div>
                  {/* Label */}
                  <div className="flex flex-col leading-tight">
                    <span
                      className={`text-[11px] font-semibold ${
                        isCurrent ? cfg.textColor : isDone ? 'text-slate-400' : 'text-slate-400'
                      }`}
                    >
                      {setting}
                    </span>
                    <span
                      className={`text-[10px] ${
                        isCurrent ? cfg.textColor + ' opacity-80' : 'text-slate-300'
                      }`}
                    >
                      {cfg.labelChinese}
                    </span>
                  </div>
                  {/* Current badge */}
                  {isCurrent && (
                    <span className={`text-[9px] ${cfg.color} text-white px-1 py-0.5 rounded font-bold flex-shrink-0`}>
                      目前
                    </span>
                  )}
                </div>
                {/* Arrow connector */}
                {idx < JOURNEY.length - 1 && (
                  <div className={`mx-2 text-sm flex-shrink-0 ${isDone || isCurrent ? 'text-slate-400' : 'text-slate-200'}`}>
                    →
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CareJourneyBar;
