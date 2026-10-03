'use client';

import React, { useState } from 'react';
import { 
  WinningPattern, 
  AvoidPattern, 
  ActionPlanItem, 
  RootCauseCategory 
} from '@/lib/types';
import { 
  Sparkles, 
  Award, 
  AlertOctagon, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Flame, 
  TrendingUp, 
  Copy, 
  Check, 
  Video, 
  FileText, 
  Lightbulb, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface AIRecommendationsProps {
  winningPatterns: WinningPattern[];
  patternsToAvoid: AvoidPattern[];
  next7DaysPlan: ActionPlanItem[];
  underperformingDiagnosis: {
    adId: string;
    adName: string;
    spend: number;
    cpa: number;
    ctr: number;
    possibleIssue: RootCauseCategory;
    evidence: string;
    recommendedTest: string;
  }[];
  currency: string;
  onOpenAdGenerator: () => void;
  selectedSubTabFilter?: '7days' | 'winners' | 'underperforming' | 'avoid';
  onSubTabFilterChange?: (tab: '7days' | 'winners' | 'underperforming' | 'avoid') => void;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  winningPatterns,
  patternsToAvoid,
  next7DaysPlan,
  underperformingDiagnosis,
  currency,
  onOpenAdGenerator,
  selectedSubTabFilter,
  onSubTabFilterChange
}) => {
  const currencySymbol = currency === 'USD' ? '$' : '₹';
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [internalSubTab, setInternalSubTab] = useState<'7days' | 'winners' | 'underperforming' | 'avoid'>('7days');
  const activeSubTab = selectedSubTabFilter !== undefined ? selectedSubTabFilter : internalSubTab;
  const handleSubTabChange = (tab: '7days' | 'winners' | 'underperforming' | 'avoid') => {
    setInternalSubTab(tab);
    if (onSubTabFilterChange) onSubTabFilterChange(tab);
  };
  const [expandedPatternId, setExpandedPatternId] = useState<string>(winningPatterns[0]?.id || '');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top AI Navigation Tabs */}
      <div className="bg-white border border-[#eef0ec] rounded-full p-2 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center flex-wrap gap-1.5 text-xs font-bold">
          <button
            onClick={() => handleSubTabChange('7days')}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full transition ${
              activeSubTab === '7days'
                ? 'bg-[#141517] text-[#e2f976] shadow-xs font-black'
                : 'text-slate-600 hover:text-[#141517] hover:bg-[#f4f5f2]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Next 7-Day Plan ({next7DaysPlan.length})</span>
          </button>

          <button
            onClick={() => handleSubTabChange('winners')}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full transition ${
              activeSubTab === 'winners'
                ? 'bg-[#141517] text-[#e2f976] shadow-xs font-black'
                : 'text-slate-600 hover:text-[#141517] hover:bg-[#f4f5f2]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Winning Angles ({winningPatterns.length})</span>
          </button>

          <button
            onClick={() => handleSubTabChange('underperforming')}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full transition ${
              activeSubTab === 'underperforming'
                ? 'bg-[#141517] text-[#e2f976] shadow-xs font-black'
                : 'text-slate-600 hover:text-[#141517] hover:bg-[#f4f5f2]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Underperforming ({underperformingDiagnosis.length})</span>
          </button>

          <button
            onClick={() => handleSubTabChange('avoid')}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full transition ${
              activeSubTab === 'avoid'
                ? 'bg-[#141517] text-[#e2f976] shadow-xs font-black'
                : 'text-slate-600 hover:text-[#141517] hover:bg-[#f4f5f2]'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Patterns To Avoid ({patternsToAvoid.length})</span>
          </button>
        </div>

        <button
          onClick={onOpenAdGenerator}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#141517] hover:bg-black text-[#e2f976] rounded-full text-xs font-black shadow-xs transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#e2f976]" />
          <span>Launch Ad Generator</span>
        </button>
      </div>

      {/* SUB-TAB 1: NEXT 7-DAY ACTION PLAN (Section 26) */}
      {activeSubTab === '7days' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs">
            <h3 className="text-base font-extrabold text-[#141517] tracking-tight">Prioritized 7-Day Creative & Scaling Roadmap</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Action items categorized into Immediate fixes, Controlled experiments, and Future exploration—anchored with exact deterministic metrics.
            </p>
          </div>

          <div className="space-y-4">
            {next7DaysPlan.map((item) => {
              const isP1 = item.priority.includes('PRIORITY 1');
              const isP2 = item.priority.includes('PRIORITY 2');

              return (
                <div
                  key={item.id}
                  className={`bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4 transition ${
                    isP1 ? 'border-l-4 border-l-rose-500' : isP2 ? 'border-l-4 border-l-[#141517]' : 'border-l-4 border-l-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                          isP1
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : isP2
                            ? 'bg-[#141517] text-[#e2f976]'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.priority}
                      </span>
                      <span className="text-[10px] font-black bg-[#f4f5f2] text-[#141517] px-3 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-[#141517] bg-[#f4f5f2] border border-[#eef0ec] px-3.5 py-1 rounded-full shadow-2xs">
                      Target KPI: {item.kpi}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-[#141517] tracking-tight">{item.title}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#fbfcfb] p-4 rounded-2xl border border-[#eef0ec] space-y-1">
                      <span className="font-black uppercase tracking-wider text-[10px] text-slate-400 block">Specific Action:</span>
                      <p className="text-[#141517] font-semibold">{item.action}</p>
                    </div>

                    <div className="bg-[#fbfcfb] p-4 rounded-2xl border border-[#eef0ec] space-y-1">
                      <span className="font-black uppercase tracking-wider text-[10px] text-slate-400 block">Why (Strategic Rationale):</span>
                      <p className="text-slate-700 font-medium">{item.why}</p>
                    </div>
                  </div>

                  <div className="bg-[#141517] text-white p-4 rounded-2xl text-xs space-y-1.5 shadow-xs">
                    <div className="flex items-center gap-2 font-extrabold text-[#e2f976]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#e2f976]" />
                      <span>Supporting Evidence & Target Outcome</span>
                    </div>
                    <p className="text-slate-200 italic">"{item.supportingEvidence}"</p>
                    <p className="text-slate-300 pt-1.5 border-t border-white/10 font-bold">
                      Expected Learning: {item.expectedLearning}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: WINNING PATTERNS & NEW VARIATIONS (Sections 21 & 22) */}
      {activeSubTab === 'winners' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs">
            <h3 className="text-base font-extrabold text-[#141517] tracking-tight">Creative Patterns & High-Performing Angles</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identified winning angles across multiple ads, accompanied by 5 new hooks, 3 copy variations, 3 headlines, and ready-to-test UGC & video concepts.
            </p>
          </div>

          <div className="space-y-6">
            {winningPatterns.map((pattern) => {
              const isExpanded = expandedPatternId === pattern.id;

              return (
                <div
                  key={pattern.id}
                  className="bg-white border border-[#eef0ec] rounded-[32px] overflow-hidden shadow-2xs space-y-4 p-6"
                >
                  {/* Pattern Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f4f5f2]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black px-3 py-1 rounded-full bg-[#141517] text-[#e2f976] uppercase tracking-wider">
                          {pattern.type} Pattern
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">{pattern.frequency}</span>
                      </div>
                      <h4 className="font-extrabold text-base text-[#141517]">{pattern.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 max-w-3xl">{pattern.patternDescription}</p>
                    </div>

                    <div className="flex items-center gap-3 bg-[#fbfcfb] border border-[#eef0ec] px-5 py-2.5 rounded-2xl text-center flex-shrink-0 shadow-2xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Avg ROAS</span>
                        <span className="text-base font-extrabold text-[#141517]">{pattern.averageRoas.toFixed(2)}x</span>
                      </div>
                      <div className="pl-3 border-l border-[#eef0ec]">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Avg CPA</span>
                        <span className="text-base font-extrabold text-[#141517]">{currencySymbol}{pattern.averageCpa.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 22: Generative Variations based on winning insight */}
                  <div className="space-y-5 pt-2">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Winning Insight $\rightarrow$ New Iterations & Scripts</span>
                    </h5>

                    {/* 5 New Hooks */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2.5">
                      <span className="text-xs font-bold text-slate-900 block">5 New 0-3 Second Hooks to Test:</span>
                      <div className="space-y-2">
                        {pattern.newHooks.map((hook, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-slate-200 rounded-md p-2.5 flex items-center justify-between gap-3 text-xs"
                          >
                            <span className="text-slate-800 font-medium italic">{hook}</span>
                            <button
                              onClick={() => copyToClipboard(hook, `hook-${pattern.id}-${idx}`)}
                              className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-50 flex-shrink-0 transition"
                              title="Copy Hook"
                            >
                              {copiedText === `hook-${pattern.id}-${idx}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Copy & Headlines Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* 3 Primary Text Variations */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2.5">
                        <span className="font-bold text-slate-900 block">3 Primary Copy Variations:</span>
                        <div className="space-y-2">
                          {pattern.newPrimaryTexts.map((copy, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-md p-3 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-blue-700 uppercase">Angle #{idx + 1}</span>
                                <button
                                  onClick={() => copyToClipboard(copy, `copy-${pattern.id}-${idx}`)}
                                  className="p-1 text-slate-400 hover:text-blue-600"
                                >
                                  {copiedText === `copy-${pattern.id}-${idx}` ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                              <p className="text-slate-700 whitespace-pre-line text-[11px]">{copy}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Headlines, CTAs & Creative Concepts */}
                      <div className="space-y-4">
                        {/* Headlines & CTAs */}
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                          <span className="font-bold text-slate-900 block">3 Headline & CTA Variations:</span>
                          <div className="space-y-1.5">
                            {pattern.newHeadlines.map((head, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200 text-xs">
                                <span className="font-semibold text-slate-800">{head}</span>
                                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                  {pattern.newCtas[idx] || 'Learn More'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 5 Creative Concepts */}
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                          <span className="font-bold text-slate-900 block">5 Visual Creative Concepts:</span>
                          <div className="space-y-1 text-[11px] text-slate-700">
                            {pattern.newCreativeConcepts.map((concept, idx) => (
                              <div key={idx} className="flex items-start gap-1.5">
                                <span className="font-bold text-blue-600">{idx + 1}.</span>
                                <span>{concept}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* UGC & Video Concepts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-blue-50/40 border border-blue-100 rounded-lg p-4 space-y-2">
                        <span className="font-bold text-blue-950 block">2 UGC Concepts:</span>
                        <div className="space-y-2">
                          {pattern.newUgcConcepts.map((ugc, idx) => (
                            <div key={idx} className="bg-white p-2.5 rounded border border-blue-200/60 text-[11px] text-slate-700">
                              <span className="font-bold text-blue-700 block mb-0.5">UGC Prompt #{idx + 1}</span>
                              <p>{ugc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-indigo-50/40 border border-indigo-100 rounded-lg p-4 space-y-2">
                        <span className="font-bold text-indigo-950 block">2 Video Storyboard Concepts:</span>
                        <div className="space-y-2">
                          {pattern.newVideoConcepts.map((vid, idx) => (
                            <div key={idx} className="bg-white p-2.5 rounded border border-indigo-200/60 text-[11px] text-slate-700">
                              <span className="font-bold text-indigo-700 block mb-0.5">Video Script #{idx + 1}</span>
                              <p>{vid}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: WHAT IS NOT WORKING? (Section 23) */}
      {activeSubTab === 'underperforming' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs">
            <h3 className="text-base font-extrabold text-[#141517] tracking-tight">WHAT IS NOT WORKING? (Underperforming Ads Diagnosis)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specific root-cause categorization (Hook vs LP vs Creative vs Offer) with evidence and corrective tests.
            </p>
          </div>

          <div className="space-y-4">
            {underperformingDiagnosis.map((item) => (
              <div
                key={item.adId}
                className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f4f5f2]">
                  <div>
                    <span className="font-extrabold text-sm text-[#141517]">{item.adName}</span>
                    <span className="text-slate-400 block text-[11px] font-semibold">ID: {item.adId}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-black text-[10px] uppercase bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-full">
                      Issue: {item.possibleIssue}
                    </span>
                    <span className="text-[#141517] bg-[#f4f5f2] border border-[#eef0ec] px-3.5 py-1 rounded-full font-bold text-[11px]">
                      Spend: {currencySymbol}{item.spend.toLocaleString()} | CPA: {currencySymbol}{item.cpa.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-rose-50/40 border border-rose-100 p-4 rounded-2xl space-y-1">
                    <span className="font-black text-rose-900 block text-[10px] uppercase tracking-wider">Diagnostic Evidence:</span>
                    <p className="text-slate-700">{item.evidence}</p>
                  </div>

                  <div className="bg-[#fbfcfb] border border-[#eef0ec] p-4 rounded-2xl space-y-1">
                    <span className="font-black text-[#141517] block text-[10px] uppercase tracking-wider">Recommended Corrective Test:</span>
                    <p className="text-slate-700">{item.recommendedTest}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PATTERNS TO AVOID (Section 24) */}
      {activeSubTab === 'avoid' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs">
            <h3 className="text-base font-extrabold text-[#141517] tracking-tight">PATTERNS TO AVOID (Account Negative Playbook)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evidence-backed negative patterns observed across client campaigns to eliminate recurring waste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {patternsToAvoid.map((avoid) => (
              <div
                key={avoid.id}
                className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-[10px] uppercase bg-rose-50 text-rose-800 px-3 py-1 rounded-full border border-rose-200">
                      {avoid.category} Issue
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{avoid.occurrenceCount} ad instances</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-[#141517]">{avoid.patternName}</h4>
                  <p className="text-slate-600 mt-2 text-[11px] leading-relaxed">{avoid.evidenceExplanation}</p>
                </div>

                <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 mt-3">
                  <span className="font-black text-rose-900 block text-[10px] uppercase mb-0.5">Strict Rule:</span>
                  <p className="text-rose-900 font-bold text-[11px]">{avoid.actionableAvoidRule}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
