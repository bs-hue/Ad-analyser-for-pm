'use client';

import React from 'react';
import { ClientProfile } from '@/lib/types';
import { 
  Sparkles, 
  Layers, 
  Calendar, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  Play,
  FileText,
  RefreshCw
} from 'lucide-react';

interface HeaderProps {
  client: ClientProfile;
  clients: ClientProfile[];
  onSelectClient: (clientId: string) => void;
  dateRange: string;
  onChangeDateRange: (range: string) => void;
  onOpenDataSourceModal: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onToggleReportView: () => void;
  isReportView: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  client,
  clients,
  onSelectClient,
  dateRange,
  onChangeDateRange,
  onOpenDataSourceModal,
  onAnalyze,
  isAnalyzing,
  onToggleReportView,
  isReportView
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3 shadow-sm no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Client Selection */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base tracking-tight">Performance Marketing Intelligence</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                  Claude Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">Autonomous Funnel & Creative Diagnostic Agent</p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block" />

          {/* Client Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Client:</span>
            <select
              value={client.id}
              onChange={(e) => onSelectClient(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.businessName.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Data Source Trigger */}
          <button
            onClick={onOpenDataSourceModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-700 transition"
          >
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Data Source</span>
            {client.metaConnected ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Meta Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded font-semibold">
                Manual / CSV
              </span>
            )}
          </button>

          {/* Date Range Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={dateRange}
              onChange={(e) => onChangeDateRange(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Last 7 Days">Last 7 Days (Default)</option>
              <option value="Last 14 Days">Last 14 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Custom Date Range">Custom Range</option>
            </select>
          </div>

          {/* Report View Toggle */}
          <button
            onClick={onToggleReportView}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition ${
              isReportView
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isReportView ? 'Workspace View' : 'Executive Report'}</span>
          </button>

          {/* Primary Action: Analyze Account */}
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Diagnosing Funnel...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze Account</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
