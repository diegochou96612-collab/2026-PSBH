// ============================================================
// DemoControlPanel – scenario control for competition demo
// This panel is for demonstration purposes only.
// ============================================================

import React from 'react';
import { useSensor } from '../context/SensorContext';
import type { DemoScenario } from '../types';

const SCENARIOS: { id: DemoScenario; label: string; desc: string; color: string }[] = [
  {
    id: 'normal',
    label: '正常壓力',
    desc: '薦骨 ~30 mmHg 穩定',
    color: 'bg-green-600 hover:bg-green-700 text-white',
  },
  {
    id: 'rising',
    label: '壓力逐漸上升',
    desc: '薦骨 35 → 60 mmHg',
    color: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  {
    id: 'high-pressure',
    label: '持續高壓',
    desc: '薦骨 ~82 mmHg 高風險',
    color: 'bg-red-600 hover:bg-red-700 text-white',
  },
];

const DemoControlPanel: React.FC = () => {
  const { scenario, setScenario, openInterventionModal, siteData, interventions } = useSensor();

  const sacrumStatus = siteData.find((s) => s.site === 'sacrum')?.status;
  const hasIntervention = interventions.length > 0;

  const handleReset = () => {
    setScenario('high-pressure');
  };

  return (
    <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="text-sm font-bold text-amber-300">模擬感測器控制器</span>
        <span className="ml-auto text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30">
          Demo Only
        </span>
      </div>
      <p className="text-[11px] text-slate-400 mb-3">
        此控制面板僅供比賽展示使用，非正式醫療介面。
      </p>

      {/* Scenario buttons */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setScenario(s.id)}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors border-2 ${
              scenario === s.id
                ? `${s.color} border-white/30 ring-2 ring-white/20`
                : `${s.color} border-transparent opacity-75`
            }`}
          >
            <div className="font-bold">{s.label}</div>
            <div className="font-normal opacity-80 mt-0.5 text-[10px]">{s.desc}</div>
          </button>
        ))}
      </div>

      {/* Intervention + Reset row */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={openInterventionModal}
          disabled={sacrumStatus !== 'high-risk' || hasIntervention}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 text-xs font-bold transition-colors"
        >
          ✚ 執行減壓介入
        </button>
        <button
          onClick={handleReset}
          className="bg-slate-600 hover:bg-slate-500 text-white rounded-lg px-3 py-2 text-xs font-bold transition-colors"
        >
          ↺ Reset Demo
        </button>
      </div>

      {/* Demo flow hint */}
      <div className="mt-3 bg-slate-800 rounded-lg px-3 py-2 text-[10px] text-slate-400">
        <span className="text-slate-300 font-semibold">Demo 流程：</span>
        {' '}正常壓力 → 壓力上升 → 持續高壓 → 執行介入 → 觀察壓力下降
      </div>
    </div>
  );
};

export default DemoControlPanel;
