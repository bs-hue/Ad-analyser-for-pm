'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  getStoredClients, 
  saveClientProfile,
  saveClientDataset,
  saveClientPeriods
} from '@/lib/storage';
import { ClientProfile, UnifiedAdRecord } from '@/lib/types';
import { parseSpreadsheetFile, autoDetectColumnMapping, normalizeRawRow } from '@/lib/dataNormalizer';
import { 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  FlaskConical, 
  ArrowRight, 
  Plus, 
  ExternalLink,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  UploadCloud,
  Link as LinkIcon,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  X,
  FileText,
  User,
  Radio,
  Check
} from 'lucide-react';

type OnboardingTab = 'manual' | 'sheet' | 'credentials';

export default function HomePage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [activeTab, setActiveTab] = useState<OnboardingTab>('manual');

  // Shared Form Fields
  const [newClientName, setNewClientName] = useState('');
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newOffer, setNewOffer] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [driveFolderUrl, setDriveFolderUrl] = useState('');

  // Option 2: Sheet / CSV Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sheetInputType, setSheetInputType] = useState<'upload' | 'google_url'>('upload');
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isParsingSheet, setIsParsingSheet] = useState(false);
  const [sheetParseError, setSheetParseError] = useState<string | null>(null);
  const [parsedRecords, setParsedRecords] = useState<UnifiedAdRecord[]>([]);
  const [parsedPeriods, setParsedPeriods] = useState<Record<string, UnifiedAdRecord[]> | null>(null);
  const [extractedBrandProfile, setExtractedBrandProfile] = useState<Partial<ClientProfile> | null>(null);

  // Option 3: Meta & Google Ads Credentials State
  const [metaAccountId, setMetaAccountId] = useState('');
  const [metaAccessToken, setMetaAccessToken] = useState('');
  const [showMetaToken, setShowMetaToken] = useState(false);
  const [metaTestStatus, setMetaTestStatus] = useState<{ loading: boolean; success?: boolean; message?: string }>({ loading: false });

  const [googleCustomerId, setGoogleCustomerId] = useState('');
  const [googleDeveloperToken, setGoogleDeveloperToken] = useState('');
  const [showGoogleToken, setShowGoogleToken] = useState(false);
  const [googleTestStatus, setGoogleTestStatus] = useState<{ loading: boolean; success?: boolean; message?: string }>({ loading: false });

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setClients(getStoredClients());
  }, []);

  const resetModalState = () => {
    setShowAddClientModal(false);
    setActiveTab('manual');
    setNewClientName('');
    setNewBusinessName('');
    setNewWebsite('');
    setNewProduct('');
    setNewOffer('');
    setCurrency('INR');
    setUploadedFileName('');
    setGoogleSheetUrl('');
    setParsedRecords([]);
    setParsedPeriods(null);
    setExtractedBrandProfile(null);
    setSheetParseError(null);
    setMetaAccountId('');
    setMetaAccessToken('');
    setMetaTestStatus({ loading: false });
    setGoogleCustomerId('');
    setGoogleDeveloperToken('');
    setGoogleTestStatus({ loading: false });
    setDriveFolderUrl('');
    setIsSubmitting(false);
  };

  // --------------------------------------------------------------------------
  // OPTION 2: Handle Spreadsheet / CSV Parsing
  // --------------------------------------------------------------------------
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingSheet(true);
    setSheetParseError(null);
    setUploadedFileName(file.name);

    try {
      const parsed = await parseSpreadsheetFile(file);

      if (parsed.agencyWorkbook) {
        // Multi-tab Agency Audit Workbook (e.g. MKR-DATA-AI.xlsx)
        const wb = parsed.agencyWorkbook;
        setParsedRecords(wb.activePeriodRecords || []);
        if (wb.clientProfile?.name && !newClientName) {
          setNewClientName(wb.clientProfile.name);
        }
        if (wb.clientProfile?.businessName && !newBusinessName) {
          setNewBusinessName(wb.clientProfile.businessName);
        }
        if (wb.clientProfile?.website && !newWebsite) {
          setNewWebsite(wb.clientProfile.website);
        }
        if (wb.clientProfile?.mainOffer && !newOffer) {
          setNewOffer(wb.clientProfile.mainOffer);
        }
        if (wb.clientProfile?.currency) {
          setCurrency(wb.clientProfile.currency);
        }

        const periodMap: Record<string, UnifiedAdRecord[]> = {};
        wb.periods.forEach(p => {
          periodMap[p.label] = p.records;
        });
        setParsedPeriods(periodMap);
        setExtractedBrandProfile(wb.clientProfile || null);
      } else {
        // Standard CSV / Flat Sheet
        const mapping = autoDetectColumnMapping(parsed.headers);
        const tempClientId = `client-${Date.now().toString(36)}`;
        const normalized = parsed.rows.map(r => normalizeRawRow(r, mapping, tempClientId));

        if (normalized.length === 0) {
          throw new Error('No valid performance records detected. Please check sheet columns.');
        }

        setParsedRecords(normalized);
        setParsedPeriods({ 'Last 7 Days': normalized });
      }
    } catch (err: any) {
      setSheetParseError(err.message || 'Failed to parse file.');
      setParsedRecords([]);
    } finally {
      setIsParsingSheet(false);
    }
  };

  const handleFetchGoogleSheet = async () => {
    if (!googleSheetUrl) return;
    setIsParsingSheet(true);
    setSheetParseError(null);

    try {
      const res = await fetch(`/api/sheets?url=${encodeURIComponent(googleSheetUrl)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch Google Sheet.');
      }

      if (data.headers && data.rows) {
        const mapping = autoDetectColumnMapping(data.headers);
        const tempClientId = `client-${Date.now().toString(36)}`;
        const normalized = data.rows.map((r: any) => normalizeRawRow(r, mapping, tempClientId));
        setParsedRecords(normalized);
        setParsedPeriods({ 'Last 7 Days': normalized });
        setUploadedFileName('Google Sheet (Connected)');
      } else {
        throw new Error('Google Sheet returned no recognizable data rows.');
      }
    } catch (err: any) {
      setSheetParseError(err.message || 'Error loading Google Sheet.');
    } finally {
      setIsParsingSheet(false);
    }
  };

  // --------------------------------------------------------------------------
  // OPTION 3: Handle Meta & Google Ads Test Connections
  // --------------------------------------------------------------------------
  const handleTestMetaConnection = async () => {
    if (!metaAccountId || !metaAccessToken) return;
    setMetaTestStatus({ loading: true });

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
          loading: false,
          success: true,
          message: `Connected: ${data.accountName} (${data.currency || 'INR'})`
        });
      } else {
        setMetaTestStatus({
          loading: false,
          success: false,
          message: data.error || 'Meta verification failed.'
        });
      }
    } catch (e: any) {
      setMetaTestStatus({
        loading: false,
        success: false,
        message: e.message || 'Network error connecting to Meta API.'
      });
    }
  };

  const handleTestGoogleConnection = async () => {
    if (!googleCustomerId) return;
    setGoogleTestStatus({ loading: true });

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
          loading: false,
          success: true,
          message: `Connected: ${data.accountName}`
        });
      } else {
        setGoogleTestStatus({
          loading: false,
          success: false,
          message: data.error || 'Google Ads verification failed.'
        });
      }
    } catch (e: any) {
      setGoogleTestStatus({
        loading: false,
        success: false,
        message: e.message || 'Network error connecting to Google Ads API.'
      });
    }
  };

  // --------------------------------------------------------------------------
  // CREATE CLIENT HANDLER (All 3 Options)
  // --------------------------------------------------------------------------
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalClientName = newClientName || extractedBrandProfile?.name;
    const finalBusinessName = newBusinessName || extractedBrandProfile?.businessName || `${finalClientName} Official`;

    if (!finalClientName || !finalBusinessName) return;

    setIsSubmitting(true);
    const clientId = `client-${Date.now().toString(36)}`;

    // Build the base ClientProfile
    const newClient: ClientProfile = {
      id: clientId,
      name: finalClientName,
      businessName: finalBusinessName,
      website: newWebsite || extractedBrandProfile?.website || 'https://example.com',
      productService: newProduct || extractedBrandProfile?.productService || 'Core Product / Service',
      mainOffer: newOffer || extractedBrandProfile?.mainOffer || 'Primary Offer',
      pricing: extractedBrandProfile?.pricing || '499',
      targetAudience: extractedBrandProfile?.targetAudience || 'Growth Founders & Scaled Digital Buyers',
      geography: extractedBrandProfile?.geography || 'India, Global',
      usp: extractedBrandProfile?.usp || 'High-converting performance marketing engine',
      painPoints: extractedBrandProfile?.painPoints || ['Rising CAC', 'Creative fatigue'],
      desires: extractedBrandProfile?.desires || ['Profitable scale above 3.5x ROAS'],
      customerObjections: extractedBrandProfile?.customerObjections || ['Will this work for our niche?'],
      competitors: extractedBrandProfile?.competitors || ['Top category competitors'],
      brandTone: extractedBrandProfile?.brandTone || 'Direct, Credible, Performance-Driven',
      approvedClaims: extractedBrandProfile?.approvedClaims || ['Proven marketing framework'],
      restrictedClaims: extractedBrandProfile?.restrictedClaims || ['No false claims'],
      
      // Integrations
      metaConnected: activeTab === 'credentials' ? Boolean(metaAccountId && metaAccessToken) : false,
      metaAccountId: metaAccountId || undefined,
      metaAccessToken: metaAccessToken || undefined,
      googleConnected: activeTab === 'credentials' ? Boolean(googleCustomerId) : false,
      googleCustomerId: googleCustomerId || undefined,
      googleDeveloperToken: googleDeveloperToken || undefined,

      lastAnalysisDate: new Date().toISOString().split('T')[0],
      activeExperimentsCount: 0,
      currency: currency || 'INR',
      driveVideoFolderUrl: driveFolderUrl || extractedBrandProfile?.driveVideoFolderUrl || undefined,
      driveCreativeFolderUrl: driveFolderUrl || extractedBrandProfile?.driveCreativeFolderUrl || undefined,
      pastLearnings: extractedBrandProfile?.pastLearnings || undefined,
      primaryTexts: extractedBrandProfile?.primaryTexts || undefined,
      headlines: extractedBrandProfile?.headlines || undefined,
      descriptions: extractedBrandProfile?.descriptions || undefined,
      ctas: extractedBrandProfile?.ctas || undefined
    };

    // Save client profile
    saveClientProfile(newClient);

    // If Sheet / CSV data was parsed, attach and persist it immediately!
    if (parsedRecords.length > 0) {
      // Re-assign records to this client ID
      const adjustedRecords = parsedRecords.map(r => ({ ...r, clientId }));
      saveClientDataset(clientId, adjustedRecords);

      if (parsedPeriods) {
        const adjustedPeriods: Record<string, UnifiedAdRecord[]> = {};
        Object.entries(parsedPeriods).forEach(([pLabel, pRecords]) => {
          adjustedPeriods[pLabel] = pRecords.map(r => ({ ...r, clientId }));
        });
        saveClientPeriods(clientId, adjustedPeriods);
      } else {
        saveClientPeriods(clientId, { 'Last 7 Days': adjustedRecords });
      }
    }

    // Refresh client list
    setClients(getStoredClients());
    resetModalState();

    // Direct user right into their new workspace
    router.push(`/client/${clientId}`);
  };

  return (
    <div className="min-h-screen w-full bg-[#fbfcfb] text-[#121316] font-sans p-6 sm:p-10 lg:p-12 flex justify-center items-start">
      {/* Main Container */}
      <div className="w-full max-w-7xl bg-white rounded-[32px] border border-neutral-200/80 shadow-sm overflow-hidden p-6 sm:p-10 space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ecefec] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5 text-[#e2f976]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#121316] text-lg tracking-tight font-display">Antigravity Intelligence</span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#e2f976] text-[#121316] shadow-sm">
                  Agency OS
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Multimodal Funnel & Creative Diagnostic Agent for Media Buyers</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddClientModal(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#121316] hover:bg-black text-white rounded-full text-xs font-bold shadow-sm transition hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="bg-[#f0f3f0] border border-[#e2e7e2] rounded-[30px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#121316] tracking-tight font-display flex flex-wrap items-center gap-2">
              <span>Managing</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300/80 rounded-full text-xs font-semibold text-slate-800 shadow-sm">
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                Your Clients
              </span>
              <span>and</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e2f976] text-[#121316] rounded-full text-xs font-extrabold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#121316]" />
                Creative Workflows
              </span>
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Onboard clients manually, drop raw agency multi-tab Excel/CSV workbooks, or sync Meta & Google Ads. The agent deterministically audits unit economics, downloads Drive video ads to 720p, runs multimodal vision teardowns, and produces prioritized 7-day action playbooks.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white border border-[#e2e7e2] p-4 rounded-2xl text-xs flex-shrink-0 shadow-sm">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Active Workspaces</span>
              <span className="text-2xl font-extrabold text-[#121316] font-display">{clients.length} Clients</span>
            </div>
            <div className="pl-4 border-l border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Reasoning Core</span>
              <span className="text-xs font-extrabold text-[#121316] bg-[#e2f976] px-2 py-0.5 rounded-full inline-block mt-0.5">
                Claude 3.5 Sonnet
              </span>
            </div>
          </div>
        </div>

        {/* Client Workspaces Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Select Client Workspace</h2>
            <span className="text-xs text-slate-500 font-medium">CSV, Excel, Meta & Google Ads supported</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-[#e2e7e2] rounded-[28px] p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between space-y-5 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#f0f3f0] group-hover:bg-[#e2f976] text-[#121316] flex items-center justify-center font-extrabold text-sm transition">
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {c.metaConnected && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" /> Meta
                        </span>
                      )}
                      {c.googleConnected && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <CheckCircle2 className="w-3 h-3 text-amber-600" /> Google
                        </span>
                      )}
                      {!c.metaConnected && !c.googleConnected && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#f0f3f0] text-slate-700 border border-slate-200">
                          Excel / Sheet
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-extrabold text-lg text-[#121316] tracking-tight font-display">{c.name}</h3>
                  <p className="text-xs font-medium text-slate-500 mb-1">{c.businessName}</p>
                  <p className="text-xs text-slate-600 line-clamp-2">{c.productService}</p>
                </div>

                {/* Metadata & CTA */}
                <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-medium">
                    <div>
                      <span className="block text-slate-400">Offer / Pricing:</span>
                      <span className="font-bold text-slate-900">{c.pricing || c.mainOffer || '₹499'}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Past Tests:</span>
                      <span className="font-bold text-slate-900">{c.pastLearnings?.length || 0} Learnings</span>
                    </div>
                  </div>

                  <Link
                    href={`/client/${c.id}`}
                    className="w-full py-2.5 bg-[#121316] hover:bg-black text-white font-bold rounded-full text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3-OPTION ONBOARDING MODAL                                                 */}
      {/* ========================================================================= */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-xs my-8 animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#e2f976] text-[#121316] text-[10px] font-extrabold uppercase">
                    New Onboarding
                  </span>
                  <h3 className="font-extrabold text-xl text-slate-900 font-display">Create Client Workspace</h3>
                </div>
                <p className="text-slate-500 text-xs">
                  Choose how you want to initialize this client: quick profile, raw spreadsheet/CSV, or live ad accounts.
                </p>
              </div>
              <button
                type="button"
                onClick={resetModalState}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3-Option Selection Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`py-3 px-3 rounded-xl font-bold flex flex-col items-center gap-1.5 transition text-center ${
                  activeTab === 'manual'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeTab === 'manual' ? 'bg-[#121316] text-[#e2f976]' : 'bg-slate-200 text-slate-600'}`}>
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-extrabold">1. Basic Profile</span>
                <span className="text-[9px] text-slate-400 hidden sm:inline">Name & Website</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('sheet')}
                className={`py-3 px-3 rounded-xl font-bold flex flex-col items-center gap-1.5 transition text-center ${
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
                className={`py-3 px-3 rounded-xl font-bold flex flex-col items-center gap-1.5 transition text-center ${
                  activeTab === 'credentials'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeTab === 'credentials' ? 'bg-[#121316] text-[#e2f976]' : 'bg-slate-200 text-slate-600'}`}>
                  <Radio className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-extrabold">3. Connect Ad APIs</span>
                <span className="text-[9px] text-slate-400 hidden sm:inline">Meta & Google Ads</span>
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4">
              {/* Primary Identity (Required in all 3 tabs) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Client Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Sharma"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Business / Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GrowthLabs Direct"
                    value={newBusinessName}
                    onChange={(e) => setNewBusinessName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* =============================================================== */}
              {/* TAB 1: BASIC PROFILE DETAILS                                    */}
              {/* =============================================================== */}
              {activeTab === 'manual' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">Website URL</label>
                      <input
                        type="url"
                        placeholder="https://growthlabs.io"
                        value={newWebsite}
                        onChange={(e) => setNewWebsite(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Currency</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
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
                      <label className="font-bold text-slate-700 block mb-1">Primary Product / Service</label>
                      <input
                        type="text"
                        placeholder="e.g. D2C Ayurvedic Skin Care"
                        value={newProduct}
                        onChange={(e) => setNewProduct(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Main Offer / Pricing Hook</label>
                      <input
                        type="text"
                        placeholder="e.g. ₹499 Discovery Kit + Free Serum"
                        value={newOffer}
                        onChange={(e) => setNewOffer(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Google Drive Creative Folder URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/drive/folders/1A2B3C..."
                      value={driveFolderUrl}
                      onChange={(e) => setDriveFolderUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Shared folder set to &quot;Anyone with the link can view&quot; for video ad assets</span>
                  </div>
                </div>
              )}

              {/* =============================================================== */}
              {/* TAB 2: ADD SHEET MANUALLY (CSV / XLSX / GOOGLE SHEET)          */}
              {/* =============================================================== */}
              {activeTab === 'sheet' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                    <button
                      type="button"
                      onClick={() => setSheetInputType('upload')}
                      className={`text-xs font-bold pb-1 border-b-2 transition ${
                        sheetInputType === 'upload'
                          ? 'border-slate-900 text-slate-900'
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Upload File (.xlsx / .csv)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSheetInputType('google_url')}
                      className={`text-xs font-bold pb-1 border-b-2 transition ${
                        sheetInputType === 'google_url'
                          ? 'border-slate-900 text-slate-900'
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Connect Google Sheets URL
                    </button>
                  </div>

                  {sheetInputType === 'upload' ? (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-slate-900 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50 hover:bg-slate-100/80 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-2 text-slate-700 group-hover:scale-110 transition shadow-sm">
                          <UploadCloud className="w-5 h-5 text-slate-800" />
                        </div>
                        <p className="font-bold text-slate-800 text-xs">
                          {uploadedFileName ? uploadedFileName : 'Click to browse or drop CSV / Excel file'}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Supports multi-tab Agency Audit Workbooks (like MKR-DATA-AI.xlsx) and standard Meta/Google CSV exports.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="font-bold text-slate-700 block">Public Google Sheets URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://docs.google.com/spreadsheets/d/..."
                          value={googleSheetUrl}
                          onChange={(e) => setGoogleSheetUrl(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        <button
                          type="button"
                          onClick={handleFetchGoogleSheet}
                          disabled={!googleSheetUrl || isParsingSheet}
                          className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs disabled:opacity-50 transition flex items-center gap-1.5"
                        >
                          {isParsingSheet ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <LinkIcon className="w-3.5 h-3.5" />}
                          <span>Fetch</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Parsing Feedback Indicator */}
                  {isParsingSheet && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-blue-800">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                      <span>Parsing spreadsheet structure & normalising columns...</span>
                    </div>
                  )}

                  {sheetParseError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800">
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>{sheetParseError}</span>
                    </div>
                  )}

                  {parsedRecords.length > 0 && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1.5 text-emerald-900">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Ready to Import: {parsedRecords.length} Ad Records Detected</span>
                      </div>
                      <p className="text-[11px] text-emerald-700">
                        {parsedPeriods 
                          ? `Parsed ${Object.keys(parsedPeriods).length} historical performance periods (7D, 14D, 30D).`
                          : 'Columns auto-mapped to standard performance schema.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* =============================================================== */}
              {/* TAB 3: CONNECT AD ACCOUNTS (META & GOOGLE ADS)                  */}
              {/* =============================================================== */}
              {activeTab === 'credentials' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Meta Section */}
                  <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          M
                        </div>
                        <span className="font-extrabold text-slate-900 text-xs">Meta Ads Manager (Direct API)</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleTestMetaConnection}
                        disabled={!metaAccountId || !metaAccessToken || metaTestStatus.loading}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-[10px] font-bold disabled:opacity-40 transition flex items-center gap-1"
                      >
                        {metaTestStatus.loading && <RefreshCw className="w-3 h-3 animate-spin" />}
                        <span>Test Meta</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Meta Ad Account ID</label>
                        <input
                          type="text"
                          placeholder="act_123456789"
                          value={metaAccountId}
                          onChange={(e) => setMetaAccountId(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">System User Access Token</label>
                        <div className="relative">
                          <input
                            type={showMetaToken ? 'text' : 'password'}
                            placeholder="EAAGm0PX..."
                            value={metaAccessToken}
                            onChange={(e) => setMetaAccessToken(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 pr-8"
                          />
                          <button
                            type="button"
                            onClick={() => setShowMetaToken(!showMetaToken)}
                            className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                          >
                            {showMetaToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {metaTestStatus.message && (
                      <div className={`p-2 rounded-xl text-[10px] font-medium flex items-center gap-1.5 ${
                        metaTestStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {metaTestStatus.success ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-rose-600" />}
                        <span>{metaTestStatus.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Google Ads Section */}
                  <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                          G
                        </div>
                        <span className="font-extrabold text-slate-900 text-xs">Google Ads (Search, PMax, YouTube)</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleTestGoogleConnection}
                        disabled={!googleCustomerId || googleTestStatus.loading}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-[10px] font-bold disabled:opacity-40 transition flex items-center gap-1"
                      >
                        {googleTestStatus.loading && <RefreshCw className="w-3 h-3 animate-spin" />}
                        <span>Test Google</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Customer ID (xxx-xxx-xxxx)</label>
                        <input
                          type="text"
                          placeholder="123-456-7890"
                          value={googleCustomerId}
                          onChange={(e) => setGoogleCustomerId(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Developer Token (Optional / Demo)</label>
                        <div className="relative">
                          <input
                            type={showGoogleToken ? 'text' : 'password'}
                            placeholder="Optional (defaults to demo)"
                            value={googleDeveloperToken}
                            onChange={(e) => setGoogleDeveloperToken(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 pr-8"
                          />
                          <button
                            type="button"
                            onClick={() => setShowGoogleToken(!showGoogleToken)}
                            className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                          >
                            {showGoogleToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {googleTestStatus.message && (
                      <div className={`p-2 rounded-xl text-[10px] font-medium flex items-center gap-1.5 ${
                        googleTestStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {googleTestStatus.success ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-rose-600" />}
                        <span>{googleTestStatus.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={resetModalState}
                  className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 rounded-full font-bold text-slate-700 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || (!newClientName && !extractedBrandProfile?.name)}
                  className="px-6 py-2.5 bg-[#121316] hover:bg-black text-white rounded-full font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50 hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#e2f976]" />
                      <span>Creating Workspace...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {activeTab === 'sheet' && parsedRecords.length > 0
                          ? `Create & Ingest ${parsedRecords.length} Ads`
                          : activeTab === 'credentials'
                          ? 'Create with Connected APIs'
                          : 'Create Client Workspace'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#e2f976]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
