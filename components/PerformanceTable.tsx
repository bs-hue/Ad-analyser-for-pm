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
  Target
} from 'lucide-react';

interface PerformanceTableProps {
  records: UnifiedAdRecord[];
  creativeMap: Record<string, CreativeIntelligence>;
  currency: string;
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({
  records,
  creativeMap,
  currency
}) => {
  const currencySymbol = currency === 'USD' ? '$' : '₹';
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('ALL');
  const [activeDrilldownAd, setActiveDrilldownAd] = useState<UnifiedAdRecord | null>(null);

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
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Strong Performer
          </span>
        );
      case 'Promising':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Promising
          </span>
        );
      case 'Underperforming':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Underperforming
          </span>
        );
      case 'Average':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Average
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Insufficient Data
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-4 p-5">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Ad-Level Performance Intelligence</h3>
          <p className="text-xs text-slate-500">
            Showing {filteredRecords.length} of {records.length} analyzed ads with hybrid statistical classification.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Tiers ({records.length})</option>
              <option value="Strong Performer">Strong Performers</option>
              <option value="Promising">Promising</option>
              <option value="Underperforming">Underperforming</option>
              <option value="Average">Average</option>
              <option value="Insufficient Data">Insufficient Data</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md">
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer max-w-[180px] truncate"
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
      <div className="overflow-x-auto">
        <table className="w-full text-left saas-table">
          <thead>
            <tr>
              <th>Ad Name / Creative</th>
              <th>Classification</th>
              <th className="text-right">Spend</th>
              <th className="text-right">Link CTR</th>
              <th className="text-right">CPC</th>
              <th className="text-right">Conversions</th>
              <th className="text-right">CPA / CPL</th>
              <th className="text-right">ROAS</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.map((ad) => {
              const creative = creativeMap[ad.adId];
              const isWinner = ad.tier === 'Strong Performer';
              const isLoser = ad.tier === 'Underperforming';

              return (
                <tr
                  key={ad.adId}
                  onClick={() => setActiveDrilldownAd(ad)}
                  className="cursor-pointer hover:bg-slate-50 transition"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      {creative?.thumbnailUrl ? (
                        <img
                          src={creative.thumbnailUrl}
                          alt=""
                          className="w-9 h-9 rounded object-cover border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                          {creative?.creativeType === 'video' ? <Play className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-xs text-slate-900 block truncate max-w-[240px]" title={ad.adName}>
                          {ad.adName}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[220px]" title={ad.campaign}>
                          {ad.campaign}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>{getTierBadge(ad.tier)}</td>

                  <td className="text-right font-medium text-xs text-slate-900">
                    {currencySymbol}{ad.spend.toLocaleString()}
                  </td>

                  <td className="text-right font-medium text-xs">
                    <span className={ad.ctr >= 3.0 ? 'text-emerald-700 font-bold' : ad.ctr < 1.8 ? 'text-rose-600' : 'text-slate-800'}>
                      {ad.ctr.toFixed(2)}%
                    </span>
                  </td>

                  <td className="text-right font-medium text-xs text-slate-700">
                    {currencySymbol}{ad.cpc.toFixed(2)}
                  </td>

                  <td className="text-right font-bold text-xs text-slate-900">
                    {ad.conversions || ad.leads || 0}
                  </td>

                  <td className="text-right font-bold text-xs">
                    <span className={isWinner ? 'text-emerald-700' : isLoser ? 'text-rose-600' : 'text-slate-900'}>
                      {currencySymbol}{ad.cpa ? ad.cpa.toFixed(2) : '0.00'}
                    </span>
                  </td>

                  <td className="text-right font-bold text-xs">
                    <span className={ad.roas >= 3.5 ? 'text-emerald-700' : ad.roas < 2.0 && ad.spend > 1000 ? 'text-rose-600' : 'text-slate-900'}>
                      {ad.roas ? ad.roas.toFixed(2) + 'x' : '—'}
                    </span>
                  </td>

                  <td className="text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDrilldownAd(ad);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Inspect Creative & Performance Diagnosis"
                    >
                      <Eye className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-3xl w-full mx-auto overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{activeDrilldownAd.adName}</h3>
                    {getTierBadge(activeDrilldownAd.tier)}
                  </div>
                  <p className="text-xs text-slate-500">ID: {activeDrilldownAd.adId} | {activeDrilldownAd.campaign}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveDrilldownAd(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
              {/* Metric Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Spend</span>
                  <span className="font-bold text-slate-900 text-sm">{currencySymbol}{activeDrilldownAd.spend.toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Link CTR / CPC</span>
                  <span className="font-bold text-slate-900 text-sm">{activeDrilldownAd.ctr.toFixed(2)}% ({currencySymbol}{activeDrilldownAd.cpc.toFixed(2)})</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">Conversions / Leads</span>
                  <span className="font-bold text-emerald-700 text-sm">{activeDrilldownAd.conversions || 0}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 text-[11px] block">CPA / ROAS</span>
                  <span className="font-bold text-slate-900 text-sm">{currencySymbol}{activeDrilldownAd.cpa.toFixed(2)} ({activeDrilldownAd.roas.toFixed(2)}x)</span>
                </div>
              </div>

              {/* AI Tier Reasoning & Statistical Evidence */}
              <div className="bg-blue-50/40 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>Claude Performance Reasoning & Evidence</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                  {(activeDrilldownAd.tierReasoning || []).map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                  {(activeDrilldownAd.evidence || []).map((ev, idx) => (
                    <li key={`ev-${idx}`} className="text-slate-600 italic">{ev}</li>
                  ))}
                </ul>
              </div>

              {/* Ad Copy & Creative Inspection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50/50">
                  <span className="font-bold text-slate-800 block text-xs">Ad Copy & Hook</span>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Headline</span>
                      <p className="font-semibold text-slate-900">{activeDrilldownAd.headline || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Primary Text</span>
                      <p className="text-slate-700 whitespace-pre-line text-xs">{activeDrilldownAd.primaryText || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Call to Action</span>
                      <p className="font-semibold text-blue-700">{activeDrilldownAd.cta || 'Learn More'}</p>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50/50">
                  <span className="font-bold text-slate-800 block text-xs">Creative Asset & Links</span>
                  <div className="space-y-2 text-xs">
                    {creativeMap[activeDrilldownAd.adId]?.thumbnailUrl && (
                      <img
                        src={creativeMap[activeDrilldownAd.adId].thumbnailUrl}
                        alt=""
                        className="w-full h-32 object-cover rounded border border-slate-200"
                      />
                    )}
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Google Drive Link</span>
                      <p className="truncate text-blue-600 font-medium">
                        {activeDrilldownAd.driveUrl || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Destination Landing Page</span>
                      <p className="truncate text-blue-600 font-medium">
                        {activeDrilldownAd.landingPageUrl || 'Default client website'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Next Test */}
              {activeDrilldownAd.recommendedTest && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-900">
                  <span className="font-bold block mb-0.5">Recommended Action / Test:</span>
                  <span>{activeDrilldownAd.recommendedTest}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-end">
              <button
                onClick={() => setActiveDrilldownAd(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md font-semibold text-xs transition"
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
