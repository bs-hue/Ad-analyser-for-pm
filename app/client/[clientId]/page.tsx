'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ClientProfile, 
  UnifiedAdRecord, 
  AccountDiagnosisResult, 
  ExperimentItem, 
  HistoricalAnalysisRun 
} from '@/lib/types';
import { 
  getStoredClients, 
  getClientById, 
  saveClientProfile, 
  getClientDataset, 
  saveClientDataset, 
  getClientExperiments, 
  saveClientExperiments, 
  getClientHistory, 
  addClientHistoryRun 
} from '@/lib/storage';
import { 
  DEMO_CREATIVE_INTELLIGENCE, 
  DEMO_LANDING_PAGE_ANALYSIS 
} from '@/lib/demoData';
import { runClaudePerformanceAnalysis } from '@/lib/claudeEngine';
import { Header } from '@/components/Header';
import { DataSourceModal } from '@/components/DataSourceModal';
import { MetricCards } from '@/components/MetricCards';
import { PerformanceTable } from '@/components/PerformanceTable';
import { CreativeIntelligence } from '@/components/CreativeIntelligence';
import { LandingPageAnalyzer } from '@/components/LandingPageAnalyzer';
import { FunnelDiagram } from '@/components/FunnelDiagram';
import { AIRecommendations } from '@/components/AIRecommendations';
import { AdGeneratorModal } from '@/components/AdGeneratorModal';
import { ExperimentTracker } from '@/components/ExperimentTracker';
import { HistoricalView } from '@/components/HistoricalView';
import { ClientKnowledgeView } from '@/components/ClientKnowledgeView';
import { ExecutiveReportView } from '@/components/ExecutiveReportView';
import { 
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
  ArrowRight
} from 'lucide-react';

type WorkspaceTab = 
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

export default function ClientWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const clientId = (params?.clientId as string) || 'client-ankit-batra';

  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [currentClient, setCurrentClient] = useState<ClientProfile | null>(null);
  const [records, setRecords] = useState<UnifiedAdRecord[]>([]);
  const [experiments, setExperiments] = useState<ExperimentItem[]>([]);
  const [historyRuns, setHistoryRuns] = useState<HistoricalAnalysisRun[]>([]);
  
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);
  const [isAdGeneratorOpen, setIsAdGeneratorOpen] = useState(false);
  const [isReportView, setIsReportView] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<AccountDiagnosisResult | null>(null);

  // Initialize client data
  useEffect(() => {
    const allClients = getStoredClients();
    setClients(allClients);
    const client = getClientById(clientId) || allClients[0];
    setCurrentClient(client);

    const clientRecords = getClientDataset(client.id);
    setRecords(clientRecords);

    const clientExps = getClientExperiments(client.id);
    setExperiments(clientExps);

    const clientHistory = getClientHistory(client.id);
    setHistoryRuns(clientHistory);

    // Initial analysis generation
    runAnalysis(client, clientRecords, dateRange);
  }, [clientId]);

  const runAnalysis = async (
    client: ClientProfile,
    dataset: UnifiedAdRecord[],
    range: string = 'Last 7 Days'
  ) => {
    setIsAnalyzing(true);
    try {
      const result = await runClaudePerformanceAnalysis(
        client,
        dataset,
        DEMO_CREATIVE_INTELLIGENCE,
        DEMO_LANDING_PAGE_ANALYSIS,
        range
      );
      setDiagnosis(result);

      // Record to historical runs
      const newRun: HistoricalAnalysisRun = {
        id: `run-${Date.now().toString(36)}`,
        clientId: client.id,
        timestamp: new Date().toLocaleString(),
        dateRangeLabel: range,
        totalSpend: result.summary.totalSpend,
        totalRevenue: result.summary.totalRevenue,
        roas: result.summary.blendedRoas,
        totalConversions: result.summary.totalPurchases || result.summary.totalLeads,
        topWinningHook: result.winningPatterns[0]?.newHooks[0] || 'Problem-led 0-3s hook',
        keyFinding: result.executiveSummary[0] || 'High ROAS performance driven by problem-led UGC.',
        winningPatternsCount: result.winningPatterns.length,
        experimentsLaunched: experiments.length
      };
      addClientHistoryRun(client.id, newRun);
      setHistoryRuns(getClientHistory(client.id));
    } catch (err) {
      console.error('Error running Claude analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectClient = (newId: string) => {
    router.push(`/client/${newId}`);
  };

  const handleDataLoaded = (newRecords: UnifiedAdRecord[]) => {
    if (!currentClient) return;
    setRecords(newRecords);
    saveClientDataset(currentClient.id, newRecords);
    runAnalysis(currentClient, newRecords, dateRange);
  };

  const handleSaveExperiments = (updated: ExperimentItem[]) => {
    if (!currentClient) return;
    setExperiments(updated);
    saveClientExperiments(currentClient.id, updated);
  };

  const handleSaveClientProfile = (updated: ClientProfile) => {
    setCurrentClient(updated);
    saveClientProfile(updated);
  };

  if (!currentClient || !diagnosis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700 text-xs">
        <div className="flex items-center gap-2 font-semibold">
          <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <span>Loading Client Intelligence Workspace...</span>
        </div>
      </div>
    );
  }

  const tabs: Array<{ id: WorkspaceTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'creatives', label: 'Creatives', icon: Film },
    { id: 'funnel', label: 'Funnel', icon: Filter },
    { id: 'landing_pages', label: 'Landing Pages', icon: Globe },
    { id: 'ai_recommendations', label: 'AI Recommendations', icon: Sparkles },
    { id: 'ad_generator', label: 'Ad Generator', icon: PlusCircle },
    { id: 'experiments', label: 'Experiments', icon: FlaskConical },
    { id: 'history', label: 'History', icon: History },
    { id: 'client_knowledge', label: 'Client Knowledge', icon: BookOpen }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Global Header */}
      <Header
        client={currentClient}
        clients={clients}
        onSelectClient={handleSelectClient}
        dateRange={dateRange}
        onChangeDateRange={(range) => {
          setDateRange(range);
          runAnalysis(currentClient, records, range);
        }}
        onOpenDataSourceModal={() => setIsDataSourceModalOpen(true)}
        onAnalyze={() => runAnalysis(currentClient, records, dateRange)}
        isAnalyzing={isAnalyzing}
        onToggleReportView={() => setIsReportView(!isReportView)}
        isReportView={isReportView}
      />

      {isReportView ? (
        <main className="flex-1 p-6">
          <ExecutiveReportView
            diagnosis={diagnosis}
            client={currentClient}
            onBackToWorkspace={() => setIsReportView(false)}
          />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 space-y-6">
          {/* Top Navigation Tabs */}
          <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm overflow-x-auto flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'ad_generator') {
                      setIsAdGeneratorOpen(true);
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <MetricCards diagnosis={diagnosis} currency={currentClient.currency} />

              {/* Executive Takeaways Banner */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900">Claude Strategic Diagnosis ({dateRange})</h3>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                    Blended ROAS: {diagnosis.summary.blendedRoas.toFixed(2)}x
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  {diagnosis.executiveSummary.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                      <p className="leading-relaxed font-medium">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Table */}
              <PerformanceTable
                records={diagnosis.records}
                creativeMap={diagnosis.creativeIntelligence}
                currency={currentClient.currency}
              />
            </div>
          )}

          {/* TAB 2: PERFORMANCE */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <MetricCards diagnosis={diagnosis} currency={currentClient.currency} />
              <PerformanceTable
                records={diagnosis.records}
                creativeMap={diagnosis.creativeIntelligence}
                currency={currentClient.currency}
              />
            </div>
          )}

          {/* TAB 3: CREATIVES */}
          {activeTab === 'creatives' && (
            <CreativeIntelligence
              records={diagnosis.records}
              creativeMap={diagnosis.creativeIntelligence}
              currency={currentClient.currency}
            />
          )}

          {/* TAB 4: FUNNEL */}
          {activeTab === 'funnel' && (
            <FunnelDiagram
              stages={diagnosis.funnelStages}
              currency={currentClient.currency}
            />
          )}

          {/* TAB 5: LANDING PAGES */}
          {activeTab === 'landing_pages' && (
            <LandingPageAnalyzer
              lpAnalysis={diagnosis.landingPageAnalysis}
              records={diagnosis.records}
            />
          )}

          {/* TAB 6: AI RECOMMENDATIONS */}
          {activeTab === 'ai_recommendations' && (
            <AIRecommendations
              winningPatterns={diagnosis.winningPatterns}
              patternsToAvoid={diagnosis.patternsToAvoid}
              next7DaysPlan={diagnosis.next7DaysPlan}
              underperformingDiagnosis={diagnosis.underperformingDiagnosis}
              currency={currentClient.currency}
              onOpenAdGenerator={() => setIsAdGeneratorOpen(true)}
            />
          )}

          {/* TAB 8: EXPERIMENTS */}
          {activeTab === 'experiments' && (
            <ExperimentTracker
              experiments={experiments}
              onSaveExperiments={handleSaveExperiments}
              clientId={currentClient.id}
            />
          )}

          {/* TAB 9: HISTORY */}
          {activeTab === 'history' && (
            <HistoricalView
              history={historyRuns}
              client={currentClient}
            />
          )}

          {/* TAB 10: CLIENT KNOWLEDGE */}
          {activeTab === 'client_knowledge' && (
            <ClientKnowledgeView
              client={currentClient}
              onSaveClient={handleSaveClientProfile}
            />
          )}
        </main>
      )}

      {/* Data Source Modal */}
      <DataSourceModal
        isOpen={isDataSourceModalOpen}
        onClose={() => setIsDataSourceModalOpen(false)}
        client={currentClient}
        onDataLoaded={handleDataLoaded}
      />

      {/* Ad Generator Modal */}
      <AdGeneratorModal
        isOpen={isAdGeneratorOpen}
        onClose={() => setIsAdGeneratorOpen(false)}
        client={currentClient}
      />
    </div>
  );
}
