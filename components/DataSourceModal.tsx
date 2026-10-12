'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ClientProfile, UnifiedAdRecord, ColumnMappingState, AgencyAuditWorkbookResult, ExperimentItem } from '@/lib/types';
import { parseSpreadsheetFile, autoDetectColumnMapping } from '@/lib/dataNormalizer';
import { saveClientProfile, saveClientExperiments, saveClientPeriods } from '@/lib/storage';
import { ColumnMapper } from './ColumnMapper';
import { 
  X, 
  UploadCloud, 
  CheckCircle2, 
  FileSpreadsheet, 
  Link as LinkIcon, 
  Layers, 
  AlertCircle,
  Database,
  ArrowRight,
  ClipboardPaste,
  Sparkles,
  ExternalLink,
  BookOpen,
  Eye,
  EyeOff,
  RefreshCw,
  User,
  Radio,
  Building2,
  Check
} from 'lucide-react';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientProfile;
  onDataLoaded: (records: UnifiedAdRecord[]) => void;
  initialTab?: 'manual' | 'sheet' | 'credentials';
  onClientUpdated?: (updatedClient: ClientProfile) => void;
}

export const DataSourceModal: React.FC<DataSourceModalProps> = ({
  isOpen,
  onClose,
  client,
  onDataLoaded,
  initialTab = 'sheet',
  onClientUpdated
}) => {
  // Top-Level 3 Options (Matching Main Dashboard Onboarding)
  const [activeTab, setActiveTab] = useState<'manual' | 'sheet' | 'credentials'>(initialTab);

  // Sync initial tab when modal opens or initialTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || (client.metaConnected ? 'credentials' : 'sheet'));
    }
  }, [isOpen, initialTab, client.metaConnected]);

  // =========================================================================
  // TAB 1: BASIC PROFILE STATE (Name & Website, Targets, Drive Folder)
  // =========================================================================
  const [profileName, setProfileName] = useState(client.name || '');
  const [profileBusinessName, setProfileBusinessName] = useState(client.businessName || '');
  const [profileWebsite, setProfileWebsite] = useState(client.website || '');
  const [profileCurrency, setProfileCurrency] = useState(client.currency || 'INR');
  const [profileProductService, setProfileProductService] = useState(client.productService || '');
  const [profileMainOffer, setProfileMainOffer] = useState(client.mainOffer || '');
  const [profileTargetCpa, setProfileTargetCpa] = useState(client.targetCpa ? String(client.targetCpa) : '');
  const [profileDriveFolder, setProfileDriveFolder] = useState(client.driveCreativeFolderUrl || client.driveVideoFolderUrl || '');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Sync profile form when client prop changes
  useEffect(() => {
    setProfileName(client.name || '');
    setProfileBusinessName(client.businessName || '');
    setProfileWebsite(client.website || '');
    setProfileCurrency(client.currency || 'INR');
    setProfileProductService(client.productService || '');
    setProfileMainOffer(client.mainOffer || '');
    setProfileTargetCpa(client.targetCpa ? String(client.targetCpa) : '');
    setProfileDriveFolder(client.driveCreativeFolderUrl || client.driveVideoFolderUrl || '');
  }, [client]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedClient: ClientProfile = {
      ...client,
      name: profileName.trim() || client.name,
      businessName: profileBusinessName.trim() || client.businessName,
      website: profileWebsite.trim() || client.website,
      currency: profileCurrency,
      productService: profileProductService.trim() || client.productService,
      mainOffer: profileMainOffer.trim() || client.mainOffer,
      targetCpa: profileTargetCpa ? parseFloat(profileTargetCpa) : client.targetCpa,
      driveCreativeFolderUrl: profileDriveFolder.trim() || undefined,
      driveVideoFolderUrl: profileDriveFolder.trim() || undefined
    };
    saveClientProfile(updatedClient);
    onClientUpdated?.(updatedClient);
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  // =========================================================================
  // TAB 2: UPLOAD SHEET / CSV STATE & SUB-TABS
  // =========================================================================
  const [sheetInputType, setSheetInputType] = useState<'upload' | 'google_url' | 'paste' | 'database'>('upload');
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

  // Local SQL Database (mysql.db) State
  const [dbState, setDbState] = useState<{
    connected: boolean;
    message: string;
    dbPath: string;
    engine: string;
  } | null>(null);
  const [isDbLoading, setIsDbLoading] = useState(false);
  const [dbActionMessage, setDbActionMessage] = useState<string | null>(null);

  // =========================================================================
  // TAB 3: CONNECT AD APIS STATE (Meta & Google Ads)
  // =========================================================================
  // Meta Mode State
  const [metaAccountId, setMetaAccountId] = useState(client.metaAccountId || '');
  const [metaAccessToken, setMetaAccessToken] = useState(client.metaAccessToken || '');
  const [showMetaToken, setShowMetaToken] = useState(false);
  const [isTestingMeta, setIsTestingMeta] = useState(false);
  const [metaTestStatus, setMetaTestStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  // Google Ads State
  const [googleCustomerId, setGoogleCustomerId] = useState(client.googleCustomerId || '');
  const [googleDeveloperToken, setGoogleDeveloperToken] = useState(client.googleDeveloperToken || '');
  const [googleRefreshToken, setGoogleRefreshToken] = useState(client.googleRefreshToken || '');
  const [showGoogleToken, setShowGoogleToken] = useState(false);
  const [isTestingGoogle, setIsTestingGoogle] = useState(false);
  const [googleTestStatus, setGoogleTestStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Microsoft Clarity State
  const [clarityProjectId, setClarityProjectId] = useState(client.clarityProjectId || '');
  const [clarityApiToken, setClarityApiToken] = useState(client.clarityApiToken || '');
  const [isTestingClarity, setIsTestingClarity] = useState(false);
  const [clarityTestStatus, setClarityTestStatus] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  // -------------------------------------------------------------------------
  // FILE UPLOAD HANDLER
  // -------------------------------------------------------------------------
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
      onClientUpdated?.(updatedClient);
    }

    // 3. Save extracted past learnings to experiments
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

    // 4. Load active performance records
    onDataLoaded(period.records);
    onClose();
  };

  // -------------------------------------------------------------------------
  // GOOGLE SHEET IMPORT HANDLER
  // -------------------------------------------------------------------------
  const handleGoogleSheetImport = async () => {
    if (!sheetUrl) {
      setUploadError('Please enter a valid Google Sheets URL');
      return;
    }

    if (!sheetUrl.includes('docs.google.com/spreadsheets')) {
      setUploadError('This doesn\'t look like a Google Sheets URL. Please paste a link like: https://docs.google.com/spreadsheets/d/...');
      return;
    }

    setUploadError(null);
    setIsImportingSheet(true);

    try {
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

  // -------------------------------------------------------------------------
  // PASTED DATA PARSE HANDLER
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // LOCAL SQL DATABASE (mysql.db) HANDLERS
  // -------------------------------------------------------------------------
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
      await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_client', client })
      });
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
          const updated = {
            ...client,
            ...data.workbookData.clientProfile,
            periodDatasets: periodMap
          };
          saveClientProfile(updated);
          onClientUpdated?.(updated);
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

  // -------------------------------------------------------------------------
  // META CONNECTION HANDLERS
  // -------------------------------------------------------------------------
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
        const updated: ClientProfile = {
          ...client,
          metaAccountId,
          metaAccessToken,
          metaConnected: true
        };
        saveClientProfile(updated);
        onClientUpdated?.(updated);
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

    const updatedClient: ClientProfile = {
      ...client,
      metaAccountId,
      metaAccessToken,
      metaConnected: true,
      lastAnalysisDate: new Date().toISOString().split('T')[0]
    };
    saveClientProfile(updatedClient);
    onClientUpdated?.(updatedClient);

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
      } else {
        setUploadError(data.error || 'No active ad records found in the specified date range.');
      }
    } catch (err: any) {
      setUploadError(`Failed to fetch Meta Ads insights: ${err.message}`);
    } finally {
      setIsFetchingMeta(false);
    }
  };

  // -------------------------------------------------------------------------
  // GOOGLE ADS HANDLERS
  // -------------------------------------------------------------------------
  const handleTestGoogleConnection = async () => {
    if (!googleCustomerId) return;
    setIsTestingGoogle(true);
    setGoogleTestStatus(null);
    try {
      const res = await fetch('/api/google-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          customerId: googleCustomerId,
          developerToken: googleDeveloperToken
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGoogleTestStatus({
          success: true,
          message: `✓ Connected: ${data.accountName}`
        });
        const updated: ClientProfile = {
          ...client,
          googleConnected: true,
          googleCustomerId,
          googleDeveloperToken,
          googleRefreshToken
        };
        saveClientProfile(updated);
        onClientUpdated?.(updated);
      } else {
        setGoogleTestStatus({
          success: false,
          message: data.error || 'Google Ads verification failed.'
        });
      }
    } catch (e: any) {
      setGoogleTestStatus({
        success: false,
        message: e.message || 'Network error connecting to Google Ads API.'
      });
    } finally {
      setIsTestingGoogle(false);
    }
  };

  const handleSaveGoogleCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ClientProfile = {
      ...client,
      googleConnected: Boolean(googleCustomerId),
      googleCustomerId: googleCustomerId.trim() || undefined,
      googleDeveloperToken: googleDeveloperToken.trim() || undefined,
      googleRefreshToken: googleRefreshToken.trim() || undefined
    };
    saveClientProfile(updated);
    onClientUpdated?.(updated);
    setGoogleTestStatus({
      success: true,
      message: '✓ Google Ads credentials saved for this workspace!'
    });
  };

  const handleTestClarityConnection = async () => {
    if (!clarityProjectId.trim()) return;
    setIsTestingClarity(true);
    setClarityTestStatus(null);
    try {
      const res = await fetch('/api/clarity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          projectId: clarityProjectId.trim(),
          apiToken: clarityApiToken.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setClarityTestStatus({
          success: true,
          message: data.message || `✓ Verified Clarity Project ID: ${clarityProjectId}`
        });
        const updated: ClientProfile = {
          ...client,
          clarityConnected: true,
          clarityProjectId: clarityProjectId.trim(),
          clarityApiToken: clarityApiToken.trim() || undefined
        };
        saveClientProfile(updated);
        onClientUpdated?.(updated);
      } else {
        setClarityTestStatus({
          success: false,
          message: data.error || 'Clarity verification failed.'
        });
      }
    } catch (e: any) {
      setClarityTestStatus({
        success: false,
        message: e.message || 'Network error connecting to Clarity API.'
      });
    } finally {
      setIsTestingClarity(false);
    }
  };

  const handleSaveClarityCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ClientProfile = {
      ...client,
      clarityConnected: Boolean(clarityProjectId.trim()),
      clarityProjectId: clarityProjectId.trim() || undefined,
      clarityApiToken: clarityApiToken.trim() || undefined
    };
    saveClientProfile(updated);
    onClientUpdated?.(updated);
    setClarityTestStatus({
      success: true,
      message: '✓ Microsoft Clarity credentials saved for this workspace!'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      {showMapper ? (
        <ColumnMapper
          headers={parsedHeaders}
          rawRows={parsedRows}
          initialMapping={initialMapping}
          clientId={client.id}
          onConfirmMapping={(records) => {
            setShowMapper(false);
            onDataLoaded(records);
            onClose();
          }}
          onCancel={() => setShowMapper(false)}
        />
      ) : (
        <div className="bg-white rounded-[32px] w-full max-w-3xl overflow-hidden shadow-2xl border border-neutral-200/80 my-8">
          {/* Modal Header */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-7 py-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#e2f976] text-[#121316] text-[10px] font-extrabold uppercase">
                  Workspace Setup &amp; Data Hub
                </span>
                <h3 className="font-extrabold text-xl text-slate-900 font-display">
                  {client.name} — Data &amp; Sources Hub
                </h3>
              </div>
              <p className="text-slate-500 text-xs">
                Manage basic client profile, ingest raw multi-sheet workbooks/CSV, or connect live Meta &amp; Google Ad APIs.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 3-Option Selection Tabs (Matching Main Dashboard Onboarding Exactly) */}
          <div className="px-7 pt-4">
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`py-3 px-3 rounded-xl font-bold flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                  activeTab === 'manual'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeTab === 'manual' ? 'bg-[#121316] text-[#e2f976]' : 'bg-slate-200 text-slate-600'}`}>
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-extrabold">1. Basic Profile</span>
                <span className="text-[9px] text-slate-400 hidden sm:inline">Name &amp; Website</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('sheet')}
                className={`py-3 px-3 rounded-xl font-bold flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                  activeTab === 'sheet'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeTab === 'sheet' ? 'bg-[#121316] text-[#e2f976]' : 'bg-slate-200 text-slate-600'}`}>
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-extrabold">2. Upload Sheet / CSV</span>
                <span className="text-[9px] text-slate-400 hidden sm:inline">Instant Data Ingest</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('credentials')}
                className={`py-3 px-3 rounded-xl font-bold flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                  activeTab === 'credentials'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeTab === 'credentials' ? 'bg-[#121316] text-[#e2f976]' : 'bg-slate-200 text-slate-600'}`}>
                  <Radio className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-extrabold">3. Connect Ad APIs</span>
                <span className="text-[9px] text-slate-400 hidden sm:inline">Meta &amp; Google Ads</span>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-7 space-y-5 max-h-[75vh] overflow-y-auto">
            {uploadError && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* =============================================================== */}
            {/* OPTION 1: BASIC PROFILE DETAILS                                */}
            {/* =============================================================== */}
            {activeTab === 'manual' && (
              <form onSubmit={handleSaveProfile} className="space-y-4 animate-in fade-in duration-150">
                {profileSaveSuccess && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>✓ Client profile updated successfully in workspace!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl">
                  <div>
                    <label className="font-bold text-slate-700 text-xs block mb-1">Client Contact Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Sharma"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 text-xs block mb-1">Business / Brand Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GrowthLabs Direct"
                      value={profileBusinessName}
                      onChange={(e) => setProfileBusinessName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 text-xs block mb-1">Website URL</label>
                    <input
                      type="url"
                      placeholder="https://growthlabs.io"
                      value={profileWebsite}
                      onChange={(e) => setProfileWebsite(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 text-xs block mb-1">Currency</label>
                    <select
                      value={profileCurrency}
                      onChange={(e) => setProfileCurrency(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold cursor-pointer"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 text-xs block mb-1">Primary Product / Service</label>
                    <input
                      type="text"
                      placeholder="e.g. D2C Ayurvedic Skin Care"
                      value={profileProductService}
                      onChange={(e) => setProfileProductService(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 text-xs block mb-1">Main Offer / Pricing Hook</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹499 Discovery Kit + Free Serum"
                      value={profileMainOffer}
                      onChange={(e) => setProfileMainOffer(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 text-xs block mb-1">Target CPA ({profileCurrency})</label>
                    <input
                      type="number"
                      placeholder="e.g. 350"
                      value={profileTargetCpa}
                      onChange={(e) => setProfileTargetCpa(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 text-xs block mb-1">Google Drive Creative Folder URL</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/drive/folders/..."
                      value={profileDriveFolder}
                      onChange={(e) => setProfileDriveFolder(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#141517] hover:bg-black text-[#e2f976] rounded-full text-xs font-black shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-[#e2f976]" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            )}

            {/* =============================================================== */}
            {/* OPTION 2: UPLOAD SHEET / CSV (INSTANT DATA INGEST)              */}
            {/* =============================================================== */}
            {activeTab === 'sheet' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Sub-Pills Switcher for Sheet Options */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                  <button
                    type="button"
                    onClick={() => setSheetInputType('upload')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      sheetInputType === 'upload'
                        ? 'bg-[#141517] text-[#e2f976] shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-black hover:bg-slate-200/80'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload File (.xlsx / .csv)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSheetInputType('google_url')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      sheetInputType === 'google_url'
                        ? 'bg-[#141517] text-[#e2f976] shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-black hover:bg-slate-200/80'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Google Sheets URL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSheetInputType('paste')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      sheetInputType === 'paste'
                        ? 'bg-[#141517] text-[#e2f976] shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-black hover:bg-slate-200/80'
                    }`}
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span>Paste Raw CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSheetInputType('database');
                      fetchDbStatus();
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      sheetInputType === 'database'
                        ? 'bg-[#141517] text-[#e2f976] shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-black hover:bg-slate-200/80'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Local SQL (mysql.db)</span>
                  </button>
                </div>

                {/* SUB-VIEW A: UPLOAD FILE (.XLSX / .CSV) */}
                {sheetInputType === 'upload' && (
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
                            className="text-xs text-slate-500 hover:text-black font-bold px-3 py-1 rounded-full bg-[#f4f5f2] cursor-pointer"
                          >
                            Change File
                          </button>
                        </div>

                        {/* Client Brief Summary */}
                        <div className="bg-white border border-[#eef0ec] rounded-2xl p-4 text-xs space-y-2.5">
                          <div className="grid grid-cols-2 gap-3 text-slate-700">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Client / Brand</span>
                              <span className="font-bold text-[#141517]">{detectedAgencyWorkbook.clientProfile?.name || client.name}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Product / Service</span>
                              <span className="font-semibold text-slate-800">{detectedAgencyWorkbook.clientProfile?.productService || client.productService}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Pricing &amp; Offer</span>
                              <span className="font-semibold text-slate-800">{detectedAgencyWorkbook.clientProfile?.pricing || detectedAgencyWorkbook.clientProfile?.mainOffer || client.mainOffer}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Audience</span>
                              <span className="font-semibold text-slate-800">{detectedAgencyWorkbook.clientProfile?.targetAudience || client.targetAudience}</span>
                            </div>
                          </div>

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
                                <span>{detectedAgencyWorkbook.pastLearnings.length} Past Tests &amp; Learnings Ingested</span>
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
                                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
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
                            className="flex-1 py-3 bg-[#141517] hover:bg-black text-[#e2f976] font-black text-xs rounded-full shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#e2f976]" />
                            <span>Apply &amp; Ingest {selectedPeriodLabel}</span>
                          </button>

                          <button
                            onClick={() => setShowMapper(true)}
                            className="px-5 py-3 border border-[#eef0ec] bg-[#f4f5f2] hover:bg-[#e8eae4] text-[#141517] text-xs font-bold rounded-full transition cursor-pointer"
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
                                Instantly parse 244 ads across 7D, 14D &amp; 30D, ingest Hinglish copy, and sync to local mysql.db.
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
                            className="px-5 py-2.5 bg-[#e2f976] hover:bg-white text-[#141517] rounded-full text-xs font-black transition flex items-center gap-1.5 shadow-sm whitespace-nowrap disabled:opacity-50 cursor-pointer"
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
                              Supports multi-sheet agency workbooks (e.g. MKR-DATA-AI.xlsx with Assets &amp; 7D/14D/30D tabs) and standard Meta exports.
                            </p>
                          </div>
                          <span className="inline-block px-4 py-1.5 bg-[#f4f5f2] text-slate-700 text-[11px] font-bold rounded-full">
                            Auto Multi-Tab &amp; Column Discovery
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SUB-VIEW B: GOOGLE SHEETS */}
                {sheetInputType === 'google_url' && (
                  <div className="space-y-4">
                    <div className="bg-[#e2f976]/20 border border-[#e2f976] rounded-2xl p-4 text-xs text-[#141517]">
                      <p className="font-extrabold text-[#141517] mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Live Google Sheets Connector — No API Key Required
                      </p>
                      <p className="text-slate-700 leading-relaxed">
                        Imports ad performance data directly from a public Google Sheet shared as <strong>&quot;Anyone with the link &rarr; Viewer&quot;</strong>.
                      </p>
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
                        First row must contain column headers (Ad Name, Spend, Impressions, CTR, CPA, ROAS). Columns are auto-mapped.
                      </p>
                    </div>

                    <button
                      onClick={handleGoogleSheetImport}
                      disabled={isImportingSheet || !sheetUrl}
                      className={`w-full py-3 font-black text-xs rounded-full shadow-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                        isImportingSheet || !sheetUrl
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-[#141517] hover:bg-black text-[#e2f976]'
                      }`}
                    >
                      {isImportingSheet ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#e2f976]" />
                          <span>Fetching &amp; Parsing Sheet Data...</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>Import from Google Sheets</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* SUB-VIEW C: PASTE RAW CSV */}
                {sheetInputType === 'paste' && (
                  <div className="space-y-4">
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
                        <span>Supports CSV and tab-separated text directly from Excel</span>
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
                      className={`w-full py-3 font-black text-xs rounded-full shadow-sm transition flex items-center justify-center gap-2 cursor-pointer ${
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
                          <span>Process &amp; Map Ingested Data</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* SUB-VIEW D: LOCAL SQL (mysql.db) */}
                {sheetInputType === 'database' && (
                  <div className="space-y-4">
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
                        Runs locally inside your workspace. All tables (clients, ad performance, experiments, history) auto-initialize.
                      </p>
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

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={handleSyncToDb}
                        disabled={isDbLoading}
                        className="p-3.5 bg-[#141517] hover:bg-black text-[#e2f976] rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
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
                        className="p-3.5 bg-white border border-[#eef0ec] hover:border-[#141517] text-slate-900 rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-slate-700" />
                        <span>Load Records from mysql.db</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =============================================================== */}
            {/* OPTION 3: CONNECT AD APIS (META & GOOGLE ADS)                   */}
            {/* =============================================================== */}
            {activeTab === 'credentials' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Meta Ads Section */}
                <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        M
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs block">Meta Ads Manager (Direct API)</span>
                        <span className="text-[10px] text-slate-500 font-medium">Auto-sync live impressions, spend, CPA &amp; creatives</span>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      client.metaConnected || metaTestStatus?.success ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {client.metaConnected || metaTestStatus?.success ? '● Connected' : '○ Not Connected'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Meta Ad Account ID</label>
                      <input
                        type="text"
                        placeholder="act_123456789"
                        value={metaAccountId}
                        onChange={(e) => setMetaAccountId(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">System User Access Token</label>
                      <div className="relative">
                        <input
                          type={showMetaToken ? 'text' : 'password'}
                          placeholder="EAAGm0PX..."
                          value={metaAccessToken}
                          onChange={(e) => setMetaAccessToken(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 pr-9 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowMetaToken(!showMetaToken)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showMetaToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs items-end">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Reporting Time Window</label>
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold cursor-pointer"
                      >
                        <option value="Last 7 Days">Last 7 Days (Default)</option>
                        <option value="Last 14 Days">Last 14 Days</option>
                        <option value="Last 30 Days">Last 30 Days</option>
                        <option value="Lifetime">Lifetime (Full Account Audit)</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleTestMetaConnection}
                        disabled={isTestingMeta || !metaAccountId || !metaAccessToken}
                        className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        {isTestingMeta ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
                        <span>Test Meta</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleMetaFetch}
                        disabled={isFetchingMeta || !metaAccountId || !metaAccessToken}
                        className="flex-1 py-2 px-3 bg-[#141517] hover:bg-black text-[#e2f976] font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        {isFetchingMeta ? <RefreshCw className="w-3 h-3 animate-spin text-[#e2f976]" /> : null}
                        <span>Sync Live Meta</span>
                      </button>
                    </div>
                  </div>

                  {metaTestStatus && (
                    <div className={`p-2.5 rounded-xl text-xs font-semibold ${
                      metaTestStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {metaTestStatus.message}
                    </div>
                  )}
                </div>

                {/* Google Ads Section */}
                <form onSubmit={handleSaveGoogleCredentials} className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                        G
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs block">Google Ads (Search, PMax, YouTube)</span>
                        <span className="text-[10px] text-slate-500 font-medium">Customer ID &amp; Developer Token connector</span>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      client.googleConnected || googleTestStatus?.success ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {client.googleConnected || googleTestStatus?.success ? '● Connected' : '○ Not Connected'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Customer ID (xxx-xxx-xxxx)</label>
                      <input
                        type="text"
                        placeholder="123-456-7890"
                        value={googleCustomerId}
                        onChange={(e) => setGoogleCustomerId(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Developer Token (Optional / Demo)</label>
                      <div className="relative">
                        <input
                          type={showGoogleToken ? 'text' : 'password'}
                          placeholder="Optional (defaults to demo)"
                          value={googleDeveloperToken}
                          onChange={(e) => setGoogleDeveloperToken(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 pr-9 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowGoogleToken(!showGoogleToken)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showGoogleToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleTestGoogleConnection}
                      disabled={!googleCustomerId || isTestingGoogle}
                      className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isTestingGoogle ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
                      <span>Test Google</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!googleCustomerId}
                      className="py-2 px-4 bg-[#141517] hover:bg-black text-[#e2f976] font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Google Credentials</span>
                    </button>
                  </div>

                  {googleTestStatus && (
                    <div className={`p-2.5 rounded-xl text-xs font-semibold ${
                      googleTestStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {googleTestStatus.message}
                    </div>
                  )}
                </form>

                {/* Microsoft Clarity Section */}
                <form onSubmit={handleSaveClarityCredentials} className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        C
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs block">Microsoft Clarity (Heatmaps &amp; User Session Telemetry)</span>
                        <span className="text-[10px] text-slate-500 font-medium">Rage clicks, dead clicks &amp; scroll depth telemetry</span>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      client.clarityConnected || clarityTestStatus?.success ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {client.clarityConnected || clarityTestStatus?.success ? '● Connected' : '○ Not Connected'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Clarity Project ID *</label>
                      <input
                        type="text"
                        placeholder="e.g. n8x92abcde"
                        value={clarityProjectId}
                        onChange={(e) => setClarityProjectId(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Clarity API Key (Optional)</label>
                      <input
                        type="password"
                        placeholder="Optional for live API export"
                        value={clarityApiToken}
                        onChange={(e) => setClarityApiToken(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleTestClarityConnection}
                      disabled={!clarityProjectId.trim() || isTestingClarity}
                      className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isTestingClarity ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
                      <span>Test Clarity</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!clarityProjectId.trim()}
                      className="py-2 px-4 bg-[#141517] hover:bg-black text-[#e2f976] font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Clarity Credentials</span>
                    </button>
                  </div>

                  {clarityTestStatus && (
                    <div className={`p-2.5 rounded-xl text-xs font-semibold ${
                      clarityTestStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {clarityTestStatus.message}
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
