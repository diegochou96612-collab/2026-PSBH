// ============================================================
// PreopRiskTab – Pre-operative Risk Assessment (3-step flow)
//
// Step 1: Input patient & surgical data
// Step 2: Analysis animation + result + risk map
// Step 3: Precision protection setup → enter live monitoring
//
// ⚠ AI-assisted Risk Analysis — Research Prototype
// Rule-based engine; not a clinically validated AI model.
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { analyzePreopRisk, DEFAULT_PREOP_INPUT } from '../data/PreopRiskEngine';
import type {
  PreopInput, PreopRiskResult, SiteRiskLevel,
  SurgicalPositionInput,
} from '../data/PreopRiskEngine';

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

const POSITIONS: { value: SurgicalPositionInput; zhLabel: string }[] = [
  { value: 'Supine',     zhLabel: '仰臥位 Supine' },
  { value: 'Prone',      zhLabel: '俯臥位 Prone' },
  { value: 'Lateral',    zhLabel: '側臥位 Lateral' },
  { value: 'Lithotomy',  zhLabel: '截石位 Lithotomy' },
  { value: 'BeachChair', zhLabel: '沙灘椅位 Beach Chair' },
];

const RISK_STYLE: Record<SiteRiskLevel, { bg: string; text: string; border: string; dot: string; label: string }> = {
  high:     { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-300',    dot: 'bg-red-500',    label: '高風險' },
  moderate: { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-300',  dot: 'bg-amber-500',  label: '優先關注' },
  low:      { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-300',  dot: 'bg-green-500',  label: '一般監測' },
};

const OVERALL_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  Critical: { bg: 'bg-red-100',   text: 'text-red-900',   border: 'border-red-400' },
  High:     { bg: 'bg-red-50',    text: 'text-red-700',   border: 'border-red-300' },
  Moderate: { bg: 'bg-amber-50',  text: 'text-amber-700', border: 'border-amber-300' },
  Low:      { bg: 'bg-green-50',  text: 'text-green-700', border: 'border-green-300' },
};

const OVERALL_ZH: Record<string, string> = {
  Critical: '極高風險',
  High:     '高風險',
  Moderate: '注意',
  Low:      '低風險',
};

// SVG positions for each site on Supine posterior outline
type Pt = { x: number; y: number };
const SITE_SVG_POS: Record<string, Pt> = {
  // Supine
  occiput:             { x: 350, y: 105 },
  'left-scapula':      { x: 270, y: 230 },
  'right-scapula':     { x: 430, y: 230 },
  sacrum:              { x: 350, y: 530 },
  'left-heel':         { x: 278, y: 830 },
  'right-heel':        { x: 422, y: 830 },
  // Prone
  forehead:            { x: 350, y: 105 },
  chest:               { x: 350, y: 270 },
  'iliac-crest':       { x: 350, y: 480 },
  'left-knee':         { x: 280, y: 680 },
  'right-knee':        { x: 420, y: 680 },
  feet:                { x: 350, y: 840 },
  // Lateral
  ear:                 { x: 350, y: 95 },
  shoulder:            { x: 220, y: 230 },
  'greater-trochanter':{ x: 220, y: 500 },
  knee:                { x: 230, y: 650 },
  'lateral-malleolus': { x: 240, y: 800 },
  // Lithotomy / Beach
  scapula:             { x: 350, y: 230 },
  calf:                { x: 350, y: 720 },
  heel:                { x: 350, y: 840 },
};

const RISK_FILL: Record<SiteRiskLevel, string> = {
  high:     '#ef4444',
  moderate: '#f59e0b',
  low:      '#22c55e',
};

// ---------------------------------------------------------------------------
// Analysis animation messages
// ---------------------------------------------------------------------------
const ANALYSIS_STEPS = [
  'Analyzing patient factors...',
  'Evaluating BMI and comorbidities...',
  'Analyzing surgical position...',
  'Estimating pressure duration risk...',
  'Identifying pressure-prone anatomical areas...',
  'Generating personalized risk map...',
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
type FlowStep = 'input' | 'analyzing' | 'result' | 'setup';

const PreopRiskTab: React.FC = () => {
  const [step, setStep] = useState<FlowStep>('input');
  const [input, setInput] = useState<PreopInput>({ ...DEFAULT_PREOP_INPUT });
  const [result, setResult] = useState<PreopRiskResult | null>(null);
  const [analysisMsg, setAnalysisMsg] = useState(0);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  // Protection setup state
  const [protectedSites, setProtectedSites] = useState<Set<string>>(new Set());
  const [setupDone, setSetupDone] = useState(false);

  const analysisTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Run analysis animation then compute result
  const startAnalysis = () => {
    setStep('analyzing');
    setAnalysisMsg(0);
    let idx = 0;
    analysisTimer.current = setInterval(() => {
      idx++;
      setAnalysisMsg(idx);
      if (idx >= ANALYSIS_STEPS.length) {
        clearInterval(analysisTimer.current!);
        setTimeout(() => {
          const r = analyzePreopRisk(input);
          setResult(r);
          // Pre-check high & moderate sites in protection setup
          const defaults = new Set(r.siteRisks.filter((s) => s.risk !== 'low').map((s) => s.siteId));
          setProtectedSites(defaults);
          setSelectedSiteId(r.siteRisks.find((s) => s.risk === 'high')?.siteId ?? null);
          setSetupDone(false);
          setStep('result');
        }, 400);
      }
    }, 280);
  };

  useEffect(() => () => { if (analysisTimer.current) clearInterval(analysisTimer.current); }, []);

  const resetFlow = () => {
    setStep('input');
    setResult(null);
    setSelectedSiteId(null);
    setSetupDone(false);
  };

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">術前風險預測</h2>
          <p className="text-sm text-slate-500">Pre-operative Risk Prediction</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-violet-100 text-violet-700 border border-violet-300 px-2 py-1 rounded font-semibold">
            AI-assisted Risk Analysis
          </span>
          <span className="text-xs bg-amber-100 text-amber-700 border border-amber-300 px-2 py-1 rounded font-semibold">
            Research Prototype
          </span>
        </div>
      </div>

      {/* AI disclaimer */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <line x1="8" y1="7" x2="8" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="5" r="0.7" fill="currentColor" />
          </svg>
          <p className="text-xs text-violet-700">
            <span className="font-semibold">AI-assisted Risk Analysis — Research Prototype</span><br />
            目前 Prototype 採規則式風險引擎模擬；未來將結合臨床資料與術後 outcome 建立個人化風險預測模型。
            本分析結果不作為臨床診斷或治療依據。
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <StepBar current={step} />

      {/* ---- STEP 1: Input ---- */}
      {step === 'input' && (
        <InputStep
          input={input}
          setInput={setInput}
          onAnalyze={startAnalysis}
        />
      )}

      {/* ---- STEP 2a: Analyzing animation ---- */}
      {step === 'analyzing' && (
        <AnalyzingStep currentMsgIdx={analysisMsg} />
      )}

      {/* ---- STEP 2b: Result ---- */}
      {step === 'result' && result && (
        <ResultStep
          input={input}
          result={result}
          selectedSiteId={selectedSiteId}
          setSelectedSiteId={setSelectedSiteId}
          onContinue={() => setStep('setup')}
          onReset={resetFlow}
        />
      )}

      {/* ---- STEP 3: Protection setup ---- */}
      {step === 'setup' && result && (
        <SetupStep
          result={result}
          protectedSites={protectedSites}
          setProtectedSites={setProtectedSites}
          setupDone={setupDone}
          setSetupDone={setSetupDone}
          onBack={() => setStep('result')}
          onReset={resetFlow}
        />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Step bar
// ---------------------------------------------------------------------------
const STEP_LABELS = [
  { key: 'input',    zh: '1. 輸入資料',   en: 'Patient Data' },
  { key: 'result',   zh: '2. 風險分析',   en: 'Risk Analysis' },
  { key: 'setup',    zh: '3. 防護配置',   en: 'Protection Setup' },
];

const StepBar: React.FC<{ current: FlowStep }> = ({ current }) => {
  const activeIdx =
    current === 'input' || current === 'analyzing' ? 0 :
    current === 'result' ? 1 : 2;

  return (
    <div className="flex items-center gap-0 bg-white rounded-xl border border-slate-200 px-6 py-3">
      {STEP_LABELS.map((s, i) => (
        <React.Fragment key={s.key}>
          <div className={`flex items-center gap-2 ${i < activeIdx ? 'opacity-60' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
              i < activeIdx
                ? 'bg-slate-300 text-white border-transparent'
                : i === activeIdx
                ? 'bg-blue-700 text-white border-blue-700 ring-2 ring-blue-200'
                : 'bg-white text-slate-400 border-slate-300'
            }`}>
              {i < activeIdx ? '✓' : i + 1}
            </div>
            <div>
              <div className={`text-sm font-semibold ${i === activeIdx ? 'text-blue-700' : 'text-slate-500'}`}>
                {s.zh}
              </div>
              <div className="text-[10px] text-slate-400">{s.en}</div>
            </div>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className={`flex-1 h-px mx-4 ${i < activeIdx ? 'bg-slate-400' : 'bg-slate-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Step 1: Input form
// ---------------------------------------------------------------------------
const InputStep: React.FC<{
  input: PreopInput;
  setInput: React.Dispatch<React.SetStateAction<PreopInput>>;
  onAnalyze: () => void;
}> = ({ input, setInput, onAnalyze }) => {
  const set = <K extends keyof PreopInput>(k: K, v: PreopInput[K]) =>
    setInput((p) => ({ ...p, [k]: v }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Patient Factors */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-700 text-white rounded flex items-center justify-center text-xs font-bold">P</span>
          Patient Factors 病人因素
        </h3>

        <div className="space-y-3">
          <FormRow label="年齡 Age">
            <div className="flex items-center gap-2">
              <input
                type="number" min={1} max={120}
                value={input.age}
                onChange={(e) => set('age', Number(e.target.value))}
                className="w-24 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-sm text-slate-500">歲</span>
            </div>
          </FormRow>

          <FormRow label="BMI">
            <div className="flex items-center gap-2">
              <input
                type="number" min={10} max={60} step={0.1}
                value={input.bmi}
                onChange={(e) => set('bmi', parseFloat(e.target.value))}
                className="w-24 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                input.bmi < 18.5 ? 'bg-red-100 text-red-700' :
                input.bmi > 30   ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }`}>
                {input.bmi < 18.5 ? '過輕' : input.bmi > 30 ? '過重' : '正常'}
              </span>
            </div>
          </FormRow>

          <FormRow label="糖尿病 Diabetes">
            <ToggleSwitch value={input.diabetes} onChange={(v) => set('diabetes', v)} />
          </FormRow>

          <FormRow label="活動能力受限">
            <ToggleSwitch value={input.mobilityImpaired} onChange={(v) => set('mobilityImpaired', v)} />
          </FormRow>

          <FormRow label="術前皮膚異常">
            <ToggleSwitch value={input.skinConditionAbnormal} onChange={(v) => set('skinConditionAbnormal', v)} />
          </FormRow>

          <FormRow label="ASA 分級">
            <div className="flex gap-1.5">
              {(['I', 'II', 'III', 'IV'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => set('asa', v)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border-2 transition-colors ${
                    input.asa === v
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </FormRow>
        </div>
      </div>

      {/* Surgical Factors */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-teal-600 text-white rounded flex items-center justify-center text-xs font-bold">S</span>
          Surgical Factors 手術因素
        </h3>

        <div className="space-y-3">
          <FormRow label="手術類型 Surgery Type">
            <input
              type="text"
              value={input.surgeryType}
              onChange={(e) => set('surgeryType', e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </FormRow>

          <FormRow label="手術體位 Position">
            <div className="flex flex-wrap gap-1.5">
              {POSITIONS.map(({ value, zhLabel }) => (
                <button
                  key={value}
                  onClick={() => set('position', value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border-2 transition-colors ${
                    input.position === value
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {zhLabel}
                </button>
              ))}
            </div>
          </FormRow>

          <FormRow label="預估時間 Duration">
            <div className="flex items-center gap-2">
              <input
                type="number" min={0.5} max={16} step={0.5}
                value={input.estimatedHours}
                onChange={(e) => set('estimatedHours', parseFloat(e.target.value))}
                className="w-24 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-sm text-slate-500">hr</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                input.estimatedHours >= 6 ? 'bg-red-100 text-red-700' :
                input.estimatedHours >= 4 ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }`}>
                {input.estimatedHours >= 6 ? '長時間' : input.estimatedHours >= 4 ? '較長' : '一般'}
              </span>
            </div>
          </FormRow>

          <FormRow label="高出血風險">
            <ToggleSwitch value={input.highBloodLossRisk} onChange={(v) => set('highBloodLossRisk', v)} />
          </FormRow>
        </div>

        {/* Demo data note */}
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <p className="text-[10px] text-slate-400">
            Demo 預設資料：Age 72 · BMI 18.6 · 糖尿病 Yes · 心臟手術 · Supine · 6 hr · ASA III
          </p>
        </div>
      </div>

      {/* Analyze button */}
      <div className="md:col-span-2">
        <button
          onClick={onAnalyze}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-base py-4 rounded-xl transition-colors flex items-center justify-center gap-3 shadow-md"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
            <path d="M6 10h8M10 6v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          開始術前風險分析
          <span className="text-blue-200 text-sm font-normal">Analyze Preoperative Risk</span>
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Step 2a: Analyzing animation
// ---------------------------------------------------------------------------
const AnalyzingStep: React.FC<{ currentMsgIdx: number }> = ({ currentMsgIdx }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 flex flex-col items-center gap-6">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
      <div className="absolute inset-0 rounded-full border-4 border-t-blue-700 border-r-blue-700 border-b-transparent border-l-transparent animate-spin" />
      <div className="absolute inset-3 rounded-full bg-blue-50 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" stroke="#1d4ed8" strokeWidth="1.5" />
          <path d="M12 8v4l2.5 2.5" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>

    <div className="text-center">
      <div className="text-base font-semibold text-slate-700 mb-1">分析中 Analyzing…</div>
      <div className="text-sm text-blue-600 font-medium min-h-[20px]">
        {ANALYSIS_STEPS[Math.min(currentMsgIdx, ANALYSIS_STEPS.length - 1)]}
      </div>
    </div>

    {/* Progress dots */}
    <div className="flex gap-1.5">
      {ANALYSIS_STEPS.map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-colors ${
            i <= currentMsgIdx ? 'bg-blue-600' : 'bg-slate-200'
          }`}
        />
      ))}
    </div>

    <p className="text-xs text-slate-400 text-center max-w-sm">
      規則式風險引擎根據病人因素、手術姿勢與預估手術時間計算個人化壓傷風險…
    </p>
  </div>
);

// ---------------------------------------------------------------------------
// Step 2b: Result
// ---------------------------------------------------------------------------
const ResultStep: React.FC<{
  input: PreopInput;
  result: PreopRiskResult;
  selectedSiteId: string | null;
  setSelectedSiteId: (id: string | null) => void;
  onContinue: () => void;
  onReset: () => void;
}> = ({ input, result, selectedSiteId, setSelectedSiteId, onContinue, onReset }) => {
  const overall = OVERALL_STYLE[result.overallRisk];
  const selectedSite = result.siteRisks.find((s) => s.siteId === selectedSiteId);

  return (
    <div className="space-y-4">
      {/* Overall risk banner */}
      <div className={`rounded-xl border-2 px-5 py-4 flex items-center justify-between ${overall.bg} ${overall.border}`}>
        <div>
          <div className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${overall.text}`}>
            術前整體風險評估 Overall Preoperative Risk
          </div>
          <div className={`text-2xl font-bold ${overall.text}`}>
            {OVERALL_ZH[result.overallRisk]}
            <span className="ml-2 text-base font-normal opacity-70">({result.overallRisk})</span>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold tabular-nums ${overall.text}`}>{result.riskScore}</div>
          <div className={`text-xs ${overall.text} opacity-70`}>Demo Risk Score</div>
        </div>
      </div>

      {/* Primary factors */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-sm font-bold text-slate-700 mb-3">主要風險因子 Primary Risk Factors</h3>
        <div className="flex flex-wrap gap-2">
          {result.primaryFactors.map((f) => (
            <span key={f} className="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-2.5 py-1 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Risk map + detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: risk map */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-700">
              術前個人化風險地圖
            </h3>
            <span className="text-[10px] bg-violet-100 text-violet-700 px-2 py-0.5 rounded border border-violet-200 font-semibold">
              術前預估風險
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2">
            體位：{input.position} · 點擊部位查看詳細原因
          </p>
          <div className="flex items-center gap-3 mb-2 text-xs text-slate-500">
            <LegendDot color="#ef4444" label="高風險" />
            <LegendDot color="#f59e0b" label="優先關注" />
            <LegendDot color="#22c55e" label="一般監測" />
          </div>
          <div className="flex items-center justify-center">
            <PreopBodyMap
              position={input.position}
              siteRisks={result.siteRisks}
              selectedSiteId={selectedSiteId}
              onSelect={setSelectedSiteId}
            />
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-1">
            ⚠ 此為「術前預估風險」，非術中即時壓力感測結果
          </p>
        </div>

        {/* Right: site detail or priority list */}
        <div className="space-y-3">
          {/* Site detail card */}
          {selectedSite ? (
            <div className={`rounded-xl border p-4 ${RISK_STYLE[selectedSite.risk].bg} ${RISK_STYLE[selectedSite.risk].border}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className={`text-base font-bold ${RISK_STYLE[selectedSite.risk].text}`}>
                    {selectedSite.labelChinese}
                    <span className="ml-2 text-sm font-normal opacity-70">{selectedSite.label}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 mt-0.5`}>
                    <span className={`w-2 h-2 rounded-full ${RISK_STYLE[selectedSite.risk].dot}`} />
                    <span className={`text-xs font-semibold ${RISK_STYLE[selectedSite.risk].text}`}>
                      術前預估：{RISK_STYLE[selectedSite.risk].label}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-600 mb-1.5">主要風險因素：</div>
              <ul className="space-y-1 mb-3">
                {selectedSite.reasons.map((r) => (
                  <li key={r} className="flex items-start gap-1.5 text-xs text-slate-700">
                    <span className={`mt-0.5 flex-shrink-0 ${RISK_STYLE[selectedSite.risk].text}`}>✓</span>
                    {r}
                  </li>
                ))}
              </ul>
              {selectedSite.risk !== 'low' && (
                <div className={`text-xs font-semibold ${RISK_STYLE[selectedSite.risk].text} border-t pt-2 mt-2`}
                  style={{ borderColor: 'currentColor', opacity: 0.4, borderTopStyle: 'solid' }}>
                  <span style={{ opacity: 1 }}>
                    建議列為{selectedSite.risk === 'high' ? '優先防護' : '加強觀察'}與術中監測部位
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center text-slate-400 text-sm">
              點擊左側人體圖部位查看風險詳情
            </div>
          )}

          {/* Priority protection list */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h3 className="text-sm font-bold text-slate-700 mb-3">
              優先防護部位 Priority Protection Areas
            </h3>
            {result.priorityList.length === 0 ? (
              <p className="text-sm text-green-600">所有部位為低風險，依常規防護即可。</p>
            ) : (
              <div className="space-y-2">
                {result.priorityList.map((p) => (
                  <div
                    key={p.siteId}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${RISK_STYLE[p.risk].bg} ${RISK_STYLE[p.risk].border} cursor-pointer`}
                    onClick={() => setSelectedSiteId(p.siteId)}
                  >
                    <span className={`w-6 h-6 rounded-full ${RISK_STYLE[p.risk].dot} text-white text-xs flex items-center justify-center font-bold flex-shrink-0`}>
                      {p.rank}
                    </span>
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${RISK_STYLE[p.risk].text}`}>
                        {p.labelChinese}
                        <span className="ml-1 text-xs opacity-60">{p.label}</span>
                      </div>
                      <div className="text-xs text-slate-500">{p.action}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${RISK_STYLE[p.risk].bg} ${RISK_STYLE[p.risk].text} ${RISK_STYLE[p.risk].border}`}>
                      {RISK_STYLE[p.risk].label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
        >
          ← 重新輸入
        </button>
        <button
          onClick={onContinue}
          className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold text-base py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          進入精準防護配置
          <span className="text-blue-200 text-sm font-normal">Continue to Precision Protection →</span>
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Step 3: Protection setup
// ---------------------------------------------------------------------------
const SetupStep: React.FC<{
  result: PreopRiskResult;
  protectedSites: Set<string>;
  setProtectedSites: React.Dispatch<React.SetStateAction<Set<string>>>;
  setupDone: boolean;
  setSetupDone: (v: boolean) => void;
  onBack: () => void;
  onReset: () => void;
}> = ({ result, protectedSites, setProtectedSites, setupDone, setSetupDone, onBack, onReset }) => {
  const toggle = (id: string) => {
    setProtectedSites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <div className="font-semibold text-blue-700 text-sm mb-0.5">
          精準防護配置 Precision Protection Setup
        </div>
        <p className="text-xs text-blue-600">
          依術前分析結果，系統已識別需優先防護的部位。請確認防護配置後進入術中即時監測。
        </p>
      </div>

      {/* Analysis summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="text-sm font-bold text-slate-700 mb-3">術前分析識別結果</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          {(['high', 'moderate', 'low'] as SiteRiskLevel[]).map((r) => {
            const count = result.siteRisks.filter((s) => s.risk === r).length;
            return (
              <div key={r} className={`rounded-lg border p-2.5 ${RISK_STYLE[r].bg} ${RISK_STYLE[r].border}`}>
                <div className={`text-2xl font-bold ${RISK_STYLE[r].text}`}>{count}</div>
                <div className={`text-xs font-medium ${RISK_STYLE[r].text}`}>{RISK_STYLE[r].label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Protection checklist */}
      {!setupDone ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h3 className="text-sm font-bold text-slate-700 mb-1">防護配置清單</h3>
          <p className="text-xs text-slate-500 mb-3">
            依術前分析結果，建議優先於以下部位配置防護與監測。
          </p>

          {/* High risk first */}
          {(['high', 'moderate', 'low'] as SiteRiskLevel[]).map((r) => {
            const sites = result.siteRisks.filter((s) => s.risk === r);
            if (sites.length === 0) return null;
            return (
              <div key={r} className="mb-4">
                <div className={`text-xs font-bold uppercase tracking-wide mb-2 ${RISK_STYLE[r].text}`}>
                  {RISK_STYLE[r].label}
                </div>
                <div className="space-y-2">
                  {sites.map((s) => (
                    <label
                      key={s.siteId}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 cursor-pointer transition-colors ${
                        protectedSites.has(s.siteId)
                          ? `${RISK_STYLE[r].bg} ${RISK_STYLE[r].border}`
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={protectedSites.has(s.siteId)}
                        onChange={() => toggle(s.siteId)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <div className="flex-1">
                        <span className={`text-sm font-semibold ${protectedSites.has(s.siteId) ? RISK_STYLE[r].text : 'text-slate-600'}`}>
                          {s.labelChinese}
                        </span>
                        <span className="text-xs text-slate-400 ml-1.5">{s.label}</span>
                      </div>
                      {r === 'high' && (
                        <span className="text-xs text-slate-500">減壓防護 ＋ 壓力感測</span>
                      )}
                      {r === 'moderate' && (
                        <span className="text-xs text-slate-500">加強防護</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="flex gap-3 mt-4">
            <button onClick={onBack}
              className="border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm px-4 py-2.5 rounded-lg font-medium">
              ← 返回分析結果
            </button>
            <button
              onClick={() => setSetupDone(true)}
              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm py-2.5 rounded-xl transition-colors"
            >
              確認防護配置 Confirm Setup
            </button>
          </div>
        </div>
      ) : (
        /* Setup confirmed */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 slide-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600 text-xl">✓</span>
              <span className="font-bold text-green-700">防護配置已確認</span>
            </div>
            <div className="text-sm text-slate-600 mb-2">
              已配置 {protectedSites.size} 個監測部位：
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.siteRisks
                .filter((s) => protectedSites.has(s.siteId))
                .map((s) => (
                  <span key={s.siteId} className={`text-xs font-medium px-2 py-0.5 rounded-full border ${RISK_STYLE[s.risk].bg} ${RISK_STYLE[s.risk].text} ${RISK_STYLE[s.risk].border}`}>
                    {s.labelChinese}
                  </span>
                ))}
            </div>
          </div>

          {/* Next step: enter live monitoring */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <div className="text-sm font-semibold text-blue-700 mb-1">下一步：術中即時監測</div>
            <p className="text-xs text-blue-600">
              防護配置完成。術中監測系統將依據此配置，對已標記的高風險部位進行優先監測與壓力警示。
            </p>
            <p className="text-xs text-slate-400 mt-1">
              請切換至「即時監測」頁籤進入術中 Dashboard。
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={onReset}
              className="border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm px-4 py-2.5 rounded-lg font-medium">
              重新開始分析
            </button>
            <div className="flex-1 bg-slate-100 border border-slate-300 text-slate-500 font-medium text-sm py-2.5 rounded-xl flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v6l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              請切換至「即時監測」頁籤
            </div>
          </div>
        </div>
      )}

      {/* Demo story note */}
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl px-4 py-3">
        <p className="text-xs text-slate-500 text-center">
          <span className="font-semibold">Prototype Demo Story：</span>
          術前風險分析 → 個人化風險地圖 → 防護配置 → 術中即時監測 → 壓力警示 → 介入 → 驗證壓力下降 → 術後追蹤
        </p>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// PreopBodyMap – SVG body diagram for pre-op risk visualization
// ---------------------------------------------------------------------------
const PreopBodyMap: React.FC<{
  position: SurgicalPositionInput;
  siteRisks: import('../data/PreopRiskEngine').SiteRiskResult[];
  selectedSiteId: string | null;
  onSelect: (id: string) => void;
}> = ({ position, siteRisks, selectedSiteId, onSelect }) => (
  <svg
    viewBox="60 30 580 870"
    style={{ width: '100%', maxHeight: '360px' }}
    aria-label="術前個人化風險地圖"
  >
    {/* Simple neutral body outline */}
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

    {/* Position label */}
    <text x="350" y="28" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600"
      style={{ userSelect: 'none' }}>
      {position} · 術前預估風險地圖
    </text>

    {/* Risk markers */}
    {siteRisks.map((s) => {
      const pos = SITE_SVG_POS[s.siteId];
      if (!pos) return null;
      const fill = RISK_FILL[s.risk];
      const isSelected = s.siteId === selectedSiteId;
      return (
        <g key={s.siteId}
          role="button" tabIndex={0}
          aria-label={`${s.labelChinese} ${s.risk}`}
          onClick={() => onSelect(s.siteId)}
          onKeyDown={(e) => e.key === 'Enter' && onSelect(s.siteId)}
          style={{ cursor: 'pointer' }}
        >
          {/* Static shadow ring – no animation */}
          <circle
            cx={pos.x} cy={pos.y} r={18}
            fill="none"
            stroke={fill}
            strokeWidth={isSelected ? 2.5 : 1.5}
            opacity={isSelected ? 0.5 : 0.25}
          />
          {/* Main marker – fixed, no animation */}
          <circle
            cx={pos.x} cy={pos.y} r={14}
            fill={fill}
            stroke={isSelected ? '#1e40af' : 'white'}
            strokeWidth={isSelected ? 3 : 2}
          />
          <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fontWeight="700" fill="white"
            style={{ pointerEvents: 'none', userSelect: 'none' }}>
            {s.risk === 'high' ? '!' : s.risk === 'moderate' ? '▲' : '✓'}
          </text>
          <text x={pos.x} y={pos.y + 26} textAnchor="middle"
            fontSize="9.5" fontWeight="600" fill={fill}
            style={{ pointerEvents: 'none', userSelect: 'none' }}>
            {s.labelChinese}
          </text>
        </g>
      );
    })}
  </svg>
);

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
const FormRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-start justify-between gap-3">
    <label className="text-sm text-slate-600 font-medium pt-1.5 flex-shrink-0 w-32">{label}</label>
    <div className="flex-1">{children}</div>
  </div>
);

const ToggleSwitch: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={`relative w-10 h-6 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-slate-300'}`}
    role="switch" aria-checked={value}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : ''}`} />
  </button>
);

const LegendDot: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <span className="flex items-center gap-1">
    <span style={{ backgroundColor: color }} className="w-2.5 h-2.5 rounded-full flex-shrink-0" />
    {label}
  </span>
);

export default PreopRiskTab;
