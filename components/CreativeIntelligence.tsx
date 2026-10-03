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
  Film,
  X
} from 'lucide-react';

interface CreativeIntelligenceProps {
  records: UnifiedAdRecord[];
  creativeMap: Record<string, CreativeType>;
  currency: string;
  onAnalyzeVideo?: (ad: UnifiedAdRecord, driveUrl: string) => Promise<void>;
  analyzingVideoId?: string | null;
  selectedFormatFilter?: string;
  onFormatFilterChange?: (format: string) => void;
}

export const CreativeIntelligence: React.FC<CreativeIntelligenceProps> = ({
  records,
  creativeMap,
  currency,
  onAnalyzeVideo,
  analyzingVideoId,
  selectedFormatFilter,
  onFormatFilterChange
}) => {
  const currencySymbol = currency === 'USD' ? '$' : '₹';
  const [internalFormat, setInternalFormat] = useState<string>('ALL');
  const selectedFormat = selectedFormatFilter !== undefined ? selectedFormatFilter : internalFormat;
  const handleFormatChange = (val: string) => {
    setInternalFormat(val);
    if (onFormatFilterChange) onFormatFilterChange(val);
  };

  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string>(records[0]?.adId || '');
  const [inputDriveUrl, setInputDriveUrl] = useState<string>('');

  // Filter ads with creative intelligence
  const adWithCreatives = records.filter((r) => !!creativeMap[r.adId]);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
              <Film className="w-5 h-5 text-[#e2f976]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#141517] tracking-tight">Multimodal Creative Intelligence</h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#141517] text-[#e2f976] px-3 py-1 rounded-full">
                  Linked to CPA & ROAS
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Every video and image asset is downloaded from Google Drive, downscaled to 720p 24fps in memory/ephemeral storage, parsed through Gemini 2.5 Flash multimodal vision, and evaluated in direct conjunction with its acquisition metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 text-xs">
            {onAnalyzeVideo && (
              <button
                onClick={() => setIsAnalyzeModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#141517] hover:bg-black text-[#e2f976] rounded-full font-black shadow-xs transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#e2f976]" />
                <span>Analyze Video (Drive Link)</span>
              </button>
            )}

            <div className="flex items-center gap-2 bg-[#f4f5f2] border border-[#eef0ec] rounded-full px-4 py-2 shadow-2xs">
              <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider">Format:</span>
              <select
                value={selectedFormat}
                onChange={(e) => handleFormatChange(e.target.value)}
                className="bg-transparent text-[#141517] font-bold text-xs focus:outline-none cursor-pointer"
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
                className="bg-white border border-[#eef0ec] rounded-[32px] overflow-hidden shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
              >
                {/* Header Strip */}
                <div className="bg-white border-b border-[#f4f5f2] p-5 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-sm text-[#141517] block truncate max-w-[280px]" title={ad.adName}>
                      {ad.adName}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 block">{ad.campaign}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {cr.driveUrlStatus === 'public_accessible' ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold bg-[#141517] text-[#e2f976] px-3 py-1 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#e2f976]" /> Public Drive Validated
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Permission Notice
                      </span>
                    )}
                  </div>
                </div>

                {/* Media & Performance Summary */}
                <div className="p-5 space-y-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Thumbnail */}
                    <div className="sm:w-44 h-36 bg-[#141517] rounded-2xl overflow-hidden border border-[#eef0ec] relative flex-shrink-0">
                      {cr.thumbnailUrl ? (
                        <img src={cr.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-500">
                          {cr.creativeType === 'video' ? <Play className="w-8 h-8 text-[#e2f976]" /> : <Layers className="w-8 h-8 text-[#e2f976]" />}
                        </div>
                      )}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#141517]/90 text-[#e2f976] text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
                        {cr.format} {cr.durationSeconds ? `• ${cr.durationSeconds}s` : ''}
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#e2f976] text-[#121316] text-[10px] font-extrabold shadow-sm">
                        {cr.hookType}
                      </div>
                    </div>

                    {/* Quick Performance Matrix */}
                    <div className="flex-1 space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[#fbfcfb] p-3 rounded-2xl border border-[#eef0ec]">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Spend</span>
                          <span className="font-extrabold text-[#141517] text-sm">{currencySymbol}{ad.spend.toLocaleString()}</span>
                        </div>
                        <div className="bg-[#fbfcfb] p-3 rounded-2xl border border-[#eef0ec]">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Link CTR</span>
                          <span className="font-extrabold text-[#141517] text-sm">{ad.ctr.toFixed(2)}%</span>
                        </div>
                        <div className="bg-[#fbfcfb] p-3 rounded-2xl border border-[#eef0ec]">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">CPA / CPL</span>
                          <span className={`font-extrabold text-sm ${isWinner ? 'text-emerald-700' : isLoser ? 'text-rose-600' : 'text-[#141517]'}`}>
                            {currencySymbol}{ad.cpa ? ad.cpa.toFixed(2) : '—'}
                          </span>
                        </div>
                        <div className="bg-[#fbfcfb] p-3 rounded-2xl border border-[#eef0ec]">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">ROAS</span>
                          <span className={`font-extrabold text-sm ${ad.roas >= 3.5 ? 'text-emerald-700' : 'text-[#141517]'}`}>
                            {ad.roas ? ad.roas.toFixed(2) + 'x' : '—'}
                          </span>
                        </div>
                      </div>

                      {/* Hook in First 3 Seconds */}
                      <div className="bg-[#141517] text-white rounded-2xl p-3.5 shadow-xs">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#e2f976] block mb-0.5">
                          Hook in First 0–3s:
                        </span>
                        <p className="text-slate-200 italic text-[11px] line-clamp-2">
                          "{cr.hookFirst3Seconds}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Structural & Visual Elements */}
                  <div className="grid grid-cols-3 gap-2 text-[11px] bg-[#fbfcfb] p-3.5 rounded-2xl border border-[#eef0ec] text-[#141517]">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Pacing</span>
                      <span className="font-extrabold text-[#141517]">{cr.pacing}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Product Reveal</span>
                      <span className="font-extrabold text-[#141517]">{cr.productRevealSeconds}s mark</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Voice / Overlay</span>
                      <span className="font-extrabold text-[#141517]">
                        {cr.speaker ? 'Yes' : 'No'} / {cr.textOverlay ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses Badges */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block mb-1">
                        Creative Strengths
                      </span>
                      <div className="space-y-1">
                        {cr.creativeStrengths.map((str, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[11px] text-[#121316]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{str}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {cr.creativeWeaknesses.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 block mb-1">
                          Identified Flaws / Friction Points
                        </span>
                        <div className="space-y-1">
                          {cr.creativeWeaknesses.map((weak, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-[11px] text-[#121316]">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                              <span>{weak}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recommended Hook-Swaps (if generated by Gemini) */}
                  {cr.recommendedHookSwaps && cr.recommendedHookSwaps.length > 0 && (
                    <div className="border-t border-neutral-200/80 pt-3 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#141517] block">
                        ⚡ AI Hook-Swap Iterations (Keep Winning Body)
                      </span>
                      <div className="space-y-1.5">
                        {cr.recommendedHookSwaps.map((hook, hIdx) => (
                          <div key={hIdx} className="bg-[#f0f3f0] border border-neutral-200/80 p-2.5 rounded-[16px] text-[11px] text-[#121316] font-medium">
                            {hook}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Audio Transcript (if available) */}
                  {cr.transcript && (
                    <div className="border-t border-neutral-200/80 pt-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">
                        Audio Voiceover & Spoken Script
                      </span>
                      <p className="text-[11px] text-[#121316] bg-[#f0f3f0] p-3 rounded-[16px] border border-neutral-200/80 italic line-clamp-3">
                        "{cr.transcript}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Analyze Ad Video Modal */}
      {isAnalyzeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] border border-[#eef0ec] shadow-2xl max-w-lg w-full p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-[#f4f5f2] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-xs">
                  <Film className="w-5 h-5 text-[#e2f976]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#141517] tracking-tight">Run 720p Video Teardown</h3>
                  <p className="text-[11px] text-slate-500">Gemini 2.5 Flash second-by-second multimodal diagnosis</p>
                </div>
              </div>
              <button
                onClick={() => setIsAnalyzeModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[#f4f5f2] hover:bg-[#e8eae4] flex items-center justify-center text-slate-700 font-bold transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-extrabold text-[#141517] block mb-1.5 uppercase text-[10px] tracking-wider">Select Ad Asset:</label>
                <select
                  value={selectedAdId}
                  onChange={(e) => {
                    setSelectedAdId(e.target.value);
                    const ad = records.find((r) => r.adId === e.target.value);
                    if (ad?.driveUrl) setInputDriveUrl(ad.driveUrl);
                  }}
                  className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-[#141517] font-bold focus:outline-none"
                >
                  {records.map((r) => (
                    <option key={r.adId} value={r.adId}>
                      {r.adName} ({currencySymbol}{r.spend.toLocaleString()} spend • {r.ctr}% CTR)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-extrabold text-[#141517] block mb-1.5 uppercase text-[10px] tracking-wider">Public Google Drive Video URL:</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={inputDriveUrl}
                  onChange={(e) => setInputDriveUrl(e.target.value)}
                  className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-[#141517] font-medium focus:outline-none focus:border-[#141517] text-xs shadow-2xs"
                />
                <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                  Works with any public Google Drive video link. Streamed, compressed to 720p 24fps in /tmp, analyzed by Gemini, and wiped immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#f4f5f2]">
              <button
                onClick={() => setIsAnalyzeModalOpen(false)}
                className="px-5 py-2.5 bg-[#f4f5f2] hover:bg-[#e8eae4] text-slate-800 font-bold rounded-full text-xs transition"
              >
                Cancel
              </button>
              <button
                disabled={!inputDriveUrl.trim() || analyzingVideoId === selectedAdId}
                onClick={async () => {
                  const targetAd = records.find((r) => r.adId === selectedAdId) || records[0];
                  if (!targetAd || !inputDriveUrl.trim()) return;
                  if (onAnalyzeVideo) {
                    await onAnalyzeVideo(targetAd, inputDriveUrl.trim());
                    setIsAnalyzeModalOpen(false);
                  }
                }}
                className="px-6 py-2.5 bg-[#141517] hover:bg-black disabled:opacity-50 text-[#e2f976] font-black rounded-full text-xs shadow-xs transition flex items-center gap-2"
              >
                {analyzingVideoId === selectedAdId ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#e2f976] border-t-transparent animate-spin" />
                    <span>Processing 720p Teardown...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#e2f976]" />
                    <span>Launch 720p Teardown</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

