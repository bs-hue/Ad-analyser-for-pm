'use client';

import React from 'react';
import { HistoricalAnalysisRun, ClientProfile } from '@/lib/types';
import { 
  History, 
  Calendar, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Layers, 
  Zap,
  Clock
} from 'lucide-react';

interface HistoricalViewProps {
  history: HistoricalAnalysisRun[];
  client: ClientProfile;
}

export const HistoricalView: React.FC<HistoricalViewProps> = ({ history, client }) => {
  const currencySymbol = client.currency === 'USD' ? '$' : '₹';

  return (
    <div className="space-y-6">
      {/* Historical Intelligence Context Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
            <History className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Historical Client Learning Memory</h3>
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                60-Day Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              The AI strategy engine utilizes cumulative account memory so you never repeat failed angles and automatically build upon winning hook patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Historical Runs Timeline */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Previous Diagnostic Audits ({history.length})
        </h4>

        {history.map((run, idx) => (
          <div
            key={run.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                  #{history.length - idx}
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm">{run.dateRangeLabel}</span>
                  <span className="text-slate-400 block text-[11px]">Audit Timestamp: {run.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ROAS: {run.roas.toFixed(2)}x
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {currencySymbol}{run.totalSpend.toLocaleString()} Spend | {run.totalConversions} Conversions
                </span>
              </div>
            </div>

            {/* Run Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-[11px] uppercase flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Top Winning Hook:
                </span>
                <p className="text-slate-700 font-medium italic">"{run.topWinningHook}"</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-[11px] uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Key Strategic Finding:
                </span>
                <p className="text-slate-700">{run.keyFinding}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
