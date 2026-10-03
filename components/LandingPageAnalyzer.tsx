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
      <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
              <Globe className="w-6 h-6 text-[#e2f976]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#141517]">Landing Page & Message-Match Intelligence</h3>
                <span className="text-[10px] font-black bg-[#141517] text-[#e2f976] px-3 py-1 rounded-full">
                  Score: {lpAnalysis.messageMatchScore}/10
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="font-semibold">URL:</span>
                <a
                  href={lpAnalysis.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#141517] font-bold hover:underline flex items-center gap-1 truncate max-w-md"
                >
                  {lpAnalysis.url}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Above-Fold Score</span>
              <span className="text-lg font-black text-[#141517]">{lpAnalysis.aboveFoldClarityScore}/10</span>
            </div>
            <div className="text-right pl-4 border-l border-[#f4f5f2]">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Form Friction</span>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#e2f976]/30 text-[#141517] border border-[#e2f976]">
                {lpAnalysis.formFrictionScore}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Message Match Chain Diagram */}
      <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#f4f5f2]">
          <div>
            <h4 className="text-sm font-extrabold text-[#141517]">Full-Funnel Message Match Continuity</h4>
            <p className="text-xs text-slate-500">
              Evaluating cognitive consistency from the initial ad hook down to the final booking form.
            </p>
          </div>
          <span className="text-xs font-bold text-[#141517] bg-[#e2f976] px-3 py-1 rounded-full shadow-2xs">
            Strong Core Alignment (Problem UGC)
          </span>
        </div>

        {/* 5-Step Alignment Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {/* Step 1 */}
          <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 text-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">1. Ad Hook (0-3s)</span>
              <p className="font-bold text-[#141517] line-clamp-3">"{lpAnalysis.alignmentChain.adHook}"</p>
            </div>
            <span className="mt-2 text-[10px] text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> High Curiosity
            </span>
          </div>

          {/* Step 2 */}
          <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 text-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">2. Ad Promise</span>
              <p className="font-bold text-[#141517] line-clamp-3">"{lpAnalysis.alignmentChain.adPromise}"</p>
            </div>
            <span className="mt-2 text-[10px] text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Specific Metric
            </span>
          </div>

          {/* Step 3 */}
          <div className="bg-[#e2f976]/20 border border-[#e2f976] rounded-2xl p-4 text-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-[#141517] block mb-1">3. LP Hero Headline</span>
              <p className="font-extrabold text-[#141517] line-clamp-3">"{lpAnalysis.alignmentChain.lpHeadline}"</p>
            </div>
            <span className="mt-2 text-[10px] text-[#141517] font-extrabold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#141517]" /> Verbatim Continuity
            </span>
          </div>

          {/* Step 4 */}
          <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 text-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">4. Landing Page Offer</span>
              <p className="font-bold text-[#141517] line-clamp-3">"{lpAnalysis.alignmentChain.lpOffer}"</p>
            </div>
            <span className="mt-2 text-[10px] text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Low Risk
            </span>
          </div>

          {/* Step 5 */}
          <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 text-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">5. Conversion Action</span>
              <p className="font-bold text-[#141517] line-clamp-3">Calendar Qualification Form</p>
            </div>
            <span className="mt-2 text-[10px] text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Filtered Intent
            </span>
          </div>
        </div>

        {/* Message Match Feedback */}
        <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 text-xs text-slate-700">
          <span className="font-bold text-[#141517] block mb-1">Conversion Diagnosis:</span>
          <p className="leading-relaxed">{lpAnalysis.messageMatchFeedback}</p>
        </div>
      </div>

      {/* Above Fold & CRO Teardown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Above the Fold Content Audit */}
        <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4 text-xs">
          <h4 className="font-extrabold text-[#141517] text-sm">Above-The-Fold Elements</h4>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Hero Headline</span>
              <p className="font-extrabold text-[#141517] text-sm mt-0.5">{lpAnalysis.headline}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Subheadline</span>
              <p className="text-slate-600 font-medium mt-0.5">{lpAnalysis.subheadline}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Main CTA Button</span>
              <p className="font-black text-[#141517] mt-0.5">{lpAnalysis.cta}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f4f5f2]">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2">Social Proof Elements</span>
            <div className="space-y-1.5">
              {lpAnalysis.proofElements.map((proof, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{proof}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CRO & Friction Recommendations */}
        <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4 text-xs">
          <h4 className="font-extrabold text-[#141517] text-sm">High-Impact CRO Recommendations</h4>

          <div className="space-y-3">
            {lpAnalysis.recommendedCROFixes.map((fix, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-[#fbfcfb] border border-[#eef0ec] p-4 rounded-2xl">
                <div className="w-7 h-7 rounded-xl bg-[#141517] text-[#e2f976] flex items-center justify-center flex-shrink-0 font-black text-xs">
                  {idx + 1}
                </div>
                <div>
                  <span className="font-bold text-[#141517] block mb-0.5">Optimization #{idx + 1}</span>
                  <span className="text-slate-600 leading-relaxed">{fix}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#f4f5f2]">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Objections Handled on Page</span>
            <div className="space-y-1.5">
              {lpAnalysis.objectionsAddressed.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-600 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
