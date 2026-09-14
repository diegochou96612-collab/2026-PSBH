// ============================================================
// App v3 – Multi-patient simulation database + role-based views
// Smart Intraoperative Pressure Injury Monitoring System
// ============================================================

import React, { useState } from 'react';
import { SensorProvider } from './context/SensorContext';
import { RoleProvider, useRole } from './context/RoleContext';
import { PostOpProvider } from './context/PostOpContext';
import { PatientProvider } from './context/PatientContext';

// Layout
import Header from './components/Header';
import CareJourneyBar from './components/CareJourneyBar';
import CurrentPatientBanner from './components/CurrentPatientBanner';
import Footer from './components/Footer';

// OR Dashboard components (v2 – PatientContext)
import PatientInfoPanelV2 from './components/PatientInfoPanelV2';
import BodyMapV2 from './components/BodyMapV2';
import PressureDetailPanelV2 from './components/PressureDetailPanelV2';
import SimControlPanel from './components/SimControlPanel';
import InterventionModalV2 from './components/InterventionModalV2';

// Tabs
import PostOpFollowUpTab from './components/PostOpFollowUpTab';
import PostOpTab from './components/PostOpTab';
import HistoryTab from './components/HistoryTab';
import PreopRiskTab from './components/PreopRiskTab';

// Role-specific views
import PACUView from './components/views/PACUView';
import ICUView from './components/views/ICUView';
import WardView from './components/views/WardView';
import OutpatientView from './components/views/OutpatientView';

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------
type Tab = 'preop' | 'dashboard' | 'followup' | 'postop' | 'history';

const TAB_LABELS: Record<Tab, { zh: string; en: string }> = {
  preop:     { zh: '術前分析', en: 'Pre-op Risk' },
  dashboard: { zh: '即時監測', en: 'Live Monitoring' },
  followup:  { zh: '術後追蹤', en: 'Post-op Follow-up' },
  postop:    { zh: '手術摘要', en: 'Surgery Summary' },
  history:   { zh: '歷史紀錄', en: 'History & CQI' },
};

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------
const App: React.FC = () => (
  <PatientProvider>
    <RoleProvider>
      <SensorProvider>
        <PostOpProvider>
          <AppShell />
        </PostOpProvider>
      </SensorProvider>
    </RoleProvider>
  </PatientProvider>
);

// ---------------------------------------------------------------------------
// AppShell
// ---------------------------------------------------------------------------
const AppShell: React.FC = () => {
  const { currentSetting, permissions } = useRole();
  const [activeTab, setActiveTab] = useState<Tab>('preop');

  React.useEffect(() => {
    setActiveTab('preop');
  }, [currentSetting]);

  const visibleTabs: Tab[] = ['preop', 'dashboard', 'followup'];
  if (currentSetting === 'OR') visibleTabs.push('postop');
  if (permissions.canViewHistory) visibleTabs.push('history');

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8]">
      <Header />
      <CareJourneyBar />
      <CurrentPatientBanner />

      {/* Tab nav */}
      <nav className="bg-white border-b border-slate-200 px-6">
        <div className="flex">
          {visibleTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === tab ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <span>{TAB_LABELS[tab].zh}</span>
              <span className="text-xs opacity-50 hidden sm:inline">{TAB_LABELS[tab].en}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 overflow-auto">
        {activeTab === 'preop' && (
          <div className="max-w-7xl mx-auto px-4 py-4">
            <PreopRiskTab />
          </div>
        )}
        {activeTab === 'dashboard' && <RoleDashboard setting={currentSetting} />}
        {activeTab === 'followup' && (
          <div className="max-w-7xl mx-auto px-4 py-4">
            <PostOpFollowUpTab />
          </div>
        )}
        {activeTab === 'postop' && (
          <div className="max-w-7xl mx-auto px-4 py-4">
            <PostOpTab />
          </div>
        )}
        {activeTab === 'history' && (
          <div className="max-w-7xl mx-auto px-4 py-4">
            <HistoryTab />
          </div>
        )}
      </main>

      <Footer />
      <InterventionModalV2 />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Role-based dashboard routing
// ---------------------------------------------------------------------------
const RoleDashboard: React.FC<{ setting: string }> = ({ setting }) => {
  switch (setting) {
    case 'OR':         return <ORDashboard />;
    case 'PACU':       return <PACUView />;
    case 'ICU':        return <ICUView />;
    case 'Ward':       return <WardView />;
    case 'Outpatient': return <OutpatientView />;
    default:           return <ORDashboard />;
  }
};

// ---------------------------------------------------------------------------
// OR Dashboard – full live monitoring, now powered by PatientContext
// ---------------------------------------------------------------------------
const ORDashboard: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
    {/* OR role banner */}
    <div className="flex items-center gap-2 bg-blue-700/10 border border-blue-200 rounded-xl px-4 py-2">
      <div className="w-5 h-5 bg-blue-700 rounded flex items-center justify-center flex-shrink-0">
        <span className="text-white text-[9px] font-bold">OR</span>
      </div>
      <span className="text-sm font-semibold text-blue-700">開刀房 Operating Room</span>
      <span className="text-xs text-blue-500">— 術中即時壓力監測介面</span>
    </div>

    {/* Three-panel layout */}
    <div className="grid grid-cols-12 gap-3" style={{ minHeight: '490px' }}>
      <div className="col-span-12 md:col-span-3">
        <PatientInfoPanelV2 />
      </div>
      <div className="col-span-12 md:col-span-5">
        <BodyMapV2 />
      </div>
      <div className="col-span-12 md:col-span-4">
        <PressureDetailPanelV2 />
      </div>
    </div>

    {/* Simulation control */}
    <SimControlPanel />
  </div>
);

export default App;
