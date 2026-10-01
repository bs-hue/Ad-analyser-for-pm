'use client';

import React from 'react';
import { FunnelStage } from '@/lib/types';
import { 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowDown, 
  HelpCircle,
  Filter,
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
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Healthy
          </span>
        );
      case 'Warning':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Warning
          </span>
        );
      case 'Bottleneck':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Funnel Leakage
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Step-by-Step Funnel Leakage Diagnosis</h3>
          <p className="text-xs text-slate-500">
            Stage-by-stage drop-off tracking across the entire customer acquisition pipeline.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-md">
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
                <div className="flex items-center justify-center my-1.5">
                  <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-0.5 rounded-full text-[11px] font-bold text-slate-600">
                    <ArrowDown className="w-3 h-3 text-slate-400" />
                    <span>Conversion Rate: {stage.rateFromPrevious}%</span>
                    <span className="text-slate-400 font-normal">
                      (Benchmark: {stage.benchmarkRate}%)
                    </span>
                  </div>
                </div>
              )}

              <div
                className={`border rounded-xl p-4 transition ${
                  stage.status === 'Bottleneck'
                    ? 'border-rose-300 bg-rose-50/20'
                    : stage.status === 'Warning'
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-slate-200 bg-slate-50/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">{stage.name}</h4>
                        {getStatusBadge(stage.status)}
                      </div>
                      <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                        {isRevenue ? `${currencySymbol}${stage.count.toLocaleString()}` : stage.count.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Diagnosis and Suggested Fix */}
                  <div className="sm:max-w-md text-xs space-y-1">
                    <p className="text-slate-800 font-medium">{stage.diagnosis}</p>
                    <p className="text-slate-500 italic">
                      <span className="font-semibold text-blue-700 not-italic">Fix: </span>
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
