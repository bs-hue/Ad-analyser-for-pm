'use client';

import React from 'react';
import { LandingPageAnalysis, UnifiedAdRecord } from '@/lib/types';
import { 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  Layers
} from 'lucide-react';

interface LandingPageAnalyzerProps {
  lpAnalysis: LandingPageAnalysis;
  records: UnifiedAdRecord[];
}

export const LandingPageAnalyzer: React.FC<LandingPageAnalyzerProps> = ({
  lpAnalysis,
  records
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Landing Page & Message-Match Intelligence</h3>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  Score: {lpAnalysis.messageMatchScore}/10
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <span>URL:</span>
                <a
                  href={lpAnalysis.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-0.5 truncate max-w-md font-medium"
                >
                  {lpAnalysis.url}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Above-Fold Score</span>
              <span className="text-lg font-extrabold text-indigo-700">{lpAnalysis.aboveFoldClarityScore}/10</span>
            </div>
            <div className="text-right pl-3 border-l border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Form Friction</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {lpAnalysis.formFrictionScore}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Message Match Chain Diagram */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Full-Funnel Message Match Continuity</h4>
            <p className="text-xs text-slate-500">
              Evaluating cognitive consistency from the initial ad hook down to the final booking form.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            Strong Core Alignment (Problem UGC)
          </span>
        </div>

        {/* 5-Step Alignment Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {/* Step 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">1. Ad Hook (0-3s)</span>
              <p className="font-semibold text-slate-900 line-clamp-3">"{lpAnalysis.alignmentChain.adHook}"</p>
            </div>
            <span className="mt-2 text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> High Curiosity
            </span>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">2. Ad Promise</span>
              <p className="font-semibold text-slate-900 line-clamp-3">"{lpAnalysis.alignmentChain.adPromise}"</p>
            </div>
            <span className="mt-2 text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Specific Metric
            </span>
          </div>

          {/* Step 3 */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3 text-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-blue-800 block mb-1">3. LP Hero Headline</span>
              <p className="font-bold text-slate-900 line-clamp-3">"{lpAnalysis.alignmentChain.lpHeadline}"</p>
            </div>
            <span className="mt-2 text-[10px] text-blue-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verbatim Continuity
            </span>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">4. Landing Page Offer</span>
              <p className="font-semibold text-slate-900 line-clamp-3">"{lpAnalysis.alignmentChain.lpOffer}"</p>
            </div>
            <span className="mt-2 text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Low Risk
            </span>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">5. Conversion Action</span>
              <p className="font-semibold text-slate-900 line-clamp-3">Calendar Qualification Form</p>
            </div>
            <span className="mt-2 text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Filtered Intent
            </span>
          </div>
        </div>

        {/* Message Match Feedback */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700">
          <span className="font-bold text-slate-900 block mb-0.5">Claude Conversion Diagnosis:</span>
          <p>{lpAnalysis.messageMatchFeedback}</p>
        </div>
      </div>

      {/* Above Fold & CRO Teardown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Above the Fold Content Audit */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 text-sm">Above-The-Fold Elements</h4>

          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Hero Headline</span>
              <p className="font-bold text-slate-900 text-sm">{lpAnalysis.headline}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Subheadline</span>
              <p className="text-slate-600 font-medium">{lpAnalysis.subheadline}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Main CTA Button</span>
              <p className="font-bold text-indigo-700">{lpAnalysis.cta}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Social Proof Elements</span>
            <div className="space-y-1">
              {lpAnalysis.proofElements.map((proof, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{proof}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CRO & Friction Recommendations */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 text-sm">High-Impact CRO Recommendations</h4>

          <div className="space-y-2.5">
            {lpAnalysis.recommendedCROFixes.map((fix, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Optimization #{idx + 1}</span>
                  <span className="text-slate-700">{fix}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Objections Handled on Page</span>
            <div className="space-y-1">
              {lpAnalysis.objectionsAddressed.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
