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
      const isAstrology = client.name.toLowerCase().includes('btra') || (client.productService || '').toLowerCase().includes('kundali');
      
      if (isAstrology) {
        setGeneratedResult({
          hook: `“Career aur marriage mein lagatar rukawat aa rahi hai? Problem aap mein nahi, 7th house aur Rahu-Ketu ke dosh mein ho sakti hai.”`,
          primaryText: `${client.primaryTexts?.[0] || 'Aapki mehnat ke bawajood career mein progress nahi ho rahi? Ya marriage mein baar-baar delays aa rahe hain?'}\n\nDr. Ankiit Btra ki Master Kundali Report se jaaniye apne grah-nakshatro ke sahi upaay.\n\n✅ 100% Personalised Analysis\n✅ Simple Doable Remedies\n✅ Express PDF Delivery\n\n👉 Apni Kundali Report aaj hi claim karein (${client.pricing || '₹499'}).`,
          headline: client.headlines?.[1] || `Delay In Marriage & Career? Find Remedies Now 💍✨`,
          cta: client.ctas?.[0] || `Order Now`,
          creativeConcept: `Dr. Ankiit Btra on-camera holding a Kundali birth chart, highlighting the 7th house and Saturn transit, cutting to WhatsApp testimonial screenshot showing marriage fixed in 90 days.`,
          videoScript: `0-3s: (Direct Eye-Contact Hook) "Aapka career aur shaadi kyu delay ho raha hai? Shayad aapke 7th house par dosh hai."\n3-10s: "90% log galat timing par decisions lete hain. Jab tak aapke graho ki sthiti align nahi hogi, tab tak rukaavate aati rahengi."\n10-25s: "Dr. Ankiit Btra ki Master Kundali Report mein hum aapko batate hain exact samay aur aasan upaay jo aapki life ki rukaavato ko door kare."\n25-35s: "Neeche diye gaye button par click karein aur apni personalized report sirf ${client.pricing || '₹499'} mein order karein."`
        });
      } else {
        setGeneratedResult({
          hook: `“If your customer acquisition cost spiked this week, stop touching your bidding strategy—fix your first 3 seconds.”`,
          primaryText: `If your Meta CPA doubled this month, don't blame the algorithm. In 90% of the funnels we audited at ${client.businessName}, the bleed is never targeting—it's creative message match.\n\nHere is how we restructure ad hooks for ${client.productService || 'your offer'} to generate qualified conversions under target CPA consistently.\n\nClaim your ${client.mainOffer || 'Growth Session'} today.`,
          headline: client.headlines?.[0] || `Why Your Ads Bleed Cash (And The 3-Second Fix)`,
          cta: client.ctas?.[0] || `Book Now`,
          creativeConcept: `Handheld smartphone camera zoom in on frustrated marketer reviewing live Ads Manager dashboard, switching to screen share of CPA drop with ${client.usp || 'creative iteration'}.`,
          videoScript: `0-3s: (Frustrated face) "If your Meta CPA doubled this month, stop touching your bidding strategy."\n3-10s: "In 90% of accounts we audit, the problem isn't broad targeting. It's that your first 3 seconds don't call out a specific painful problem."\n10-25s: "Look at this campaign: we restructured the opening angle to directly address ${client.painPoints?.[0] || 'the core pain point'} and CPA dropped in 14 days."\n25-35s: "Click below to get started with ${client.name} today."`
        });
      }
    }, 800);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] border border-[#eef0ec] shadow-2xl max-w-4xl w-full mx-auto overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-white border-b border-[#f4f5f2] px-7 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-[#e2f976]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#141517]">AI Performance Ad Generator</h3>
              <p className="text-xs text-slate-500">
                Generate high-converting creative scripts and copy trained on {client.name}'s verified winning patterns.
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

        <div className="p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[78vh] overflow-y-auto">
          {/* Left: Input Parameters */}
          <div className="lg:col-span-5 space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Product / Service</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Main Offer</label>
              <input
                type="text"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Winning Historical Insight</label>
              <textarea
                rows={2}
                value={winningInsight}
                onChange={(e) => setWinningInsight(e.target.value)}
                className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517] cursor-pointer"
                >
                  <option value="Raw UGC Video">Raw UGC Video</option>
                  <option value="Founder Breakdown">Founder Breakdown</option>
                  <option value="Static High-Contrast">Static High-Contrast</option>
                  <option value="Diagnostic Chart">Diagnostic Chart</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                  className="w-full bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-3 text-slate-900 font-semibold focus:border-[#141517] cursor-pointer"
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
              className="w-full py-3 bg-[#141517] hover:bg-black text-[#e2f976] font-black text-xs rounded-full shadow-sm transition flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4 text-[#e2f976]" />
              <span>{isGenerating ? 'Synthesizing Winning Copy...' : 'Generate High-ROAS Ad Concept'}</span>
            </button>
          </div>

          {/* Right: Generated Output */}
          <div className="lg:col-span-7 space-y-4">
            {!generatedResult ? (
              <div className="h-full border-2 border-dashed border-[#e2e5df] rounded-[28px] p-8 flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#f4f5f2] text-slate-400 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-[#141517]">No ad generated yet</p>
                <p className="text-[11px] text-slate-400 max-w-sm">
                  Click 'Generate High-ROAS Ad Concept' to produce complete hook variations, primary copy, and a timestamped video script.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* 0-3s Hook */}
                <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#141517] text-[11px] uppercase tracking-wider">0–3s Hook (Pattern Interrupt)</span>
                    <button
                      onClick={() => copyToClipboard(generatedResult.hook, 'hook')}
                      className="w-7 h-7 rounded-full bg-[#f4f5f2] hover:bg-[#e8eae4] flex items-center justify-center text-slate-600 transition"
                    >
                      {copiedKey === 'hook' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="font-semibold text-[#141517] italic text-xs leading-relaxed">{generatedResult.hook}</p>
                </div>

                {/* Primary Text & Headline */}
                <div className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#141517] text-[11px] uppercase tracking-wider">Primary Ad Copy</span>
                    <button
                      onClick={() => copyToClipboard(generatedResult.primaryText, 'copy')}
                      className="w-7 h-7 rounded-full bg-[#f4f5f2] hover:bg-[#e8eae4] flex items-center justify-center text-slate-600 transition"
                    >
                      {copiedKey === 'copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-slate-700 whitespace-pre-line text-xs leading-relaxed">{generatedResult.primaryText}</p>
                  <div className="pt-2.5 border-t border-[#f4f5f2] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Headline</span>
                      <span className="font-bold text-[#141517]">{generatedResult.headline}</span>
                    </div>
                    <span className="font-black text-xs bg-[#141517] text-[#e2f976] px-3.5 py-1.5 rounded-full">
                      {generatedResult.cta}
                    </span>
                  </div>
                </div>

                {/* Timestamped Video Script */}
                <div className="bg-[#141517] text-white border border-[#23252a] rounded-[28px] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-[11px] uppercase tracking-wider flex items-center gap-2">
                      <Video className="w-4 h-4 text-[#e2f976]" />
                      <span>Timestamped Video Production Script</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(generatedResult.videoScript, 'script')}
                      className="w-7 h-7 rounded-full bg-[#222428] hover:bg-[#2e3137] flex items-center justify-center text-white transition"
                    >
                      {copiedKey === 'script' ? <Check className="w-3.5 h-3.5 text-[#e2f976]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-slate-300 whitespace-pre-line text-[11px] font-mono leading-relaxed bg-[#222428] p-3.5 rounded-2xl border border-white/10">
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
