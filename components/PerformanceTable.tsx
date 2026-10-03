'use client';

import React, { useState } from 'react';
import { UnifiedAdRecord, PerformanceTier, CreativeIntelligence } from '@/lib/types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Eye, 
  ExternalLink, 
  Filter, 
  TrendingUp, 
  Layers, 
  Play, 
  FileText,
  X,
  Target,
  Sparkles,
  UploadCloud,
  Film,
  Image as ImageIcon
} from 'lucide-react';

interface PerformanceTableProps {
  records: UnifiedAdRecord[];
  creativeMap: Record<string, CreativeIntelligence>;
  currency: string;
  onAnalyzeVideo?: (ad: UnifiedAdRecord, driveUrl: string) => Promise<void>;
  analyzingVideoId?: string | null;
  selectedTierFilter?: string;
  onTierFilterChange?: (tier: string) => void;
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({
  records,
  creativeMap,
  currency,
  onAnalyzeVideo,
  analyzingVideoId,
  selectedTierFilter,
  onTierFilterChange
}) => {
  const currencySymbol = currency === 'USD' ? '$' : '₹';
  const [internalTier, setInternalTier] = useState<string>('ALL');
  const selectedTier = selectedTierFilter !== undefined ? selectedTierFilter : internalTier;
  const handleTierChange = (val: string) => {
    setInternalTier(val);
    if (onTierFilterChange) onTierFilterChange(val);
  };

  const [selectedCampaign, setSelectedCampaign] = useState<string>('ALL');
  const [activeDrilldownAd, setActiveDrilldownAd] = useState<UnifiedAdRecord | null>(null);
  const [customDriveUrl, setCustomDriveUrl] = useState<string>('');
  const [localAttachedMedia, setLocalAttachedMedia] = useState<Record<string, { url: string; type: 'video' | 'image'; name: string }>>({});

  const handleFileUploadForAd = (adId: string, file: File) => {
    const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.mov');
    const objectUrl = URL.createObjectURL(file);
    setLocalAttachedMedia(prev => ({
      ...prev,
      [adId]: {
        url: objectUrl,
        type: isVideo ? 'video' : 'image',
        name: file.name
      }
    }));
  };

  const campaigns = Array.from(new Set(records.map((r) => r.campaign || 'General')));

  const filteredRecords = records.filter((r) => {
    if (selectedTier !== 'ALL' && r.tier !== selectedTier) return false;
    if (selectedCampaign !== 'ALL' && r.campaign !== selectedCampaign) return false;
    return true;
  });

  const getTierBadge = (tier?: PerformanceTier) => {
    switch (tier) {
      case 'Strong Performer':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-full bg-[#141517] text-[#e2f976]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2f976]" />
            Strong Performer
          </span>
        );
      case 'Promising':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-full bg-[#e2f976] text-[#121316]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#141517]" />
            Promising
          </span>
        );
      case 'Underperforming':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            Underperforming
          </span>
        );
      case 'Average':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-white text-[#121316] border border-neutral-200/80">
            Average
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-neutral-200 text-neutral-600">
            Insufficient Data
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-5">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f4f5f2]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
            <Layers className="w-5 h-5 text-[#e2f976]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-[#141517] tracking-tight">Ad-Level Performance Intelligence</h3>
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#141517] text-[#e2f976] px-3 py-1 rounded-full">
                Deterministic Math
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredRecords.length} of {records.length} analyzed ads with hybrid statistical classification.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-[#f4f5f2] border border-[#eef0ec] px-4 py-2 rounded-full shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedTier}
              onChange={(e) => handleTierChange(e.target.value)}
              className="bg-transparent font-bold text-[#141517] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Tiers ({records.length})</option>
              <option value="Strong Performer">Strong Performers</option>
              <option value="Promising">Promising</option>
              <option value="Underperforming">Underperforming</option>
              <option value="Average">Average</option>
              <option value="Insufficient Data">Insufficient Data</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f4f5f2] border border-[#eef0ec] px-4 py-2 rounded-full shadow-2xs">
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="bg-transparent font-bold text-[#141517] focus:outline-none cursor-pointer max-w-[180px] truncate"
            >
              <option value="ALL">All Campaigns</option>
              {campaigns.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto bg-white rounded-[28px] border border-[#eef0ec] p-2">
        <table className="w-full text-left saas-table">
          <thead>
            <tr className="border-b border-neutral-100 text-[11px] font-black uppercase tracking-wider text-neutral-400">
              <th className="py-3 px-4">Ad Name / Creative</th>
              <th className="py-3 px-3">Classification</th>
              <th className="py-3 px-3 text-right">Spend</th>
              <th className="py-3 px-3 text-right">Link CTR</th>
              <th className="py-3 px-3 text-right">CPC</th>
              <th className="py-3 px-3 text-right">Conversions</th>
              <th className="py-3 px-3 text-right">CPA / CPL</th>
              <th className="py-3 px-3 text-right">ROAS</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredRecords.map((ad) => {
              const creative = creativeMap[ad.adId];
              const isWinner = ad.tier === 'Strong Performer';
              const isLoser = ad.tier === 'Underperforming';

              return (
                <tr
                  key={ad.adId}
                  onClick={() => setActiveDrilldownAd(ad)}
                  className="cursor-pointer hover:bg-[#f0f3f0]/50 transition rounded-xl"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {localAttachedMedia[ad.adId] ? (
                        <div className="w-10 h-10 rounded-[12px] bg-[#141517] text-[#e2f976] flex items-center justify-center flex-shrink-0 font-bold border border-neutral-200">
                          {localAttachedMedia[ad.adId].type === 'video' ? <Film className="w-4 h-4 text-[#e2f976]" /> : <ImageIcon className="w-4 h-4 text-[#e2f976]" />}
                        </div>
                      ) : creative?.thumbnailUrl ? (
                        <img
                          src={creative.thumbnailUrl}
                          alt=""
                          className="w-10 h-10 rounded-[12px] object-cover border border-neutral-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-[12px] bg-[#141517] flex items-center justify-center text-[#e2f976] flex-shrink-0">
                          {creative?.creativeType === 'video' ? <Play className="w-4 h-4 text-[#e2f976]" /> : <Layers className="w-4 h-4 text-[#e2f976]" />}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-[#121316] block truncate max-w-[220px]" title={ad.adName}>
                            {ad.adName}
                          </span>
                          {localAttachedMedia[ad.adId] && (
                            <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                              Local File
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-semibold text-neutral-400 block truncate max-w-[220px]" title={ad.campaign}>
                          {ad.campaign}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-3">{getTierBadge(ad.tier)}</td>

                  <td className="text-right font-extrabold text-xs text-[#121316] px-3">
                    {currencySymbol}{ad.spend.toLocaleString()}
                  </td>

                  <td className="text-right font-extrabold text-xs px-3">
                    <span className={ad.ctr >= 3.0 ? 'text-emerald-700 font-black' : ad.ctr < 1.8 ? 'text-rose-600' : 'text-[#121316]'}>
                      {ad.ctr.toFixed(2)}%
                    </span>
                  </td>

                  <td className="text-right font-medium text-xs text-neutral-600 px-3">
                    {currencySymbol}{ad.cpc.toFixed(2)}
                  </td>

                  <td className="text-right font-black text-xs text-[#121316] px-3">
                    {ad.conversions || ad.leads || 0}
                  </td>

                  <td className="text-right font-extrabold text-xs px-3">
                    <span className={isWinner ? 'text-emerald-700' : isLoser ? 'text-rose-600' : 'text-[#121316]'}>
                      {currencySymbol}{ad.cpa ? ad.cpa.toFixed(2) : '0.00'}
                    </span>
                  </td>

                  <td className="text-right font-extrabold text-xs px-3">
                    <span className={ad.roas >= 3.5 ? 'text-emerald-700' : ad.roas < 2.0 && ad.spend > 1000 ? 'text-rose-600' : 'text-[#121316]'}>
                      {ad.roas ? ad.roas.toFixed(2) + 'x' : '—'}
                    </span>
                  </td>

                  <td className="text-center px-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDrilldownAd(ad);
                      }}
                      className="w-8 h-8 rounded-full bg-[#f0f3f0] hover:bg-[#141517] hover:text-[#e2f976] inline-flex items-center justify-center text-neutral-600 transition"
                      title="Inspect Creative & Performance Diagnosis"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Drill-down Modal / Inspector Drawer */}
      {activeDrilldownAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] border border-[#eef0ec] shadow-2xl max-w-3xl w-full mx-auto overflow-hidden">
            {/* Modal Header */}
            <div className="bg-white border-b border-[#f4f5f2] px-7 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-xs">
                  <FileText className="w-5 h-5 text-[#e2f976]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-[#141517] tracking-tight">{activeDrilldownAd.adName}</h3>
                    {getTierBadge(activeDrilldownAd.tier)}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">ID: {activeDrilldownAd.adId} • {activeDrilldownAd.campaign}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveDrilldownAd(null)}
                className="w-9 h-9 rounded-full bg-[#f4f5f2] hover:bg-[#e8eae4] flex items-center justify-center text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-7 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-[#141517]">
              {/* Metric Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#fbfcfb] p-4 rounded-2xl border border-[#eef0ec]">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Spend</span>
                  <span className="font-extrabold text-[#141517] text-base">{currencySymbol}{activeDrilldownAd.spend.toLocaleString()}</span>
                </div>
                <div className="bg-[#fbfcfb] p-4 rounded-2xl border border-[#eef0ec]">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Link CTR / CPC</span>
                  <span className="font-extrabold text-[#141517] text-base">{activeDrilldownAd.ctr.toFixed(2)}% ({currencySymbol}{activeDrilldownAd.cpc.toFixed(2)})</span>
                </div>
                <div className="bg-[#fbfcfb] p-4 rounded-2xl border border-[#eef0ec]">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">Conversions</span>
                  <span className="font-extrabold text-emerald-700 text-base">{activeDrilldownAd.conversions || 0}</span>
                </div>
                <div className="bg-[#fbfcfb] p-4 rounded-2xl border border-[#eef0ec]">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider block">CPA / ROAS</span>
                  <span className="font-extrabold text-[#141517] text-base">{currencySymbol}{activeDrilldownAd.cpa ? activeDrilldownAd.cpa.toFixed(2) : '—'} ({activeDrilldownAd.roas ? activeDrilldownAd.roas.toFixed(2) + 'x' : '—'})</span>
                </div>
              </div>

              {/* AI Tier Reasoning & Statistical Evidence */}
              <div className="bg-[#141517] text-white rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-[#e2f976] font-extrabold text-xs">
                  <Target className="w-4 h-4 text-[#e2f976]" />
                  <span>Performance Classification Diagnostic & Evidence</span>
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-slate-200 pl-1 text-xs">
                  {(activeDrilldownAd.tierReasoning || []).map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                  {(activeDrilldownAd.evidence || []).map((ev, idx) => (
                    <li key={`ev-${idx}`} className="text-slate-300 italic">{ev}</li>
                  ))}
                </ul>
              </div>

              {/* Ad Copy & Creative Inspection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#eef0ec] rounded-2xl p-5 space-y-3 bg-[#fbfcfb]">
                  <span className="font-black text-[11px] uppercase tracking-wider text-slate-400 block">Ad Copy & Hook</span>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Headline</span>
                      <p className="font-extrabold text-[#141517]">{activeDrilldownAd.headline || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Primary Text</span>
                      <p className="text-slate-700 whitespace-pre-line text-xs">{activeDrilldownAd.primaryText || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Call to Action</span>
                      <p className="font-extrabold text-[#141517]">{activeDrilldownAd.cta || 'Learn More'}</p>
                    </div>
                  </div>
                </div>

                <div className="border border-[#eef0ec] rounded-2xl p-5 space-y-3 bg-[#fbfcfb]">
                  <span className="font-black text-[11px] uppercase tracking-wider text-slate-400 block">Creative Asset & Links</span>
                  <div className="space-y-3 text-xs">
                    {creativeMap[activeDrilldownAd.adId]?.thumbnailUrl && (
                      <img
                        src={creativeMap[activeDrilldownAd.adId].thumbnailUrl}
                        alt=""
                        className="w-full h-32 object-cover rounded-2xl border border-[#eef0ec]"
                      />
                    )}
                    {/* Local File Attachment (Direct User Drag & Drop) */}
                    <div className="pt-2 border-t border-[#f4f5f2] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#141517] block">
                          Attach Creative Asset (Drag & Drop):
                        </span>
                        {localAttachedMedia[activeDrilldownAd.adId] && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            ✓ {localAttachedMedia[activeDrilldownAd.adId].name}
                          </span>
                        )}
                      </div>

                      {localAttachedMedia[activeDrilldownAd.adId] && (
                        <div className="rounded-2xl overflow-hidden border border-[#eef0ec] bg-black">
                          {localAttachedMedia[activeDrilldownAd.adId].type === 'video' ? (
                            <video
                              src={localAttachedMedia[activeDrilldownAd.adId].url}
                              controls
                              className="w-full max-h-48 object-contain"
                            />
                          ) : (
                            <img
                              src={localAttachedMedia[activeDrilldownAd.adId].url}
                              alt="Local ad asset"
                              className="w-full max-h-48 object-contain"
                            />
                          )}
                        </div>
                      )}

                      <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#eef0ec] hover:border-[#141517] bg-[#fbfcfb] hover:bg-white rounded-2xl p-3 cursor-pointer transition text-xs font-semibold text-slate-700 hover:text-black">
                        <UploadCloud className="w-4 h-4 text-slate-500" />
                        <span>Upload or drag video/image (.mp4, .png, .jpg)</span>
                        <input
                          type="file"
                          accept="video/*,image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUploadForAd(activeDrilldownAd.adId, file);
                          }}
                        />
                      </label>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Google Drive Link</span>
                      <p className="truncate text-[#141517] font-semibold">
                        {activeDrilldownAd.driveUrl || 'Not provided'}
                      </p>
                    </div>

                    {/* Gemini Multimodal Teardown Action */}
                    {onAnalyzeVideo && (
                      <div className="pt-3 border-t border-[#f4f5f2] space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#141517] block">Gemini Multimodal 720p Teardown:</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Paste public Drive video URL..."
                            defaultValue={activeDrilldownAd.driveUrl || customDriveUrl}
                            onChange={(e) => setCustomDriveUrl(e.target.value)}
                            className="flex-1 bg-[#fbfcfb] border border-[#eef0ec] rounded-full px-4 py-2 text-xs text-[#141517] font-medium focus:outline-none shadow-2xs"
                          />
                          <button
                            disabled={analyzingVideoId === activeDrilldownAd.adId}
                            onClick={() => {
                              const targetUrl = customDriveUrl || activeDrilldownAd.driveUrl;
                              if (!targetUrl) {
                                alert('Please provide a Google Drive video link.');
                                return;
                              }
                              onAnalyzeVideo(activeDrilldownAd, targetUrl);
                            }}
                            className="px-5 py-2 bg-[#141517] hover:bg-black disabled:opacity-50 text-[#e2f976] rounded-full font-black text-xs whitespace-nowrap shadow-xs transition flex items-center gap-1.5"
                          >
                            {analyzingVideoId === activeDrilldownAd.adId ? (
                              <>
                                <span className="w-3 h-3 rounded-full border-2 border-[#e2f976] border-t-transparent animate-spin" />
                                <span>Analyzing...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3 text-[#e2f976]" />
                                <span>Teardown</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Auto-downscales to 720p 24fps via FFmpeg, uploads to Gemini File API, and purges /tmp immediately.
                        </p>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Destination Landing Page</span>
                      <p className="truncate text-slate-600 font-medium">
                        {activeDrilldownAd.landingPageUrl || 'Default client website'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Next Test */}
              {activeDrilldownAd.recommendedTest && (
                <div className="bg-[#e2f976]/20 border border-[#e2f976] rounded-2xl p-4 text-[#141517]">
                  <span className="font-black text-[11px] uppercase tracking-wider block mb-1">Recommended Action / Test:</span>
                  <span className="font-semibold text-xs leading-relaxed">{activeDrilldownAd.recommendedTest}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t border-[#f4f5f2] px-7 py-4 flex justify-end">
              <button
                onClick={() => setActiveDrilldownAd(null)}
                className="px-6 py-2.5 bg-[#141517] hover:bg-black text-[#e2f976] rounded-full font-black text-xs shadow-xs transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

