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
    <div className="max-w-5xl mx-auto space-y-8 py-6 text-slate-800">
      {/* Top Action Toolbar (hidden on print) */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
        <button
          onClick={onBackToWorkspace}
          className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          <span>Back to Workspace</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Report Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-1">
              Performance Marketing Intelligence Report
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {client.name} — Comprehensive Funnel & Creative Diagnosis
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {client.businessName} • Period: {diagnosis.dateRange} • Generated: {new Date(diagnosis.generatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-semibold">Engine</span>
            <span className="text-sm font-bold text-slate-900">Claude Strategic Reasoning</span>
          </div>
        </div>

        {/* 1. EXECUTIVE SUMMARY */}
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">1</span>
            Executive Summary
          </h2>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 text-xs leading-relaxed text-slate-700">
            {diagnosis.executiveSummary.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ACCOUNT PERFORMANCE */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">2</span>
          Account Performance Summary
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Total Spend</span>
            <span className="text-lg font-bold text-slate-900">{currencySymbol}{diagnosis.summary.totalSpend.toLocaleString()}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Total Revenue</span>
            <span className="text-lg font-bold text-slate-900">{currencySymbol}{diagnosis.summary.totalRevenue.toLocaleString()}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Blended ROAS</span>
            <span className="text-lg font-extrabold text-emerald-700">{diagnosis.summary.blendedRoas.toFixed(2)}x</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Average CPA / CPL</span>
            <span className="text-lg font-bold text-slate-900">{currencySymbol}{diagnosis.summary.averageCpa.toFixed(2)}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Total Conversions</span>
            <span className="text-lg font-bold text-slate-900">{diagnosis.summary.totalPurchases || diagnosis.summary.totalLeads}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Link CTR</span>
            <span className="text-lg font-bold text-slate-900">{diagnosis.summary.averageCtr.toFixed(2)}%</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Average CPC</span>
            <span className="text-lg font-bold text-slate-900">{currencySymbol}{diagnosis.summary.averageCpc.toFixed(2)}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Active Winners</span>
            <span className="text-lg font-bold text-emerald-700">{diagnosis.summary.strongPerformersCount} Ads</span>
          </div>
        </div>
      </div>

      {/* 3. WHAT IS WORKING */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">3</span>
          What Is Working (Winning Patterns)
        </h2>

        <div className="space-y-4">
          {diagnosis.winningPatterns.map((pat) => (
            <div key={pat.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{pat.title}</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Avg ROAS: {pat.averageRoas.toFixed(2)}x | Avg CPA: {currencySymbol}{pat.averageCpa.toFixed(2)}
                </span>
              </div>
              <p className="text-slate-700">{pat.patternDescription}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. WHAT IS NOT WORKING */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">4</span>
          What Is Not Working (Underperforming Ads)
        </h2>

        <div className="space-y-3">
          {diagnosis.underperformingDiagnosis.map((item) => (
            <div key={item.adId} className="border border-slate-200 rounded-lg p-3 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{item.adName}</span>
                <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Issue: {item.possibleIssue} (CPA: {currencySymbol}{item.cpa.toFixed(2)})
                </span>
              </div>
              <p className="text-slate-600">{item.evidence}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FUNNEL DIAGNOSIS */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">5</span>
          Full Funnel Diagnosis
        </h2>

        <div className="space-y-2 text-xs">
          {diagnosis.funnelStages.map((stg) => (
            <div key={stg.name} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <span className="font-bold text-slate-900">{stg.name}</span>
                <p className="text-slate-600 text-[11px]">{stg.diagnosis}</p>
              </div>
              <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${stg.status === 'Healthy' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {stg.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. WHAT TO STOP / AVOID */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">6</span>
          What To Stop / Patterns To Avoid
        </h2>

        <div className="space-y-3 text-xs">
          {diagnosis.patternsToAvoid.map((av) => (
            <div key={av.id} className="bg-rose-50/40 border border-rose-200 rounded-lg p-4 space-y-1.5">
              <span className="font-bold text-rose-900">{av.patternName}</span>
              <p className="text-slate-700">{av.evidenceExplanation}</p>
              <p className="text-rose-800 font-semibold pt-1 border-t border-rose-200/60">
                Rule: {av.actionableAvoidRule}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. NEXT 7 DAYS ACTION PLAN */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">7</span>
          Next 7-Day Prioritized Action Plan
        </h2>

        <div className="space-y-3 text-xs">
          {diagnosis.next7DaysPlan.map((act) => (
            <div key={act.id} className="border border-slate-200 rounded-lg p-4 space-y-1 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{act.title}</span>
                <span className="font-bold text-blue-700 text-[10px] bg-blue-50 px-2 py-0.5 rounded">
                  {act.priority}
                </span>
              </div>
              <p className="text-slate-700"><strong>Action:</strong> {act.action}</p>
              <p className="text-slate-600 italic"><strong>Why & KPI:</strong> {act.why} (Target: {act.kpi})</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
