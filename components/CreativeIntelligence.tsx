'use client';

import React, { useState } from 'react';
import { UnifiedAdRecord, CreativeIntelligence as CreativeType } from '@/lib/types';
import { 
  Play, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  Eye, 
  Zap,
  ShieldCheck,
  Film
} from 'lucide-react';

interface CreativeIntelligenceProps {
  records: UnifiedAdRecord[];
  creativeMap: Record<string, CreativeType>;
  currency: string;
}

export const CreativeIntelligence: React.FC<CreativeIntelligenceProps> = ({
  records,
  creativeMap,
  currency
}) => {
  const currencySymbol = currency === 'USD' ? '$' : '₹';
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');

  // Filter ads with creative intelligence
  const adWithCreatives = records.filter((r) => !!creativeMap[r.adId]);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white border border-blue-200/60 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Multimodal Creative Intelligence</h3>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Linked to CPA & ROAS
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Every video and image asset is downloaded from Google Drive, parsed through AI vision, and evaluated in direct conjunction with its acquisition metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600">Format:</span>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 rounded-md px-2.5 py-1 text-xs font-semibold focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Formats ({adWithCreatives.length})</option>
              <option value="UGC">UGC Videos</option>
              <option value="Founder">Founder Breakdown</option>
              <option value="Static">Static & Infographics</option>
              <option value="Motion Graphic">Motion Graphic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Creative Asset Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {adWithCreatives
          .filter((ad) => {
            const cr = creativeMap[ad.adId];
            if (selectedFormat === 'UGC' && cr?.format !== 'UGC') return false;
            if (selectedFormat === 'Founder' && cr?.format !== 'Founder') return false;
            if (selectedFormat === 'Static' && cr?.creativeType !== 'image') return false;
            if (selectedFormat === 'Motion Graphic' && cr?.format !== 'Motion Graphic') return false;
            return true;
          })
          .map((ad) => {
            const cr = creativeMap[ad.adId];
            const isWinner = ad.tier === 'Strong Performer';
            const isLoser = ad.tier === 'Underperforming';

            return (
              <div
                key={ad.adId}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                {/* Header Strip */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block truncate max-w-[280px]" title={ad.adName}>
                      {ad.adName}
                    </span>
                    <span className="text-[11px] text-slate-500 block">{ad.campaign}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {cr.driveUrlStatus === 'public_accessible' ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Public Drive Validated
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">
                        <AlertTriangle className="w-3 h-3 text-amber-600" /> Permission Notice
                      </span>
                    )}
                  </div>
                </div>

                {/* Media & Performance Summary */}
                <div className="p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Thumbnail */}
                    <div className="sm:w-44 h-36 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative flex-shrink-0">
                      {cr.thumbnailUrl ? (
                        <img src={cr.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          {cr.creativeType === 'video' ? <Play className="w-8 h-8" /> : <Layers className="w-8 h-8" />}
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-bold">
                        {cr.format} {cr.durationSeconds ? `• ${cr.durationSeconds}s` : ''}
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold shadow">
                        {cr.hookType}
                      </div>
                    </div>

                    {/* Quick Performance Matrix */}
                    <div className="flex-1 space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 p-2 rounded border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">Spend</span>
                          <span className="font-bold text-slate-900">{currencySymbol}{ad.spend.toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">Link CTR</span>
                          <span className="font-bold text-slate-900">{ad.ctr.toFixed(2)}%</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">CPA / CPL</span>
                          <span className={`font-bold ${isWinner ? 'text-emerald-700' : isLoser ? 'text-rose-600' : 'text-slate-900'}`}>
                            {currencySymbol}{ad.cpa ? ad.cpa.toFixed(2) : '—'}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">ROAS</span>
                          <span className={`font-bold ${ad.roas >= 3.5 ? 'text-emerald-700' : 'text-slate-900'}`}>
                            {ad.roas ? ad.roas.toFixed(2) + 'x' : '—'}
                          </span>
                        </div>
                      </div>

                      {/* Hook in First 3 Seconds */}
                      <div className="bg-blue-50/50 border border-blue-100 rounded-md p-2">
                        <span className="text-[10px] font-bold uppercase text-blue-900 block mb-0.5">
                          Hook in First 0–3s:
                        </span>
                        <p className="text-slate-800 italic text-[11px] line-clamp-2">
                          {cr.hookFirst3Seconds}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Structural & Visual Elements */}
                  <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Pacing</span>
                      <span className="font-bold text-slate-800">{cr.pacing}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Product Reveal</span>
                      <span className="font-bold text-slate-800">{cr.productRevealSeconds}s into video</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Overlay / Speaker</span>
                      <span className="font-bold text-slate-800">
                        {cr.speaker ? 'Yes' : 'No'} / {cr.textOverlay ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses Badges */}
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-800 block mb-1">
                        Creative Strengths
                      </span>
                      <div className="space-y-1">
                        {cr.creativeStrengths.map((str, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{str}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {cr.creativeWeaknesses.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] font-bold uppercase text-rose-800 block mb-1">
                          Identified Flaws / Friction Points
                        </span>
                        <div className="space-y-1">
                          {cr.creativeWeaknesses.map((weak, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                              <span>{weak}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Audio Transcript (if available) */}
                  {cr.transcript && (
                    <div className="border-t border-slate-100 pt-2">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                        Audio Voiceover & Spoken Script
                      </span>
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 italic line-clamp-3">
                        "{cr.transcript}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
