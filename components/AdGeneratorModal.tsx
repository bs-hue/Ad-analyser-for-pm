'use client';

import React, { useState } from 'react';
import { ClientProfile } from '@/lib/types';
import { 
  Sparkles, 
  X, 
  Copy, 
  Check, 
  Video, 
  FileText, 
  Lightbulb, 
  Layers, 
  Play,
  RotateCcw
} from 'lucide-react';

interface AdGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientProfile;
}

export const AdGeneratorModal: React.FC<AdGeneratorModalProps> = ({
  isOpen,
  onClose,
  client
}) => {
  const [product, setProduct] = useState(client.productService);
  const [offer, setOffer] = useState(client.mainOffer);
  const [audience, setAudience] = useState(client.targetAudience);
  const [winningInsight, setWinningInsight] = useState(
    'Problem-led opening hook addressing Meta CPA doubling in first 2 seconds with raw handheld UGC and whiteboard unit economics.'
  );
  const [platform, setPlatform] = useState<'Meta Ads' | 'Google Ads' | 'TikTok Ads' | 'YouTube Shorts'>('Meta Ads');
  const [format, setFormat] = useState<'Raw UGC Video' | 'Founder Breakdown' | 'Static High-Contrast' | 'Diagnostic Chart'>('Raw UGC Video');
  const [tone, setTone] = useState(client.brandTone);
  const [objective, setObjective] = useState<'LEADS' | 'SALES' | 'BOOKINGS'>('LEADS');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    hook: string;
    primaryText: string;
    headline: string;
    cta: string;
    creativeConcept: string;
    videoScript: string;
  } | null>(null);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedResult({
        hook: `“If your customer acquisition cost spiked this week, stop touching your bidding strategy—fix your first 3 seconds.”`,
        primaryText: `If your Meta CPA doubled this month, don't blame the algorithm. In 90% of the 250+ funnels we audited at ${client.businessName}, the bleed is never targeting—it's creative message match.\n\nHere is how we restructure B2B ad hooks to generate qualified discovery calls under ₹120 consistently.\n\nClaim your 1-on-1 Growth Blueprint Session today.`,
        headline: `Why Your B2B Ads Bleed Cash (And The 3-Second Fix)`,
        cta: `Book Now`,
        creativeConcept: `Handheld smartphone camera zoom in on frustrated founder reviewing live Ads Manager dashboard, switching to screen share of CPA drop from ₹450 to ₹99.`,
        videoScript: `0-3s: (Frustrated face) "If your Meta CPA doubled this month, stop touching your bidding strategy."\n3-10s: "In 90% of accounts we audit, the problem isn't broad targeting. It's that your first 3 seconds don't call out a specific painful problem."\n10-25s: "Look at this client: we changed literally one sentence in the opening hook and CAC dropped from ₹800 to ₹119 in 14 days."\n25-35s: "Click below to book a 1-on-1 Growth Blueprint Session and let's audit your creative machine."`
      });
    }, 900);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-4xl w-full mx-auto overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Performance Ad Generator</h3>
              <p className="text-xs text-slate-500">
                Generate high-converting creative scripts and copy trained on {client.name}'s verified winning patterns.
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

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[78vh] overflow-y-auto">
          {/* Left: Input Parameters */}
          <div className="lg:col-span-5 space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Product / Service</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Main Offer</label>
              <input
                type="text"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Winning Historical Insight</label>
              <textarea
                rows={2}
                value={winningInsight}
                onChange={(e) => setWinningInsight(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Raw UGC Video">Raw UGC Video</option>
                  <option value="Founder Breakdown">Founder Breakdown</option>
                  <option value="Static High-Contrast">Static High-Contrast</option>
                  <option value="Diagnostic Chart">Diagnostic Chart</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Meta Ads">Meta Ads</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                  <option value="TikTok Ads">TikTok Ads</option>
                  <option value="Google Ads">Google Ads</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Synthesizing Winning Copy...' : 'Generate High-ROAS Ad Concept'}</span>
            </button>
          </div>

          {/* Right: Generated Output */}
          <div className="lg:col-span-7 space-y-4">
            {!generatedResult ? (
              <div className="h-full border border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                <Lightbulb className="w-8 h-8 text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">No ad generated yet</p>
                <p className="text-[11px] text-slate-400 max-w-sm">
                  Click 'Generate High-ROAS Ad Concept' to produce complete hook variations, primary copy, and a timestamped video script.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                {/* 0-3s Hook */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900 text-[11px] uppercase">0–3s Hook (Pattern Interrupt)</span>
                    <button
                      onClick={() => copyToClipboard(generatedResult.hook, 'hook')}
                      className="p-1 text-slate-400 hover:text-blue-600"
                    >
                      {copiedKey === 'hook' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="font-semibold text-slate-900 italic text-xs">{generatedResult.hook}</p>
                </div>

                {/* Primary Text & Headline */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-[11px] uppercase">Primary Ad Copy</span>
                    <button
                      onClick={() => copyToClipboard(generatedResult.primaryText, 'copy')}
                      className="p-1 text-slate-400 hover:text-blue-600"
                    >
                      {copiedKey === 'copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-slate-700 whitespace-pre-line text-xs">{generatedResult.primaryText}</p>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Headline</span>
                      <span className="font-bold text-slate-900">{generatedResult.headline}</span>
                    </div>
                    <span className="font-bold text-xs bg-blue-600 text-white px-2.5 py-1 rounded">
                      {generatedResult.cta}
                    </span>
                  </div>
                </div>

                {/* Timestamped Video Script */}
                <div className="bg-indigo-50/40 border border-indigo-200/60 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-950 text-[11px] uppercase flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Timestamped Video Production Script</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(generatedResult.videoScript, 'script')}
                      className="p-1 text-slate-400 hover:text-indigo-600"
                    >
                      {copiedKey === 'script' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-slate-700 whitespace-pre-line text-[11px] font-mono leading-relaxed bg-white p-2.5 rounded border border-indigo-100">
                    {generatedResult.videoScript}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
