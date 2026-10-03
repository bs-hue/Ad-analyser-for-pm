'use client';

import React from 'react';
import { FunnelStage } from '@/lib/types';
import { 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowDown, 
  Layers
} from 'lucide-react';

interface FunnelDiagramProps {
  stages: FunnelStage[];
  currency: string;
}

export const FunnelDiagram: React.FC<FunnelDiagramProps> = ({ stages, currency }) => {
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  const getStatusBadge = (status: FunnelStage['status']) => {
    switch (status) {
      case 'Healthy':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-[#141517] text-[#e2f976]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#e2f976]" />
            Optimal Flow
          </span>
        );
      case 'Warning':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            Pacing Risk
          </span>
        );
      case 'Bottleneck':
        return (
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
            Critical Leakage
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#eef0ec] rounded-[32px] p-7 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f4f5f2]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
            <TrendingDown className="w-5 h-5 text-[#e2f976]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-[#141517] tracking-tight">Full-Funnel Friction Diagnosis</h3>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#141517] text-[#e2f976]">
                Deterministic
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Stage-by-stage drop-off tracking across the entire customer acquisition pipeline.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#141517] bg-[#f4f5f2] border border-[#eef0ec] px-4 py-2 rounded-full shadow-2xs">
          {stages.length} Funnel Stages Evaluated
        </span>
      </div>

      {/* Funnel Flow Cards */}
      <div className="space-y-4">
        {stages.map((stage, idx) => {
          const isRevenue = stage.name === 'Revenue';
          const isFirst = idx === 0;

          return (
            <div key={stage.name} className="relative">
              {!isFirst && (
                <div className="flex items-center justify-center my-2">
                  <div className="flex items-center gap-2 bg-[#f4f5f2] border border-[#eef0ec] px-4 py-1.5 rounded-full text-[11px] font-bold text-[#141517] shadow-2xs">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                    <span>Conversion Rate: <span className="font-extrabold text-[#141517]">{stage.rateFromPrevious}%</span></span>
                    <span className="text-slate-500 font-normal">
                      (Benchmark: {stage.benchmarkRate}%)
                    </span>
                  </div>
                </div>
              )}

              <div
                className={`border rounded-[28px] p-6 transition ${
                  stage.status === 'Bottleneck'
                    ? 'border-rose-200 bg-rose-50/60'
                    : stage.status === 'Warning'
                    ? 'border-amber-200 bg-amber-50/60'
                    : 'border-[#eef0ec] bg-[#fbfcfb]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-2xl bg-[#141517] text-[#e2f976] font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-[#141517] tracking-tight">{stage.name}</h4>
                        {getStatusBadge(stage.status)}
                      </div>
                      <span className="text-lg font-extrabold text-[#141517] tracking-tight">
                        {isRevenue ? `${currencySymbol}${stage.count.toLocaleString()}` : stage.count.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Diagnosis and Suggested Fix */}
                  <div className="sm:max-w-md text-xs space-y-1">
                    <p className="text-[#141517] font-semibold">{stage.diagnosis}</p>
                    <p className="text-slate-500 italic">
                      <span className="font-bold text-[#141517] not-italic">Fix: </span>
                      {stage.suggestedFix}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

