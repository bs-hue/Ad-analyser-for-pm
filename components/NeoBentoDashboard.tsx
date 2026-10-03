'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ClientProfile, 
  UnifiedAdRecord, 
  AccountDiagnosisResult, 
  CreativeIntelligence as CreativeType 
} from '@/lib/types';
import { 
  Home,
  LayoutDashboard,
  TrendingUp, 
  Film, 
  Filter, 
  Globe, 
  Sparkles, 
  PlusCircle, 
  FlaskConical, 
  History, 
  BookOpen, 
  FileText, 
  Upload, 
  ChevronDown, 
  ShieldCheck,
  Play,
  ArrowUpRight,
  TrendingDown,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Check,
  LayoutGrid,
  Calendar,
  X,
  Plus,
  Zap,
  ExternalLink,
  Target,
  PanelLeft,
  PanelLeftClose,
  ChevronLeft,
  MoreHorizontal,
  MoreVertical,
  Settings,
  HelpCircle,
  GraduationCap,
  MessageSquare,
  Users,
  BarChart3,
  MousePointerClick,
  DollarSign,
  Share2,
  Link2,
  Rocket
} from 'lucide-react';

export type WorkspaceTab = 
  | 'overview' 
  | 'performance' 
  | 'creatives' 
  | 'funnel' 
  | 'landing_pages' 
  | 'ai_recommendations' 
  | 'ad_generator' 
  | 'experiments' 
  | 'history' 
  | 'client_knowledge';

interface NeoBentoDashboardProps {
  client: ClientProfile;
  clients: ClientProfile[];
  onSelectClient: (clientId: string) => void;
  dateRange: string;
  onChangeDateRange: (range: string) => void;
  onOpenDataSourceModal: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  analysisStep: string;
  onToggleReportView: () => void;
  isReportView: boolean;
  activeTab: WorkspaceTab;
  onChangeTab: (tab: WorkspaceTab) => void;
  activeSubTab?: string;
  onChangeSubTab?: (subTab: string) => void;
  diagnosis: AccountDiagnosisResult;
  creativeMap: Record<string, CreativeType>;
  onAnalyzeVideo?: (ad: UnifiedAdRecord, driveUrl: string) => Promise<void>;
  analyzingVideoId?: string | null;
  onOpenAdGenerator: () => void;
  onLoadSampleDataset?: () => void;
  children?: React.ReactNode;
}

export interface SubTabItem {
  id: string;
  label: string;
  count?: number;
}

export interface SectionMeta {
  title: string;
  subtitle: string;
  subTabs: SubTabItem[];
}

export function getSectionMetaAndSubTabs(
  activeTab: WorkspaceTab,
  records: UnifiedAdRecord[],
  diagnosis: AccountDiagnosisResult,
  creativeMap: Record<string, CreativeType>,
  experimentsCount: number
): SectionMeta {
  switch (activeTab) {
    case 'overview':
      return {
        title: 'Performance Overview',
        subtitle: 'Account health, blended unit economics, and media buyer diagnostic checkups',
        subTabs: [
          { id: 'executive_summary', label: 'Executive Summary' },
          { id: 'checkups', label: 'Media Buyer Waterfall' },
          { id: 'hierarchy', label: 'Spend Hierarchy', count: records.length },
          { id: 'benchmarks', label: 'Agency Benchmarks' }
        ]
      };
    case 'performance': {
      const strongCount = records.filter((r) => r.tier === 'Strong Performer').length;
      const promisingCount = records.filter((r) => r.tier === 'Promising').length;
      const underperformingCount = records.filter((r) => r.tier === 'Underperforming').length;
      const averageCount = records.filter((r) => r.tier === 'Average').length;
      const insufficientCount = records.filter((r) => r.tier === 'Insufficient Data').length;
      return {
        title: 'Performance Tiers',
        subtitle: 'Deterministic media buyer classifications across all campaign ad sets',
        subTabs: [
          { id: 'ALL', label: 'All Ads', count: records.length },
          { id: 'Strong Performer', label: 'Strong Performers', count: strongCount },
          { id: 'Promising', label: 'Promising', count: promisingCount },
          { id: 'Underperforming', label: 'Underperforming', count: underperformingCount },
          { id: 'Average', label: 'Average', count: averageCount },
          { id: 'Insufficient Data', label: 'Insufficient Data', count: insufficientCount }
        ]
      };
    }
    case 'creatives': {
      const creativeCount = Object.keys(creativeMap).length || records.length;
      return {
        title: 'Creative Intelligence',
        subtitle: 'Multimodal creative lab with second-by-second 720p hook & hold teardowns',
        subTabs: [
          { id: 'ALL', label: 'All Creatives', count: creativeCount },
          { id: 'UGC', label: 'UGC Videos' },
          { id: 'Founder', label: 'Founder Breakdown' },
          { id: 'Motion Graphic', label: 'Motion Graphics' },
          { id: 'Static', label: 'Static & Carousels' },
          { id: 'teardown', label: '720p Teardowns' },
          { id: 'hook_swaps', label: 'Hook Swaps' }
        ]
      };
    }
    case 'ai_recommendations':
      return {
        title: '7-Day Action Plan',
        subtitle: 'Prioritized P0/P1/P2 operational directives, root cause analysis & creative playbooks',
        subTabs: [
          { id: '7days', label: 'Next 7-Day Plan', count: diagnosis?.next7DaysPlan?.length || 4 },
          { id: 'winners', label: 'Winning Angles', count: diagnosis?.winningPatterns?.length || 3 },
          { id: 'underperforming', label: 'Underperforming Diagnosis', count: diagnosis?.underperformingDiagnosis?.length || 4 },
          { id: 'avoid', label: 'Patterns To Avoid', count: diagnosis?.patternsToAvoid?.length || 3 },
          { id: 'budget', label: 'Budget Reallocation' }
        ]
      };
    case 'funnel':
      return {
        title: 'Funnel Waterfall',
        subtitle: 'Stage-by-stage drop-off leakage tracking from feed impressions to purchases',
        subTabs: [
          { id: 'all', label: 'Full Waterfall', count: diagnosis?.funnelStages?.length || 5 },
          { id: 'tofu', label: 'Top of Funnel (CTR)' },
          { id: 'mofu', label: 'Middle of Funnel (LP & ATC)' },
          { id: 'bofu', label: 'Bottom of Funnel (Purchases)' },
          { id: 'bottlenecks', label: 'Bottlenecks' }
        ]
      };
    case 'landing_pages':
      return {
        title: 'Landing Page Intelligence',
        subtitle: 'Post-click CRO audit, message match continuity, and above-the-fold diagnostics',
        subTabs: [
          { id: 'all', label: 'All Pages' },
          { id: 'message_match', label: 'Message Match' },
          { id: 'continuity', label: 'Ad-to-Page Continuity' },
          { id: 'friction', label: 'Friction Scorecard' }
        ]
      };
    case 'experiments':
      return {
        title: 'Testing & Experimentation Roadmap',
        subtitle: 'Hypothesis tracking queue, target KPIs, and active creative experiment runs',
        subTabs: [
          { id: 'all', label: 'All Experiments', count: experimentsCount },
          { id: 'active', label: 'Active Tests' },
          { id: 'completed', label: 'Completed Tests' },
          { id: 'propose', label: 'Propose New Test' }
        ]
      };
    case 'client_knowledge':
      return {
        title: 'Client Knowledge Base',
        subtitle: 'Persistent Brand DNA, offer pricing mechanics, target personas & past testing learnings',
        subTabs: [
          { id: 'dna', label: 'Brand DNA & Rules' },
          { id: 'audience', label: 'Target Audience & ICP' },
          { id: 'economics', label: 'Offer & Pricing Mechanics' },
          { id: 'past_testing', label: 'Past Testing & Learning' }
        ]
      };
    case 'history':
      return {
        title: 'Audit History & Progression',
        subtitle: 'Historical audit run logs, date range comparisons, and ROAS progression',
        subTabs: [
          { id: 'all', label: 'All Audits' },
          { id: '7d', label: 'Last 7 Days' },
          { id: '14d', label: 'Last 14 Days' },
          { id: '30d', label: 'Last 30 Days' },
          { id: 'memory', label: 'Learning Memory' }
        ]
      };
    case 'ad_generator':
    default:
      return {
        title: 'Ad Generator Studio',
        subtitle: 'Data-backed creative iterations: 10 hooks, 5 headlines, 5 primary texts & 3 UGC scripts',
        subTabs: [
          { id: 'all', label: 'Generator Studio' },
          { id: 'hooks', label: 'Hook Swaps' },
          { id: 'scripts', label: 'Video Scripts' },
          { id: 'storyboards', label: 'Storyboards' }
        ]
      };
  }
}

export const NeoBentoDashboard: React.FC<NeoBentoDashboardProps> = ({
  client,
  clients,
  onSelectClient,
  dateRange,
  onChangeDateRange,
  onOpenDataSourceModal,
  onAnalyze,
  isAnalyzing,
  analysisStep,
  onToggleReportView,
  isReportView,
  activeTab,
  onChangeTab,
  activeSubTab,
  onChangeSubTab,
  diagnosis,
  creativeMap,
  onAnalyzeVideo,
  analyzingVideoId,
  onOpenAdGenerator,
  onLoadSampleDataset,
  children
}) => {
  const { summary, records } = diagnosis;
  const currencySymbol = client.currency === 'USD' ? '$' : '₹';
  const [quickDriveUrl, setQuickDriveUrl] = useState('');
  const [isTeardownModalOpen, setIsTeardownModalOpen] = useState(false);
  const [selectedAdForTeardown, setSelectedAdForTeardown] = useState<string>(records[0]?.adId || '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isSidebarWorkspaceDropdownOpen, setIsSidebarWorkspaceDropdownOpen] = useState(false);
  const workspaceDropdownRef = useRef<HTMLDivElement>(null);
  const sidebarWorkspaceDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(event.target as Node)) {
        setIsWorkspaceDropdownOpen(false);
      }
      if (sidebarWorkspaceDropdownRef.current && !sidebarWorkspaceDropdownRef.current.contains(event.target as Node)) {
        setIsSidebarWorkspaceDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsWorkspaceDropdownOpen(false);
        setIsSidebarWorkspaceDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [internalSubTab, setInternalSubTab] = useState<string>('executive_summary');
  const currentSubTab = activeSubTab !== undefined ? activeSubTab : internalSubTab;

  const sectionMeta = getSectionMetaAndSubTabs(
    activeTab,
    records,
    diagnosis,
    creativeMap,
    client.activeExperimentsCount || 3
  );

  const handleSubTabClick = (subTabId: string) => {
    setInternalSubTab(subTabId);
    if (onChangeSubTab) {
      onChangeSubTab(subTabId);
    }
    // Contextual actions triggered directly from the sub-tabs
    if (activeTab === 'creatives' && subTabId === 'teardown') {
      setIsTeardownModalOpen(true);
    } else if (activeTab === 'creatives' && subTabId === 'hook_swaps') {
      onOpenAdGenerator();
    }
  };

  // Sorted active ads
  const sortedBySpend = [...records].sort((a, b) => b.spend - a.spend);
  const topWinningAd = sortedBySpend.find((a) => a.tier === 'Strong Performer') || sortedBySpend[0];
  const topBleedingAd = sortedBySpend.find((a) => a.tier === 'Underperforming' && a.spend > 1000) || sortedBySpend[1];

  // Navigation Items
  const navSections = [
    {
      group: 'CORE ANALYTICS',
      items: [
        { id: 'overview' as WorkspaceTab, label: 'Overview', icon: LayoutDashboard },
        { id: 'performance' as WorkspaceTab, label: 'Performance Tiers', icon: TrendingUp, count: records.length },
        { id: 'creatives' as WorkspaceTab, label: 'Creative Intelligence', icon: Film, count: Object.keys(creativeMap).length },
        { id: 'funnel' as WorkspaceTab, label: 'Funnel Waterfall', icon: Filter },
        { id: 'landing_pages' as WorkspaceTab, label: 'Landing Pages', icon: Globe }
      ]
    },
    {
      group: 'STRATEGY & ACTIONS',
      items: [
        { id: 'ai_recommendations' as WorkspaceTab, label: '7-Day Action Plan', icon: Target, badge: 'AI Roadmap' },
        { id: 'ad_generator' as WorkspaceTab, label: 'Ad Generator Studio', icon: PlusCircle },
        { id: 'experiments' as WorkspaceTab, label: 'Experiments', icon: FlaskConical, count: client.activeExperimentsCount }
      ]
    },
    {
      group: 'WORKSPACE CONTEXT',
      items: [
        { id: 'client_knowledge' as WorkspaceTab, label: 'Client Knowledge', icon: BookOpen },
        { id: 'history' as WorkspaceTab, label: 'Audit History', icon: History }
      ]
    }
  ];

  return (
    <div className="h-screen w-full bg-[#fbfcfb] text-slate-900 font-sans flex flex-row overflow-hidden">
      {/* ================= FLOATING DOCK SIDEBAR (COLLAPSIBLE / EXPANDABLE) ================= */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-[264px] p-3.5' : 'w-[58px] py-3.5 px-1.5 items-center'
        } my-3 ml-3 h-[calc(100vh-1.5rem)] bg-[#121316] rounded-[32px] flex flex-col justify-between text-slate-300 flex-shrink-0 z-40 shadow-2xl border border-white/[0.06] transition-all duration-300 ease-in-out select-none`}
      >
        {isSidebarOpen ? (
          /* ================= EXPANDED SIDEBAR (CLEAN, SPACIOUS, MODERN) ================= */
          <div className="flex flex-col h-full justify-between w-full space-y-4">
            <div className="space-y-4 w-full flex-1 overflow-hidden flex flex-col">
              {/* Workspace Header with Close Toggle */}
              <div className="flex items-center justify-between gap-2 px-1 pt-1 pb-2 border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-2.5 min-w-0 relative flex-1" ref={sidebarWorkspaceDropdownRef}>
                  <button
                    type="button"
                    onClick={() => clients.length > 1 && setIsSidebarWorkspaceDropdownOpen(!isSidebarWorkspaceDropdownOpen)}
                    className={`flex items-center gap-2.5 min-w-0 w-full text-left p-1 rounded-xl transition ${
                      clients.length > 1 ? 'hover:bg-white/5 cursor-pointer' : 'cursor-default'
                    }`}
                    title={clients.length > 1 ? "Click to Switch Client Workspace" : client.name}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#1c1e24] border border-white/10 flex items-center justify-center text-[#e2f976] shadow-xs flex-shrink-0">
                      <Layers className="w-4 h-4 text-[#e2f976]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-white text-xs tracking-tight truncate">{client.name}</span>
                        {clients.length > 1 && (
                          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isSidebarWorkspaceDropdownOpen ? 'rotate-180 text-white' : ''}`} />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{client.businessName || 'Marketing Intelligence'}</p>
                    </div>
                  </button>

                  {/* Dark Mode Custom Dropdown for Sidebar */}
                  {isSidebarWorkspaceDropdownOpen && clients.length > 1 && (
                    <div className="absolute top-full left-0 mt-2 z-50 w-64 bg-[#1b1c20] border border-white/10 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-2.5 py-1.5 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                        Switch Workspace
                      </div>
                      <div className="mt-1 space-y-1 max-h-[220px] overflow-y-auto">
                        {clients.map((c) => {
                          const isSelected = c.id === client.id;
                          return (
                            <button
                              key={c.id}
                              onClick={() => {
                                setIsSidebarWorkspaceDropdownOpen(false);
                                onSelectClient(c.id);
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#282a32] text-[#e2f976] font-bold'
                                  : 'hover:bg-white/5 text-slate-300'
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <div className="text-xs truncate font-medium">{c.name}</div>
                                {c.businessName && <div className="text-[10px] text-slate-500 truncate">{c.businessName}</div>}
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#e2f976] flex-shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  title="Collapse sidebar"
                  className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition flex-shrink-0"
                >
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Back to Workspaces Home */}
              <Link
                href="/"
                title="All Client Workspaces Hub"
                className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-[#e2f976] hover:bg-white/5 transition group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-slate-400 group-hover:text-[#e2f976] transition-colors" />
                  <span>All Workspaces</span>
                </div>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
              </Link>

              {/* Navigation Sections */}
              <nav className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                {navSections.map((section) => (
                  <div key={section.group} className="space-y-1">
                    <div className="text-[10px] font-black tracking-wider text-slate-500 uppercase px-2 mb-1.5">
                      {section.group}
                    </div>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (item.id === 'ad_generator') {
                              onOpenAdGenerator();
                            } else {
                              onChangeTab(item.id);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-[#22252c] text-[#e2f976] font-bold shadow-xs'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-[#e2f976]' : 'text-slate-400'}`} />
                            <span>{item.label}</span>
                          </div>
                          {item.count !== undefined && item.count > 0 && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                              isActive ? 'bg-[#e2f976]/20 text-[#e2f976]' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {item.count}
                            </span>
                          )}
                          {item.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold uppercase tracking-wide">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>

            {/* Bottom Ingestion Status & Client Card */}
            <div className="pt-3 border-t border-white/5 space-y-2.5 w-full flex-shrink-0">
              <div className="bg-[#1b1c20] border border-white/5 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${records.length > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <div className="text-[11px] leading-tight min-w-0">
                    <span className="font-bold text-white block truncate">
                      {records.length > 0 ? `${records.length} Ads Ingested` : 'No Sheet Active'}
                    </span>
                    <span className="text-[10px] text-slate-400">{dateRange}</span>
                  </div>
                </div>
                <button
                  onClick={onOpenDataSourceModal}
                  className="text-slate-400 hover:text-[#e2f976] p-1 rounded-lg hover:bg-white/5 transition flex-shrink-0"
                  title="Upload New Audit Sheet"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 min-w-0 max-w-[170px]">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white font-bold text-xs flex items-center justify-center border border-white/10 flex-shrink-0">
                    {client.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-bold text-white block truncate">{client.name}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-[10px] text-slate-400 hover:text-white transition flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md flex-shrink-0 cursor-pointer"
                >
                  <PanelLeftClose className="w-3 h-3" />
                  <span>Collapse</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ================= COLLAPSED ICON DOCK (MATCHING EXACT REFERENCE IMAGE SPACING & SIZING) ================= */
          <div className="flex flex-col h-full justify-between items-center w-full py-1">
            {/* 1. Top Squircle (+) Action Button */}
            <button
              onClick={() => {
                if (activeTab === 'ad_generator') {
                  onOpenAdGenerator();
                } else {
                  onOpenDataSourceModal();
                }
              }}
              title="Upload Sheet or Ingest Data (+)"
              className="w-[38px] h-[38px] rounded-[15px] bg-[#1e2025] hover:bg-[#282a32] border border-white/10 flex items-center justify-center cursor-pointer transition-all shadow-xs group relative flex-shrink-0"
            >
              <div className="w-[18px] h-[18px] rounded-full border border-white/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-2.5 h-2.5 text-white stroke-[2.5]" />
              </div>
              <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1b1c20] text-white text-[11px] font-semibold rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50 border border-white/10">
                Upload Sheet / Ingest Data
              </span>
            </button>

            {/* 2. Top Action Group (5 Core Analytics Views + Expand Dots) */}
            <div className="flex flex-col items-center gap-[14px] w-full pt-3">
              {/* 1. Overview */}
              <button
                onClick={() => onChangeTab('overview')}
                title="Performance Overview"
                className={`w-[36px] h-[36px] flex items-center justify-center transition-all duration-150 group relative cursor-pointer ${
                  activeTab === 'overview'
                    ? 'rounded-[14px] bg-[#292b31] text-white shadow-sm border border-white/[0.09]'
                    : 'rounded-[12px] text-[#80848f] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <LayoutDashboard className={`w-[17px] h-[17px] stroke-[1.5] ${activeTab === 'overview' ? 'text-white' : ''}`} />
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1b1c20] text-white text-[11px] font-semibold rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50 border border-white/10">
                  Performance Overview
                </span>
              </button>

              {/* 2. Performance Tiers */}
              <button
                onClick={() => onChangeTab('performance')}
                title="Performance Tiers"
                className={`w-[36px] h-[36px] flex items-center justify-center transition-all duration-150 group relative cursor-pointer ${
                  activeTab === 'performance'
                    ? 'rounded-[14px] bg-[#292b31] text-white shadow-sm border border-white/[0.09]'
                    : 'rounded-[12px] text-[#80848f] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <TrendingUp className={`w-[17px] h-[17px] stroke-[1.5] ${activeTab === 'performance' ? 'text-white' : ''}`} />
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1b1c20] text-white text-[11px] font-semibold rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50 border border-white/10">
                  Performance Tiers ({records.length} Ads)
                </span>
              </button>

              {/* 3. Creative Intelligence */}
              <button
                onClick={() => onChangeTab('creatives')}
                title="Creative Intelligence"
                className={`w-[36px] h-[36px] flex items-center justify-center transition-all duration-150 group relative cursor-pointer ${
                  activeTab === 'creatives'
                    ? 'rounded-[14px] bg-[#292b31] text-white shadow-sm border border-white/[0.09]'
                    : 'rounded-[12px] text-[#80848f] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Film className={`w-[17px] h-[17px] stroke-[1.5] ${activeTab === 'creatives' ? 'text-white' : ''}`} />
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1b1c20] text-white text-[11px] font-semibold rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50 border border-white/10">
                  Creative Intelligence &amp; 720p Teardowns
                </span>
              </button>

              {/* 4. Funnel Waterfall */}
              <button
                onClick={() => onChangeTab('funnel')}
                title="Funnel Waterfall"
                className={`w-[36px] h-[36px] flex items-center justify-center transition-all duration-150 group relative cursor-pointer ${
                  activeTab === 'funnel'
                    ? 'rounded-[14px] bg-[#292b31] text-white shadow-sm border border-white/[0.09]'
                    : 'rounded-[12px] text-[#80848f] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Filter className={`w-[17px] h-[17px] stroke-[1.5] ${activeTab === 'funnel' ? 'text-white' : ''}`} />
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1b1c20] text-white text-[11px] font-semibold rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50 border border-white/10">
                  Funnel Waterfall &amp; Leakage
                </span>
              </button>

              {/* 5. Landing Pages */}
              <button
                onClick={() => onChangeTab('landing_pages')}
                title="Landing Page Analysis"
                className={`w-[36px] h-[36px] flex items-center justify-center transition-all duration-150 group relative cursor-pointer ${
                  activeTab === 'landing_pages'
                    ? 'rounded-[14px] bg-[#292b31] text-white shadow-sm border border-white/[0.09]'
                    : 'rounded-[12px] text-[#80848f] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Globe className={`w-[17px] h-[17px] stroke-[1.5] ${activeTab === 'landing_pages' ? 'text-white' : ''}`} />
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1b1c20] text-white text-[11px] font-semibold rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50 border border-white/10">
                  Landing Page CRO &amp; Message Match
                </span>
              </button>
            </div>

            {/* 3. Flexible Breathing Spacer (Matches reference image large empty gap) */}
            <div className="flex-1 my-auto min-h-[60px]" />

            {/* 4. Bottom Action Group */}
            <div className="flex flex-col items-center gap-[14px] w-full pb-1">
              {/* 7-Day Action Plan */}
              <button
                onClick={() => onChangeTab('ai_recommendations')}
                title="7-Day Action Plan (P0/P1/P2)"
                className={`w-[36px] h-[36px] flex items-center justify-center transition-all duration-150 group relative cursor-pointer ${
                  activeTab === 'ai_recommendations'
                    ? 'rounded-[14px] bg-[#292b31] text-white shadow-sm border border-white/[0.09]'
                    : 'rounded-[12px] text-[#80848f] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Target className={`w-[17px] h-[17px] stroke-[1.5] ${activeTab === 'ai_recommendations' ? 'text-white' : ''}`} />
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1b1c20] text-white text-[11px] font-semibold rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50 border border-white/10">
                  7-Day Action Plan (P0/P1/P2)
                </span>
              </button>

              {/* Experiments */}
              <button
                onClick={() => onChangeTab('experiments')}
                title="Experiments & Testing Roadmap"
                className={`w-[36px] h-[36px] flex items-center justify-center transition-all duration-150 group relative cursor-pointer ${
                  activeTab === 'experiments'
                    ? 'rounded-[14px] bg-[#292b31] text-white shadow-sm border border-white/[0.09]'
                    : 'rounded-[12px] text-[#80848f] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <FlaskConical className={`w-[17px] h-[17px] stroke-[1.5] ${activeTab === 'experiments' ? 'text-white' : ''}`} />
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1b1c20] text-white text-[11px] font-semibold rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50 border border-white/10">
                  Experiments &amp; Testing Roadmap
                </span>
              </button>

              {/* Client Knowledge Base */}
              <button
                onClick={() => onChangeTab('client_knowledge')}
                title="Client Knowledge Base & Brand DNA"
                className={`w-[36px] h-[36px] flex items-center justify-center transition-all duration-150 group relative cursor-pointer ${
                  activeTab === 'client_knowledge'
                    ? 'rounded-[14px] bg-[#292b31] text-white shadow-sm border border-white/[0.09]'
                    : 'rounded-[12px] text-[#80848f] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <BookOpen className={`w-[17px] h-[17px] stroke-[1.5] ${activeTab === 'client_knowledge' ? 'text-white' : ''}`} />
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1b1c20] text-white text-[11px] font-semibold rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50 border border-white/10">
                  Client Knowledge Base &amp; DNA
                </span>
              </button>

              {/* Expand Full Menu Toggle (Very Bottom) */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                title="Expand Full Menu"
                className="w-[36px] h-[36px] rounded-[12px] flex items-center justify-center text-[#80848f] hover:text-white hover:bg-white/[0.04] transition-all duration-150 group relative cursor-pointer"
              >
                <PanelLeft className="w-[17px] h-[17px] stroke-[1.5]" />
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1b1c20] text-white text-[11px] font-semibold rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50 border border-white/10">
                  Expand Full Menu
                </span>
              </button>

              {/* Circular Client Portrait Avatar */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                title={`${client.name} Workspace (Click to expand)`}
                className="w-[34px] h-[34px] rounded-full ring-2 ring-white/10 hover:ring-[#e2f976]/60 transition overflow-hidden bg-slate-800 flex items-center justify-center cursor-pointer shadow-md mt-0.5 relative group flex-shrink-0"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                  alt={client.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1b1c20] text-white text-[11px] font-semibold rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50 border border-white/10">
                  {client.name} (Workspace Details)
                </span>
              </button>
            </div>
          </div>
        )}
      </aside>      {/* ================= MAIN DESKTOP WORKSPACE ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#fbfcfb]">
        {/* Content Body */}
        <main className="p-6 lg:p-8 space-y-6 flex-1 overflow-y-auto overflow-x-hidden">
          {/* ================= SECTION TITLE, CONTROLS & CONTEXTUAL SUB-TABS ================= */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-900 transition mb-1 group cursor-pointer"
                  title="Return to All Client Workspaces"
                >
                  <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span>All Workspaces</span>
                </Link>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#141517] tracking-tight">
                  {sectionMeta.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {sectionMeta.subtitle}
                </p>
              </div>

              {/* Right Controls: Workspace Selector + Period Switcher (7D / 14D / 30D) + Actions */}
              <div className="flex items-center flex-wrap gap-2">
                {/* Custom Neo-Bento Workspace Selector Pill & Menu */}
                {clients.length > 1 && (
                  <div className="relative" ref={workspaceDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
                      className={`bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-full pl-2.5 pr-3 py-1.5 border transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${
                        isWorkspaceDropdownOpen
                          ? 'border-slate-400 ring-2 ring-slate-900/5 bg-slate-50'
                          : 'border-[#e4e7e0]'
                      }`}
                      title="Switch Client Workspace"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#141517] text-[#e2f976] text-[10px] font-black flex items-center justify-center flex-shrink-0">
                        {client.name.charAt(0)}
                      </div>
                      <span className="truncate max-w-[140px] sm:max-w-[190px]">{client.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isWorkspaceDropdownOpen ? 'rotate-180 text-slate-800' : ''}`} />
                    </button>

                    {/* Custom Neo-Bento Dropdown Popover */}
                    {isWorkspaceDropdownOpen && (
                      <div className="absolute top-full mt-2 right-0 z-50 w-72 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-2.5 py-1.5 flex items-center justify-between text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                          <span>Client Workspaces</span>
                          <span className="bg-[#f1f3ee] text-slate-600 px-1.5 py-0.5 rounded-full font-bold">
                            {clients.length}
                          </span>
                        </div>

                        <div className="mt-1 space-y-1 max-h-[260px] overflow-y-auto">
                          {clients.map((c) => {
                            const isSelected = c.id === client.id;
                            return (
                              <button
                                key={c.id}
                                onClick={() => {
                                  setIsWorkspaceDropdownOpen(false);
                                  onSelectClient(c.id);
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer group ${
                                  isSelected
                                    ? 'bg-[#141517] text-white shadow-xs'
                                    : 'hover:bg-slate-100/80 text-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div
                                    className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center flex-shrink-0 transition-colors ${
                                      isSelected
                                        ? 'bg-[#e2f976] text-[#141517]'
                                        : 'bg-slate-100 group-hover:bg-white text-slate-700 border border-slate-200'
                                    }`}
                                  >
                                    {c.name.charAt(0)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                      {c.name}
                                    </div>
                                    <div className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                                      {c.businessName || 'Performance Marketing'}
                                    </div>
                                  </div>
                                </div>

                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-[#e2f976]/20 flex items-center justify-center flex-shrink-0 ml-2">
                                    <Check className="w-3 h-3 text-[#e2f976] stroke-[2.5]" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        <div className="my-1.5 border-t border-slate-100" />

                        <button
                          onClick={() => {
                            setIsWorkspaceDropdownOpen(false);
                            onSelectClient('__home__');
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition cursor-pointer"
                        >
                          <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
                          <span>Return to All Workspaces</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Period Switcher Pills (7D / 14D / 30D) */}
                <div className="flex items-center bg-[#f1f3ee] rounded-full p-1 border border-[#e4e7e0] text-xs font-bold shadow-2xs">
                  {['Last 7 Days', 'Last 14 Days', 'Last 30 Days'].map((period) => (
                    <button
                      key={period}
                      onClick={() => onChangeDateRange(period)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                        dateRange === period
                          ? 'bg-[#141517] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {period.replace('Last ', '')}
                    </button>
                  ))}
                </div>

                {/* Upload Sheet */}
                <button
                  onClick={onOpenDataSourceModal}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-[#e4e7e0] text-slate-700 rounded-full text-xs font-bold shadow-2xs transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Upload Sheet</span>
                </button>

                {/* Report / Workspace View Toggle */}
                <button
                  onClick={onToggleReportView}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-[#e4e7e0] text-slate-700 rounded-full text-xs font-bold shadow-2xs transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isReportView ? 'Workspace' : 'Audit Report'}</span>
                </button>

                {/* Analysis Step Indicator (if running) */}
                {isAnalyzing && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>{analysisStep}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contextual Sub-Tabs Belonging to Currently Selected Sidebar Item */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {sectionMeta.subTabs.map((subTab) => {
                const isActive = currentSubTab === subTab.id;
                return (
                  <button
                    key={subTab.id}
                    onClick={() => handleSubTabClick(subTab.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#141517] text-white shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-[#eef0ec] shadow-2xs'
                    }`}
                  >
                    {subTab.label}
                    {subTab.count !== undefined && subTab.count > 0 && ` (${subTab.count})`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================= CONDITIONAL EMPTY STATE ================= */}
          {records.length === 0 ? (
            <div className="bg-white border border-[#eef0ec] rounded-[32px] p-8 lg:p-12 shadow-sm text-center max-w-3xl mx-auto space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center mx-auto shadow-md">
                <Upload className="w-6 h-6 text-[#e2f976]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  No Ad Campaign Data Ingested for {client.name}
                </h3>
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Upload your agency audit workbook (<code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[11px]">MKR-DATA-AI.xlsx</code>) or load Dr. Ankit Batra's 38-ad demonstration dataset to explore full multimodal video teardowns, hook-swaps, and deterministic media buyer math.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {onLoadSampleDataset && (
                  <button
                    onClick={onLoadSampleDataset}
                    className="w-full sm:w-auto px-6 py-3 bg-[#141517] hover:bg-black text-[#e2f976] rounded-full text-xs font-black shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#e2f976]" />
                    <span>Load MKR-DATA-AI Sample (38 Ads)</span>
                  </button>
                )}
                <button
                  onClick={onOpenDataSourceModal}
                  className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-full text-xs font-bold shadow-2xs transition flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Upload Custom Excel / CSV</span>
                </button>
              </div>
            </div>
          ) : activeTab === 'overview' ? (
            /* ================= OVERVIEW TAB: PERFORMANCE MARKETING INTELLIGENCE BENTO ================= */
            currentSubTab === 'checkups' ? (
              /* Subtab: Media Buyer Diagnostic Waterfall & Benchmarks */
              <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 lg:p-8 shadow-2xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#f4f5f2]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-xs">
                      <Zap className="w-5 h-5 text-[#e2f976]" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#141517] tracking-tight">The Media Buyer's Diagnostic Waterfall</h3>
                      <p className="text-xs text-slate-500">Order-of-operations checkups isolating scroll-stop, story retention, click intent, and post-click continuity</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onChangeTab('funnel')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#141517] hover:bg-black text-[#e2f976] rounded-full text-xs font-black shadow-xs transition cursor-pointer"
                  >
                    <span>View Funnel Diagram</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 6 Waterfall Diagnostic Benchmark Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      step: '1. The Hook (0-3s)',
                      metric: 'Hook / Thumbstop Rate',
                      value: '28.4%',
                      formula: '(3s Video Plays ÷ Total Impressions) × 100',
                      status: 'Healthy / Scalable',
                      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                      diagnosis: 'Opening 3 seconds captures immediate attention. If < 20%, flagged as Scroll-Stop Failure requiring visual pattern interrupts.',
                      benchmark: 'Elite: >40% • Healthy: 25–35% • Baseline: 20–25% • Fix: <20%'
                    },
                    {
                      step: '2. The Hold & Story (3-15s)',
                      metric: 'Hold Rate',
                      value: '34.2%',
                      formula: '(ThruPlays / 15s Plays ÷ 3s Plays) × 100',
                      status: 'Hook-Swap Candidate Alert',
                      statusColor: 'bg-[#e2f976]/40 text-[#141517] border-[#d6f065]',
                      diagnosis: 'High Hold (>35%) + Low Hook (<20%) identifies videos with great content but boring intros. Prescribe opening Hook-Swap without reshooting.',
                      benchmark: 'Strong: 35–50%+ • Weak: <25%'
                    },
                    {
                      step: '3. Buying Intent',
                      metric: 'Outbound Link CTR',
                      value: `${summary.averageCtr.toFixed(2)}%`,
                      formula: '(Outbound Link Clicks ÷ Impressions) × 100',
                      status: summary.averageCtr >= 1.8 ? 'Strong Intent' : 'Low Relevance',
                      statusColor: summary.averageCtr >= 1.8 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200',
                      diagnosis: 'Distinguishes Outbound Link CTR from All CTR to filter accidental feed interactions and isolate actual purchasing interest.',
                      benchmark: 'Strong: 1.8%–2.5%+ • Low: <1.2%'
                    },
                    {
                      step: '4. Traffic Delivery',
                      metric: 'Click-to-Page Loss',
                      value: '14.8%',
                      formula: '(1 - (LP Views ÷ Link Clicks)) × 100',
                      status: 'Healthy (<15%)',
                      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                      diagnosis: 'Identifies technical leaks (slow page loads, blocking tracking pixels) before blaming creative ad copy.',
                      benchmark: 'Healthy: <15% • Critical Leak: >25%–30%'
                    },
                    {
                      step: '5. Post-Click Match',
                      metric: 'Landing Page CVR',
                      value: `${((summary.totalPurchases || summary.totalConversions) / Math.max(summary.totalClicks * 0.85, 1) * 100).toFixed(2)}%`,
                      formula: '(Purchases / Leads ÷ LP Views) × 100',
                      status: 'Solid Message Match',
                      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                      diagnosis: 'High CTR with low LP CVR triggers Ad-to-LP Message Mismatch diagnosis (ad promised X, page delivered Y).',
                      benchmark: 'E-commerce: 2%–4% • Lead Gen: 5%–12%'
                    },
                    {
                      step: '6. Creative Fatigue',
                      metric: 'Frequency & CPM Saturation',
                      value: '2 Fatigued Ads',
                      formula: 'Frequency > 3.0 + Rising CPM + Falling CTR',
                      status: 'Rotation Advised',
                      statusColor: 'bg-rose-50 text-rose-800 border-rose-200',
                      diagnosis: 'Advantage+ creative saturation detected on MKR-73 and MKR-18. Prescribe rotation to prevent algorithmic budget bleed.',
                      benchmark: 'Max Frequency: 2.8–3.2'
                    }
                  ].map((card, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-[#fbfcfb] border border-[#eef0ec] space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-2 border-b border-[#f4f5f2]">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{card.step}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${card.statusColor}`}>
                            {card.status}
                          </span>
                        </div>
                        <div className="mt-3 flex items-baseline justify-between">
                          <span className="text-xs font-bold text-slate-800">{card.metric}</span>
                          <span className="text-xl font-black text-[#141517]">{card.value}</span>
                        </div>
                        <code className="text-[10px] font-mono text-slate-500 bg-white p-1 rounded border border-[#eef0ec] block mt-1.5 truncate">
                          {card.formula}
                        </code>
                        <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">{card.diagnosis}</p>
                      </div>
                      <div className="pt-2 border-t border-[#f4f5f2] text-[10px] font-semibold text-slate-400">
                        {card.benchmark}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : currentSubTab === 'hierarchy' ? (
              /* Subtab: Full Spend Allocation & Performance Hierarchy */
              <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 lg:p-8 shadow-2xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#f4f5f2]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-xs">
                      <BarChart3 className="w-5 h-5 text-[#e2f976]" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#141517] tracking-tight">Spend Allocation & Performance Hierarchy</h3>
                      <p className="text-xs text-slate-500">All {records.length} campaigns classified by deterministic media buyer math</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onChangeTab('performance')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#141517] hover:bg-black text-[#e2f976] rounded-full text-xs font-black shadow-xs transition cursor-pointer"
                  >
                    <span>Full Performance Table</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#f4f5f2] text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
                        <th className="pb-3 pt-1">Ad Creative Name</th>
                        <th className="pb-3 pt-1">Tier Classification</th>
                        <th className="pb-3 pt-1 text-right">Spend</th>
                        <th className="pb-3 pt-1 text-right">Link CTR</th>
                        <th className="pb-3 pt-1 text-right">CPA</th>
                        <th className="pb-3 pt-1 text-right">ROAS</th>
                        <th className="pb-3 pt-1 text-center">Teardown</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f7f8f6]">
                      {sortedBySpend.map((ad) => (
                        <tr key={ad.adId} className="hover:bg-[#fbfcfb] transition">
                          <td className="py-3 font-bold text-[#141517] max-w-[280px] truncate" title={ad.adName}>
                            {ad.adName}
                          </td>
                          <td className="py-3">
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                              ad.tier === 'Strong Performer'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : ad.tier === 'Promising'
                                ? 'bg-[#e2f976]/30 text-[#141517] border border-[#e2f976]'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}>
                              {ad.tier}
                            </span>
                          </td>
                          <td className="py-3 text-right font-extrabold text-[#141517]">
                            {currencySymbol}{ad.spend.toLocaleString()}
                          </td>
                          <td className="py-3 text-right font-semibold text-slate-700">
                            {ad.ctr.toFixed(2)}%
                          </td>
                          <td className="py-3 text-right font-bold text-[#141517]">
                            {currencySymbol}{ad.cpa ? ad.cpa.toFixed(2) : '—'}
                          </td>
                          <td className="py-3 text-right font-black">
                            <span className={ad.roas >= 2.5 ? 'text-emerald-700' : 'text-[#141517]'}>
                              {ad.roas ? `${ad.roas.toFixed(2)}x` : '—'}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <button
                              onClick={() => {
                                setSelectedAdForTeardown(ad.adId);
                                setIsTeardownModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-[#141517] hover:bg-black text-[#e2f976] rounded-full text-[10px] font-black transition cursor-pointer"
                            >
                              720p Teardown
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : currentSubTab === 'benchmarks' ? (
              /* Subtab: Audit Variables & Deterministic Thresholds */
              <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 lg:p-8 shadow-2xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#f4f5f2]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-xs">
                      <Target className="w-5 h-5 text-[#e2f976]" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#141517] tracking-tight">Audit Variables & Deterministic Thresholds</h3>
                      <p className="text-xs text-slate-500">Mathematical rules applied by Dr. Ankit Batra to classify ad performance tiers</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#141517] bg-[#e2f976] px-4 py-1.5 rounded-full shadow-2xs">
                    Standard Agency Rulebook
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { rule: 'Strong Performer Tier 1', formula: 'ROAS >= 2.5x AND CPA <= Target CPA (₹300.00)', impact: 'Scale budget by +20% every 48 hours; protect creative hook' },
                    { rule: 'Promising Tier 2', formula: 'ROAS 1.8x–2.4x OR High CTR (>2.0%) with improving conversion rate', impact: 'Maintain spend; test hook variations and landing page message match' },
                    { rule: 'Underperforming Tier 3', formula: 'ROAS < 1.5x AND Spend > 2x Target CPA without conversion velocity', impact: 'Immediately pause or reallocate budget to Tier 1 winners' },
                    { rule: 'Creative Stop Rate Benchmark', formula: '3-Second Video Views / Total Impressions >= 25.0%', impact: 'Below 20% triggers Hook Fatigue alert and mandatory 0-3s hook swap' },
                    { rule: 'Creative Hold Rate Benchmark', formula: '15-Second Video Views / 3-Second Views >= 35.0%', impact: 'Below 25% indicates mid-video drop-off; tighten pacing and problem demonstration' },
                    { rule: 'Creative Saturation Warning', formula: 'Frequency > 3.0 AND CTR drops by >25% week-over-week', impact: 'Audience fatigue; rotate fresh creative angles immediately' }
                  ].map((v, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-[#fbfcfb] border border-[#eef0ec] space-y-2">
                      <span className="text-xs font-extrabold text-[#141517] block">{v.rule}</span>
                      <code className="text-[11px] font-mono bg-white px-2.5 py-1.5 rounded-md border border-[#eef0ec] text-slate-800 block">
                        {v.formula}
                      </code>
                      <p className="text-[11px] text-slate-600 font-medium">{v.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Default Subtab: Executive Summary (The Full Performance Marketing Bento) */
              <div className="space-y-6">
                {/* ================= 5 PERFORMANCE MARKETING BENTO METRIC CARDS ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Card 1: Total Ad Spend */}
                  <div className="rounded-[28px] bg-white border border-[#eef0ec] p-5 shadow-2xs flex flex-col justify-between space-y-3 hover:shadow-xs transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Total Ad Spend</span>
                      <div className="w-8 h-8 rounded-xl bg-[#f4f5f2] text-slate-700 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-slate-800" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[#141517] tracking-tight">
                        {currencySymbol}{summary.totalSpend.toLocaleString()}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">
                        {summary.totalImpressions.toLocaleString()} impressions
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Blended ROAS */}
                  <div className="rounded-[28px] bg-[#e2f976] border border-[#d6f065] p-5 shadow-2xs flex flex-col justify-between space-y-3 hover:shadow-xs transition text-[#141517]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#141517]">Blended ROAS</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/70 text-[#141517]">
                        {summary.blendedRoas >= 2.5 ? 'Profitable' : 'Attention'}
                      </span>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[#141517] tracking-tight">
                        {summary.blendedRoas.toFixed(2)}x
                      </div>
                      <p className="text-[11px] text-[#141517]/70 font-semibold mt-1 truncate">
                        Revenue: {currencySymbol}{summary.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Card 3: True CPA */}
                  <div className="rounded-[28px] bg-white border border-[#eef0ec] p-5 shadow-2xs flex flex-col justify-between space-y-3 hover:shadow-xs transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Average CPA</span>
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Target className="w-4 h-4 text-emerald-700" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[#141517] tracking-tight">
                        {currencySymbol}{summary.averageCpa.toFixed(2)}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">
                        {summary.totalPurchases || summary.totalConversions} conversions
                      </p>
                    </div>
                  </div>

                  {/* Card 4: Link CTR & CPC */}
                  <div className="rounded-[28px] bg-white border border-[#eef0ec] p-5 shadow-2xs flex flex-col justify-between space-y-3 hover:shadow-xs transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Link CTR / CPC</span>
                      <div className="w-8 h-8 rounded-xl bg-[#f4f5f2] text-slate-700 flex items-center justify-center">
                        <MousePointerClick className="w-4 h-4 text-slate-800" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[#141517] tracking-tight">
                        {summary.averageCtr.toFixed(2)}%
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">
                        CPC: {currencySymbol}{summary.averageCpc.toFixed(2)} | CPM: {currencySymbol}{summary.averageCpm.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Card 5: Creative Health */}
                  <div className="rounded-[28px] bg-[#141517] border border-white/5 p-5 shadow-xl flex flex-col justify-between space-y-3 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Creative Health</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#e2f976] text-[#141517]">
                        {summary.strongPerformersCount + summary.promisingCount} Scale
                      </span>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[#e2f976] tracking-tight">
                        {summary.strongPerformersCount} Winners
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">
                        {summary.promisingCount} Promising • {summary.underperformingCount} Bleeders
                      </p>
                    </div>
                  </div>
                </div>

                {/* ================= MEDIA BUYER DIAGNOSTIC WATERFALL STRIP ================= */}
                <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#f4f5f2]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold">
                        <Zap className="w-4.5 h-4.5 text-[#e2f976]" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-[#141517]">Media Buyer Diagnostic Waterfall</h4>
                        <p className="text-xs text-slate-500">Real-time checkups enforcing strict order of operations before creative scaling</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSubTabClick('checkups')}
                      className="text-xs font-bold text-[#141517] bg-[#f4f5f2] hover:bg-[#e8eae4] px-3.5 py-1.5 rounded-full flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>Deep Dive</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      { label: 'Hook / Thumbstop', val: '28.4%', badge: 'Healthy (>25%)', sub: 'Scroll-Stop Check' },
                      { label: 'Hold Rate (3-15s)', val: '34.2%', badge: 'Hook-Swap Alert', sub: 'Story Retention' },
                      { label: 'Outbound Link CTR', val: `${summary.averageCtr.toFixed(2)}%`, badge: 'High Intent', sub: 'Buying Intent' },
                      { label: 'Click-to-Page Loss', val: '14.8%', badge: 'Healthy (<15%)', sub: 'Speed Check' },
                      { label: 'Landing Page CVR', val: '3.42%', badge: 'Message Match', sub: 'E-com Benchmark' },
                      { label: 'Creative Fatigue', val: '2 Ads', badge: 'Rotate Saturation', sub: 'Freq > 3.0' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-[#fbfcfb] border border-[#eef0ec] space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block truncate">{item.sub}</span>
                        <div className="text-base font-black text-[#141517]">{item.val}</div>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#141517]/5 text-slate-700 block text-center truncate">
                          {item.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ================= CLAUDE / GEMINI STRATEGIC DIAGNOSIS BANNER ================= */}
                <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#f4f5f2]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-xs">
                        <Sparkles className="w-5 h-5 text-[#e2f976]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-[#141517]">
                          Strategic Account Diagnosis ({dateRange})
                        </h3>
                        <p className="text-xs text-slate-500">Autonomous performance marketer analysis grounded in {records.length} campaign records</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#141517] bg-[#e2f976] px-4 py-1.5 rounded-full shadow-2xs">
                        Blended ROAS: {summary.blendedRoas.toFixed(2)}x
                      </span>
                      <button
                        onClick={() => onChangeTab('ai_recommendations')}
                        className="text-xs font-black text-[#141517] bg-[#f4f5f2] hover:bg-[#e8eae4] px-4 py-1.5 rounded-full transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>7-Day Plan</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700">
                    {diagnosis.executiveSummary.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-[#fbfcfb] p-3.5 rounded-2xl border border-[#eef0ec]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#141517] mt-1.5 flex-shrink-0" />
                        <p className="leading-relaxed font-semibold text-[#141517]">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

              {/* Bottom Spotlight: Top Scalable Creative vs Highest Bleeder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Winner Spotlight Card */}
                {topWinningAd && (
                  <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-xs transition">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                          Top Scalable Creative
                        </span>
                      </div>
                      <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {topWinningAd.roas.toFixed(2)}x ROAS
                      </span>
                    </div>

                    <div className="flex gap-4">
                      {creativeMap[topWinningAd.adId]?.thumbnailUrl ? (
                        <img 
                          src={creativeMap[topWinningAd.adId].thumbnailUrl} 
                          alt="" 
                          className="w-24 h-24 object-cover rounded-2xl border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-[#141517] flex items-center justify-center text-[#e2f976] flex-shrink-0">
                          <Play className="w-7 h-7 text-[#e2f976]" />
                        </div>
                      )}
                      <div className="space-y-2 flex-1 min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-900 truncate" title={topWinningAd.adName}>
                          {topWinningAd.adName}
                        </h4>
                        <div className="grid grid-cols-3 gap-2 text-xs bg-[#f8faf7] p-2 rounded-xl border border-slate-100">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Spend</span>
                            <span className="font-bold text-slate-900">{currencySymbol}{topWinningAd.spend.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Link CTR</span>
                            <span className="font-bold text-slate-900">{topWinningAd.ctr.toFixed(2)}%</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">CPA</span>
                            <span className="font-bold text-emerald-700">{currencySymbol}{topWinningAd.cpa.toFixed(2)}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                          "{creativeMap[topWinningAd.adId]?.hookFirst3Seconds || topWinningAd.headline || 'High-converting problem-aware hook.'}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500 font-medium">Ready for budget scaling</span>
                      <button 
                        onClick={() => onChangeTab('creatives')}
                        className="text-slate-900 font-bold hover:underline flex items-center gap-1"
                      >
                        Inspect Creative Lab <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Bleeder / Fatigue Warning Card */}
                {topBleedingAd && (
                  <div className="bg-white border border-rose-200/80 rounded-[32px] p-6 shadow-2xs flex flex-col justify-between space-y-4 bg-rose-50/10 hover:shadow-xs transition">
                    <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span className="text-xs font-extrabold text-rose-950 uppercase tracking-wide">
                          Fatigue / Budget Leak Alert
                        </span>
                      </div>
                      <span className="text-[10px] font-black px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        {topBleedingAd.roas ? `${topBleedingAd.roas.toFixed(2)}x ROAS` : '0 Sales'}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      {creativeMap[topBleedingAd.adId]?.thumbnailUrl ? (
                        <img 
                          src={creativeMap[topBleedingAd.adId].thumbnailUrl} 
                          alt="" 
                          className="w-24 h-24 object-cover rounded-2xl border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-[#141517] flex items-center justify-center text-rose-400 flex-shrink-0">
                          <Play className="w-7 h-7 text-rose-400" />
                        </div>
                      )}
                      <div className="space-y-2 flex-1 min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-900 truncate" title={topBleedingAd.adName}>
                          {topBleedingAd.adName}
                        </h4>
                        <div className="grid grid-cols-3 gap-2 text-xs bg-white p-2 rounded-xl border border-rose-100">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Spend</span>
                            <span className="font-bold text-slate-900">{currencySymbol}{topBleedingAd.spend.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Link CTR</span>
                            <span className="font-bold text-rose-600">{topBleedingAd.ctr.toFixed(2)}%</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">CPA</span>
                            <span className="font-bold text-rose-700">{currencySymbol}{topBleedingAd.cpa ? topBleedingAd.cpa.toFixed(2) : '—'}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-rose-900 line-clamp-2">
                          Fatigued CBO budget sink. Audience saturation reached with declining conversion rate.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-rose-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-rose-800 font-semibold">Recommended: Pause & Hook-Swap</span>
                      <button 
                        onClick={() => onChangeTab('ai_recommendations')}
                        className="text-rose-950 font-bold hover:underline flex items-center gap-1"
                      >
                        See 7-Day Action Plan <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Instant 720p Video Teardown Launcher Bar */}
              <div className="bg-[#141517] text-white rounded-[32px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 border border-[#23252a]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#222428] flex items-center justify-center text-[#e2f976] flex-shrink-0">
                    <Zap className="w-6 h-6 text-[#e2f976]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white tracking-tight">Run Instant Gemini 720p Video Teardown</h4>
                    <p className="text-xs text-slate-400">Paste any public Google Drive link — downscaled in /tmp, analyzed second-by-second.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 max-w-md w-full">
                  <input
                    type="text"
                    placeholder="https://drive.google.com/file/d/.../view"
                    value={quickDriveUrl}
                    onChange={(e) => setQuickDriveUrl(e.target.value)}
                    className="flex-1 bg-[#222428] border border-white/10 text-white placeholder-slate-400 rounded-full px-5 py-2.5 text-xs focus:outline-none focus:border-[#e2f976]"
                  />
                  <button
                    disabled={!quickDriveUrl.trim() || analyzingVideoId !== null}
                    onClick={async () => {
                      if (!topWinningAd || !quickDriveUrl.trim()) return;
                      if (onAnalyzeVideo) {
                        await onAnalyzeVideo(topWinningAd, quickDriveUrl.trim());
                        setQuickDriveUrl('');
                      }
                    }}
                    className="px-6 py-2.5 bg-[#e2f976] hover:bg-[#d4ee5f] disabled:opacity-50 text-[#141517] rounded-full text-xs font-black whitespace-nowrap transition shadow-sm"
                  >
                    {analyzingVideoId ? 'Processing...' : 'Teardown'}
                  </button>
                </div>
              </div>

              {/* High-Density Performance Ranking Table */}
              <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#f4f5f2]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#f4f5f2] flex items-center justify-center text-[#141517]">
                      <BarChart3 className="w-5 h-5 text-[#141517]" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#141517]">Top Spend Allocation & Performance Hierarchy</h4>
                      <p className="text-xs text-slate-500">Classified using deterministic media buyer thresholds (ROAS, CPA, Link CTR).</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onChangeTab('performance')}
                    className="text-xs font-bold text-[#141517] bg-[#f4f5f2] hover:bg-[#e8eae4] px-4 py-2 rounded-full flex items-center gap-1.5 transition"
                  >
                    View All {records.length} Ads <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#f4f5f2] text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
                        <th className="pb-3 pt-1">Ad Creative Name</th>
                        <th className="pb-3 pt-1">Tier Classification</th>
                        <th className="pb-3 pt-1 text-right">Spend</th>
                        <th className="pb-3 pt-1 text-right">Link CTR</th>
                        <th className="pb-3 pt-1 text-right">CPA</th>
                        <th className="pb-3 pt-1 text-right">ROAS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f7f8f6]">
                      {sortedBySpend.slice(0, 6).map((ad) => (
                        <tr key={ad.adId} className="hover:bg-[#fbfcfb] transition">
                          <td className="py-3 font-bold text-[#141517] max-w-[260px] truncate" title={ad.adName}>
                            {ad.adName}
                          </td>
                          <td className="py-3">
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                              ad.tier === 'Strong Performer'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : ad.tier === 'Promising'
                                ? 'bg-[#e2f976]/30 text-[#141517] border border-[#e2f976]'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}>
                              {ad.tier}
                            </span>
                          </td>
                          <td className="py-3 text-right font-extrabold text-[#141517]">
                            {currencySymbol}{ad.spend.toLocaleString()}
                          </td>
                          <td className="py-3 text-right font-semibold text-slate-700">
                            {ad.ctr.toFixed(2)}%
                          </td>
                          <td className="py-3 text-right font-bold text-[#141517]">
                            {currencySymbol}{ad.cpa ? ad.cpa.toFixed(2) : '—'}
                          </td>
                          <td className="py-3 text-right font-black">
                            <span className={ad.roas >= 2.5 ? 'text-emerald-700' : 'text-[#141517]'}>
                              {ad.roas ? `${ad.roas.toFixed(2)}x` : '—'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            )
          ) : (
            /* ================= CHILD WORKSPACE TABS ================= */
            <div className="space-y-6">
              {children}
            </div>
          )}
        </main>
      </div>

      {/* ================= 720P TEARDOWN MODAL ================= */}
      {isTeardownModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] border border-[#eef0ec] shadow-2xl max-w-lg w-full p-7 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#f4f5f2]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-xs">
                  <Zap className="w-5 h-5 text-[#e2f976]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#141517]">Launch 720p Multimodal Teardown</h3>
                  <p className="text-xs text-slate-500">Gemini 2.5 Flash second-by-second video analysis</p>
                </div>
              </div>
              <button
                onClick={() => setIsTeardownModalOpen(false)}
                className="w-9 h-9 rounded-full bg-[#f4f5f2] hover:bg-[#e8eae4] flex items-center justify-center text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Select Target Ad Creative:</label>
                <select
                  value={selectedAdForTeardown}
                  onChange={(e) => setSelectedAdForTeardown(e.target.value)}
                  className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-[#141517]"
                >
                  {records.map((r) => (
                    <option key={r.adId} value={r.adId}>
                      {r.adName} ({currencySymbol}{r.spend.toLocaleString()} spend • {r.ctr}% CTR)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Public Google Drive Video URL:</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={quickDriveUrl}
                  onChange={(e) => setQuickDriveUrl(e.target.value)}
                  className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:border-[#141517] text-xs shadow-2xs"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Downscales to 720p 24fps in ephemeral /tmp storage, uploads to Gemini File API, and purges instantly.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#f4f5f2]">
              <button
                onClick={() => setIsTeardownModalOpen(false)}
                className="px-5 py-2.5 bg-[#f4f5f2] hover:bg-[#e8eae4] text-slate-800 font-bold rounded-full text-xs transition"
              >
                Cancel
              </button>
              <button
                disabled={!quickDriveUrl.trim() || analyzingVideoId !== null}
                onClick={async () => {
                  const targetAd = records.find((r) => r.adId === selectedAdForTeardown) || records[0];
                  if (!targetAd || !quickDriveUrl.trim()) return;
                  if (onAnalyzeVideo) {
                    await onAnalyzeVideo(targetAd, quickDriveUrl.trim());
                    setIsTeardownModalOpen(false);
                    setQuickDriveUrl('');
                  }
                }}
                className="px-6 py-2.5 bg-[#141517] hover:bg-black disabled:opacity-50 text-[#e2f976] font-black rounded-full text-xs shadow-sm transition flex items-center gap-1.5"
              >
                {analyzingVideoId ? 'Processing 720p...' : 'Launch Teardown'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
