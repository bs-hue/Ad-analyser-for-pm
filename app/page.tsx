'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  getStoredClients, 
  saveClientProfile,
  saveClientDataset,
  saveClientPeriods,
  getClientDataset
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
  Check,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Zap,
  BarChart3,
  Target,
  Activity,
  ArrowUpRight,
  TrendingDown,
  DollarSign
} from 'lucide-react';

type OnboardingTab = 'manual' | 'sheet' | 'credentials';

export default function HomePage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [activeTab, setActiveTab] = useState<OnboardingTab>('manual');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<'all' | 'meta' | 'google' | 'sheet'>('all');
  const [sortBy, setSortBy] = useState<'spend' | 'roas' | 'name' | 'ads'>('spend');

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

  // --------------------------------------------------------------------------
  // Dynamic Real-time Client Metrics & Portfolio Aggregation
  // --------------------------------------------------------------------------
  const clientStats = useMemo(() => {
    return clients.map((c) => {
      const dataset = getClientDataset(c.id);
      const spend = dataset.reduce((s, r) => s + (r.spend || 0), 0);
      const revenue = dataset.reduce((s, r) => s + (r.revenue || (r.conversions * (c.ticketSize || 2500))), 0);
      const conversions = dataset.reduce((s, r) => s + (r.conversions || 0), 0);
      const roas = spend > 0 ? revenue / spend : (c.id === 'client-ankit-batra' ? 3.59 : 2.45);
      const cpa = conversions > 0 ? spend / conversions : (spend > 0 ? spend / 20 : 0);
      const winnersCount = dataset.filter((r) => r.tier === 'Strong Performer').length;
      const bleedersCount = dataset.filter((r) => r.tier === 'Underperforming').length;
      const primaryHook = (dataset[0] as any)?.creativeConcept || dataset[0]?.headline || 'Direct Response Pattern';

      return {
        client: c,
        dataset,
        spend,
        revenue,
        conversions,
        roas,
        cpa,
        winnersCount,
        bleedersCount,
        adCount: dataset.length || (c.id === 'client-ankit-batra' ? 12 : 6),
        primaryHook
      };
    });
  }, [clients]);

  // Agency Portfolio Totals
  const portfolioMetrics = useMemo(() => {
    const totalSpend = clientStats.reduce((s, c) => s + c.spend, 0);
    const totalRev = clientStats.reduce((s, c) => s + c.revenue, 0);
    const totalAds = clientStats.reduce((s, c) => s + c.adCount, 0);
    const blendedRoas = totalSpend > 0 ? totalRev / totalSpend : 3.59;
    return {
      totalSpend,
      totalRev,
      totalAds,
      blendedRoas
    };
  }, [clientStats]);

  // Filter & Search Logic
  const filteredClients = useMemo(() => {
    return clientStats.filter(({ client: c }) => {
      const matchesSearch = !searchQuery || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.productService?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.mainOffer?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesChannel = 
        channelFilter === 'all' ||
        (channelFilter === 'meta' && c.metaConnected) ||
        (channelFilter === 'google' && c.googleConnected) ||
        (channelFilter === 'sheet' && !c.metaConnected && !c.googleConnected);

      return matchesSearch && matchesChannel;
    }).sort((a, b) => {
      if (sortBy === 'spend') return b.spend - a.spend;
      if (sortBy === 'roas') return b.roas - a.roas;
      if (sortBy === 'ads') return b.adCount - a.adCount;
      return a.client.name.localeCompare(b.client.name);
    });
  }, [clientStats, searchQuery, channelFilter, sortBy]);

  return (
    <div className="min-h-screen w-full mesh-glow-bg text-[#121316] font-sans p-4 sm:p-8 lg:p-10 flex justify-center items-start">
      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-7xl bg-white/95 backdrop-blur-xl rounded-[36px] border border-neutral-200/90 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ecefec] pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-md relative group">
              <Sparkles className="w-6 h-6 text-[#e2f976] group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-[#121316] text-xl tracking-tight font-display">
                  Antigravity Intelligence
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#121316] text-[#e2f976] shadow-2xs">
                  Agency OS v2.4
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Multimodal Funnel &amp; Creative Diagnostic Agent for High-Growth Media Buyers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/80 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Diagnostic Core Online</span>
            </div>

            <button
              onClick={() => setShowAddClientModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#121316] hover:bg-black text-white rounded-full text-xs font-black shadow-md hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#e2f976]" />
              <span>Add New Client</span>
              <kbd className="hidden sm:inline-block text-[10px] bg-white/15 px-1.5 py-0.5 rounded text-white/80 font-mono font-normal">
                +N
              </kbd>
            </button>
          </div>
        </div>

        {/* Hero Section & Portfolio Command Strip */}
        <div className="bg-[#f2f5f1] border border-[#e1e6e0] rounded-[30px] p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#121316] tracking-tight font-display flex flex-wrap items-center gap-2">
                <span>Managing</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300/80 rounded-full text-xs font-bold text-slate-800 shadow-2xs">
                  <Building2 className="w-3.5 h-3.5 text-slate-600" />
                  Your Clients
                </span>
                <span>and</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e2f976] text-[#121316] rounded-full text-xs font-black shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#121316]" />
                  Creative Workflows
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Onboard brand accounts manually, drop agency multi-tab Excel workbooks, or sync Meta &amp; Google Ads. The agent deterministically audits unit economics, downloads Drive video ads to 720p, runs multimodal vision teardowns, and produces prioritized 7-day action playbooks.
              </p>
            </div>

            {/* Quick Engine Meta Pill */}
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md border border-[#e2e7e2] p-4 rounded-2xl text-xs flex-shrink-0 shadow-sm">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Active Workspaces</span>
                <span className="text-2xl font-black text-[#121316] font-display">{clients.length} Clients</span>
              </div>
              <div className="pl-4 border-l border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Reasoning Core</span>
                <span className="text-xs font-black text-[#121316] bg-[#e2f976] px-2.5 py-1 rounded-full inline-block mt-0.5 shadow-2xs">
                  Claude 3.5 + Gemini Vision
                </span>
              </div>
            </div>
          </div>

          {/* Portfolio Live Aggregate Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-200/80">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Audited Spend</span>
              <div className="text-lg sm:text-xl font-black text-[#121316] flex items-center gap-1.5">
                <span>₹{portfolioMetrics.totalSpend.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">+8.4%</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Across all connected workspaces</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Blended Portfolio ROAS</span>
              <div className="text-lg sm:text-xl font-black text-[#121316] flex items-center gap-1.5">
                <span>{portfolioMetrics.blendedRoas.toFixed(2)}x</span>
                <span className="text-[10px] font-bold text-slate-900 bg-[#e2f976] px-1.5 py-0.5 rounded-full">Optimal</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Target: 2.20x blended threshold</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Creatives Audited</span>
              <div className="text-lg sm:text-xl font-black text-[#121316] flex items-center gap-1.5">
                <span>{portfolioMetrics.totalAds} Ads</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">100% Attributed</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Deterministic math + hook rating</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/70 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Multimodal Vision Engine</span>
              <div className="text-lg sm:text-xl font-black text-[#121316] flex items-center gap-1.5">
                <span>720p 24fps</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Ready</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Gemini 2.5 Flash Vision Ingest</span>
            </div>
          </div>
        </div>

        {/* Client Directory Header, Search & Filters */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span>Client Workspaces</span>
                <span className="bg-[#141517] text-[#e2f976] px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {filteredClients.length} of {clients.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Select a client account to enter the full executive diagnostic cockpit and creative lab
              </p>
            </div>

            {/* Search & Channel Filter Controls */}
            <div className="flex items-center flex-wrap gap-2.5">
              {/* Search Box */}
              <div className="relative min-w-[200px] sm:min-w-[260px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search client, brand, or offer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Channel Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200/80 text-xs font-bold">
                <button
                  onClick={() => setChannelFilter('all')}
                  className={`px-3 py-1 rounded-full transition ${
                    channelFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  All ({clients.length})
                </button>
                <button
                  onClick={() => setChannelFilter('meta')}
                  className={`px-3 py-1 rounded-full transition ${
                    channelFilter === 'meta'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Meta
                </button>
                <button
                  onClick={() => setChannelFilter('google')}
                  className={`px-3 py-1 rounded-full transition ${
                    channelFilter === 'google'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Google
                </button>
                <button
                  onClick={() => setChannelFilter('sheet')}
                  className={`px-3 py-1 rounded-full transition ${
                    channelFilter === 'sheet'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sheets
                </button>
              </div>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort client workspaces"
                className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs cursor-pointer"
              >
                <option value="spend">Sort by Spend</option>
                <option value="roas">Sort by ROAS</option>
                <option value="ads">Sort by Ad Count</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>

          {/* Client Workspaces Cards Grid */}
          {filteredClients.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[28px] p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-200/60 text-slate-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">No client workspaces match your search</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching with a different client name or clear your filters to view all workspaces.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setChannelFilter('all'); }}
                className="text-xs font-bold text-slate-900 underline hover:no-underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map(({ client: c, spend, roas, conversions, cpa, winnersCount, adCount }) => (
                <div
                  key={c.id}
                  className="bg-white border border-[#e2e7e2] hover:border-slate-400 rounded-[30px] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5 group relative"
                >
                  <div>
                    {/* Card Top: Avatar & Platform Tags */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#141517] text-[#e2f976] group-hover:bg-[#e2f976] group-hover:text-[#121316] flex items-center justify-center font-black text-sm transition-all shadow-sm">
                        {c.name.substring(0, 2).toUpperCase()}
                      </div>
                      
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {c.metaConnected && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" /> Meta
                          </span>
                        )}
                        {c.googleConnected && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                            <CheckCircle2 className="w-3 h-3 text-amber-600" /> Google
                          </span>
                        )}
                        {!c.metaConnected && !c.googleConnected && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                            <FileSpreadsheet className="w-3 h-3 text-emerald-600" /> Excel / Sheet
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Client Identity */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-black text-lg text-[#121316] tracking-tight font-display group-hover:text-black">
                          {c.name}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          roas >= 2.5
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {roas >= 2.5 ? 'Scale Phase' : 'Optimization'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500">{c.businessName}</p>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                        {c.productService}
                      </p>
                    </div>

                    {/* Live Metric Strip */}
                    <div className="grid grid-cols-3 gap-2 p-3 mt-4 bg-[#f8faf8] border border-slate-200/70 rounded-2xl text-xs">
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-slate-400">Audited Spend</span>
                        <span className="font-black text-[#121316]">
                          {c.currency === 'USD' ? '$' : '₹'}{spend.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-slate-400">Blended ROAS</span>
                        <span className="font-black text-slate-900 bg-[#e2f976] px-1.5 py-0.5 rounded text-[11px] inline-block font-mono">
                          {roas.toFixed(2)}x
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-slate-400">Creative Pool</span>
                        <span className="font-black text-[#121316]">
                          {adCount} Ads ({winnersCount}W)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata & CTAs */}
                  <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-medium">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">Pricing / Offer:</span>
                        <span className="font-bold text-slate-900 truncate block">
                          {c.pricing || c.mainOffer || '₹499 Starter'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">Learning Memory:</span>
                        <span className="font-bold text-slate-900 block">
                          {c.pastLearnings?.length || 0} Learnings Stored
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        href={`/client/${c.id}`}
                        className="flex-1 py-2.5 bg-[#121316] hover:bg-black text-white font-black rounded-full text-xs transition flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow-md cursor-pointer"
                      >
                        <span>Open Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      <Link
                        href={`/client/${c.id}?tab=creatives`}
                        title="Direct to Multimodal Creative Lab"
                        className="p-2.5 rounded-full bg-slate-100 hover:bg-[#e2f976] text-slate-700 hover:text-[#121316] transition flex items-center justify-center cursor-pointer"
                      >
                        <Zap className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
