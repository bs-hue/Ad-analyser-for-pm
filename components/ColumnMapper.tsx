'use client';

import React, { useState } from 'react';
import { UnifiedAdRecord, ColumnMappingState } from '@/lib/types';
import { CANONICAL_FIELD_LABELS, normalizeRawRow } from '@/lib/dataNormalizer';
import { validatePerformanceDataset, DatasetValidationReport } from '@/lib/validator';
import { 
  ArrowRight, 
  Check, 
  AlertTriangle, 
  Info, 
  Database, 
  CheckCircle2, 
  Sparkles,
  Layers
} from 'lucide-react';

interface ColumnMapperProps {
  headers: string[];
  rawRows: Record<string, any>[];
  initialMapping: ColumnMappingState;
  clientId: string;
  onConfirmMapping: (normalizedRecords: UnifiedAdRecord[]) => void;
  onCancel: () => void;
}

export const ColumnMapper: React.FC<ColumnMapperProps> = ({
  headers,
  rawRows,
  initialMapping,
  clientId,
  onConfirmMapping,
  onCancel
}) => {
  const [mapping, setMapping] = useState<ColumnMappingState>(initialMapping);

  const handleFieldChange = (header: string, targetField: keyof UnifiedAdRecord | 'ignore') => {
    setMapping((prev) => ({
      ...prev,
      [header]: targetField
    }));
  };

  // Generate preview records
  const previewRecords: UnifiedAdRecord[] = React.useMemo(() => {
    return rawRows.map((row) => normalizeRawRow(row, mapping, clientId, 'manual'));
  }, [rawRows, mapping, clientId]);

  // Run validation report
  const validationReport: DatasetValidationReport = React.useMemo(() => {
    return validatePerformanceDataset(previewRecords);
  }, [previewRecords]);

  const targetOptions: Array<{ key: keyof UnifiedAdRecord | 'ignore'; label: string }> = [
    { key: 'ignore', label: '— Ignore Column —' },
    ...Object.entries(CANONICAL_FIELD_LABELS).map(([k, label]) => ({
      key: k as keyof UnifiedAdRecord,
      label
    }))
  ];

  return (
    <div className="bg-white rounded-[32px] border border-[#eef0ec] shadow-2xl max-w-5xl w-full mx-auto overflow-hidden text-slate-800">
      {/* Modal Header */}
      <div className="bg-white border-b border-[#f4f5f2] px-7 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-xs">
            <Layers className="w-5 h-5 text-[#e2f976]" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#141517]">Map Columns & Validate Performance Dataset</h2>
            <p className="text-xs text-slate-500">
              Verify that uploaded sheet headers match the system's normalized performance schema.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
        {/* Left: Column Mapping Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Detected Columns ({headers.length})
            </span>
            <span className="text-xs text-slate-500">Auto-mapped with heuristic matching</span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left saas-table">
              <thead>
                <tr>
                  <th className="w-1/2">Uploaded Sheet Column</th>
                  <th className="w-1/2">System Normalized Field</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {headers.map((header) => {
                  const mappedTo = mapping[header] || 'ignore';
                  const isMapped = mappedTo !== 'ignore';

                  return (
                    <tr key={header} className={isMapped ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="font-medium text-slate-800 text-xs py-2 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isMapped ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className="truncate max-w-[200px]" title={header}>{header}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <select
                          value={mappedTo}
                          onChange={(e) => handleFieldChange(header, e.target.value as any)}
                          className={`w-full text-xs font-medium rounded border px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer ${
                            isMapped
                              ? 'bg-blue-50/40 border-blue-200 text-blue-900 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          {targetOptions.map((opt) => (
                            <option key={opt.key} value={opt.key}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Real-time Data Preview & Validation Diagnostics */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Dataset Validation & Stats
          </span>

          {/* KPI Summary Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Total Rows</span>
                <span className="text-base font-bold text-slate-900">{validationReport.totalRows}</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Unique Ads</span>
                <span className="text-base font-bold text-slate-900">{validationReport.totalAds}</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Total Spend</span>
                <span className="text-base font-bold text-slate-900">₹{validationReport.totalSpend.toLocaleString()}</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Total Conversions</span>
                <span className="text-base font-bold text-emerald-700">{validationReport.totalConversions}</span>
              </div>
            </div>

            {/* Metrics Available Matrix */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">Capabilities Audit:</span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <span className={`flex items-center gap-1 ${validationReport.metricsAvailable.hasSpend ? 'text-emerald-700' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-3 h-3" /> Spend & CPM
                </span>
                <span className={`flex items-center gap-1 ${validationReport.metricsAvailable.hasConversions ? 'text-emerald-700' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-3 h-3" /> CPA / Conversions
                </span>
                <span className={`flex items-center gap-1 ${validationReport.metricsAvailable.hasDriveUrls ? 'text-emerald-700' : 'text-amber-600'}`}>
                  <CheckCircle2 className="w-3 h-3" /> Drive Creatives
                </span>
                <span className={`flex items-center gap-1 ${validationReport.metricsAvailable.hasLandingPages ? 'text-emerald-700' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-3 h-3" /> Landing Pages
                </span>
              </div>
            </div>
          </div>

          {/* Validation Warnings & Alerts */}
          <div className="space-y-2">
            {validationReport.issues.length === 0 ? (
              <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Dataset is Valid</span>
                  <span>All core performance metrics mapped cleanly. Ready for Claude funnel analysis.</span>
                </div>
              </div>
            ) : (
              validationReport.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 p-3 rounded-lg text-xs border ${
                    issue.type === 'error'
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : issue.type === 'warning'
                      ? 'bg-amber-50 border-amber-200 text-amber-800'
                      : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}
                >
                  {issue.type === 'error' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  ) : issue.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold block">{issue.code.replace(/_/g, ' ')}</span>
                    <span>{issue.message}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="bg-white border-t border-[#f4f5f2] px-7 py-4 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 bg-[#f4f5f2] hover:bg-[#e8eae4] rounded-full text-xs font-bold text-slate-800 transition"
        >
          Cancel
        </button>

        <button
          onClick={() => onConfirmMapping(previewRecords)}
          disabled={!validationReport.canProceed}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#141517] hover:bg-black text-[#e2f976] rounded-full text-xs font-black shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Confirm & Continue to Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
