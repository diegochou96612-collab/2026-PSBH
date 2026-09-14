// ============================================================
// RoleContext – care setting / role switcher for demo
// ============================================================

import React, { createContext, useContext, useState } from 'react';
import type { CareSetting, RolePermissions } from '../types';
import { CARE_SETTINGS, ROLE_PERMISSIONS } from '../types';

interface RoleContextValue {
  currentSetting: CareSetting;
  setCurrentSetting: (s: CareSetting) => void;
  config: typeof CARE_SETTINGS[CareSetting];
  permissions: RolePermissions;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSetting, setCurrentSetting] = useState<CareSetting>('OR');

  const config = CARE_SETTINGS[currentSetting];
  const permissions = ROLE_PERMISSIONS[currentSetting];

  return (
    <RoleContext.Provider value={{ currentSetting, setCurrentSetting, config, permissions }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextValue => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
};
