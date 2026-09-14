// ============================================================
// PostOpContext – cross-setting post-op records, photos, timeline
// All data is bound to patientId OR-2026-001 for demo.
// Photos are local blob URLs only – no server upload in prototype.
// ============================================================

import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  SkinRecord,
  TimelineEvent,
  PostOpBodySite,
  SkinObservation,
  CareSetting,
  TimelineEventType,
} from '../types';
import {
  INITIAL_SKIN_RECORDS,
  INITIAL_TIMELINE_EVENTS,
  PATIENT_ID,
} from '../data/mockPostOpData';
import { CARE_SETTINGS } from '../types';

interface PostOpContextValue {
  skinRecords: SkinRecord[];
  timelineEvents: TimelineEvent[];
  addSkinRecord: (params: {
    site: PostOpBodySite;
    careSetting: CareSetting;
    observations: SkinObservation[];
    nursingNote: string;
    photoPreviewUrl?: string;
    photoFileName?: string;
  }) => void;
  addTimelineEvent: (params: {
    time: string;
    type: TimelineEventType;
    careSetting: CareSetting;
    title: string;
    description: string;
    relatedSite?: string;
    photoPreviewUrl?: string;
    severity?: TimelineEvent['severity'];
  }) => void;
}

const PostOpContext = createContext<PostOpContextValue | null>(null);

export const PostOpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [skinRecords, setSkinRecords] = useState<SkinRecord[]>(INITIAL_SKIN_RECORDS);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(INITIAL_TIMELINE_EVENTS);

  const addSkinRecord = useCallback((params: {
    site: PostOpBodySite;
    careSetting: CareSetting;
    observations: SkinObservation[];
    nursingNote: string;
    photoPreviewUrl?: string;
    photoFileName?: string;
  }) => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const record: SkinRecord = {
      id: `sr-${Date.now()}`,
      patientId: PATIENT_ID,
      site: params.site,
      careSetting: params.careSetting,
      timestamp,
      observations: params.observations,
      nursingNote: params.nursingNote,
      photoPreviewUrl: params.photoPreviewUrl,
      photoFileName: params.photoFileName,
      recordedBy: CARE_SETTINGS[params.careSetting].roleLabel,
    };
    setSkinRecords((prev) => [record, ...prev]);

    // Auto-add to timeline
    const tEvent: TimelineEvent = {
      id: `te-${Date.now()}`,
      patientId: PATIENT_ID,
      time: timestamp,
      type: params.photoPreviewUrl ? 'photo-record' : 'skin-assessment',
      careSetting: params.careSetting,
      title: `${CARE_SETTINGS[params.careSetting].labelChinese}皮膚評估`,
      description: params.nursingNote || '護理人員完成皮膚評估記錄。',
      relatedSite: params.site,
      photoPreviewUrl: params.photoPreviewUrl,
      severity: params.observations.includes('skin-integrity-abnormal')
        ? 'high-risk'
        : params.observations.includes('persistent-erythema') || params.observations.includes('redness')
        ? 'caution'
        : 'info',
    };
    setTimelineEvents((prev) => [...prev, tEvent]);
  }, []);

  const addTimelineEvent = useCallback((params: {
    time: string;
    type: TimelineEventType;
    careSetting: CareSetting;
    title: string;
    description: string;
    relatedSite?: string;
    photoPreviewUrl?: string;
    severity?: TimelineEvent['severity'];
  }) => {
    const event: TimelineEvent = {
      id: `te-${Date.now()}`,
      patientId: PATIENT_ID,
      ...params,
    };
    setTimelineEvents((prev) => [...prev, event]);
  }, []);

  return (
    <PostOpContext.Provider value={{ skinRecords, timelineEvents, addSkinRecord, addTimelineEvent }}>
      {children}
    </PostOpContext.Provider>
  );
};

export const usePostOp = (): PostOpContextValue => {
  const ctx = useContext(PostOpContext);
  if (!ctx) throw new Error('usePostOp must be used within PostOpProvider');
  return ctx;
};
