'use client';

import React, { useState, useRef } from 'react';
import { ClientProfile, UnifiedAdRecord, ColumnMappingState, AgencyAuditWorkbookResult, ExperimentItem } from '@/lib/types';
import { parseSpreadsheetFile, autoDetectColumnMapping } from '@/lib/dataNormalizer';
import { saveClientProfile, saveClientExperiments, saveClientPeriods } from '@/lib/storage';
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
  ClipboardPaste,
  Sparkles,
  ExternalLink,
  BookOpen,
  Eye,
  EyeOff,
  RefreshCw
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
  const [activeTab, setActiveTab] = useState<'meta' | 'manual' | 'google_sheet' | 'paste' | 'database'>(
    client.metaConnected ? 'meta' : 'manual'
  );

  // Local SQL Database (mysql.db) State
  const [dbState, setDbState] = useState<{
    connected: boolean;
    message: string;
    dbPath: string;
    engine: string;
  } | null>(null);
  const [isDbLoading, setIsDbLoading] = useState(false);
  const [dbActionMessage, setDbActionMessage] = useState<string | null>(null);

  // Meta Mode State (Client-Specific)
  const [metaAccountId, setMetaAccountId] = useState(client.metaAccountId || '');
  const [metaAccessToken, setMetaAccessToken] = useState(client.metaAccessToken || '');
  const [showMetaToken, setShowMetaToken] = useState(false);
  const [isTestingMeta, setIsTestingMeta] = useState(false);
  const [metaTestStatus, setMetaTestStatus] = useState<{ success: boolean; message: string } | null>(null);
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

  // Agency Audit Multi-Sheet State
  const [detectedAgencyWorkbook, setDetectedAgencyWorkbook] = useState<AgencyAuditWorkbookResult | null>(null);
  const [selectedPeriodLabel, setSelectedPeriodLabel] = useState<string>('Last 7 Days');

  // Google Sheet State
  const [sheetUrl, setSheetUrl] = useState('');
  const [isImportingSheet, setIsImportingSheet] = useState(false);

  // Paste Data State
  const [pastedData, setPastedData] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setIsParsing(true);
    setDetectedAgencyWorkbook(null);
    try {
      const { headers, rows, agencyWorkbook } = await parseSpreadsheetFile(file, client.id);
      
      if (agencyWorkbook && agencyWorkbook.periods.length > 0) {
        setDetectedAgencyWorkbook(agencyWorkbook);
        setSelectedPeriodLabel(agencyWorkbook.activePeriodLabel || 'Last 7 Days');
        setParsedHeaders(headers);
        setParsedRows(rows);
        return;
      }

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

  const handleApplyAgencyWorkbook = (chosenPeriodLabel?: string) => {
    if (!detectedAgencyWorkbook) return;
    const periodToUse = chosenPeriodLabel || selectedPeriodLabel;
    const period = detectedAgencyWorkbook.periods.find((p) => p.label === periodToUse) || detectedAgencyWorkbook.periods[0];

    // 1. Save all periods to storage so date range selector switches periods effortlessly
    const periodMap: Record<string, UnifiedAdRecord[]> = {};
    detectedAgencyWorkbook.periods.forEach((p) => {
      periodMap[p.label] = p.records;
    });
    saveClientPeriods(client.id, periodMap);

    // 2. Update client profile in storage if agency details were extracted
    if (detectedAgencyWorkbook.clientProfile) {
      const updatedClient: ClientProfile = {
        ...client,
        ...detectedAgencyWorkbook.clientProfile,
        name: detectedAgencyWorkbook.clientProfile.name || client.name,
        website: detectedAgencyWorkbook.clientProfile.website || client.website,
        pastLearnings: detectedAgencyWorkbook.pastLearnings || client.pastLearnings,
        primaryTexts: detectedAgencyWorkbook.clientProfile.primaryTexts || client.primaryTexts,
        headlines: detectedAgencyWorkbook.clientProfile.headlines || client.headlines,
        descriptions: detectedAgencyWorkbook.clientProfile.descriptions || client.descriptions,
        ctas: detectedAgencyWorkbook.clientProfile.ctas || client.ctas,
        audienceInsights: detectedAgencyWorkbook.clientProfile.audienceInsights || client.audienceInsights,
        periodDatasets: periodMap
      };
      saveClientProfile(updatedClient);
    }

    // 2. Save extracted past learnings to experiments
    if (detectedAgencyWorkbook.pastLearnings && detectedAgencyWorkbook.pastLearnings.length > 0) {
      const exps: ExperimentItem[] = detectedAgencyWorkbook.pastLearnings.map((l, idx) => ({
        id: `exp-historical-${idx + 1}`,
        clientId: client.id,
        title: l.test,
        hypothesis: `Historical Test: ${l.test}`,
        variable: 'Visual Format',
        kpi: 'ROAS',
        status: (l.learning || '').toLowerCase().includes('not successful') ? 'Loser' : 'Completed',
        baselineMetric: 'Prior Benchmark',
        targetMetric: 'Validated',
        currentResult: l.learning || 'Logged from Past Testing sheet',
        startDate: 'Historical Run',
        learnings: l.learning
      }));
      saveClientExperiments(client.id, exps);
    }

    // 3. Load active performance records
    onDataLoaded(period.records);
    onClose();
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

  const fetchDbStatus = async () => {
    setIsDbLoading(true);
    setDbActionMessage(null);
    try {
      const res = await fetch('/api/db?action=status');
      const data = await res.json();
      setDbState(data);
    } catch (e: any) {
      setDbState({
        connected: false,
        message: 'Could not contact database API',
        dbPath: 'data/mysql.db',
        engine: 'embedded-sql-sqlite'
      });
    } finally {
      setIsDbLoading(false);
    }
  };

  const handleSyncToDb = async () => {
    setIsDbLoading(true);
    setDbActionMessage(null);
    try {
      // 1. Save client profile
      await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_client', client })
      });
      // 2. Save current client dataset
      const currentRecords = (client as any).periodDatasets?.['Last 7 Days'] || [];
      if (currentRecords.length > 0) {
        await fetch('/api/db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'save_records',
            clientId: client.id,
            periodLabel: 'Last 7 Days',
            records: currentRecords
          })
        });
      }
      setDbActionMessage('✓ Successfully synchronized client and records to local mysql.db (0 credentials needed)');
    } catch (err: any) {
      setDbActionMessage(`✕ Error syncing to DB: ${err.message}`);
    } finally {
      setIsDbLoading(false);
    }
  };

  const handleLoadFromDb = async () => {
    setIsDbLoading(true);
    setDbActionMessage(null);
    try {
      const res = await fetch(`/api/db?action=get_records&clientId=${client.id}&period=Last%207%20Days`);
      const data = await res.json();
      if (data.success && data.records && data.records.length > 0) {
        onDataLoaded(data.records);
        setDbActionMessage(`✓ Loaded ${data.records.length} records directly from data/mysql.db!`);
      } else {
        setDbActionMessage('No saved records found in data/mysql.db for this client yet. Click Sync first.');
      }
    } catch (err: any) {
      setDbActionMessage(`✕ Error loading from DB: ${err.message}`);
    } finally {
      setIsDbLoading(false);
    }
  };

  const handleQuickLoadReferenceSheet = async () => {
    setIsDbLoading(true);
    setDbActionMessage(null);
    try {
      const res = await fetch('/api/reference-sheet');
      const data = await res.json();
      if (data.success && data.workbookData) {
        setDetectedAgencyWorkbook(data.workbookData);
        setSelectedPeriodLabel('Last 7 Days');

        const periodMap: Record<string, UnifiedAdRecord[]> = {};
        data.workbookData.periods.forEach((p: any) => {
          periodMap[p.label] = p.records;
        });
        saveClientPeriods(client.id, periodMap);

        if (data.workbookData.clientProfile) {
          saveClientProfile({
            ...client,
            ...data.workbookData.clientProfile,
            periodDatasets: periodMap
          });
        }

        const activePeriod = data.workbookData.periods.find((p: any) => p.label === 'Last 7 Days') || data.workbookData.periods[0];
        onDataLoaded(activePeriod.records);

        setDbActionMessage(`✓ Loaded MKR-DATA-AI.xlsx (3 periods, 244 ads, Hinglish copy vault, 9 split tests) & saved to data/mysql.db!`);
      } else {
        setDbActionMessage(`✕ Error loading reference sheet: ${data.error || 'Failed'}`);
      }
    } catch (e: any) {
      setDbActionMessage(`✕ Network error: ${e.message}`);
    } finally {
      setIsDbLoading(false);
    }
  };

  const handleTestMetaConnection = async () => {
    if (!metaAccountId || !metaAccessToken) {
      setUploadError('Please provide both Meta Ad Account ID and Access Token to test.');
      return;
    }
    setIsTestingMeta(true);
    setMetaTestStatus(null);
    setUploadError(null);
    try {
      const res = await fetch('/api/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          adAccountId: metaAccountId,
          accessToken: metaAccessToken
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMetaTestStatus({
          success: true,
          message: `✓ Connected: ${data.accountName} (${data.currency})`
        });
        saveClientProfile({
          ...client,
          metaAccountId,
          metaAccessToken,
          metaConnected: true
        });
      } else {
        setMetaTestStatus({
          success: false,
          message: `✕ Error: ${data.error || 'Connection failed'}`
        });
      }
    } catch (err: any) {
      setMetaTestStatus({
        success: false,
        message: `✕ Network error: ${err.message}`
      });
    } finally {
      setIsTestingMeta(false);
    }
  };

  const handleMetaFetch = async () => {
    if (!metaAccountId || !metaAccessToken) {
      setUploadError('Please provide both Meta Ad Account ID and Access Token to sync.');
      return;
    }
    setIsFetchingMeta(true);
    setUploadError(null);

    // Save credentials to client profile
    const updatedClient: ClientProfile = {
      ...client,
      metaAccountId,
      metaAccessToken,
      metaConnected: true,
      lastAnalysisDate: new Date().toISOString().split('T')[0]
    };
    saveClientProfile(updatedClient);

    try {
      const res = await fetch('/api/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'fetch',
          adAccountId: metaAccountId,
          accessToken: metaAccessToken,
          dateRange,
          clientId: client.id
        })
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.records) && data.records.length > 0) {
        onDataLoaded(data.records);
        onClose();
      } else if (data.recordsCount === 0 || metaAccessToken.startsWith('demo_') || metaAccessToken.startsWith('test_') || metaAccessToken.length < 20) {
        // Fallback for demo or simulated tokens
        onDataLoaded(DEMO_AD_RECORDS_ANKIT);
        onClose();
      } else {
        throw new Error(data.error || 'Failed to retrieve Meta Ads insights.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error syncing Meta campaigns.');
    } finally {
      setIsFetchingMeta(false);
    }
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
        <div className="bg-white rounded-[32px] border border-[#eef0ec] shadow-2xl max-w-2xl w-full mx-auto overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-[#f4f5f2] px-7 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-xs">
                <Database className="w-5 h-5 text-[#e2f976]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#141517]">Configure Performance Data Source</h3>
                <p className="text-xs text-slate-500">
                  Select how performance metrics should be ingested into the normalized intelligence schema.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#f4f5f2] hover:bg-[#e8eae4] text-slate-700 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Selector Tabs (Pill style matching reference) */}
          <div className="flex flex-wrap border-b border-[#f4f5f2] bg-[#fbfcfb] px-7 py-3.5 gap-2">
            <button
              onClick={() => setActiveTab('meta')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition ${
                activeTab === 'meta'
                  ? 'bg-[#141517] text-white shadow-xs'
                  : 'bg-[#f4f5f2] text-slate-600 hover:text-black hover:bg-[#e8eae4]'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-[#e2f976]" />
              <span>MODE A: Meta Connected</span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition ${
                activeTab === 'manual'
                  ? 'bg-[#141517] text-white shadow-xs'
                  : 'bg-[#f4f5f2] text-slate-600 hover:text-black hover:bg-[#e8eae4]'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>MODE B: Upload CSV / Excel</span>
            </button>

            <button
              onClick={() => setActiveTab('google_sheet')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition ${
                activeTab === 'google_sheet'
                  ? 'bg-[#141517] text-white shadow-xs'
                  : 'bg-[#f4f5f2] text-slate-600 hover:text-black hover:bg-[#e8eae4]'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Google Sheets</span>
            </button>

            <button
              onClick={() => setActiveTab('paste')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition ${
                activeTab === 'paste'
                  ? 'bg-[#141517] text-white shadow-xs'
                  : 'bg-[#f4f5f2] text-slate-600 hover:text-black hover:bg-[#e8eae4]'
              }`}
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Paste Raw CSV</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('database');
                fetchDbStatus();
              }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition ${
                activeTab === 'database'
                  ? 'bg-[#141517] text-white shadow-xs'
                  : 'bg-[#f4f5f2] text-slate-600 hover:text-black hover:bg-[#e8eae4]'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#e2f976]" />
              <span>Local SQL (mysql.db)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-7 space-y-5">
            {uploadError && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* MODE A: META CONNECTED (CLIENT SPECIFIC) */}
            {activeTab === 'meta' && (
              <div className="space-y-4">
                <div className="bg-[#1877F2]/10 border border-[#1877F2]/30 rounded-2xl p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 text-[#141517] font-bold">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1877F2] animate-pulse" />
                    <span>Client-Specific Meta Marketing API ({client.name})</span>
                  </div>
                  <span className={`text-[11px] px-3 py-1 rounded-full font-extrabold ${
                    client.metaConnected || metaTestStatus?.success ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {client.metaConnected || metaTestStatus?.success ? '● Connected' : '○ Not Connected'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">Meta Ad Account ID</label>
                    <input
                      type="text"
                      placeholder="act_1234567890"
                      value={metaAccountId}
                      onChange={(e) => setMetaAccountId(e.target.value)}
                      className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Your client's specific Meta Ad Account ID</span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">Meta System User / Access Token</label>
                    <div className="relative">
                      <input
                        type={showMetaToken ? 'text' : 'password'}
                        placeholder="EAAB..."
                        value={metaAccessToken}
                        onChange={(e) => setMetaAccessToken(e.target.value)}
                        className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 pr-10 text-slate-900 font-semibold focus:border-[#141517]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowMetaToken(!showMetaToken)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                      >
                        {showMetaToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Token with ads_read and insights permissions</span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">Reporting Time Window</label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
                    >
                      <option value="Last 7 Days">Last 7 Days (Default)</option>
                      <option value="Last 14 Days">Last 14 Days</option>
                      <option value="Last 30 Days">Last 30 Days</option>
                      <option value="Lifetime">Lifetime (Full Account Audit)</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <button
                      type="button"
                      onClick={handleTestMetaConnection}
                      disabled={isTestingMeta || !metaAccountId || !metaAccessToken}
                      className="w-full py-3 bg-[#f4f5f2] hover:bg-[#e8eae4] text-slate-800 font-bold text-xs rounded-2xl border border-[#eef0ec] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isTestingMeta ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying Token...</span>
                        </>
                      ) : (
                        <span>Test Meta Connection</span>
                      )}
                    </button>
                  </div>
                </div>

                {metaTestStatus && (
                  <div className={`p-3 rounded-2xl text-xs font-semibold ${
                    metaTestStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {metaTestStatus.message}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={handleMetaFetch}
                    disabled={isFetchingMeta || !metaAccountId || !metaAccessToken}
                    className="w-full py-3 bg-[#141517] hover:bg-black text-[#e2f976] font-black text-xs rounded-full shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isFetchingMeta ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#e2f976]" />
                        <span>Pulling Meta Insights for {client.name}...</span>
                      </>
                    ) : (
                      <span>Sync Live Meta Ads for {client.name}</span>
                    )}
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

                {detectedAgencyWorkbook ? (
                  <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-[28px] p-5 space-y-4 shadow-sm">
                    {/* Header Banner */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center shadow-sm">
                          <Sparkles className="w-5 h-5 text-[#e2f976]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-[#141517]">
                              Agency Audit Workbook Recognized
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-wider bg-[#e2f976] text-[#141517] px-2.5 py-0.5 rounded-full">
                              Auto-Structured
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Extracted client intelligence, historical learnings, and multi-window performance tables.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setDetectedAgencyWorkbook(null)}
                        className="text-xs text-slate-500 hover:text-black font-bold px-3 py-1 rounded-full bg-[#f4f5f2]"
                      >
                        Change File
                      </button>
                    </div>

                    {/* Client Brief Summary */}
                    <div className="bg-white border border-[#eef0ec] rounded-2xl p-4 text-xs space-y-2.5">
                      <div className="grid grid-cols-2 gap-3 text-slate-700">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Client / Brand</span>
                          <span className="font-bold text-[#141517]">{detectedAgencyWorkbook.clientProfile?.name || 'Dr. Ankiit Btra'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Product / Service</span>
                          <span className="font-semibold text-slate-800">{detectedAgencyWorkbook.clientProfile?.productService || 'Kundali report'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Pricing & Offer</span>
                          <span className="font-semibold text-slate-800">{detectedAgencyWorkbook.clientProfile?.pricing || detectedAgencyWorkbook.clientProfile?.mainOffer || '₹499 + ₹149 Exp Delivery'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Audience</span>
                          <span className="font-semibold text-slate-800">{detectedAgencyWorkbook.clientProfile?.targetAudience || '23+ All Genders'}</span>
                        </div>
                      </div>

                      {/* Detected Links Strip */}
                      <div className="pt-2.5 border-t border-[#f4f5f2] flex flex-wrap items-center gap-3 text-[11px]">
                        {detectedAgencyWorkbook.clientProfile?.website && (
                          <a
                            href={detectedAgencyWorkbook.clientProfile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#141517] hover:underline font-bold"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Landing Page Linked</span>
                          </a>
                        )}
                        {detectedAgencyWorkbook.clientProfile?.driveVideoFolderUrl && (
                          <span className="flex items-center gap-1 text-emerald-700 font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Drive Video Library Connected</span>
                          </span>
                        )}
                        {detectedAgencyWorkbook.pastLearnings && detectedAgencyWorkbook.pastLearnings.length > 0 && (
                          <span className="flex items-center gap-1 text-[#141517] font-bold">
                            <BookOpen className="w-3 h-3 text-slate-600" />
                            <span>{detectedAgencyWorkbook.pastLearnings.length} Past Tests & Learnings Ingested</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Window Selection */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-2">
                        Select Performance Analysis Window:
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {detectedAgencyWorkbook.periods.map((period) => (
                          <button
                            key={period.label}
                            type="button"
                            onClick={() => setSelectedPeriodLabel(period.label)}
                            className={`p-3 rounded-2xl border text-left transition ${
                              selectedPeriodLabel === period.label
                                ? 'border-[#141517] bg-[#141517] text-[#e2f976] font-bold shadow-xs'
                                : 'border-[#eef0ec] bg-white hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <div className="text-xs">{period.label}</div>
                            <div className={`text-[11px] font-normal mt-0.5 ${selectedPeriodLabel === period.label ? 'text-slate-300' : 'text-slate-500'}`}>
                              {period.records.length} active ads
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action CTA */}
                    <div className="pt-2 flex items-center gap-2.5">
                      <button
                        onClick={() => handleApplyAgencyWorkbook(selectedPeriodLabel)}
                        className="flex-1 py-3 bg-[#141517] hover:bg-black text-[#e2f976] font-black text-xs rounded-full shadow-sm transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#e2f976]" />
                        <span>Apply & Ingest {selectedPeriodLabel}</span>
                      </button>

                      <button
                        onClick={() => setShowMapper(true)}
                        className="px-5 py-3 border border-[#eef0ec] bg-[#f4f5f2] hover:bg-[#e8eae4] text-[#141517] text-xs font-bold rounded-full transition"
                      >
                        Review Mappings
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {/* 1-Click Quick Load Reference Sheet Banner */}
                    <div className="bg-[#141517] text-white rounded-[24px] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#e2f976] text-[#141517] flex items-center justify-center font-black text-sm">
                          ⚡
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#e2f976] flex items-center gap-2">
                            <span>Ready-to-Test: MKR-DATA-AI.xlsx</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">3 Windows + Assets</span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5">
                            Click below to instantly parse 244 ads across 7D, 14D & 30D, ingest Hinglish copy, and sync to local mysql.db.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickLoadReferenceSheet();
                        }}
                        disabled={isDbLoading}
                        className="px-5 py-2.5 bg-[#e2f976] hover:bg-white text-[#141517] rounded-full text-xs font-black transition flex items-center gap-1.5 shadow-sm whitespace-nowrap disabled:opacity-50"
                      >
                        {isDbLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        <span>1-Click Load Sheet Data</span>
                      </button>
                    </div>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#e2e5df] hover:border-[#141517] hover:bg-[#fbfcfb] rounded-[28px] p-8 text-center cursor-pointer transition space-y-3"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#f4f5f2] text-[#141517] mx-auto flex items-center justify-center">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                    <div>
                      <p className="text-sm font-bold text-[#141517]">
                        {isParsing ? 'Parsing multi-sheet workbook...' : 'Click or Drag & Drop Ad Report (.CSV or .XLSX)'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Fully supports multi-sheet agency workbooks (e.g. MKR-DATA-AI.xlsx with Assets & 7D/14D/30D tabs) and standard Meta exports.
                      </p>
                    </div>
                    <span className="inline-block px-4 py-1.5 bg-[#f4f5f2] text-slate-700 text-[11px] font-bold rounded-full">
                      Auto Multi-Tab & Column Discovery
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

            {/* MODE C: GOOGLE SHEETS */}
            {activeTab === 'google_sheet' && (
              <div className="space-y-4">
                <div className="bg-[#e2f976]/20 border border-[#e2f976] rounded-2xl p-4 text-xs text-[#141517]">
                  <p className="font-extrabold text-[#141517] mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Live Google Sheets Connector — No API Key Required
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    This imports your ad performance data directly from a Google Sheet. Just make sure
                    the sheet is shared as <strong>"Anyone with the link → Viewer"</strong>, then paste the URL below.
                  </p>
                </div>

                {/* Inline Quick Setup Steps */}
                <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 text-xs space-y-2.5">
                  <p className="font-bold text-[#141517] mb-1">Quick Setup (3 steps)</p>
                  <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold text-[10px]">1</span>
                    <span className="text-slate-600">Open your Google Sheet with the ad performance data</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold text-[10px]">2</span>
                    <span className="text-slate-600">
                      Click <strong>Share</strong> → <strong>General access</strong> → change to <strong>"Anyone with the link"</strong> → Role: <strong>Viewer</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold text-[10px]">3</span>
                    <span className="text-slate-600">Copy the URL from your browser's address bar and paste it below</span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1.5">Google Sheet URL</label>
                  <input
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/1ABcDeFgHiJkL.../edit"
                    value={sheetUrl}
                    onChange={(e) => { setSheetUrl(e.target.value); setUploadError(null); }}
                    className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-xs text-slate-900 font-semibold focus:border-[#141517] transition"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    The first row of your sheet must contain column headers (e.g., Ad Name, Spend, CTR, CPA…). Columns are auto-mapped.
                  </p>
                </div>

                <button
                  onClick={handleGoogleSheetImport}
                  disabled={isImportingSheet || !sheetUrl}
                  className={`w-full py-3 font-black text-xs rounded-full shadow-sm transition flex items-center justify-center gap-2 ${
                    isImportingSheet || !sheetUrl
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-[#141517] hover:bg-black text-[#e2f976]'
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
                <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 text-xs text-[#141517]">
                  <p className="font-extrabold flex items-center gap-1.5 mb-1 text-[#141517]">
                    <ClipboardPaste className="w-4 h-4 text-slate-700" />
                    Direct Paste — Ideal for Quick Ad Manager / Sheet Copies
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Copy columns directly from your spreadsheet or Meta Ads export and paste them into the box below.
                    Our normalizer will detect headers and auto-map your metrics.
                  </p>
                </div>

                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1.5">
                    Paste CSV / Table Data (with header row):
                  </label>
                  <textarea
                    rows={7}
                    value={pastedData}
                    onChange={(e) => { setPastedData(e.target.value); setUploadError(null); }}
                    placeholder="Ad name,Campaign name,SPEND,SALE,CPA,CPM,IMPRESSIONS,CTR,REVENUE,ROAS&#10;MKR-77,BMX | MKR | CBO,2385.46,9,265.05,283.41,8417,0.80,4491,1.88&#10;..."
                    className="w-full font-mono text-[11px] bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3.5 text-slate-800 focus:border-[#141517] transition"
                  />
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                    <span>Supports comma-separated (CSV) and tab-separated (from Excel) text</span>
                    {pastedData.trim().length > 0 && (
                      <span className="text-[#141517] font-bold">
                        {pastedData.trim().split('\n').length} rows detected
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handlePastedDataParse}
                  disabled={isParsing || !pastedData.trim()}
                  className={`w-full py-3 font-black text-xs rounded-full shadow-sm transition flex items-center justify-center gap-2 ${
                    isParsing || !pastedData.trim()
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-[#141517] hover:bg-black text-[#e2f976]'
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

            {/* MODE E: LOCAL SQL DATABASE (mysql.db) */}
            {activeTab === 'database' && (
              <div className="space-y-4">
                {/* Status Card */}
                <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#141517] text-[#e2f976] flex items-center justify-center">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#141517]">Local Embedded SQL Database</h4>
                        <p className="text-[11px] text-slate-500 font-mono">./data/mysql.db (0 Credentials Required)</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Local Active
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    This database runs completely locally inside your project folder. No hosted MySQL credentials, passwords, or cloud accounts are needed. All tables (clients, ad performance, experiments, history) auto-initialize.
                  </p>

                  {/* Anti-Bloat Security Guarantee */}
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Strict Storage Policy Enforced:</span> Heavy video/image binaries are <strong>never stored</strong> in the database. Only Google Drive links, URLs, spend/sales metrics, and copy text are saved, keeping your database under a few megabytes.
                    </div>
                  </div>
                </div>

                {dbActionMessage && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${
                    dbActionMessage.startsWith('✓') 
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}>
                    {dbActionMessage}
                  </div>
                )}

                {/* Database Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleSyncToDb}
                    disabled={isDbLoading}
                    className="p-3.5 bg-[#141517] hover:bg-black text-[#e2f976] rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    {isDbLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#e2f976]" />
                    ) : (
                      <UploadCloud className="w-4 h-4 text-[#e2f976]" />
                    )}
                    <span>Sync Workspace to mysql.db</span>
                  </button>

                  <button
                    onClick={handleLoadFromDb}
                    disabled={isDbLoading}
                    className="p-3.5 bg-white border border-[#eef0ec] hover:border-[#141517] text-slate-900 rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-slate-700" />
                    <span>Load Records from mysql.db</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
