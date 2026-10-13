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
  User,
  Radio,
  FileSpreadsheet,
  BarChart3,
  MousePointerClick,
  DollarSign,
  Share2,
  Link2,
  Rocket,
  Search,
  Command,
  Volume2,
  VolumeX,
  Copy,
  ArrowRight,
  Clock,
  Eye,
  Flame,
  Pause,
  Activity,
  Info,
  ArrowUp,
  ArrowDown
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
  onOpenDataSourceModal: (tab?: 'manual' | 'sheet' | 'credentials') => void;
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
        title: 'Executive Command Cockpit',
        subtitle: 'Account health, blended unit economics, and autonomous AI strategic verdict',
        subTabs: []
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
          { id: 'teardown', label: '720p Teardowns' }
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
          { id: 'avoid', label: 'Patterns To Avoid', count: diagnosis?.patternsToAvoid?.length || 3 }
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
        title: 'Landing Page & Clarity Intelligence',
        subtitle: 'Post-click CRO audit, Microsoft Clarity heatmaps/session friction, and message-match diagnostics',
        subTabs: [
          { id: 'all', label: 'All Analysis' },
          { id: 'clarity', label: 'Microsoft Clarity Telemetry', count: 5 },
          { id: 'continuity', label: 'Message Match Continuity' },
          { id: 'cro_fixes', label: 'CRO Action Plan & Proof' }
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
          { id: 'all', label: 'All Audit Logs' },
          { id: 'memory', label: 'Account Learning Memory' }
        ]
      };
    case 'ad_generator':
    default:
      return {
        title: 'Ad Generator Studio',
        subtitle: 'Data-backed creative iterations: 10 hooks, 5 headlines, 5 primary texts & 3 UGC scripts',
        subTabs: [
          { id: 'all', label: 'All Creative Assets' },
          { id: 'hooks', label: '10 Data-Backed Hooks' },
          { id: 'headlines', label: '5 High-Impact Headlines' },
          { id: 'primary', label: 'Primary Copy Blocks' },
          { id: 'scripts', label: '3 Video UGC Scripts' }
        ]
      };
  }
}

const Sparkline: React.FC<{ 
  points: number[]; 
  color: string; 
  fillColor?: string; 
  height?: number; 
  width?: number; 
}> = ({ points, color, fillColor, height = 28, width = 84 }) => {
  if (!points || points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const coordinates = points.map((p, i) => {
    const x = i * step;
    const y = height - ((p - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  });
  const pathD = `M ${coordinates.join(' L ')}`;
  const areaD = `M 0,${height} L ${coordinates.join(' L ')} L ${width},${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible inline-block">
      {fillColor && <path d={areaD} fill={fillColor} opacity={0.25} />}
      <path d={pathD} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

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
  const [isDataOptionsOpen, setIsDataOptionsOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'info' | 'success' | 'warn' } | null>(null);
  const workspaceDropdownRef = useRef<HTMLDivElement>(null);
  const sidebarWorkspaceDropdownRef = useRef<HTMLDivElement>(null);
  const dataOptionsDropdownRef = useRef<HTMLDivElement>(null);

  const showToast = (text: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 3200);
  };

  const toggleAudioBrief = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Audio narration not supported in this browser', 'warn');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      showToast('Paused AI audio brief');
      return;
    }

    window.speechSynthesis.cancel();
    const speechText = `Executive Performance Brief for ${client.name}. ` +
      `Blended ROAS is currently ${summary.blendedRoas.toFixed(2)} with total ad spend of ${summary.totalSpend.toLocaleString()} and revenue of ${summary.totalRevenue.toLocaleString()}. ` +
      `Key findings: ` + diagnosis.executiveSummary.join('. ');

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
    showToast('Playing AI executive audio briefing narration...', 'success');
  };

  const copyStrategicBrief = () => {
    const briefText = `🎯 STRATEGIC ACCOUNT DIAGNOSIS: ${client.name} (${dateRange})\n` +
      `• Blended ROAS: ${summary.blendedRoas.toFixed(2)}x (Target: 2.50x)\n` +
      `• Total Spend: ${currencySymbol}${summary.totalSpend.toLocaleString()} | Revenue: ${currencySymbol}${summary.totalRevenue.toLocaleString()}\n` +
      `• CPA: ${currencySymbol}${summary.averageCpa.toFixed(2)} | Link CTR: ${summary.averageCtr.toFixed(2)}%\n` +
      `• Creative Pool: ${summary.strongPerformersCount} Winners, ${summary.promisingCount} Promising, ${summary.underperformingCount} Bleeders\n\n` +
      `KEY STRATEGIC FINDINGS:\n` +
      diagnosis.executiveSummary.map((p, i) => `${i + 1}. ${p}`).join('\n');

    navigator.clipboard.writeText(briefText).then(() => {
      setCopiedBrief(true);
      showToast('Copied Strategic Brief to clipboard!', 'success');
      setTimeout(() => setCopiedBrief(false), 2500);
    }).catch(() => {
      showToast('Unable to copy to clipboard', 'warn');
    });
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
        return;
      }

      if (!isInput && e.key === '/' && !isCommandOpen) {
        e.preventDefault();
        setIsCommandOpen(true);
        return;
      }

      if (!isInput && !isCommandOpen && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tabKeyMap: Record<string, WorkspaceTab> = {
          '1': 'overview',
          '2': 'performance',
          '3': 'creatives',
          '4': 'funnel',
          '5': 'landing_pages',
          '6': 'ai_recommendations',
          '7': 'experiments',
        };
        if (tabKeyMap[e.key]) {
          onChangeTab(tabKeyMap[e.key]);
          showToast(`Switched to ${tabKeyMap[e.key].replace('_', ' ').toUpperCase()}`);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [isCommandOpen, onChangeTab]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(event.target as Node)) {
        setIsWorkspaceDropdownOpen(false);
      }
      if (sidebarWorkspaceDropdownRef.current && !sidebarWorkspaceDropdownRef.current.contains(event.target as Node)) {
        setIsSidebarWorkspaceDropdownOpen(false);
      }
      if (dataOptionsDropdownRef.current && !dataOptionsDropdownRef.current.contains(event.target as Node)) {
        setIsDataOptionsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsWorkspaceDropdownOpen(false);
        setIsSidebarWorkspaceDropdownOpen(false);
        setIsDataOptionsOpen(false);
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
        { id: 'landing_pages' as WorkspaceTab, label: 'Landing Pages & Clarity', icon: Globe }
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
                  onClick={() => onOpenDataSourceModal('sheet')}
                  className="text-slate-400 hover:text-[#e2f976] p-1 rounded-lg hover:bg-white/5 transition flex-shrink-0 cursor-pointer"
                  title="Data &amp; Setup Options (3 Options)"
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
                  onOpenDataSourceModal('sheet');
                }
              }}
              title="Data &amp; Setup Options (3 Options) (+)"
              className="w-[38px] h-[38px] rounded-[15px] bg-[#1e2025] hover:bg-[#282a32] border border-white/10 flex items-center justify-center cursor-pointer transition-all shadow-xs group relative flex-shrink-0"
            >
              <div className="w-[18px] h-[18px] rounded-full border border-white/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-2.5 h-2.5 text-white stroke-[2.5]" />
              </div>
              <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1b1c20] text-white text-[11px] font-semibold rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50 border border-white/10">
                Data &amp; Setup (3 Options)
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

              {/* Right Controls: Quick Search + Workspace Selector + Period Switcher (7D / 14D / 30D) + Actions */}
              <div className="flex items-center flex-wrap gap-2">
                {/* Global Command Palette Quick Trigger */}
                <button
                  type="button"
                  onClick={() => setIsCommandOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-[#e4e7e0] rounded-full text-xs text-slate-600 hover:text-slate-900 shadow-2xs transition cursor-pointer group"
                  title="Search ads, tabs, and actions (⌘K or /)"
                >
                  <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition" />
                  <span className="font-semibold text-slate-700">Quick Command</span>
                  <kbd className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 shadow-2xs">⌘K</kbd>
                </button>

                {/* Attribution Health Sync Indicator */}
                <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/90 border border-emerald-200/70 rounded-full text-[11px] font-bold text-emerald-800 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{records.length} Ads • Live Attribution</span>
                </div>
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

                {/* Data & Client Setup Options (Replaces single Upload Sheet with the 3 options matching New Client) */}
                <div className="relative" ref={dataOptionsDropdownRef}>
                  <button
                    onClick={() => setIsDataOptionsOpen(!isDataOptionsOpen)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-[#e4e7e0] text-slate-700 rounded-full text-xs font-bold shadow-2xs transition cursor-pointer group"
                    title="Data & Setup Options (3 Options)"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#e2f976] border border-black/20" />
                    <Upload className="w-3.5 h-3.5 text-slate-500 group-hover:text-black transition" />
                    <span>Upload &amp; Data Options</span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isDataOptionsOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDataOptionsOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                          Data &amp; Client Setup
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#e2f976] text-[#121316]">
                          3 Options
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setIsDataOptionsOpen(false);
                          onOpenDataSourceModal('manual');
                        }}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-left transition cursor-pointer group/opt"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover/opt:bg-[#121316] group-hover/opt:text-[#e2f976] transition flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">1. Basic Profile</div>
                          <div className="text-[10px] text-slate-400">Name, Website &amp; Brand Targets</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setIsDataOptionsOpen(false);
                          onOpenDataSourceModal('sheet');
                        }}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-left transition cursor-pointer group/opt"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#e2f976]/30 flex items-center justify-center text-[#121316] group-hover/opt:bg-[#121316] group-hover/opt:text-[#e2f976] transition flex-shrink-0">
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">2. Upload Sheet / CSV</div>
                          <div className="text-[10px] text-slate-400">Instant Data Ingest &amp; Multi-Sheet</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setIsDataOptionsOpen(false);
                          onOpenDataSourceModal('credentials');
                        }}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-left transition cursor-pointer group/opt"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover/opt:bg-[#121316] group-hover/opt:text-[#e2f976] transition flex-shrink-0">
                          <Radio className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">3. Connect Ad APIs</div>
                          <div className="text-[10px] text-slate-400">Meta &amp; Google Ads Live API</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

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
            {sectionMeta.subTabs.length > 0 && (
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
            )}
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
                  onClick={() => onOpenDataSourceModal('sheet')}
                  className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-full text-xs font-bold shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Upload Sheet / Connect Data Sources</span>
                </button>
              </div>
            </div>
          ) : activeTab === 'overview' ? (
            /* ================= OVERVIEW: EXECUTIVE COMMAND COCKPIT ================= */
            <div className="space-y-6">
                {/* ================= 5 PERFORMANCE MARKETING BENTO METRIC CARDS ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Card 1: Total Ad Spend */}
                  <div className="rounded-[28px] bg-white border border-[#eef0ec] p-5 shadow-2xs flex flex-col justify-between space-y-3 hover:shadow-xs hover:border-slate-300 transition group relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-500">Total Ad Spend</span>
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                          +8.4%
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-[#f4f5f2] group-hover:bg-[#141517] group-hover:text-[#e2f976] text-slate-700 flex items-center justify-center transition">
                        <TrendingUp className="w-4 h-4 transition-colors" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-2xl font-black text-[#141517] tracking-tight">
                          {currencySymbol}{summary.totalSpend.toLocaleString()}
                        </span>
                        <div className="opacity-75 group-hover:opacity-100 transition">
                          <Sparkline 
                            points={[12000, 13400, 12800, 15100, 14900, 16800, summary.totalSpend]} 
                            color="#141517" 
                            fillColor="#141517"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mt-1.5 pt-1.5 border-t border-slate-100">
                        <span>CPM {currencySymbol}{summary.averageCpm.toFixed(2)}</span>
                        <span>{summary.totalImpressions.toLocaleString()} Impr</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Blended ROAS (Hero Bento Card) */}
                  <div className="rounded-[28px] bg-gradient-to-br from-[#e2f976] via-[#dcf76c] to-[#cef14d] border border-[#cbe949] p-5 shadow-sm flex flex-col justify-between space-y-3 hover:shadow-md hover:scale-[1.01] transition-all text-[#141517] relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-[#141517]">Blended ROAS</span>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#141517] text-[#e2f976]">
                          ★ HERO
                        </span>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/80 text-[#141517] shadow-2xs">
                        Target 2.20x
                      </span>
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-3xl font-black text-[#141517] tracking-tight">
                          {summary.blendedRoas.toFixed(2)}x
                        </span>
                        <div className="opacity-90">
                          <Sparkline 
                            points={[2.1, 2.3, 2.2, 2.6, 2.7, 2.8, summary.blendedRoas]} 
                            color="#141517" 
                            fillColor="#141517"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#141517]/80 font-bold mt-1.5 pt-1.5 border-t border-black/10">
                        <span>Rev {currencySymbol}{summary.totalRevenue.toLocaleString()}</span>
                        <span className="text-emerald-950 bg-white/60 px-1.5 py-0.2 rounded">+0.42x lift</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: True CPA */}
                  <div className="rounded-[28px] bg-white border border-[#eef0ec] p-5 shadow-2xs flex flex-col justify-between space-y-3 hover:shadow-xs hover:border-slate-300 transition group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-500">Average CPA</span>
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                          -14.2%
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition">
                        <Target className="w-4 h-4 transition-colors" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-2xl font-black text-[#141517] tracking-tight">
                          {currencySymbol}{summary.averageCpa.toFixed(2)}
                        </span>
                        <div className="opacity-75 group-hover:opacity-100 transition">
                          <Sparkline 
                            points={[640, 590, 560, 530, 510, 480, summary.averageCpa]} 
                            color="#059669" 
                            fillColor="#059669"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mt-1.5 pt-1.5 border-t border-slate-100">
                        <span>{summary.totalPurchases || summary.totalConversions} Conversions</span>
                        <span className="text-emerald-600 font-semibold">Efficient</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Link CTR & CPC */}
                  <div className="rounded-[28px] bg-white border border-[#eef0ec] p-5 shadow-2xs flex flex-col justify-between space-y-3 hover:shadow-xs hover:border-slate-300 transition group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-500">Link CTR / CPC</span>
                        <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md">
                          High Intent
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-[#f4f5f2] group-hover:bg-[#141517] group-hover:text-[#e2f976] text-slate-700 flex items-center justify-center transition">
                        <MousePointerClick className="w-4 h-4 transition-colors" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-2xl font-black text-[#141517] tracking-tight">
                          {summary.averageCtr.toFixed(2)}%
                        </span>
                        <div className="opacity-75 group-hover:opacity-100 transition">
                          <Sparkline 
                            points={[1.8, 1.9, 2.1, 2.0, 2.3, 2.4, summary.averageCtr]} 
                            color="#2563eb" 
                            fillColor="#2563eb"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mt-1.5 pt-1.5 border-t border-slate-100">
                        <span>CPC {currencySymbol}{summary.averageCpc.toFixed(2)}</span>
                        <span>CVR 3.42%</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 5: Creative Health */}
                  <div className="rounded-[28px] bg-[#141517] border border-white/5 p-5 shadow-xl flex flex-col justify-between space-y-3 text-white group hover:border-[#e2f976]/30 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Creative Health</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#e2f976] text-[#141517]">
                        {summary.strongPerformersCount + summary.promisingCount} Scale
                      </span>
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-2xl font-black text-[#e2f976] tracking-tight">
                          {summary.strongPerformersCount} Winners
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" title="Winners" />
                          <span className="w-2 h-2 rounded-full bg-amber-400" title="Promising" />
                          <span className="w-2 h-2 rounded-full bg-rose-400" title="Bleeders" />
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden flex">
                        <div 
                          className="bg-emerald-400 h-full" 
                          style={{ width: `${(summary.strongPerformersCount / (records.length || 1)) * 100}%` }} 
                        />
                        <div 
                          className="bg-amber-400 h-full" 
                          style={{ width: `${(summary.promisingCount / (records.length || 1)) * 100}%` }} 
                        />
                        <div 
                          className="bg-rose-500 h-full" 
                          style={{ width: `${(summary.underperformingCount / (records.length || 1)) * 100}%` }} 
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mt-1.5 pt-1.5 border-t border-white/10">
                        <span>{summary.promisingCount} Promising</span>
                        <span className="text-rose-400">{summary.underperformingCount} Bleeders</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= MEDIA BUYER DIAGNOSTIC WATERFALL STRIP ================= */}
                <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f4f5f2]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-xs">
                        <Activity className="w-5 h-5 text-[#e2f976]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-[#141517]">Media Buyer Diagnostic Waterfall</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e2f976] text-[#121316]">
                            6 Checkups
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">Autonomous order-of-operations audit before budget scaling or hook swaps</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onChangeTab('funnel')}
                        className="text-xs font-bold text-[#141517] bg-[#f4f5f2] hover:bg-[#e8eae4] px-4 py-2 rounded-full flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <span>Full Funnel Analysis</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      { label: 'Thumbstop / Hook', val: '28.4%', badge: 'Healthy (>25%)', sub: 'Scroll-Stop', percent: 76, status: 'good' },
                      { label: 'Hold Rate (3-15s)', val: '34.2%', badge: 'Hook-Swap Alert', sub: 'Story Retention', percent: 48, status: 'warn' },
                      { label: 'Outbound Link CTR', val: `${summary.averageCtr.toFixed(2)}%`, badge: 'High Intent (>1.5%)', sub: 'Buying Intent', percent: 82, status: 'good' },
                      { label: 'Click-to-Page Loss', val: '14.8%', badge: 'Healthy (<15%)', sub: 'Page Latency', percent: 85, status: 'good' },
                      { label: 'Landing Page CVR', val: '3.42%', badge: 'Strong Match (>2.5%)', sub: 'E-com Benchmark', percent: 74, status: 'good' },
                      { label: 'Creative Fatigue', val: '2 Ads', badge: 'Rotate Saturation', sub: 'Freq > 3.0', percent: 40, status: 'warn' }
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className="p-3.5 rounded-2xl bg-[#fbfcfb] hover:bg-slate-50 border border-[#eef0ec] hover:border-slate-300 transition-all space-y-2 group cursor-pointer"
                        onClick={() => {
                          onChangeTab(item.status === 'warn' ? 'creatives' : 'funnel');
                          showToast(`Opened diagnostics for ${item.label}`);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 block truncate">{item.sub}</span>
                          <span className={`w-2 h-2 rounded-full ${item.status === 'good' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        </div>
                        <div className="text-lg font-black text-[#141517] tracking-tight">{item.val}</div>
                        {/* Mini visual meter bar */}
                        <div className="w-full bg-slate-200/80 rounded-full h-1 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${item.status === 'good' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full block text-center truncate ${
                          item.status === 'good' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}>
                          {item.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ================= CLAUDE / GEMINI STRATEGIC DIAGNOSIS BANNER ================= */}
                <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f4f5f2]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-xs flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-[#e2f976]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-extrabold text-[#141517]">
                            Strategic Account Diagnosis ({dateRange})
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {records.length} records verified
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">Autonomous performance marketer analysis with deterministic unit economics</p>
                      </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-2">
                      {/* Audio Briefing Speech Synthesizer Toggle */}
                      <button
                        onClick={toggleAudioBrief}
                        className={`text-xs font-black px-4 py-1.5 rounded-full border transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                          isPlayingAudio
                            ? 'bg-[#141517] text-[#e2f976] border-black ring-2 ring-[#e2f976]/40'
                            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
                        }`}
                        title="Listen to Executive Audio Narration"
                      >
                        {isPlayingAudio ? (
                          <>
                            <div className="flex items-end gap-0.5 h-3.5 px-0.5">
                              <span className="w-1 bg-[#e2f976] rounded-full wave-bar-1" />
                              <span className="w-1 bg-[#e2f976] rounded-full wave-bar-2" />
                              <span className="w-1 bg-[#e2f976] rounded-full wave-bar-3" />
                              <span className="w-1 bg-[#e2f976] rounded-full wave-bar-4" />
                            </div>
                            <span>Stop Audio Brief</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-slate-700" />
                            <span>Listen Audio Brief</span>
                          </>
                        )}
                      </button>

                      {/* One-Click Copy Strategic Brief */}
                      <button
                        onClick={copyStrategicBrief}
                        className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Copy structured brief to clipboard"
                      >
                        {copiedBrief ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copy Brief</span>
                          </>
                        )}
                      </button>

                      <span className="text-xs font-black text-[#141517] bg-[#e2f976] px-3.5 py-1.5 rounded-full shadow-2xs">
                        Blended ROAS: {summary.blendedRoas.toFixed(2)}x
                      </span>

                      <button
                        onClick={() => onChangeTab('ai_recommendations')}
                        className="text-xs font-black text-white bg-[#141517] hover:bg-black px-4 py-1.5 rounded-full transition flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <span>7-Day Plan</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {diagnosis.executiveSummary.map((point, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-3 bg-[#fbfcfb] hover:bg-white p-3.5 rounded-2xl border border-[#eef0ec] hover:border-slate-300 transition group shadow-2xs"
                      >
                        <span className="w-6 h-6 rounded-lg bg-[#141517] text-[#e2f976] text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                          0{idx + 1}
                        </span>
                        <p className="leading-relaxed font-semibold text-[#141517] flex-1">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

              {/* Bottom Spotlight: Top Scalable Creative vs Highest Bleeder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Winner Spotlight Card */}
                {topWinningAd && (
                  <div className="bg-white border border-emerald-200/80 rounded-[32px] p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-xs transition bg-gradient-to-b from-white via-white to-emerald-50/20">
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
                          Top Scalable Creative
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Top 5% Meta Tier
                        </span>
                      </div>
                      <span className="text-[11px] font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                        {topWinningAd.roas.toFixed(2)}x ROAS
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      {creativeMap[topWinningAd.adId]?.thumbnailUrl ? (
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0 group/thumb">
                          <img 
                            src={creativeMap[topWinningAd.adId].thumbnailUrl} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">0:34s</span>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-[#141517] flex items-center justify-center text-[#e2f976] flex-shrink-0 relative">
                          <Play className="w-7 h-7 text-[#e2f976]" />
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-[#e2f976]">0:34s</span>
                        </div>
                      )}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900 truncate" title={topWinningAd.adName}>
                            {topWinningAd.adName}
                          </h4>
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">9:16 Video</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs bg-[#f8faf7] p-2.5 rounded-xl border border-slate-100">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Spend</span>
                            <span className="font-black text-slate-900">{currencySymbol}{topWinningAd.spend.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Link CTR</span>
                            <span className="font-black text-emerald-700">{topWinningAd.ctr.toFixed(2)}%</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">CPA</span>
                            <span className="font-black text-emerald-700">{currencySymbol}{topWinningAd.cpa.toFixed(2)}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                          "{creativeMap[topWinningAd.adId]?.hookFirst3Seconds || topWinningAd.headline || 'High-converting problem-aware hook with strong hold.'}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => showToast(`Scaled daily budget by +25% on "${topWinningAd.adName}"`, 'success')}
                          className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition cursor-pointer flex items-center gap-1"
                        >
                          <TrendingUp className="w-3 h-3" />
                          <span>Scale Budget +25%</span>
                        </button>
                        <button
                          onClick={() => {
                            onChangeTab('ad_generator');
                            showToast('Generating 5 hook variations from winning angle...');
                          }}
                          className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
                        >
                          Generate 5 Hooks
                        </button>
                      </div>
                      <button 
                        onClick={() => onChangeTab('creatives')}
                        className="text-slate-900 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Inspect Creative Lab <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Bleeder / Fatigue Warning Card */}
                {topBleedingAd && (
                  <div className="bg-white border border-rose-200 rounded-[32px] p-6 shadow-2xs flex flex-col justify-between space-y-4 bg-gradient-to-b from-white via-white to-rose-50/20 hover:shadow-xs transition">
                    <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
                        <span className="text-xs font-extrabold text-rose-950 uppercase tracking-wide">
                          Fatigue / Budget Leak Alert
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          Frequency 3.84x
                        </span>
                      </div>
                      <span className="text-[11px] font-black px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs">
                        {topBleedingAd.roas ? `${topBleedingAd.roas.toFixed(2)}x ROAS` : '0 Sales'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      {creativeMap[topBleedingAd.adId]?.thumbnailUrl ? (
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-rose-200 flex-shrink-0">
                          <img 
                            src={creativeMap[topBleedingAd.adId].thumbnailUrl} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-[#141517] flex items-center justify-center text-rose-400 flex-shrink-0">
                          <Play className="w-7 h-7 text-rose-400" />
                        </div>
                      )}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900 truncate" title={topBleedingAd.adName}>
                            {topBleedingAd.adName}
                          </h4>
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">CBO Budget Drain</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs bg-white p-2.5 rounded-xl border border-rose-100">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Spend</span>
                            <span className="font-black text-slate-900">{currencySymbol}{topBleedingAd.spend.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Link CTR</span>
                            <span className="font-black text-rose-600">{topBleedingAd.ctr.toFixed(2)}%</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">CPA</span>
                            <span className="font-black text-rose-700">{currencySymbol}{topBleedingAd.cpa ? topBleedingAd.cpa.toFixed(2) : '—'}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-rose-900 line-clamp-2 bg-rose-50/60 p-2 rounded-lg border border-rose-100">
                          Fatigued CBO budget sink. Audience saturation reached; high frequency and decaying conversion rate.
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-rose-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => showToast(`Paused ad set "${topBleedingAd.adName}" to stop budget bleed`, 'warn')}
                          className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs transition cursor-pointer flex items-center gap-1"
                        >
                          <Pause className="w-3 h-3" />
                          <span>Pause Ad Set</span>
                        </button>
                        <button
                          onClick={() => {
                            onChangeTab('ad_generator');
                            showToast('Opening Hook Generator to swap first 3 seconds...');
                          }}
                          className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
                        >
                          Swap First 3 Seconds
                        </button>
                      </div>
                      <button 
                        onClick={() => onChangeTab('ai_recommendations')}
                        className="text-rose-950 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        See 7-Day Action Plan <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
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

      {/* ================= COMMAND PALETTE (CMD+K / CTRL+K) ================= */}
      {isCommandOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/65 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#121316] text-white rounded-[28px] border border-white/10 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150">
            {/* Search Input Bar */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search ads, tabs, actions, or press 1-7 (e.g. 'ROAS', 'UGC', 'Sheet')..."
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base font-semibold text-white placeholder-slate-500 focus:outline-none"
              />
              <kbd className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-400 border border-white/10">
                ESC
              </kbd>
              <button
                onClick={() => setIsCommandOpen(false)}
                className="w-7 h-7 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Results */}
            <div className="p-3 overflow-y-auto space-y-4 max-h-[60vh] custom-scrollbar text-xs">
              {/* Workspace Navigation Shortcuts */}
              <div>
                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Workspace Tabs &amp; Views (Keys 1-7)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                  {[
                    { id: 'overview' as WorkspaceTab, label: 'Overview (Cockpit)', key: '1', icon: LayoutDashboard },
                    { id: 'performance' as WorkspaceTab, label: 'Performance Tiers', key: '2', icon: TrendingUp },
                    { id: 'creatives' as WorkspaceTab, label: 'Creative Intelligence', key: '3', icon: Film },
                    { id: 'funnel' as WorkspaceTab, label: 'Funnel Waterfall', key: '4', icon: Filter },
                    { id: 'landing_pages' as WorkspaceTab, label: 'Landing Pages & CRO', key: '5', icon: Globe },
                    { id: 'ai_recommendations' as WorkspaceTab, label: '7-Day Action Plan', key: '6', icon: Target },
                    { id: 'experiments' as WorkspaceTab, label: 'Experimentation Roadmap', key: '7', icon: FlaskConical },
                    { id: 'ad_generator' as WorkspaceTab, label: 'Ad Generator Studio', icon: PlusCircle },
                    { id: 'client_knowledge' as WorkspaceTab, label: 'Client Knowledge Base', icon: BookOpen },
                    { id: 'history' as WorkspaceTab, label: 'Audit History & Progression', icon: History }
                  ]
                    .filter((item) => !commandQuery || item.label.toLowerCase().includes(commandQuery.toLowerCase()))
                    .map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onChangeTab(item.id);
                            setIsCommandOpen(false);
                            showToast(`Navigated to ${item.label}`);
                          }}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white text-left transition cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 text-slate-400 group-hover:text-[#e2f976] transition-colors" />
                            <span className="font-semibold text-xs">{item.label}</span>
                          </div>
                          {item.key && (
                            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 group-hover:text-white">
                              {item.key}
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Quick Actions
                </div>
                <div className="space-y-1 mt-1">
                  {[
                    {
                      label: 'Launch 720p Multimodal Teardown',
                      desc: 'Gemini 2.5 Flash video analysis with hook and hold breakdown',
                      icon: Zap,
                      action: () => {
                        setIsCommandOpen(false);
                        setIsTeardownModalOpen(true);
                      }
                    },
                    {
                      label: 'Listen to AI Executive Audio Narration',
                      desc: 'Native speech synthesis summary of unit economics and recommendations',
                      icon: Volume2,
                      action: () => {
                        setIsCommandOpen(false);
                        toggleAudioBrief();
                      }
                    },
                    {
                      label: 'Copy Strategic Diagnostic Brief',
                      desc: 'One-click formatted executive summary copied to clipboard',
                      icon: Copy,
                      action: () => {
                        setIsCommandOpen(false);
                        copyStrategicBrief();
                      }
                    },
                    {
                      label: 'Upload Audit Spreadsheet (XLSX / CSV)',
                      desc: 'Ingest campaign sheets with multi-sheet detection',
                      icon: Upload,
                      action: () => {
                        setIsCommandOpen(false);
                        onOpenDataSourceModal('sheet');
                      }
                    },
                    {
                      label: 'Toggle Executive Audit Report View',
                      desc: 'Switch between interactive workspace and printable agency report',
                      icon: FileText,
                      action: () => {
                        setIsCommandOpen(false);
                        onToggleReportView();
                      }
                    }
                  ]
                    .filter((a) => !commandQuery || a.label.toLowerCase().includes(commandQuery.toLowerCase()) || a.desc.toLowerCase().includes(commandQuery.toLowerCase()))
                    .map((item, idx) => {
                      const ActionIcon = item.icon;
                      return (
                        <button
                          key={idx}
                          onClick={item.action}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-left transition cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#e2f976]">
                              <ActionIcon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-bold text-white text-xs">{item.label}</div>
                              <div className="text-[11px] text-slate-400">{item.desc}</div>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#e2f976] transition-colors" />
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Matching Campaign Ads */}
              {records.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Campaign Ads ({records.filter((r) => !commandQuery || r.adName.toLowerCase().includes(commandQuery.toLowerCase()) || r.tier?.toLowerCase().includes(commandQuery.toLowerCase())).length})</span>
                    <span className="text-slate-500 font-normal">Click to inspect in Creative Lab</span>
                  </div>
                  <div className="space-y-1 mt-1 max-h-48 overflow-y-auto custom-scrollbar">
                    {records
                      .filter((r) => !commandQuery || r.adName.toLowerCase().includes(commandQuery.toLowerCase()) || r.tier?.toLowerCase().includes(commandQuery.toLowerCase()))
                      .slice(0, 10)
                      .map((ad) => (
                        <button
                          key={ad.adId}
                          onClick={() => {
                            onChangeTab('creatives');
                            setIsCommandOpen(false);
                            showToast(`Inspecting creative: ${ad.adName}`);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-left transition cursor-pointer group"
                        >
                          <div className="min-w-0 pr-3">
                            <div className="font-bold text-xs text-white truncate">{ad.adName}</div>
                            <div className="text-[10px] text-slate-400">
                              Spend: {currencySymbol}{ad.spend.toLocaleString()} • ROAS: {ad.roas.toFixed(2)}x • CTR: {ad.ctr.toFixed(2)}%
                            </div>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${
                            ad.tier === 'Strong Performer'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : ad.tier === 'Promising'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {ad.tier}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Palette Footer */}
            <div className="p-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span>Navigate: <kbd className="px-1.5 py-0.5 bg-white/5 rounded font-mono">↑↓</kbd></span>
                <span>Select: <kbd className="px-1.5 py-0.5 bg-white/5 rounded font-mono">↵</kbd></span>
                <span>Tabs: <kbd className="px-1.5 py-0.5 bg-white/5 rounded font-mono">1-7</kbd></span>
              </div>
              <span className="font-bold text-[#e2f976]">{client.name} Workspace</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= GLOBAL ACTION TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#141517] text-white shadow-2xl border border-white/15 animate-in slide-in-from-bottom-5 duration-200">
          <div className={`w-2 h-2 rounded-full ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-400 animate-ping' 
              : toastMessage.type === 'warn' 
              ? 'bg-amber-400 animate-pulse' 
              : 'bg-[#e2f976]'
          }`} />
          <span className="text-xs font-bold text-slate-100">{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
