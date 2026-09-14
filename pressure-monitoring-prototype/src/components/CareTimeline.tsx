// ============================================================
// CareTimeline – cross-setting care journey event timeline
// Links intra-op pressure events with post-op skin records.
// ============================================================

import React, { useState } from 'react';
import type { TimelineEvent, CareSetting } from '../types';
import { CARE_SETTINGS } from '../types';
import { usePostOp } from '../context/PostOpContext';

// Event type icons & colors
const EVENT_CONFIG: Record<TimelineEvent['type'], { icon: string; label: string }> = {
  'surgery-start':  { icon: '🔪', label: '手術開始' },
  'pressure-alert': { icon: '⚠', label: '壓力警示' },
  'intervention':   { icon: '✚', label: '防護介入' },
  'surgery-end':    { icon: '✓', label: '手術結束' },
  'skin-assessment':{ icon: '👁', label: '皮膚評估' },
  'photo-record':   { icon: '📷', label: '照片紀錄' },
  'nursing-note':   { icon: '📝', label: '護理紀錄' },
};

const SEVERITY_STYLES: Record<NonNullable<TimelineEvent['severity']>, {
  border: string; bg: string; dot: string;
}> = {
  info:      { border: 'border-slate-300', bg: 'bg-white',       dot: 'bg-slate-400' },
  caution:   { border: 'border-amber-300', bg: 'bg-amber-50',    dot: 'bg-amber-500' },
  'high-risk':{ border: 'border-red-300',  bg: 'bg-red-50',      dot: 'bg-red-500' },
  success:   { border: 'border-green-300', bg: 'bg-green-50',    dot: 'bg-green-500' },
};

const SETTING_FILTER: (CareSetting | 'all')[] = ['all', 'OR', 'PACU', 'ICU', 'Ward', 'Outpatient'];

const CareTimeline: React.FC = () => {
  const { timelineEvents } = usePostOp();
  const [filter, setFilter] = useState<CareSetting | 'all'>('all');
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);

  const filtered = filter === 'all'
    ? timelineEvents
    : timelineEvents.filter((e) => e.careSetting === filter);

  return (
    <div>
      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs text-slate-500 font-medium">篩選場域：</span>
        {SETTING_FILTER.map((s) => {
          const isActive = filter === s;
          const cfg = s !== 'all' ? CARE_SETTINGS[s] : null;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                isActive
                  ? s === 'all'
                    ? 'bg-slate-700 text-white border-slate-700'
                    : `${cfg!.color} text-white border-transparent`
                  : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
              }`}
            >
              {s === 'all' ? '全部' : `${s} ${cfg!.labelChinese}`}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" aria-hidden="true" />

        <div className="space-y-3 pl-8">
          {filtered.length === 0 && (
            <div className="text-sm text-slate-400 text-center py-8">
              此場域尚無紀錄
            </div>
          )}
          {filtered.map((event) => {
            const severity = event.severity ?? 'info';
            const style = SEVERITY_STYLES[severity];
            const cfg = CARE_SETTINGS[event.careSetting];
            const evtConfig = EVENT_CONFIG[event.type];

            return (
              <div key={event.id} className="relative">
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[26px] top-3 w-4 h-4 rounded-full border-2 border-white ${style.dot} shadow-sm`}
                  aria-hidden="true"
                />

                {/* Event card */}
                <div className={`rounded-xl border ${style.border} ${style.bg} px-4 py-3`}>
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base leading-none">{evtConfig.icon}</span>
                      <span className="font-semibold text-slate-800 text-sm">{event.title}</span>
                      {/* Setting badge */}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold text-white ${cfg.color}`}>
                        {event.careSetting}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0 font-mono">
                      {event.time}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>

                  {/* Related site */}
                  {event.relatedSite && (
                    <div className="mt-1 text-[10px] text-slate-400">
                      部位：{event.relatedSite}
                    </div>
                  )}

                  {/* Photo thumbnail */}
                  {event.photoPreviewUrl ? (
                    <div className="mt-2">
                      <img
                        src={event.photoPreviewUrl}
                        alt="皮膚照片"
                        className="w-16 h-16 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90"
                        onClick={() => setExpandedPhoto(event.photoPreviewUrl!)}
                      />
                      <div className="text-[10px] text-slate-400 mt-0.5">點擊放大</div>
                    </div>
                  ) : event.photoFileName ? (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <rect x="1" y="2" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                        <circle cx="4" cy="5.5" r="1.2" stroke="currentColor" strokeWidth="1" />
                        <path d="M2 9l2.5-2 2 1.5 2-2.5 1.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="italic">{event.photoFileName}</span>
                      <span className="text-[9px] bg-slate-100 text-slate-400 px-1 rounded">Demo Photo</span>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Photo lightbox */}
      {expandedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setExpandedPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label="照片放大"
        >
          <img
            src={expandedPhoto}
            alt="皮膚照片放大"
            className="max-w-full max-h-full rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70"
            onClick={() => setExpandedPhoto(null)}
            aria-label="關閉"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default CareTimeline;
