// ============================================================
// SensorContext – global state for sensor data & demo control
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import type {
  SiteData,
  BodySite,
  PressureDataPoint,
  DemoScenario,
  InterventionRecord,
  InterventionType,
} from '../types';
import {
  MockSensorDataProvider,
  getSiteDataForScenario,
  generateSacrumHistory,
} from '../data/mockSensorData';

// ---- Context shape --------------------------------------------------------

interface SensorContextValue {
  // Current data
  siteData: SiteData[];
  selectedSite: BodySite;
  setSelectedSite: (site: BodySite) => void;
  pressureHistory: PressureDataPoint[];

  // Demo scenario control
  scenario: DemoScenario;
  setScenario: (scenario: DemoScenario) => void;

  // Intervention
  interventions: InterventionRecord[];
  isInterventionModalOpen: boolean;
  openInterventionModal: () => void;
  closeInterventionModal: () => void;
  confirmIntervention: (type: InterventionType) => void;
  isAnimatingDrop: boolean;

  // Derived helpers
  getSelectedSiteData: () => SiteData | undefined;

  // Surgery elapsed time (for demo)
  elapsedSeconds: number;
}

const SensorContext = createContext<SensorContextValue | null>(null);

// ---- Provider ---------------------------------------------------------------

export const SensorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const provider = useRef(new MockSensorDataProvider('high-pressure'));

  const [scenario, setScenarioState] = useState<DemoScenario>('high-pressure');
  const [siteData, setSiteData] = useState<SiteData[]>(
    provider.current.getLatestSiteData()
  );
  const [selectedSite, setSelectedSite] = useState<BodySite>('sacrum');
  const [pressureHistory, setPressureHistory] = useState<PressureDataPoint[]>(
    provider.current.getPressureHistory('sacrum')
  );
  const [interventions, setInterventions] = useState<InterventionRecord[]>([]);
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [isAnimatingDrop, setIsAnimatingDrop] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(3 * 3600 + 42 * 60 + 18);

  // Surgery clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const setScenario = useCallback((s: DemoScenario) => {
    setScenarioState(s);
    provider.current.setScenario(s);
    const data = getSiteDataForScenario(s);
    setSiteData(data);
    setPressureHistory(generateSacrumHistory(s, data));
    setSelectedSite('sacrum');
  }, []);

  // When selected site changes, refresh history
  useEffect(() => {
    setPressureHistory(provider.current.getPressureHistory(selectedSite));
  }, [selectedSite]);

  // Animate rising scenario – update sacrum pressure gradually
  useEffect(() => {
    if (scenario !== 'rising') return;
    let current = 40;
    const interval = setInterval(() => {
      current = Math.min(current + 1.5, 62);
      setSiteData((prev) =>
        prev.map((s) =>
          s.site === 'sacrum'
            ? {
                ...s,
                pressure: Math.round(current),
                status: current >= 55 ? 'caution' : 'stable',
                durationMin: s.durationMin + 0.1,
              }
            : s
        )
      );
      if (current >= 62) clearInterval(interval);
    }, 400);
    return () => clearInterval(interval);
  }, [scenario]);

  const openInterventionModal = () => setIsInterventionModalOpen(true);
  const closeInterventionModal = () => setIsInterventionModalOpen(false);

  const confirmIntervention = useCallback(
    (type: InterventionType) => {
      const sacrumData = siteData.find((s) => s.site === 'sacrum');
      const pressureBefore = sacrumData?.pressure ?? 82;
      const pressureAfter = 43;
      const reduction = Math.round(
        ((pressureBefore - pressureAfter) / pressureBefore) * 100 * 10
      ) / 10;

      const record: InterventionRecord = {
        id: Date.now().toString(),
        site: 'sacrum',
        timestamp: '14:32',
        interventionType: type,
        pressureBefore,
        pressureAfter,
        reduction,
      };

      setInterventions((prev) => [...prev, record]);
      setIsInterventionModalOpen(false);
      setIsAnimatingDrop(true);

      // Animate pressure drop: 82 → 75 → 66 → 54 → 43
      const steps = [75, 66, 54, 43];
      steps.forEach((val, idx) => {
        setTimeout(() => {
          setSiteData((prev) =>
            prev.map((s) => {
              if (s.site !== 'sacrum') return s;
              const newStatus: SiteData['status'] =
                val > 65 ? 'caution' : val > 50 ? 'caution' : 'stable';
              return { ...s, pressure: val, status: newStatus, trend: 'falling' };
            })
          );
          // Update history with falling tail
          if (idx === steps.length - 1) {
            setScenarioState('post-intervention');
            provider.current.setScenario('post-intervention');
            setPressureHistory(
              generateSacrumHistory(
                'post-intervention',
                getSiteDataForScenario('post-intervention')
              )
            );
            setIsAnimatingDrop(false);
          }
        }, (idx + 1) * 3000);
      });
    },
    [siteData]
  );

  const getSelectedSiteData = useCallback(
    () => siteData.find((s) => s.site === selectedSite),
    [siteData, selectedSite]
  );

  return (
    <SensorContext.Provider
      value={{
        siteData,
        selectedSite,
        setSelectedSite,
        pressureHistory,
        scenario,
        setScenario,
        interventions,
        isInterventionModalOpen,
        openInterventionModal,
        closeInterventionModal,
        confirmIntervention,
        isAnimatingDrop,
        getSelectedSiteData,
        elapsedSeconds,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};

// ---- Hook -------------------------------------------------------------------

export const useSensor = (): SensorContextValue => {
  const ctx = useContext(SensorContext);
  if (!ctx) throw new Error('useSensor must be used within SensorProvider');
  return ctx;
};
