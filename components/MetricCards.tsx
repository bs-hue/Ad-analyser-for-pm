'use client';

import React from 'react';
import { AccountDiagnosisResult } from '@/lib/types';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MousePointerClick, 
  Target, 
  Zap, 
  ShieldAlert, 
  Award, 
  Layers
} from 'lucide-react';

interface MetricCardsProps {
  diagnosis: AccountDiagnosisResult;
  currency: string;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ diagnosis, currency }) => {
  const { summary } = diagnosis;
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  const cards = [
    {
      title: 'Total Ad Spend',
      value: `${currencySymbol}${summary.totalSpend.toLocaleString()}`,
      subtitle: `${summary.totalImpressions.toLocaleString()} impressions`,
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Blended ROAS',
      value: `${summary.blendedRoas.toFixed(2)}x`,
      subtitle: `Revenue: ${currencySymbol}${summary.totalRevenue.toLocaleString()}`,
      icon: Zap,
      color: summary.blendedRoas >= 3.5 ? 'emerald' : summary.blendedRoas >= 2.5 ? 'amber' : 'rose',
      badge: summary.blendedRoas >= 3.5 ? 'Profitable' : 'Attention'
    },
    {
      title: 'Average CPL / CPA',
      value: `${currencySymbol}${summary.averageCpa.toFixed(2)}`,
      subtitle: `${summary.totalConversions} total conversions`,
      icon: Target,
      color: summary.averageCpa < 120 ? 'emerald' : 'slate'
    },
    {
      title: 'Link CTR / CPC',
      value: `${summary.averageCtr.toFixed(2)}%`,
      subtitle: `CPC: ${currencySymbol}${summary.averageCpc.toFixed(2)} | CPM: ${currencySymbol}${summary.averageCpm.toFixed(2)}`,
      icon: MousePointerClick,
      color: summary.averageCtr >= 2.5 ? 'emerald' : 'amber'
    },
    {
      title: 'Creative Health Ratio',
      value: `${summary.strongPerformersCount} Winners`,
      subtitle: `${summary.underperformingCount} underperforming | ${summary.promisingCount} promising`,
      icon: Award,
      color: 'indigo',
      badge: `${summary.strongPerformersCount + summary.promisingCount} Scale Candidates`
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">{card.title}</span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  card.color === 'emerald'
                    ? 'bg-emerald-50 text-emerald-600'
                    : card.color === 'rose'
                    ? 'bg-rose-50 text-rose-600'
                    : card.color === 'amber'
                    ? 'bg-amber-50 text-amber-600'
                    : card.color === 'indigo'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'bg-blue-50 text-blue-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">{card.value}</span>
                {card.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 truncate" title={card.subtitle}>
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
