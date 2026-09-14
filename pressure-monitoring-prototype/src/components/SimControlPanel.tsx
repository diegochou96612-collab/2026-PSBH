// ============================================================
// SimControlPanel – simulation control with speed, play/pause
// Replaces DemoControlPanel for multi-patient mode
// ============================================================

import React from 'react';
import { usePatient } from '../context/PatientContext';
import type { SimulationSpeed } from '../types';

const SPEEDS: SimulationSpeed[] = [1, 2, 5];

const SimControlPanel: React.FC = () => {
  const {
    simRunning, simSpeed,
    startSim, pauseSim, setSimSpeed, resetSim,
    openIntervention, interventions,
    currentPatient, liveSites,
  } = usePatient();

  const hasHighRisk = liveSites.some((s) => s.status === 'high-risk');
  const hasIntervention = interventions.length > 0;

  return (
    <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="text-sm font-bold text-amber-300">模擬感測器控制器</span>
        <span className="ml-auto text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30">
          Demo Only
        </span>
      </div>
      <p className="text-[11px] text-slate-400 mb-3">
        目前病人：<span className="text-white font-mono">{currentPatient.patientId}</span>
        {' '}· 此控制面板僅供展示使用，非正式醫療介面。
      </p>

      <div className="grid grid-cols-4 gap-2 mb-2">
        {/* Play / Pause */}
        <button
          onClick={simRunning ? pauseSim : startSim}
          className={`col-span-2 flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors border-2 ${
            simRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-white border-transparent'
              : 'bg-green-600 hover:bg-green-700 text-white border-transparent'
          }`}
        >
          {simRunning ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                <rect x="2" y="2" width="4" height="10" rx="1" />
                <rect x="8" y="2" width="4" height="10" rx="1" />
              </svg>
              暫停 Pause
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                <path d="M3 2l9 5-9 5V2z" />
              </svg>
              播放 Play
            </>
          )}
        </button>

        {/* Speed buttons */}
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => setSimSpeed(s)}
            className={`rounded-lg px-2 py-2.5 text-sm font-bold transition-colors border-2 ${
              simSpeed === s
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-slate-700 text-slate-300 border-transparent hover:bg-slate-600'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Intervention + Reset */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={openIntervention}
          disabled={!hasHighRisk || hasIntervention}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 text-xs font-bold transition-colors"
        >
          ✚ 執行減壓介入
        </button>
        <button
          onClick={resetSim}
          className="bg-slate-600 hover:bg-slate-500 text-white rounded-lg px-3 py-2 text-xs font-bold transition-colors"
        >
          ↺ Reset Demo
        </button>
      </div>

      {/* Status indicator */}
      <div className="mt-3 flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2 text-[10px] text-slate-400">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${simRunning ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`} />
        {simRunning
          ? `模擬執行中 @ ${simSpeed}x · 壓力數值每 ${Math.round(1000 / simSpeed)} ms 更新`
          : '模擬已暫停 · 按 Play 開始即時壓力模擬'}
      </div>
    </div>
  );
};

export default SimControlPanel;
