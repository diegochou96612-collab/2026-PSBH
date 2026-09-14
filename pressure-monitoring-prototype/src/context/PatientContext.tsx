// ============================================================
// PatientContext – multi-patient selection & simulation state
// ============================================================

import React, {
  createContext, useContext, useState, useEffect,
  useCallback, useRef,
} from 'react';
import type { MockPatient, PatientSiteData, SimulationSpeed, PressureStatus } from '../types';
import { MOCK_PATIENTS, PATIENT_MAP } from '../data/mockPatients';

interface PatientContextValue {
  // Patient selection
  patients: MockPatient[];
  currentPatient: MockPatient;
  setCurrentPatientId: (id: string) => void;

  // Live site data (may drift from base during simulation)
  liveSites: PatientSiteData[];
  selectedSiteId: string;
  setSelectedSiteId: (id: string) => void;
  getSelectedSite: () => PatientSiteData | undefined;

  // Simulation control
  simRunning: boolean;
  simSpeed: SimulationSpeed;
  startSim: () => void;
  pauseSim: () => void;
  setSimSpeed: (s: SimulationSpeed) => void;
  resetSim: () => void;

  // Patient elapsed clock
  elapsedSeconds: number;

  // Intervention helpers (Demo modal for current patient)
  isInterventionOpen: boolean;
  openIntervention: () => void;
  closeIntervention: () => void;
  confirmIntervention: (type: string) => void;
  interventions: { siteId: string; pressureBefore: number; pressureAfter: number; reduction: number; timestamp: string; type: string }[];
  isAnimatingDrop: boolean;
}

const PatientContext = createContext<PatientContextValue | null>(null);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPatientId, setCurrentPatientId] = useState('OR-2026-001');
  const [livePatients, setLivePatients] = useState<Record<string, PatientSiteData[]>>(() =>
    Object.fromEntries(MOCK_PATIENTS.map((p) => [p.patientId, [...p.pressureSites]]))
  );
  const [elapsedMap, setElapsedMap] = useState<Record<string, number>>(() =>
    Object.fromEntries(MOCK_PATIENTS.map((p) => [p.patientId, p.elapsedSeconds]))
  );
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [simRunning, setSimRunning] = useState(false);
  const [simSpeed, setSimSpeedState] = useState<SimulationSpeed>(1);
  const [isInterventionOpen, setIsInterventionOpen] = useState(false);
  const [interventions, setInterventions] = useState<PatientContextValue['interventions']>([]);
  const [isAnimatingDrop, setIsAnimatingDrop] = useState(false);
  const simInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPatient = PATIENT_MAP[currentPatientId] ?? MOCK_PATIENTS[0];
  const liveSites = livePatients[currentPatientId] ?? currentPatient.pressureSites;

  // Auto-select first (highest pressure) site when patient changes
  useEffect(() => {
    const sites = livePatients[currentPatientId] ?? currentPatient.pressureSites;
    const highest = [...sites].sort((a, b) => b.pressure - a.pressure)[0];
    setSelectedSiteId(highest?.siteId ?? sites[0]?.siteId ?? '');
  }, [currentPatientId]);

  // Surgery clock tick (for current patient only while simRunning)
  useEffect(() => {
    const t = setInterval(() => {
      setElapsedMap((prev) => ({
        ...prev,
        [currentPatientId]: prev[currentPatientId] + 1,
      }));
    }, 1000);
    return () => clearInterval(t);
  }, [currentPatientId]);

  // Simulation drift – update pressures gradually when running
  useEffect(() => {
    if (!simRunning) {
      if (simInterval.current) clearInterval(simInterval.current);
      return;
    }
    const tickMs = Math.round(1000 / simSpeed);
    simInterval.current = setInterval(() => {
      setLivePatients((prev) => {
        const sites = prev[currentPatientId] ?? [];
        const updated = sites.map((s) => {
          // Gentle drift: high-risk sites rise slightly, stable drift ±1
          let delta = 0;
          if (s.status === 'high-risk') delta = +(Math.random() * 1.5 - 0.3).toFixed(1);
          else if (s.status === 'caution') delta = +(Math.random() * 1.2 - 0.5).toFixed(1);
          else delta = +(Math.random() * 0.8 - 0.4).toFixed(1);
          const newPressure = Math.max(15, Math.min(115, s.pressure + delta));
          const newStatus: PressureStatus = newPressure >= 80 ? 'high-risk' : newPressure >= 55 ? 'caution' : 'stable';
          const newTrend: PatientSiteData['trend'] = delta > 0.2 ? 'rising' : delta < -0.2 ? 'falling' : 'stable';
          return { ...s, pressure: Math.round(newPressure * 10) / 10, status: newStatus, trend: newTrend };
        });
        return { ...prev, [currentPatientId]: updated };
      });
    }, tickMs);
    return () => { if (simInterval.current) clearInterval(simInterval.current); };
  }, [simRunning, simSpeed, currentPatientId]);

  const startSim = useCallback(() => setSimRunning(true), []);
  const pauseSim = useCallback(() => setSimRunning(false), []);
  const setSimSpeed = useCallback((s: SimulationSpeed) => setSimSpeedState(s), []);
  const resetSim = useCallback(() => {
    setSimRunning(false);
    setLivePatients(Object.fromEntries(
      MOCK_PATIENTS.map((p) => [p.patientId, [...p.pressureSites.map((s) => ({ ...s }))]])
    ));
    setElapsedMap(Object.fromEntries(MOCK_PATIENTS.map((p) => [p.patientId, p.elapsedSeconds])));
    setInterventions([]);
    setIsAnimatingDrop(false);
  }, []);

  const openIntervention = useCallback(() => setIsInterventionOpen(true), []);
  const closeIntervention = useCallback(() => setIsInterventionOpen(false), []);

  const confirmIntervention = useCallback((type: string) => {
    const site = liveSites.find((s) => s.siteId === selectedSiteId);
    const pressureBefore = site?.pressure ?? 80;
    const pressureAfter = Math.round(pressureBefore * 0.52);
    const reduction = Math.round((1 - pressureAfter / pressureBefore) * 1000) / 10;
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setInterventions((prev) => [...prev, { siteId: selectedSiteId, pressureBefore, pressureAfter, reduction, timestamp: ts, type }]);
    setIsInterventionOpen(false);
    setIsAnimatingDrop(true);
    setSimRunning(false);

    const steps = [
      Math.round(pressureBefore * 0.92),
      Math.round(pressureBefore * 0.80),
      Math.round(pressureBefore * 0.66),
      pressureAfter,
    ];
    steps.forEach((val, idx) => {
      setTimeout(() => {
        setLivePatients((prev) => {
          const sites = prev[currentPatientId] ?? [];
          return {
            ...prev,
            [currentPatientId]: sites.map((s) => {
              if (s.siteId !== selectedSiteId) return s;
              const newStatus = val >= 80 ? 'high-risk' : val >= 55 ? 'caution' : 'stable';
              return { ...s, pressure: val, status: newStatus, trend: 'falling' };
            }),
          };
        });
        if (idx === steps.length - 1) setIsAnimatingDrop(false);
      }, (idx + 1) * 2500);
    });
  }, [liveSites, selectedSiteId, currentPatientId]);

  const getSelectedSite = useCallback(
    () => liveSites.find((s) => s.siteId === selectedSiteId),
    [liveSites, selectedSiteId]
  );

  return (
    <PatientContext.Provider value={{
      patients: MOCK_PATIENTS,
      currentPatient,
      setCurrentPatientId,
      liveSites,
      selectedSiteId,
      setSelectedSiteId,
      getSelectedSite,
      simRunning,
      simSpeed,
      startSim,
      pauseSim,
      setSimSpeed,
      resetSim,
      elapsedSeconds: elapsedMap[currentPatientId] ?? currentPatient.elapsedSeconds,
      isInterventionOpen,
      openIntervention,
      closeIntervention,
      confirmIntervention,
      interventions,
      isAnimatingDrop,
    }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = (): PatientContextValue => {
  const ctx = useContext(PatientContext);
  if (!ctx) throw new Error('usePatient must be used within PatientProvider');
  return ctx;
};
