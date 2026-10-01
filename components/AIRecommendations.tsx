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
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  winningPatterns,
  patternsToAvoid,
  next7DaysPlan,
  underperformingDiagnosis,
  currency,
  onOpenAdGenerator
}) => {
  const currencySymbol = currency === 'USD' ? '$' : '₹';
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'7days' | 'winners' | 'underperforming' | 'avoid'>('7days');
  const [expandedPatternId, setExpandedPatternId] = useState<string>(winningPatterns[0]?.id || '');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top AI Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center flex-wrap gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('7days')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition ${
              activeSubTab === '7days'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Next 7-Day Action Plan ({next7DaysPlan.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('winners')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition ${
              activeSubTab === 'winners'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>What Worked & New Variations ({winningPatterns.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('underperforming')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition ${
              activeSubTab === 'underperforming'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>What Didn't Work ({underperformingDiagnosis.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('avoid')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition ${
              activeSubTab === 'avoid'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Patterns To Avoid ({patternsToAvoid.length})</span>
          </button>
        </div>

        <button
          onClick={onOpenAdGenerator}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Ad Generator</span>
        </button>
      </div>

      {/* SUB-TAB 1: NEXT 7-DAY ACTION PLAN (Section 26) */}
      {activeSubTab === '7days' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">WHAT SHOULD WE DO NEXT? (Prioritized Roadmap)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Action items categorized into Immediate fixes, Controlled experiments, and Future exploration—each anchored with exact KPIs and learnings.
            </p>
          </div>

          <div className="space-y-3">
            {next7DaysPlan.map((item) => {
              const isP1 = item.priority.includes('PRIORITY 1');
              const isP2 = item.priority.includes('PRIORITY 2');

              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-xl p-5 shadow-sm space-y-3 transition ${
                    isP1 ? 'border-l-4 border-l-rose-500' : isP2 ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-slate-400'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          isP1
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isP2
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.priority}
                      </span>
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded">
                      Target KPI: {item.kpi}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">Specific Action:</span>
                      <p className="text-slate-700">{item.action}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">Why (Strategic Rationale):</span>
                      <p className="text-slate-700">{item.why}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50/40 p-3 rounded-lg border border-blue-100 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-blue-950">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Supporting Evidence & Expected Learning</span>
                    </div>
                    <p className="text-slate-700 italic">"{item.supportingEvidence}"</p>
                    <p className="text-slate-600 pt-1 border-t border-blue-100 font-medium">
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
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">WHAT IS WORKING? (Winning Creative Patterns)</h3>
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
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm space-y-4 p-6"
                >
                  {/* Pattern Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                          {pattern.type} Pattern
                        </span>
                        <span className="text-xs text-slate-500">{pattern.frequency}</span>
                      </div>
                      <h4 className="font-extrabold text-base text-slate-900">{pattern.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 max-w-3xl">{pattern.patternDescription}</p>
                    </div>

                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center flex-shrink-0">
                      <div>
                        <span className="text-[10px] text-emerald-700 font-bold uppercase block">Avg ROAS</span>
                        <span className="text-base font-extrabold text-emerald-900">{pattern.averageRoas.toFixed(2)}x</span>
                      </div>
                      <div className="pl-3 border-l border-emerald-200">
                        <span className="text-[10px] text-emerald-700 font-bold uppercase block">Avg CPA</span>
                        <span className="text-base font-extrabold text-emerald-900">{currencySymbol}{pattern.averageCpa.toFixed(2)}</span>
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
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">WHAT IS NOT WORKING? (Underperforming Ads Diagnosis)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specific root-cause categorization (Hook vs LP vs Creative vs Offer) with evidence and corrective tests.
            </p>
          </div>

          <div className="space-y-3">
            {underperformingDiagnosis.map((item) => (
              <div
                key={item.adId}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <span className="font-bold text-sm text-slate-900">{item.adName}</span>
                    <span className="text-slate-400 block text-[11px]">ID: {item.adId}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[10px] uppercase bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                      Issue: {item.possibleIssue}
                    </span>
                    <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold text-[11px]">
                      Spend: {currencySymbol}{item.spend.toLocaleString()} | CPA: {currencySymbol}{item.cpa.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-rose-50/30 border border-rose-100 p-3 rounded-lg space-y-1">
                    <span className="font-bold text-rose-900 block">Diagnostic Evidence:</span>
                    <p className="text-slate-700">{item.evidence}</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-1">
                    <span className="font-bold text-slate-900 block">Recommended Corrective Test:</span>
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
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">PATTERNS TO AVOID (Account Negative Playbook)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evidence-backed negative patterns observed across client campaigns to eliminate recurring waste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {patternsToAvoid.map((avoid) => (
              <div
                key={avoid.id}
                className="bg-white border border-rose-200 rounded-xl p-5 shadow-sm space-y-3 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[10px] uppercase bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                      {avoid.category} Issue
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{avoid.occurrenceCount} ad instances</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{avoid.patternName}</h4>
                  <p className="text-slate-600 mt-2 text-[11px] leading-relaxed">{avoid.evidenceExplanation}</p>
                </div>

                <div className="bg-rose-50 p-3 rounded-lg border border-rose-200 mt-2">
                  <span className="font-bold text-rose-900 block text-[10px] uppercase mb-0.5">Strict Rule:</span>
                  <p className="text-rose-800 font-medium text-[11px]">{avoid.actionableAvoidRule}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
