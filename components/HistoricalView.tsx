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
      <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
            <History className="w-5 h-5 text-[#e2f976]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-[#141517] tracking-tight">Historical Client Learning Memory</h3>
              <span className="text-[10px] font-black bg-[#141517] text-[#e2f976] px-3 py-1 rounded-full uppercase tracking-wider">
                60-Day Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              The AI strategy engine utilizes cumulative account memory so you never repeat failed angles and automatically build upon winning hook patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Historical Runs Timeline */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#141517] px-2">
          Previous Diagnostic Audits ({history.length})
        </h4>

        {history.map((run, idx) => (
          <div
            key={run.id}
            className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f4f5f2]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-black text-xs shadow-2xs">
                  #{history.length - idx}
                </div>
                <div>
                  <span className="font-extrabold text-[#141517] text-sm">{run.dateRangeLabel}</span>
                  <span className="text-slate-400 block text-[11px] font-medium">Audit Timestamp: {run.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-[#141517] text-[#e2f976]">
                  ROAS: {run.roas.toFixed(2)}x
                </span>
                <span className="text-xs font-bold text-[#141517] bg-[#f4f5f2] border border-[#eef0ec] px-4 py-1.5 rounded-full">
                  {currencySymbol}{run.totalSpend.toLocaleString()} Spend • {run.totalConversions} Conversions
                </span>
              </div>
            </div>

            {/* Run Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#fbfcfb] p-4 rounded-2xl border border-[#eef0ec] space-y-1.5">
                <span className="font-black text-[#141517] block text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#141517]" />
                  Top Winning Hook:
                </span>
                <p className="text-slate-700 font-medium italic">"{run.topWinningHook}"</p>
              </div>

              <div className="bg-[#fbfcfb] p-4 rounded-2xl border border-[#eef0ec] space-y-1.5">
                <span className="font-black text-[#141517] block text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
