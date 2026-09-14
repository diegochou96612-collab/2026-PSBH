// ============================================================
// PatientListDrawer – slide-in patient list with search & filter
// ============================================================

import React, { useState, useMemo } from 'react';
import { usePatient } from '../context/PatientContext';
import type { MockPatient, SurgeryPosition, OverallRisk, CareSetting } from '../types';
import { OVERALL_RISK_CONFIG, POSITION_LABELS, CARE_SETTINGS } from '../types';

interface PatientListDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ALL = 'all';

const PatientListDrawer: React.FC<PatientListDrawerProps> = ({ open, onClose }) => {
  const { patients, currentPatient, setCurrentPatientId } = usePatient();

  const [search, setSearch] = useState('');
  const [filterPosition, setFilterPosition] = useState<SurgeryPosition | 'all'>(ALL);
  const [filterRisk, setFilterRisk] = useState<OverallRisk | 'all'>(ALL);
  const [filterSetting, setFilterSetting] = useState<CareSetting | 'all'>(ALL);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch = p.patientId.toLowerCase().includes(search.toLowerCase()) ||
        p.surgeryNameZh.includes(search) ||
        p.surgeryNameEn.toLowerCase().includes(search.toLowerCase());
      const matchPos = filterPosition === ALL || p.position === filterPosition;
      const matchRisk = filterRisk === ALL || p.overallRisk === filterRisk;
      const matchSetting = filterSetting === ALL || p.careSetting === filterSetting;
      return matchSearch && matchPos && matchRisk && matchSetting;
    });
  }, [patients, search, filterPosition, filterRisk, filterSetting]);

  const handleSelect = (id: string) => {
    setCurrentPatientId(id);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[420px] max-w-full bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="病人清單"
      >
        {/* Header */}
        <div className="bg-[#0f172a] text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="font-bold text-base">病人清單 Patient List</div>
            <div className="text-xs text-blue-300 mt-0.5">
              {filtered.length} / {patients.length} 位 · Simulation Data
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
            aria-label="關閉"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
              <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜尋 Patient ID 或手術名稱…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-2 border-b border-slate-200 flex-shrink-0 space-y-2">
          {/* Position filter */}
          <FilterRow label="體位">
            {(['all', 'Supine', 'Prone', 'Lateral', 'Lithotomy', 'BeachChair'] as const).map((v) => (
              <FilterChip
                key={v}
                label={v === 'all' ? '全部' : POSITION_LABELS[v as SurgeryPosition].zh}
                active={filterPosition === v}
                onClick={() => setFilterPosition(v as SurgeryPosition | 'all')}
              />
            ))}
          </FilterRow>
          {/* Risk filter */}
          <FilterRow label="風險">
            {(['all', 'Low', 'Moderate', 'High', 'Critical'] as const).map((v) => {
              const cfg = v !== 'all' ? OVERALL_RISK_CONFIG[v as OverallRisk] : null;
              return (
                <FilterChip
                  key={v}
                  label={v === 'all' ? '全部' : cfg!.labelChinese}
                  active={filterRisk === v}
                  onClick={() => setFilterRisk(v as OverallRisk | 'all')}
                  color={cfg ? `${cfg.bg} ${cfg.text}` : undefined}
                />
              );
            })}
          </FilterRow>
          {/* Care setting filter */}
          <FilterRow label="場域">
            {(['all', 'OR', 'PACU', 'ICU', 'Ward', 'Outpatient'] as const).map((v) => (
              <FilterChip
                key={v}
                label={v === 'all' ? '全部' : v}
                active={filterSetting === v}
                onClick={() => setFilterSetting(v as CareSetting | 'all')}
              />
            ))}
          </FilterRow>
        </div>

        {/* Patient list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="text-center text-slate-400 text-sm py-10">
              沒有符合條件的病人
            </div>
          )}
          {filtered.map((p) => (
            <PatientCard
              key={p.patientId}
              patient={p}
              isActive={p.patientId === currentPatient.patientId}
              onSelect={() => handleSelect(p.patientId)}
            />
          ))}
        </div>

        {/* Footer disclaimer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex-shrink-0">
          <p className="text-[10px] text-slate-400 text-center">
            所有病人資料均為 SIMULATION DATA · NOT REAL PATIENT DATA
          </p>
        </div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------

const PatientCard: React.FC<{
  patient: MockPatient;
  isActive: boolean;
  onSelect: () => void;
}> = ({ patient, isActive, onSelect }) => {
  const riskCfg = OVERALL_RISK_CONFIG[patient.overallRisk];
  const settingCfg = CARE_SETTINGS[patient.careSetting];

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
        isActive ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'
      }`}
    >
      {/* ID + basic */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="font-bold text-sm font-mono text-blue-800">{patient.patientId}</span>
          {isActive && (
            <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">目前</span>
          )}
        </div>
        <div className="text-xs text-slate-500 mb-1">
          {patient.age}歲 · {patient.sex === 'Male' ? '男' : '女'} · BMI {patient.bmi} · ASA {patient.asa}
        </div>
        <div className="text-sm font-medium text-slate-700 leading-tight mb-0.5">
          {patient.surgeryNameZh}
        </div>
        <div className="text-xs text-slate-400">{patient.surgeryNameEn}</div>
        <div className="text-xs text-slate-500 mt-0.5">
          體位：{POSITION_LABELS[patient.position].zh}
        </div>
      </div>
      {/* Badges */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${riskCfg.bg} ${riskCfg.text} ${riskCfg.border}`}>
          {riskCfg.labelChinese}
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${settingCfg.color}`}>
          {patient.careSetting}
        </span>
      </div>
    </button>
  );
};

const FilterRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-center gap-1.5 flex-wrap">
    <span className="text-[10px] text-slate-400 font-medium w-8 flex-shrink-0">{label}</span>
    <div className="flex gap-1 flex-wrap">{children}</div>
  </div>
);

const FilterChip: React.FC<{
  label: string; active: boolean; onClick: () => void; color?: string;
}> = ({ label, active, onClick, color }) => (
  <button
    onClick={onClick}
    className={`text-[10px] px-2 py-0.5 rounded-full border font-medium transition-colors ${
      active
        ? (color ?? 'bg-blue-700 text-white border-blue-700')
        : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
    }`}
  >
    {label}
  </button>
);

export default PatientListDrawer;
