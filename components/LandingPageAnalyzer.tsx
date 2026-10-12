'use client';

import React, { useState, useEffect } from 'react';
import { LandingPageAnalysis, UnifiedAdRecord, ClientProfile, ClarityMetrics } from '@/lib/types';
import { DEMO_CLARITY_METRICS } from '@/lib/demoData';
import { saveClientProfile } from '@/lib/storage';
import { 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  Layers,
  Flame,
  MousePointerClick,
  MoveVertical,
  Undo2,
  Smartphone,
  Monitor,
  Key,
  RefreshCw,
  Copy,
  Code2,
  Sliders,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

interface LandingPageAnalyzerProps {
  lpAnalysis: LandingPageAnalysis;
  records: UnifiedAdRecord[];
  client?: ClientProfile | null;
  onUpdateClient?: (updated: ClientProfile) => void;
  selectedSubTabFilter?: string;
  onSubTabFilterChange?: (subTab: string) => void;
}

export const LandingPageAnalyzer: React.FC<LandingPageAnalyzerProps> = ({
  lpAnalysis,
  records,
  client,
  onUpdateClient,
  selectedSubTabFilter = 'all',
  onSubTabFilterChange
}) => {
  // Microsoft Clarity Frontend API State
  const [clarityProjectId, setClarityProjectId] = useState<string>(
    client?.clarityProjectId || 'ms-clarity-ankit-funnel'
  );
  const [clarityApiToken, setClarityApiToken] = useState<string>(
    client?.clarityApiToken || ''
  );
  const [isClarityConnected, setIsClarityConnected] = useState<boolean>(
    Boolean(client?.clarityConnected ?? true)
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [clarityMetrics, setClarityMetrics] = useState<ClarityMetrics>(DEMO_CLARITY_METRICS);
  const [activeClarityTab, setActiveClarityTab] = useState<'friction' | 'dropoffs' | 'ai_insights'>('friction');

  // Sync state if client prop changes
  useEffect(() => {
    if (client) {
      if (client.clarityProjectId) setClarityProjectId(client.clarityProjectId);
      if (client.clarityApiToken) setClarityApiToken(client.clarityApiToken);
      if (client.clarityConnected !== undefined) setIsClarityConnected(client.clarityConnected);
    }
  }, [client]);

  // Test Clarity Connection Handler
  const handleTestClarity = async () => {
    if (!clarityProjectId.trim()) {
      setVerifyStatus({
        success: false,
        message: 'Please provide a valid Microsoft Clarity Project ID'
      });
      return;
    }

    setIsVerifying(true);
    setVerifyStatus(null);

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
        setVerifyStatus({
          success: true,
          message: data.message || `✓ Verified Clarity Project ID: ${clarityProjectId}`
        });
        setIsClarityConnected(true);

        if (client) {
          const updated: ClientProfile = {
            ...client,
            clarityConnected: true,
            clarityProjectId: clarityProjectId.trim(),
            clarityApiToken: clarityApiToken.trim() || undefined
          };
          saveClientProfile(updated);
          onUpdateClient?.(updated);
        }
      } else {
        setVerifyStatus({
          success: false,
          message: data.error || 'Failed to verify Clarity project'
        });
      }
    } catch (e: any) {
      setVerifyStatus({
        success: false,
        message: e.message || 'Network error verifying Clarity API'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveClarityCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;

    const updated: ClientProfile = {
      ...client,
      clarityConnected: Boolean(clarityProjectId.trim()),
      clarityProjectId: clarityProjectId.trim() || undefined,
      clarityApiToken: clarityApiToken.trim() || undefined
    };
    saveClientProfile(updated);
    onUpdateClient?.(updated);
    setIsClarityConnected(Boolean(clarityProjectId.trim()));
    setVerifyStatus({
      success: true,
      message: '✓ Microsoft Clarity credentials saved to workspace!'
    });
    setTimeout(() => setVerifyStatus(null), 3500);
  };

  const handleSimulateDemo = () => {
    setClarityProjectId('ms-clarity-ankit-funnel');
    setIsClarityConnected(true);
    setClarityMetrics(DEMO_CLARITY_METRICS);
    setVerifyStatus({
      success: true,
      message: '✓ Loaded demonstration Microsoft Clarity telemetry dataset!'
    });
    setTimeout(() => setVerifyStatus(null), 3000);
  };

  const trackingSnippet = `<!-- Microsoft Clarity Tracking Code -->
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${clarityProjectId.trim() || 'YOUR_PROJECT_ID'}");
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
              <Globe className="w-6 h-6 text-[#e2f976]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#141517]">Landing Page &amp; Clarity CRO Intelligence</h3>
                <span className="text-[10px] font-black bg-[#141517] text-[#e2f976] px-3 py-1 rounded-full">
                  Score: {lpAnalysis.messageMatchScore}/10
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Microsoft Clarity Live
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="font-semibold">Audited URL:</span>
                <a
                  href={lpAnalysis.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#141517] font-bold hover:underline flex items-center gap-1 truncate max-w-md"
                >
                  {lpAnalysis.url}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Above-Fold Score</span>
              <span className="text-lg font-black text-[#141517]">{lpAnalysis.aboveFoldClarityScore}/10</span>
            </div>
            <div className="text-right pl-4 border-l border-[#f4f5f2]">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Form Friction</span>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#e2f976]/30 text-[#141517] border border-[#e2f976]">
                {lpAnalysis.formFrictionScore}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MICROSOFT CLARITY FRONTEND CONFIGURATION & TELEMETRY HUB                  */}
      {/* ========================================================================= */}
      {(selectedSubTabFilter === 'all' || selectedSubTabFilter === 'clarity') && (
        <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-5">
        {/* Hub Header & Status Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#f4f5f2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <MousePointerClick className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-[#141517]">Microsoft Clarity Post-Click Telemetry</h4>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold ${
                  isClarityConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {isClarityConnected ? `● Connected (${clarityProjectId})` : '○ API Not Configured'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Live session friction, heatmaps, rage clicks, and dead clicks directly audited for this client.
              </p>
            </div>
          </div>

          {/* Action Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowCodeSnippet(!showCodeSnippet)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f4f5f2] hover:bg-[#e8eae4] text-slate-700 rounded-full text-xs font-bold transition cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showCodeSnippet ? 'Hide Tracking Tag' : 'Get Tracking Tag'}</span>
            </button>

            <button
              onClick={handleSimulateDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e2f976] hover:bg-white border border-[#141517]/10 text-[#141517] rounded-full text-xs font-extrabold transition cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Demo Telemetry</span>
            </button>
          </div>
        </div>

        {/* FRONTEND API INPUT STRIP (Where the user enters their Clarity Project ID / API Token) */}
        <form onSubmit={handleSaveClarityCredentials} className="p-4 bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-extrabold text-[#141517]">Clarity Project &amp; API Integration</span>
            </div>
            <span className="text-[11px] text-slate-500">
              Find your Project ID in Clarity Dashboard &rarr; Settings &rarr; Overview
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Clarity Project ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. n8x92abcde or project-slug"
                value={clarityProjectId}
                onChange={(e) => setClarityProjectId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Clarity API Key / Access Token (Optional)
              </label>
              <input
                type="password"
                placeholder="Optional for live export telemetry"
                value={clarityApiToken}
                onChange={(e) => setClarityApiToken(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={handleTestClarity}
                disabled={isVerifying || !clarityProjectId.trim()}
                className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Verify Project</span>
              </button>

              <button
                type="submit"
                disabled={!clarityProjectId.trim()}
                className="flex-1 py-2 px-3 bg-[#141517] hover:bg-black text-[#e2f976] text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save API</span>
              </button>
            </div>
          </div>

          {verifyStatus && (
            <div className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              verifyStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {verifyStatus.success ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
              <span>{verifyStatus.message}</span>
            </div>
          )}
        </form>

        {/* CODE SNIPPET DRAWER (IF EXPANDED) */}
        {showCodeSnippet && (
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#e2f976]" />
                <span className="text-xs font-bold">Paste into website &lt;head&gt; tag</span>
              </div>
              <button
                type="button"
                onClick={copyToClipboard}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
              >
                {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                <span>{copiedSnippet ? 'Copied Tag!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono bg-black/40 p-3 rounded-xl overflow-x-auto text-slate-200">
              {trackingSnippet}
            </pre>
          </div>
        )}

        {/* ================= 5 CLARITY TELEMETRY BENTO CARDS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {/* Card 1: Rage Clicks */}
          <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Rage Clicks</span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-rose-600">{clarityMetrics.rageClicksPercent}%</div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full inline-block mt-1">
                High Frustration
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Repeated rapid clicking on unresponsive elements.</p>
          </div>

          {/* Card 2: Dead Clicks */}
          <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Dead Clicks</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <MousePointerClick className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-600">{clarityMetrics.deadClicksPercent}%</div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-1">
                Unlinked Badges
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Clicks on unclickable cards, badges or images.</p>
          </div>

          {/* Card 3: Excessive Scrolling */}
          <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Excessive Scroll</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <MoveVertical className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-purple-700">{clarityMetrics.excessiveScrollPercent}%</div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full inline-block mt-1">
                Content Hunting
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Users scrolling up and down searching for pricing info.</p>
          </div>

          {/* Card 4: Quick Backs / Bounces */}
          <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Quick Backs</span>
              <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <Undo2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-orange-600">{clarityMetrics.quickBacksPercent}%</div>
              <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full inline-block mt-1">
                &lt; 4s Immediate Exit
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Leaving within 4 seconds due to ad/headline disconnect.</p>
          </div>

          {/* Card 5: Average Scroll Depth */}
          <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 flex flex-col justify-between space-y-2 col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Avg Scroll Depth</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600">{clarityMetrics.averageScrollDepth}%</div>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-semibold">
                <span>📱 {clarityMetrics.deviceSplit.mobilePercent}%</span>
                <span>💻 {clarityMetrics.deviceSplit.desktopPercent}%</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500">44% of mobile users drop before reaching the CTA.</p>
          </div>
        </div>

        {/* CLARITY DEEP-DIVE TABS */}
        <div className="pt-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <button
              onClick={() => setActiveClarityTab('friction')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeClarityTab === 'friction'
                  ? 'bg-[#141517] text-[#e2f976]'
                  : 'text-slate-500 hover:text-black hover:bg-slate-100'
              }`}
            >
              Friction Hotspots ({clarityMetrics.topFrictionElements.length})
            </button>
            <button
              onClick={() => setActiveClarityTab('dropoffs')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeClarityTab === 'dropoffs'
                  ? 'bg-[#141517] text-[#e2f976]'
                  : 'text-slate-500 hover:text-black hover:bg-slate-100'
              }`}
            >
              Page Drop-Offs ({clarityMetrics.pageDropOffs.length})
            </button>
            <button
              onClick={() => setActiveClarityTab('ai_insights')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeClarityTab === 'ai_insights'
                  ? 'bg-[#141517] text-[#e2f976]'
                  : 'text-slate-500 hover:text-black hover:bg-slate-100'
              }`}
            >
              AI CRO Directives ({clarityMetrics.aiCroInsights.length})
            </button>
          </div>

          <div className="pt-3">
            {/* SUB-VIEW 1: FRICTION HOTSPOTS */}
            {activeClarityTab === 'friction' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {clarityMetrics.topFrictionElements.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        item.issue === 'Rage Click'
                          ? 'bg-rose-100 text-rose-800'
                          : item.issue === 'Dead Click'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {item.issue}
                      </span>
                      <span className="font-extrabold text-slate-700">
                        {item.occurrences} incidents
                      </span>
                    </div>
                    <code className="block bg-white border border-slate-200 px-2 py-1 rounded-lg font-mono text-[11px] text-slate-800 truncate">
                      {item.element}
                    </code>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* SUB-VIEW 2: PAGE DROPOFFS */}
            {activeClarityTab === 'dropoffs' && (
              <div className="space-y-2.5">
                {clarityMetrics.pageDropOffs.map((page, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#141517] text-white flex items-center justify-center font-bold text-[11px]">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 block">{page.url}</span>
                        <span className="text-[11px] text-slate-400">Avg Time on Screen: {page.avgTimeSeconds}s</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Drop-Off Rate</span>
                      <span className="text-sm font-black text-rose-600">{page.dropOffRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUB-VIEW 3: AI CRO DIRECTIVES */}
            {activeClarityTab === 'ai_insights' && (
              <div className="space-y-2.5">
                {clarityMetrics.aiCroInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-xs"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <p className="text-emerald-950 font-medium leading-relaxed">
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MESSAGE MATCH CONTINUITY FLOW (ORIGINAL AUDIT INTEGRITY)                  */}
      {/* ========================================================================= */}
      {(selectedSubTabFilter === 'all' || selectedSubTabFilter === 'continuity') && (
        <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#f4f5f2]">
            <div>
              <h4 className="text-sm font-extrabold text-[#141517]">Full-Funnel Message Match Continuity</h4>
              <p className="text-xs text-slate-500">
                Evaluating cognitive consistency from the initial ad hook down to the final booking form.
              </p>
            </div>
            <span className="text-xs font-bold text-[#141517] bg-[#e2f976] px-3 py-1 rounded-full shadow-2xs">
              Strong Core Alignment
            </span>
          </div>

          {/* 5-Step Alignment Flow */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
            {/* Step 1 */}
            <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 text-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">1. Ad Hook (0-3s)</span>
                <p className="font-bold text-[#141517] line-clamp-3">&quot;{lpAnalysis.alignmentChain.adHook}&quot;</p>
              </div>
              <span className="mt-2 text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> High Curiosity
              </span>
            </div>

            {/* Step 2 */}
            <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 text-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">2. Ad Core Promise</span>
                <p className="font-bold text-[#141517] line-clamp-3">&quot;{lpAnalysis.alignmentChain.adPromise}&quot;</p>
              </div>
              <span className="mt-2 text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Clear Value
              </span>
            </div>

            {/* Step 3 */}
            <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 text-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">3. LP Headline</span>
                <p className="font-bold text-[#141517] line-clamp-3">&quot;{lpAnalysis.alignmentChain.lpHeadline}&quot;</p>
              </div>
              <span className="mt-2 text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Matched Angle
              </span>
            </div>

            {/* Step 4 */}
            <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 text-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">4. Offer Framing</span>
                <p className="font-bold text-[#141517] line-clamp-3">&quot;{lpAnalysis.alignmentChain.lpOffer}&quot;</p>
              </div>
              <span className="mt-2 text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ₹499 Hook
              </span>
            </div>

            {/* Step 5 */}
            <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 text-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">5. Friction Point</span>
                <p className="font-bold text-amber-900 line-clamp-3">&quot;{lpAnalysis.alignmentChain.conversionFriction}&quot;</p>
              </div>
              <span className="mt-2 text-[10px] text-amber-700 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600" /> Address in Step 2
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Copy Alignment & CRO Fixes */}
      {(selectedSubTabFilter === 'all' || selectedSubTabFilter === 'cro_fixes') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Benefits & Social Proof */}
          <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4">
            <h4 className="text-sm font-extrabold text-[#141517]">Landing Page Proof &amp; Benefits</h4>
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Identified Benefits</span>
              {lpAnalysis.benefitsIdentified.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-[#fbfcfb] p-2.5 rounded-xl border border-[#eef0ec]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Proof Elements</span>
              <div className="flex flex-wrap gap-2">
                {lpAnalysis.proofElements.map((proof, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#141517] text-[#e2f976] rounded-full text-[11px] font-bold">
                    {proof}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended CRO Fixes */}
          <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 shadow-2xs space-y-4">
            <h4 className="text-sm font-extrabold text-[#141517]">Prioritized CRO Action Plan</h4>
            <div className="space-y-3">
              {lpAnalysis.recommendedCROFixes.map((fix, idx) => (
                <div key={idx} className="p-3.5 bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl flex items-start gap-3 text-xs">
                  <span className="w-5 h-5 rounded-full bg-[#141517] text-[#e2f976] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-slate-800 font-semibold leading-relaxed">{fix}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
