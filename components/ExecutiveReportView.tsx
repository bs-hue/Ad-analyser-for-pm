'use client';

import React from 'react';
import { AccountDiagnosisResult, ClientProfile } from '@/lib/types';
import { 
  Printer, 
  FileDown, 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  Layers, 
  Calendar, 
  Globe, 
  Award, 
  Sparkles,
  TrendingUp,
  AlertOctagon,
  ArrowRight
} from 'lucide-react';

interface ExecutiveReportViewProps {
  diagnosis: AccountDiagnosisResult;
  client: ClientProfile;
  onBackToWorkspace: () => void;
}

export const ExecutiveReportView: React.FC<ExecutiveReportViewProps> = ({
  diagnosis,
  client,
  onBackToWorkspace
}) => {
  const currencySymbol = client.currency === 'USD' ? '$' : '₹';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 text-slate-800">
      {/* Top Action Toolbar (hidden on print) */}
      <div className="no-print bg-white border border-[#eef0ec] rounded-[32px] p-4 shadow-2xs flex items-center justify-between">
        <button
          onClick={onBackToWorkspace}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#f4f5f2] hover:bg-[#e8eae4] rounded-full text-xs font-bold text-slate-800 transition"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          <span>Back to Workspace</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#141517] hover:bg-black text-[#e2f976] rounded-full text-xs font-black shadow-sm transition"
          >
            <Printer className="w-4 h-4 text-[#e2f976]" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Report Header Card */}
      <div className="bg-white border border-[#eef0ec] rounded-[32px] p-8 shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#f4f5f2] pb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#141517] text-[#e2f976] px-3 py-1 rounded-full inline-block mb-2">
              Performance Marketing Intelligence Report
            </span>
            <h1 className="text-2xl font-extrabold text-[#141517] tracking-tight">
              {client.name} — Comprehensive Funnel & Creative Diagnosis
            </h1>
            <p className="text-xs text-slate-500 mt-1.5">
              {client.businessName} • Period: {diagnosis.dateRange} • Generated: {new Date(diagnosis.generatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-semibold">Engine</span>
            <span className="text-sm font-extrabold text-[#141517]">Multimodal Diagnostic Reasoning</span>
          </div>
        </div>

        {/* 1. EXECUTIVE SUMMARY */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#141517] flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#141517] text-[#e2f976] text-[11px] font-black flex items-center justify-center">1</span>
            Executive Summary
          </h2>
          <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-6 space-y-2.5 text-xs leading-relaxed text-slate-700">
            {diagnosis.executiveSummary.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold text-slate-800">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ACCOUNT PERFORMANCE */}
      <div className="bg-white border border-[#eef0ec] rounded-[32px] p-8 shadow-2xs space-y-5">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#141517] flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#141517] text-[#e2f976] text-[11px] font-black flex items-center justify-center">2</span>
          Account Performance Summary
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-xs">
          <div className="bg-[#fbfcfb] p-4 rounded-2xl border border-[#eef0ec]">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Total Spend</span>
            <span className="text-lg font-black text-[#141517]">{currencySymbol}{diagnosis.summary.totalSpend.toLocaleString()}</span>
          </div>
          <div className="bg-[#fbfcfb] p-4 rounded-2xl border border-[#eef0ec]">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Total Revenue</span>
            <span className="text-lg font-black text-[#141517]">{currencySymbol}{diagnosis.summary.totalRevenue.toLocaleString()}</span>
          </div>
          <div className="bg-[#fbfcfb] p-4 rounded-2xl border border-[#eef0ec]">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Blended ROAS</span>
            <span className="text-lg font-black text-emerald-700">{diagnosis.summary.blendedRoas.toFixed(2)}x</span>
          </div>
          <div className="bg-[#fbfcfb] p-4 rounded-2xl border border-[#eef0ec]">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Average CPA / CPL</span>
            <span className="text-lg font-black text-[#141517]">{currencySymbol}{diagnosis.summary.averageCpa.toFixed(2)}</span>
          </div>
          <div className="bg-[#fbfcfb] p-4 rounded-2xl border border-[#eef0ec]">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Total Conversions</span>
            <span className="text-lg font-black text-[#141517]">{diagnosis.summary.totalPurchases || diagnosis.summary.totalLeads}</span>
          </div>
          <div className="bg-[#fbfcfb] p-4 rounded-2xl border border-[#eef0ec]">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Link CTR</span>
            <span className="text-lg font-black text-[#141517]">{diagnosis.summary.averageCtr.toFixed(2)}%</span>
          </div>
          <div className="bg-[#fbfcfb] p-4 rounded-2xl border border-[#eef0ec]">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Average CPC</span>
            <span className="text-lg font-black text-[#141517]">{currencySymbol}{diagnosis.summary.averageCpc.toFixed(2)}</span>
          </div>
          <div className="bg-[#fbfcfb] p-4 rounded-2xl border border-[#eef0ec]">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Active Winners</span>
            <span className="text-lg font-black text-emerald-700">{diagnosis.summary.strongPerformersCount} Ads</span>
          </div>
        </div>
      </div>

      {/* 3. WHAT IS WORKING */}
      <div className="bg-white border border-[#eef0ec] rounded-[32px] p-8 shadow-2xs space-y-5">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#141517] flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#141517] text-[#e2f976] text-[11px] font-black flex items-center justify-center">3</span>
          What Is Working (Winning Patterns)
        </h2>

        <div className="space-y-4">
          {diagnosis.winningPatterns.map((pat) => (
            <div key={pat.id} className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#141517] text-sm">{pat.title}</span>
                <span className="font-black text-[#141517] bg-[#e2f976] px-3 py-1 rounded-full text-[11px]">
                  Avg ROAS: {pat.averageRoas.toFixed(2)}x | Avg CPA: {currencySymbol}{pat.averageCpa.toFixed(2)}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">{pat.patternDescription}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. WHAT IS NOT WORKING */}
      <div className="bg-white border border-[#eef0ec] rounded-[32px] p-8 shadow-2xs space-y-5">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#141517] flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#141517] text-[#e2f976] text-[11px] font-black flex items-center justify-center">4</span>
          What Is Not Working (Underperforming Ads)
        </h2>

        <div className="space-y-3">
          {diagnosis.underperformingDiagnosis.map((item) => (
            <div key={item.adId} className="border border-[#eef0ec] bg-[#fbfcfb] rounded-2xl p-4 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#141517]">{item.adName}</span>
                <span className="text-rose-800 font-bold bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  Issue: {item.possibleIssue} (CPA: {currencySymbol}{item.cpa.toFixed(2)})
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{item.evidence}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FUNNEL DIAGNOSIS */}
      <div className="bg-white border border-[#eef0ec] rounded-[32px] p-8 shadow-2xs space-y-5">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#141517] flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#141517] text-[#e2f976] text-[11px] font-black flex items-center justify-center">5</span>
          Full Funnel Diagnosis
        </h2>

        <div className="space-y-2.5 text-xs">
          {diagnosis.funnelStages.map((stg) => (
            <div key={stg.name} className="flex items-center justify-between p-4 bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl">
              <div>
                <span className="font-extrabold text-[#141517]">{stg.name}</span>
                <p className="text-slate-600 text-[11px] mt-0.5">{stg.diagnosis}</p>
              </div>
              <span className={`font-black px-3 py-1 rounded-full text-[11px] ${stg.status === 'Healthy' ? 'bg-[#e2f976]/30 text-[#141517] border border-[#e2f976]' : 'bg-amber-100 text-amber-900 border border-amber-300'}`}>
                {stg.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. WHAT TO STOP / AVOID */}
      <div className="bg-white border border-[#eef0ec] rounded-[32px] p-8 shadow-2xs space-y-5">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#141517] flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#141517] text-[#e2f976] text-[11px] font-black flex items-center justify-center">6</span>
          What To Stop / Patterns To Avoid
        </h2>

        <div className="space-y-3.5 text-xs">
          {diagnosis.patternsToAvoid.map((av) => (
            <div key={av.id} className="bg-rose-50/20 border border-rose-200/80 rounded-2xl p-5 space-y-2">
              <span className="font-extrabold text-rose-950 text-sm">{av.patternName}</span>
              <p className="text-slate-700 leading-relaxed">{av.evidenceExplanation}</p>
              <p className="text-rose-900 font-bold pt-2 border-t border-rose-200/60">
                Rule: {av.actionableAvoidRule}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. NEXT 7 DAYS ACTION PLAN */}
      <div className="bg-white border border-[#eef0ec] rounded-[32px] p-8 shadow-2xs space-y-5">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#141517] flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#141517] text-[#e2f976] text-[11px] font-black flex items-center justify-center">7</span>
          Next 7-Day Prioritized Action Plan
        </h2>

        <div className="space-y-3.5 text-xs">
          {diagnosis.next7DaysPlan.map((act) => (
            <div key={act.id} className="border border-[#eef0ec] rounded-2xl p-5 space-y-2 bg-[#fbfcfb]">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#141517] text-sm">{act.title}</span>
                <span className="font-black text-[#141517] text-[10px] bg-[#e2f976] px-3 py-1 rounded-full">
                  {act.priority}
                </span>
              </div>
              <p className="text-slate-800"><strong>Action:</strong> {act.action}</p>
              <p className="text-slate-600 italic"><strong>Why & KPI:</strong> {act.why} (Target: {act.kpi})</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
