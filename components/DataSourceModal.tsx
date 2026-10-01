'use client';

import React, { useState, useRef } from 'react';
import { ClientProfile, UnifiedAdRecord, ColumnMappingState } from '@/lib/types';
import { parseSpreadsheetFile, autoDetectColumnMapping } from '@/lib/dataNormalizer';
import { ColumnMapper } from './ColumnMapper';
import { DEMO_AD_RECORDS_ANKIT } from '@/lib/demoData';
import { 
  X, 
  UploadCloud, 
  CheckCircle2, 
  FileSpreadsheet, 
  Link as LinkIcon, 
  Layers, 
  Sliders, 
  AlertCircle,
  Database,
  ArrowRight,
  ClipboardPaste
} from 'lucide-react';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientProfile;
  onDataLoaded: (records: UnifiedAdRecord[]) => void;
}

export const DataSourceModal: React.FC<DataSourceModalProps> = ({
  isOpen,
  onClose,
  client,
  onDataLoaded
}) => {
  const [activeTab, setActiveTab] = useState<'meta' | 'manual' | 'google_sheet' | 'paste'>(
    client.metaConnected ? 'meta' : 'manual'
  );

  // Meta Mode State
  const [metaAccount, setMetaAccount] = useState('act_49201948201 (Ankit Batra Growth)');
  const [selectedCampaign, setSelectedCampaign] = useState('All Active Campaigns');
  const [selectedAdSet, setSelectedAdSet] = useState('All Ad Sets');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  // Manual File State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, any>[]>([]);
  const [initialMapping, setInitialMapping] = useState<ColumnMappingState>({});
  const [showMapper, setShowMapper] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Google Sheet State
  const [sheetUrl, setSheetUrl] = useState('');
  const [isImportingSheet, setIsImportingSheet] = useState(false);

  // Paste Data State
  const [pastedData, setPastedData] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setIsParsing(true);
    try {
      const { headers, rows } = await parseSpreadsheetFile(file);
      if (rows.length === 0) {
        throw new Error('The uploaded file is empty or could not be parsed.');
      }
      const mapping = autoDetectColumnMapping(headers);
      setParsedHeaders(headers);
      setParsedRows(rows);
      setInitialMapping(mapping);
      setShowMapper(true);
    } catch (err: any) {
      setUploadError(err.message || 'Error processing spreadsheet file');
    } finally {
      setIsParsing(false);
    }
  };

  const handleGoogleSheetImport = async () => {
    if (!sheetUrl) {
      setUploadError('Please enter a valid Google Sheets URL');
      return;
    }

    // Basic validation: must look like a Google Sheets URL
    if (!sheetUrl.includes('docs.google.com/spreadsheets')) {
      setUploadError('This doesn\'t look like a Google Sheets URL. Please paste a link like: https://docs.google.com/spreadsheets/d/...');
      return;
    }

    setUploadError(null);
    setIsImportingSheet(true);

    try {
      // Fetch CSV through our proxy API to avoid CORS
      const apiUrl = `/api/sheets?url=${encodeURIComponent(sheetUrl)}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to fetch sheet (status ${response.status})`);
      }

      const csvText = await response.text();

      if (!csvText || csvText.trim().length === 0) {
        throw new Error('The Google Sheet appears to be empty. Please check that it has data rows.');
      }

      // Parse the CSV using PapaParse (same engine used for file uploads)
      const Papa = (await import('papaparse')).default;
      const parseResult = Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });

      const headers = (parseResult.meta.fields || []).filter(Boolean);
      const rows = parseResult.data as Record<string, any>[];

      if (headers.length === 0 || rows.length === 0) {
        throw new Error('No valid data found in the sheet. Make sure the first row contains column headers.');
      }

      // Auto-detect column mapping (same as file upload flow)
      const mapping = autoDetectColumnMapping(headers);
      setParsedHeaders(headers);
      setParsedRows(rows);
      setInitialMapping(mapping);
      setShowMapper(true);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to import Google Sheet');
    } finally {
      setIsImportingSheet(false);
    }
  };

  const handlePastedDataParse = async () => {
    if (!pastedData || pastedData.trim().length === 0) {
      setUploadError('Please paste your CSV, TSV, or spreadsheet data first.');
      return;
    }
    setUploadError(null);
    setIsParsing(true);
    try {
      const Papa = (await import('papaparse')).default;
      const parseResult = Papa.parse(pastedData.trim(), {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });

      const headers = (parseResult.meta.fields || []).filter(Boolean);
      const rows = parseResult.data as Record<string, any>[];

      if (headers.length === 0 || rows.length === 0) {
        throw new Error('Could not find valid headers or data rows. Make sure the first line has column titles.');
      }

      const mapping = autoDetectColumnMapping(headers);
      setParsedHeaders(headers);
      setParsedRows(rows);
      setInitialMapping(mapping);
      setShowMapper(true);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to parse pasted data');
    } finally {
      setIsParsing(false);
    }
  };

  const handleMetaFetch = () => {
    setIsFetchingMeta(true);
    setTimeout(() => {
      setIsFetchingMeta(false);
      onDataLoaded(DEMO_AD_RECORDS_ANKIT);
      onClose();
    }, 800);
  };

  const handleConfirmMapping = (records: UnifiedAdRecord[]) => {
    setShowMapper(false);
    onDataLoaded(records);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      {showMapper ? (
        <ColumnMapper
          headers={parsedHeaders}
          rawRows={parsedRows}
          initialMapping={initialMapping}
          clientId={client.id}
          onConfirmMapping={handleConfirmMapping}
          onCancel={() => setShowMapper(false)}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full mx-auto overflow-hidden">
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Configure Performance Data Source</h3>
                <p className="text-xs text-slate-500">
                  Select how performance metrics should be ingested into the normalized intelligence schema.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 pt-3 gap-2">
            <button
              onClick={() => setActiveTab('meta')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === 'meta'
                  ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>MODE A: Meta Connected</span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === 'manual'
                  ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>MODE B: Upload CSV / Excel</span>
            </button>

            <button
              onClick={() => setActiveTab('google_sheet')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === 'google_sheet'
                  ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Google Sheets</span>
            </button>

            <button
              onClick={() => setActiveTab('paste')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === 'paste'
                  ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg shadow-sm'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Paste Raw CSV</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 space-y-4">
            {uploadError && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* MODE A: META CONNECTED */}
            {activeTab === 'meta' && (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Meta Ads Account Connected (Token Active)</span>
                  </div>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    MCP Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Meta Ad Account</label>
                    <select
                      value={metaAccount}
                      onChange={(e) => setMetaAccount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="act_49201948201 (Ankit Batra Growth)">
                        act_49201948201 (Ankit Batra Growth)
                      </option>
                      <option value="act_88219481022 (ScaleConsulting Global)">
                        act_88219481022 (ScaleConsulting Global)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Date Range</label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Last 7 Days">Last 7 Days (Default)</option>
                      <option value="Last 14 Days">Last 14 Days</option>
                      <option value="Last 30 Days">Last 30 Days</option>
                      <option value="Lifetime">Lifetime (Audit)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Campaign Filter</label>
                    <select
                      value={selectedCampaign}
                      onChange={(e) => setSelectedCampaign(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="All Active Campaigns">All Active Campaigns</option>
                      <option value="TOF_Scale_DirectResponse_Video_Q3">TOF_Scale_DirectResponse_Video_Q3</option>
                      <option value="MOFU_Retargeting_HighIntent_Q3">MOFU_Retargeting_HighIntent_Q3</option>
                      <option value="TEST_NewHooks_FastPaced_Sep26">TEST_NewHooks_FastPaced_Sep26</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Ad Set Filter</label>
                    <select
                      value={selectedAdSet}
                      onChange={(e) => setSelectedAdSet(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="All Ad Sets">All Ad Sets</option>
                      <option value="Broad_Interest_B2B_Founders_35kSpend">Broad_Interest_B2B_Founders_35kSpend</option>
                      <option value="Agency_Owners_Lookalikes_20kSpend">Agency_Owners_Lookalikes_20kSpend</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={handleMetaFetch}
                    disabled={isFetchingMeta}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                  >
                    {isFetchingMeta ? 'Syncing Meta Ads Data...' : 'Retrieve Performance Data & Sync Creatives'}
                  </button>
                </div>
              </div>
            )}

            {/* MODE B: MANUAL CSV / XLSX */}
            {activeTab === 'manual' && (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/20 rounded-xl p-8 text-center cursor-pointer transition space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {isParsing ? 'Parsing spreadsheet...' : 'Click or Drag & Drop Ad Report (.CSV or .XLSX)'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports Meta Ads Manager exports, custom agency reports, and Google Sheets XLSX exports.
                    </p>
                  </div>
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-md">
                    Auto Column-Mapping Included
                  </span>
                </div>
              </div>
            )}

            {/* MODE C: GOOGLE SHEETS */}
            {activeTab === 'google_sheet' && (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800">
                  <p className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Live Google Sheets Connector — No API Key Required
                  </p>
                  <p className="text-emerald-700 leading-relaxed">
                    This imports your ad performance data directly from a Google Sheet. Just make sure
                    the sheet is shared as <strong>"Anyone with the link → Viewer"</strong>, then paste the URL below.
                  </p>
                </div>

                {/* Inline Quick Setup Steps */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2">
                  <p className="font-semibold text-slate-800 mb-1.5">Quick Setup (3 steps)</p>
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">1</span>
                    <span className="text-slate-600">Open your Google Sheet with the ad performance data</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">2</span>
                    <span className="text-slate-600">
                      Click <strong>Share</strong> → <strong>General access</strong> → change to <strong>"Anyone with the link"</strong> → Role: <strong>Viewer</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">3</span>
                    <span className="text-slate-600">Copy the URL from your browser's address bar and paste it below</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-xs text-slate-700 block mb-1">Google Sheet URL</label>
                  <input
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/1ABcDeFgHiJkL.../edit"
                    value={sheetUrl}
                    onChange={(e) => { setSheetUrl(e.target.value); setUploadError(null); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    The first row of your sheet must contain column headers (e.g., Ad Name, Spend, CTR, CPA…). Columns are auto-mapped.
                  </p>
                </div>

                <button
                  onClick={handleGoogleSheetImport}
                  disabled={isImportingSheet || !sheetUrl}
                  className={`w-full py-2.5 font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2 ${
                    isImportingSheet || !sheetUrl
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isImportingSheet ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Fetching &amp; Parsing Sheet Data...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-3.5 h-3.5" />
                      Import from Google Sheets
                    </>
                  )}
                </button>
              </div>
            )}

            {/* MODE D: PASTE RAW CSV / SPREADSHEET TEXT */}
            {activeTab === 'paste' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
                  <p className="font-bold flex items-center gap-1.5 mb-1 text-blue-900">
                    <ClipboardPaste className="w-4 h-4 text-blue-600" />
                    Direct Paste — Ideal for Quick Ad Manager / Sheet Copies
                  </p>
                  <p className="text-blue-700 leading-relaxed">
                    Copy columns directly from your spreadsheet or Meta Ads export and paste them into the box below.
                    Our normalizer will detect headers and auto-map your metrics.
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-xs text-slate-700 block mb-1">
                    Paste CSV / Table Data (with header row):
                  </label>
                  <textarea
                    rows={7}
                    value={pastedData}
                    onChange={(e) => { setPastedData(e.target.value); setUploadError(null); }}
                    placeholder="Ad name,Campaign name,SPEND,SALE,CPA,CPM,IMPRESSIONS,CTR,REVENUE,ROAS&#10;MKR-77,BMX | MKR | CBO,2385.46,9,265.05,283.41,8417,0.80,4491,1.88&#10;..."
                    className="w-full font-mono text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                    <span>Supports comma-separated (CSV) and tab-separated (from Excel) text</span>
                    {pastedData.trim().length > 0 && (
                      <span className="text-blue-600 font-medium">
                        {pastedData.trim().split('\n').length} rows detected
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handlePastedDataParse}
                  disabled={isParsing || !pastedData.trim()}
                  className={`w-full py-2.5 font-semibold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2 ${
                    isParsing || !pastedData.trim()
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isParsing ? (
                    'Processing and mapping columns...'
                  ) : (
                    <>
                      <ArrowRight className="w-3.5 h-3.5" />
                      Process &amp; Map Ingested Data
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
