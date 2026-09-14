// ============================================================
// SkinRecordForm – add post-op skin record with photo upload
// Photos are local preview only (no server upload in prototype).
// Future AI Image Analysis module is noted but not implemented.
// ============================================================

import React, { useState, useRef } from 'react';
import type {
  PostOpBodySite,
  SkinObservation,
  CareSetting,
} from '../types';
import {
  POST_OP_BODY_SITE_LABELS,
  SKIN_OBSERVATION_LABELS,
  SKIN_OBSERVATION_COLORS,
} from '../types';
import { usePostOp } from '../context/PostOpContext';

interface SkinRecordFormProps {
  defaultSite?: PostOpBodySite;
  careSetting: CareSetting;
  onComplete?: () => void;
}

const BODY_SITES: PostOpBodySite[] = [
  'occiput', 'left-shoulder', 'right-shoulder',
  'sacrum', 'left-heel', 'right-heel', 'other',
];

const SKIN_OBS: SkinObservation[] = [
  'no-abnormality', 'redness', 'persistent-erythema',
  'skin-integrity-abnormal', 'other',
];

const SkinRecordForm: React.FC<SkinRecordFormProps> = ({
  defaultSite = 'sacrum',
  careSetting,
  onComplete,
}) => {
  const { addSkinRecord } = usePostOp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [site, setSite] = useState<PostOpBodySite>(defaultSite);
  const [observations, setObservations] = useState<SkinObservation[]>([]);
  const [nursingNote, setNursingNote] = useState('');
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | undefined>();
  const [photoFileName, setPhotoFileName] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('請選擇圖片檔案 (JPG, PNG, HEIC)');
      return;
    }
    setError('');
    setPhotoFileName(file.name);
    const url = URL.createObjectURL(file);
    setPhotoPreviewUrl(url);
  };

  const toggleObservation = (obs: SkinObservation) => {
    setObservations((prev) => {
      // "no-abnormality" is exclusive
      if (obs === 'no-abnormality') return [obs];
      const without = prev.filter((o) => o !== 'no-abnormality');
      return without.includes(obs)
        ? without.filter((o) => o !== obs)
        : [...without, obs];
    });
  };

  const handleSubmit = () => {
    if (observations.length === 0) {
      setError('請至少選擇一項皮膚觀察結果');
      return;
    }
    setError('');
    addSkinRecord({
      site,
      careSetting,
      observations,
      nursingNote,
      photoPreviewUrl,
      photoFileName,
    });
    setSubmitted(true);
    onComplete?.();
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 slide-in">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-green-600 text-lg">✓</span>
          <span className="font-semibold text-green-700">皮膚紀錄已儲存</span>
        </div>
        <p className="text-xs text-slate-500 mb-2">
          本筆紀錄已加入時間軸，供後續照護場域查閱。
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setObservations([]);
            setNursingNote('');
            setPhotoPreviewUrl(undefined);
            setPhotoFileName(undefined);
            setSite(defaultSite);
          }}
          className="text-xs text-blue-600 hover:underline"
        >
          ＋ 新增另一筆紀錄
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Body site */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          評估部位 Body Site
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BODY_SITES.map((s) => (
            <button
              key={s}
              onClick={() => setSite(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border-2 transition-colors text-left ${
                site === s
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="font-semibold">{POST_OP_BODY_SITE_LABELS[s].zh}</div>
              <div className="text-[10px] opacity-70">{POST_OP_BODY_SITE_LABELS[s].en}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Photo upload */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          照片記錄 Photo
        </label>
        <div className="flex items-start gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="12" cy="5" r="0.8" fill="currentColor" />
            </svg>
            拍照 / 上傳照片
          </button>
          {/* Hidden file input – supports camera on mobile */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handlePhotoChange}
            aria-label="上傳照片"
          />
          {photoPreviewUrl ? (
            <div className="relative">
              <img
                src={photoPreviewUrl}
                alt="皮膚照片預覽"
                className="w-20 h-20 object-cover rounded-lg border border-slate-200"
              />
              <button
                onClick={() => { setPhotoPreviewUrl(undefined); setPhotoFileName(undefined); }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                aria-label="移除照片"
              >
                ✕
              </button>
              <div className="text-[10px] text-slate-400 mt-1 max-w-[80px] truncate">{photoFileName}</div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 mt-2">
              <div>支援 JPG / PNG / HEIC</div>
              <div className="text-[10px] mt-0.5">手機裝置可直接開啟相機</div>
            </div>
          )}
        </div>
        {/* AI Future Module notice */}
        <div className="mt-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-semibold">AI Image Analysis</span>
            <span className="text-[9px] bg-slate-200 text-slate-500 px-1 py-0.5 rounded">Future Module</span>
            <span className="text-[9px] bg-amber-100 text-amber-600 px-1 py-0.5 rounded">Research Prototype</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            目前照片功能定位為臨床紀錄與追蹤。未來照片自動分析功能尚未臨床驗證。
          </p>
        </div>
      </div>

      {/* Skin observations */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          皮膚觀察 Skin Observation
          <span className="ml-1 text-xs font-normal text-slate-400">（可複選）</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SKIN_OBS.map((obs) => {
            const selected = observations.includes(obs);
            const colorClass = selected ? SKIN_OBSERVATION_COLORS[obs] : 'bg-white text-slate-600 border-slate-200';
            return (
              <label
                key={obs}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border-2 cursor-pointer transition-colors ${colorClass}`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleObservation(obs)}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm font-medium">{SKIN_OBSERVATION_LABELS[obs]}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Nursing note */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          護理紀錄 / 備註
        </label>
        <textarea
          value={nursingNote}
          onChange={(e) => setNursingNote(e.target.value)}
          placeholder="輸入護理觀察、處置說明或備註…"
          rows={3}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
      >
        儲存皮膚紀錄
      </button>

      <p className="text-[10px] text-slate-400 text-center">
        * Prototype 階段照片僅本機預覽，不上傳至伺服器。
        Future HIS / EMR Integration 待開發。
      </p>
    </div>
  );
};

export default SkinRecordForm;
