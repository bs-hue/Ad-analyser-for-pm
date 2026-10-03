'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ClientProfile, 
  UnifiedAdRecord, 
  AccountDiagnosisResult, 
  ExperimentItem, 
  HistoricalAnalysisRun,
  CreativeIntelligence as CreativeType
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
  addClientHistoryRun,
  getClientPeriods
} from '@/lib/storage';
import { 
  DEMO_CREATIVE_INTELLIGENCE, 
  DEMO_LANDING_PAGE_ANALYSIS,
  DEMO_AD_RECORDS_MKR
} from '@/lib/demoData';
import { runClaudePerformanceAnalysis } from '@/lib/claudeEngine';
import { NeoBentoDashboard } from '@/components/NeoBentoDashboard';
import { Header } from '@/components/Header';
import { DataSourceModal } from '@/components/DataSourceModal';
import { MetricCards } from '@/components/MetricCards';
import { PerformanceTable } from '@/components/PerformanceTable';
import { CreativeIntelligence } from '@/components/CreativeIntelligence';
import { LandingPageAnalyzer } from '@/components/LandingPageAnalyzer';
import { FunnelDiagram } from '@/components/FunnelDiagram';
import { AIRecommendations } from '@/components/AIRecommendations';
import { AdGeneratorModal } from '@/components/AdGeneratorModal';
import { AdGeneratorView } from '@/components/AdGeneratorView';
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
  const [creativeMap, setCreativeMap] = useState<Record<string, CreativeType>>(DEMO_CREATIVE_INTELLIGENCE);
  const [analyzingVideoId, setAnalyzingVideoId] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [activeSubTab, setActiveSubTab] = useState<string>('executive_summary');

  const handleTabChange = (tab: WorkspaceTab) => {
    setActiveTab(tab);
    if (tab === 'overview') setActiveSubTab('executive_summary');
    else if (tab === 'performance') setActiveSubTab('ALL');
    else if (tab === 'creatives') setActiveSubTab('ALL');
    else if (tab === 'ai_recommendations') setActiveSubTab('7days');
    else if (tab === 'funnel') setActiveSubTab('all');
    else if (tab === 'landing_pages') setActiveSubTab('all');
    else if (tab === 'experiments') setActiveSubTab('all');
    else if (tab === 'client_knowledge') setActiveSubTab('dna');
    else if (tab === 'history') setActiveSubTab('all');
    else setActiveSubTab('all');
  };
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
    runAnalysis(client, clientRecords, dateRange, DEMO_CREATIVE_INTELLIGENCE);
  }, [clientId]);

  const recordRun = (client: ClientProfile, res: AccountDiagnosisResult, range: string) => {
    const newRun: HistoricalAnalysisRun = {
      id: `run-${Date.now().toString(36)}`,
      clientId: client.id,
      timestamp: new Date().toLocaleString(),
      dateRangeLabel: range,
      totalSpend: res.summary.totalSpend,
      totalRevenue: res.summary.totalRevenue,
      roas: res.summary.blendedRoas,
      totalConversions: res.summary.totalPurchases || res.summary.totalLeads,
      topWinningHook: res.winningPatterns[0]?.newHooks[0] || 'Problem-led 0-3s hook',
      keyFinding: res.executiveSummary[0] || 'High ROAS performance driven by problem-led UGC.',
      winningPatternsCount: res.winningPatterns.length,
      experimentsLaunched: experiments.length
    };
    addClientHistoryRun(client.id, newRun);
    setHistoryRuns(getClientHistory(client.id));
  };

  const runAnalysis = async (
    client: ClientProfile,
    dataset: UnifiedAdRecord[],
    range: string = 'Last 7 Days',
    customCreativeMap?: Record<string, CreativeType>
  ) => {
    setIsAnalyzing(true);
    setAnalysisStep('Ingesting dataset & calculating deterministic benchmarks...');
    const activeCreatives = customCreativeMap || creativeMap;

    try {
      // 1. Immediate local deterministic calculation for instantaneous baseline
      const baseResult = await runClaudePerformanceAnalysis(
        client,
        dataset,
        activeCreatives,
        DEMO_LANDING_PAGE_ANALYSIS,
        range
      );
      setDiagnosis(baseResult);

      // 2. Synthesize with Gemini Live Strategy via /api/diagnose
      setAnalysisStep('Synthesizing Gemini AI Strategic Diagnosis & 7-Day Plan...');
      try {
        const res = await fetch('/api/diagnose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client,
            records: dataset,
            creativeMap: activeCreatives,
            lpAnalysis: DEMO_LANDING_PAGE_ANALYSIS,
            dateRangeLabel: range
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.diagnosis) {
            setDiagnosis(data.diagnosis);
            recordRun(client, data.diagnosis, range);
            return;
          }
        }
      } catch (fetchErr) {
        console.warn('Live Gemini diagnosis API call skipped/fallback:', fetchErr);
      }

      recordRun(client, baseResult, range);
    } catch (err) {
      console.error('Error running performance analysis:', err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleAnalyzeVideo = async (ad: UnifiedAdRecord, driveUrl: string) => {
    setAnalyzingVideoId(ad.adId);
    try {
      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driveUrl,
          adRecord: ad,
          targetCpa: currentClient?.targetCpa || 300,
          productName: currentClient?.productService || 'Kundali Consultation',
          offerDescription: currentClient?.pricing || currentClient?.mainOffer || '₹499 report'
        })
      });

      const data = await response.json();
      if (data.success && data.creative) {
        const updated = {
          ...creativeMap,
          [ad.adId]: data.creative
        };
        setCreativeMap(updated);
        if (currentClient) {
          runAnalysis(currentClient, records, dateRange, updated);
        }
      } else {
        alert(data.error || 'Video analysis failed. Please verify the Google Drive link is public.');
      }
    } catch (err: any) {
      alert(`Error during video analysis: ${err.message}`);
    } finally {
      setAnalyzingVideoId(null);
    }
  };

  const handleSelectClient = (newId: string) => {
    if (newId === '__home__') {
      router.push('/');
      return;
    }
    router.push(`/client/${newId}`);
  };

  const handleDataLoaded = (newRecords: UnifiedAdRecord[]) => {
    if (!currentClient) return;
    setRecords(newRecords);
    saveClientDataset(currentClient.id, newRecords);
    const refreshed = getClientById(currentClient.id) || currentClient;
    setCurrentClient(refreshed);
    runAnalysis(refreshed, newRecords, dateRange);
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

  const handleLoadSampleDataset = () => {
    if (!currentClient) return;
    saveClientDataset(currentClient.id, DEMO_AD_RECORDS_MKR);
    setRecords(DEMO_AD_RECORDS_MKR);
    runAnalysis(currentClient, DEMO_AD_RECORDS_MKR, dateRange, DEMO_CREATIVE_INTELLIGENCE);
  };

  if (!currentClient || !diagnosis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfcfb] text-[#121316] text-xs">
        <div className="flex items-center gap-2.5 font-bold">
          <div className="w-5 h-5 rounded-full border-2 border-[#141517] border-t-[#e2f976] animate-spin" />
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
    <>
      <NeoBentoDashboard
        client={currentClient}
        clients={clients}
        onSelectClient={handleSelectClient}
        dateRange={dateRange}
        onChangeDateRange={(range) => {
          setDateRange(range);
          if (currentClient) {
            const storedPeriods = getClientPeriods(currentClient.id);
            const targetRecords = storedPeriods?.[range] || currentClient.periodDatasets?.[range];
            if (targetRecords && targetRecords.length > 0) {
              setRecords(targetRecords);
              runAnalysis(currentClient, targetRecords, range);
              return;
            }
          }
          runAnalysis(currentClient, records, range);
        }}
        onOpenDataSourceModal={() => setIsDataSourceModalOpen(true)}
        onAnalyze={() => runAnalysis(currentClient, records, dateRange)}
        isAnalyzing={isAnalyzing}
        analysisStep={analysisStep}
        onToggleReportView={() => setIsReportView(!isReportView)}
        isReportView={isReportView}
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        activeSubTab={activeSubTab}
        onChangeSubTab={setActiveSubTab}
        diagnosis={diagnosis}
        creativeMap={creativeMap}
        onAnalyzeVideo={handleAnalyzeVideo}
        analyzingVideoId={analyzingVideoId}
        onOpenAdGenerator={() => setIsAdGeneratorOpen(true)}
        onLoadSampleDataset={handleLoadSampleDataset}
      >
        {isReportView ? (
          <ExecutiveReportView
            diagnosis={diagnosis}
            client={currentClient}
            onBackToWorkspace={() => setIsReportView(false)}
          />
        ) : (
          <div className="space-y-6">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Executive Takeaways Banner */}
                <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#f4f5f2]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-xs">
                        <Sparkles className="w-5 h-5 text-[#e2f976]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-[#141517]">
                          Strategic Diagnosis ({dateRange})
                        </h3>
                        <p className="text-xs text-slate-500">Autonomous performance marketer analysis</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#141517] bg-[#e2f976] px-4 py-1.5 rounded-full shadow-2xs">
                      Blended ROAS: {diagnosis.summary.blendedRoas.toFixed(2)}x
                    </span>
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

                {/* Performance Table */}
                <PerformanceTable
                  records={diagnosis.records}
                  creativeMap={creativeMap}
                  currency={currentClient.currency}
                  onAnalyzeVideo={handleAnalyzeVideo}
                  analyzingVideoId={analyzingVideoId}
                  selectedTierFilter={activeSubTab}
                  onTierFilterChange={setActiveSubTab}
                />
              </div>
            )}

            {/* TAB 2: PERFORMANCE */}
            {activeTab === 'performance' && (
              <PerformanceTable
                records={diagnosis.records}
                creativeMap={creativeMap}
                currency={currentClient.currency}
                onAnalyzeVideo={handleAnalyzeVideo}
                analyzingVideoId={analyzingVideoId}
                selectedTierFilter={activeSubTab}
                onTierFilterChange={setActiveSubTab}
              />
            )}

            {/* TAB 3: CREATIVES */}
            {activeTab === 'creatives' && (
              <CreativeIntelligence
                records={diagnosis.records}
                creativeMap={creativeMap}
                currency={currentClient.currency}
                onAnalyzeVideo={handleAnalyzeVideo}
                analyzingVideoId={analyzingVideoId}
                selectedFormatFilter={activeSubTab}
                onFormatFilterChange={setActiveSubTab}
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
                selectedSubTabFilter={
                  activeSubTab === 'winners' || activeSubTab === 'underperforming' || activeSubTab === 'avoid'
                    ? activeSubTab
                    : '7days'
                }
                onSubTabFilterChange={setActiveSubTab as any}
              />
            )}

            {/* TAB 7: AD GENERATOR */}
            {activeTab === 'ad_generator' && (
              <AdGeneratorView
                client={currentClient}
                diagnosis={diagnosis}
                onOpenModal={() => setIsAdGeneratorOpen(true)}
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
          </div>
        )}
      </NeoBentoDashboard>

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
    </>
  );
}
