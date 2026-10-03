'use client';

import React, { useState } from 'react';
import { ClientProfile, AccountDiagnosisResult } from '@/lib/types';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Video, 
  FileText, 
  Lightbulb, 
  Layers, 
  ArrowRight,
  PlusCircle,
  Wand2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface AdGeneratorViewProps {
  client: ClientProfile;
  diagnosis: AccountDiagnosisResult;
  onOpenModal: () => void;
}

export const AdGeneratorView: React.FC<AdGeneratorViewProps> = ({
  client,
  diagnosis,
  onOpenModal
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'hooks' | 'headlines' | 'primary' | 'scripts'>('all');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isAstrology = 
    client.name.toLowerCase().includes('btra') || 
    (client.productService || '').toLowerCase().includes('kundali') ||
    (client.businessName || '').toLowerCase().includes('astro');

  // 10 Data-Backed Hooks categorized by mechanism
  const hooks = isAstrology
    ? [
        { type: 'Problem-First', text: '“Career aur marriage mein lagatar rukawat aa rahi hai? Problem aapki mehnat mein nahi, 7th house ke dosh mein ho sakti hai.”' },
        { type: 'Curiosity-Gap', text: '“Kyu 90% log apni Kundali ka sabse zaroori grah check karna bhool jaate hain jab unka career rukta hai?”' },
        { type: 'Contrarian', text: '“Expensive gemstones pehenne se pehle yeh ek simple birth chart checkup zaroor kar lein.”' },
        { type: 'Social Proof', text: '“1,000+ logon ne Dr. Ankiit Btra ke remedies follow kiye aur marriage delays resolve kiye—yeh hai exact breakdown.”' },
        { type: 'Direct Benefit', text: '“Apne aane waale 12 mahino ka career aur marriage roadmap samjhein sirf 24 ghante mein.”' },
        { type: 'Emotional Fear', text: '“Agar har rishta aakhri moment par toot raha hai, toh yeh planetary warning sign ignore mat karein.”' },
        { type: 'Authority', text: '“15+ saal ke Vedic astrological experience se dekha hai: 3 graho ka alignment aapka pura career change kar sakta hai.”' },
        { type: 'Relatable Story', text: '“Meri shaadi 3 saal se delay ho rahi thi jab tak maine apne chart ka yeh ek dosh remedy nahi kiya.”' },
        { type: 'Urgency Pricing', text: `“Limited slots: Dr. Ankiit Btra ki Master Kundali Report abhi order karein sirf ${client.pricing || '₹499'} mein.”` },
        { type: 'Objection Buster', text: '“No confusing jargon, no unrealistic totkas—sirf practical Vedic guidance jo kaam kare.”' }
      ]
    : [
        { type: 'Problem-First', text: `“If your Meta CPA doubled this month, stop touching your bidding strategy—fix your first 3 seconds.”` },
        { type: 'Curiosity-Gap', text: `“The 3-second hook structure that cut customer acquisition costs by 42% without changing our targeting.”` },
        { type: 'Contrarian', text: `“Broad targeting isn't broken—your opening frame is just boring your best buyers.”` },
        { type: 'Social Proof', text: `“How we scaled ${client.businessName} from ₹5L to ₹25L monthly spend while keeping ROAS above 3.5x.”` },
        { type: 'Direct Benefit', text: `“Get an autonomous 7-day creative iteration playbook delivered directly to your media buying team.”` },
        { type: 'Process Reveal', text: `“We stopped testing random ad copies and built this deterministic 5-tier classification framework instead.”` },
        { type: 'Authority', text: `“After analyzing over 200+ paid campaigns this quarter, this single creative defect caused 80% of budget bleed.”` },
        { type: 'Relatable Story', text: `“I spent 3 weeks tweaking audience segments before realizing our landing page headline didn't match the ad hook.”` },
        { type: 'Urgency Pricing', text: `“Claim your initial performance audit session with ${client.name} before this month's intake closes.”` },
        { type: 'Objection Buster', text: `“You don't need a 20-person production crew—high converting UGC works best shot on an iPhone.”` }
      ];

  // 5 High-Impact Headlines
  const headlines = isAstrology
    ? [
        client.headlines?.[0] || 'Delay In Marriage & Career? Get Vedic Remedies ✨',
        client.headlines?.[1] || 'Personalized Kundali Consultation Report By Dr. Ankiit Btra',
        client.headlines?.[2] || 'Aapki Grah Stithi Ka Sach — 100% Confidential Analysis',
        client.headlines?.[3] || 'Simple Doable Remedies For Life, Wealth & Relationship Obstacles',
        client.headlines?.[4] || `Order Your Comprehensive Kundali Report Now (${client.pricing || '₹499'})`
      ]
    : [
        client.headlines?.[0] || `Why Your Ads Bleed Cash (And The 3-Second Fix)`,
        client.headlines?.[1] || `Scale Meta Spend Profitably With Autonomous Creative Intelligence`,
        client.headlines?.[2] || `Stop Guessing: Data-Backed Creative Iterations for Media Buyers`,
        client.headlines?.[3] || `Cut Customer Acquisition Cost By 35% in 14 Days`,
        client.headlines?.[4] || `Book Your Strategic Funnel & Creative Diagnostic Session`
      ];

  // 3 Primary Copy Variations
  const primaryTexts = [
    {
      label: 'Variation A: Problem-Agitate-Solve (PAS)',
      text: isAstrology
        ? `${client.primaryTexts?.[0] || 'Aapki mehnat ke bawajood career mein progress nahi ho rahi? Ya marriage mein baar-baar delays aa rahe hain?'}\n\nDr. Ankiit Btra ki Master Kundali Report se jaaniye apne grah-nakshatro ke sahi upaay.\n\n✅ 100% Personalised Analysis\n✅ Simple Doable Remedies\n✅ Express PDF Delivery\n\n👉 Apni Kundali Report aaj hi claim karein (${client.pricing || '₹499'}).`
        : `If your customer acquisition cost spiked this week, don't blame the algorithm.\n\nIn 90% of the funnels we audited at ${client.businessName}, the bleed is never targeting—it's creative message match.\n\nHere is how we restructure ad hooks for ${client.productService || 'your offer'} to generate qualified conversions under target CPA consistently.\n\nClaim your ${client.mainOffer || 'Growth Session'} today.`
    },
    {
      label: 'Variation B: Direct-Response Bulleted Value',
      text: isAstrology
        ? `Life mein rukawat kab khatam hogi? 🌟\n\nDr. Ankiit Btra ke 15+ years experience par aadharit Kundali Report mein payein:\n• Career & Finance growth timings\n• Marriage & Relationship remedy plan\n• Shani & Rahu-Ketu dosh nivaran\n\nAbhi order karein aur raste ki har rukaawat ko door karein!`
        : `Scale your campaigns without burning capital:\n\n• Deterministic 5-tier classification across all ad sets\n• Second-by-second 720p hook & hold teardowns\n• Strict ad-to-landing-page message match scoring\n• Prioritized P0/P1/P2 7-day action playbooks\n\nSee how ${client.name} helps brands dominate paid acquisition.`
    },
    {
      label: 'Variation C: Story-Driven Conversational',
      text: isAstrology
        ? `“Mujhe laga sab theek chal raha hai, par promotions hamesha skip ho jaate the…”\n\nJab Rahul ne apni Kundali report Dr. Btra se banwayi, tab samajh aaya ki 10th house par Shani ki drishti thi. Sirf 2 practical upaay follow kiye aur 6 months ke andar promotion mila.\n\nAap bhi apni life ka sahi disha nirdharit karein.`
        : `Last month, an agency was bleeding ₹15,000/day on Meta with a 1.2x ROAS.\n\nInstead of restructuring campaigns or increasing bids, we did one thing: swapped the opening 3 seconds with a problem-first UGC hook.\n\nIn 14 days, blended ROAS jumped to 3.8x. Here is the framework.`
    }
  ];

  // 3 Video UGC Scripts
  const scripts = isAstrology
    ? [
        {
          title: 'Script 1: Handheld Direct-To-Camera Doctor Breakdown',
          duration: '35 Seconds',
          breakdown: [
            { time: '0-3s (Hook)', visual: 'Dr. Ankiit Btra holding birth chart on camera with direct eye contact', audio: '“Aapka career aur shaadi kyu delay ho raha hai? Shayad aapke 7th house par dosh hai.”' },
            { time: '3-12s (Agitate)', visual: 'Cut to screen showing planetary transits and frustration text overlay', audio: '“90% log galat timing par decisions lete hain. Jab tak grah align nahi honge, tab tak mehnat ke bawajood results slow aate hain.”' },
            { time: '12-25s (Solution)', visual: 'Cut to PDF report preview and WhatsApp message from satisfied client', audio: '“Dr. Ankiit Btra ki Master Kundali Report mein hum aapko batate hain exact samay aur aasan upaay jo life ki rukaavato ko door karein.”' },
            { time: '25-35s (CTA)', visual: 'Screen recording showing 2-click booking form on smartphone', audio: `“Neeche diye gaye button par click karein aur apni personalized report sirf ${client.pricing || '₹499'} mein order karein.”` }
          ]
        },
        {
          title: 'Script 2: Relatable UGC Testimonial (Marriage Delay)',
          duration: '30 Seconds',
          breakdown: [
            { time: '0-3s (Hook)', visual: 'Young professional woman speaking directly to front-facing smartphone camera', audio: '“Meri shaadi 2 saal se baat bante bante ruk rahi thi jab tak maine yeh report nahi dekhi.”' },
            { time: '3-10s (Problem)', visual: 'Relatable sigh, showing matrimonial profile notifications', audio: '“Har rishta aakhri moment par cancel ho jaata tha. Family sab pareshan thi.”' },
            { time: '10-22s (Turning Point)', visual: 'Holding printed Kundali chart with highlighted remedies', audio: '“Dr. Btra ne bataya ki Mangal aur Saturn ka combination tha. Sirf simple daily remedies follow kiye.”' },
            { time: '22-30s (CTA)', visual: 'Happy smile, pointing down to CTA button with discount banner', audio: `“Agar aap bhi aisi situation face kar rahe hain, toh apni report abhi check karayein.”` }
          ]
        },
        {
          title: 'Script 3: Whiteboard Educational Angle (Career & Wealth)',
          duration: '40 Seconds',
          breakdown: [
            { time: '0-4s (Hook)', visual: 'Drawing 12 houses of Vedic Kundali on a clean acrylic whiteboard', audio: '“Agar aap 5 saal se hard work kar rahe hain par wealth accumulate nahi ho rahi, yeh 2nd house check karein.”' },
            { time: '4-15s (Insight)', visual: 'Pointing marker to 2nd house (Dhan) and 10th house (Karma)', audio: '“Vedic Jyotish mein karma aur labha ka balance hota hai. Agar labha sthan par shani ki drishti hai, toh income aati hai par tikti nahi.”' },
            { time: '15-28s (Remedy)', visual: 'Showing digital tablet with Kundali consultation details', audio: '“Is report mein hum aapke personalised graho ka analysis karke exact remedies provide karte hain.”' },
            { time: '28-40s (CTA)', visual: 'End card with verified trust badges and express delivery guarantee', audio: '“Order your report today on our official portal.”' }
          ]
        }
      ]
    : [
        {
          title: 'Script 1: Marketer Frustration to Live Ads Manager Fix',
          duration: '35 Seconds',
          breakdown: [
            { time: '0-3s (Hook)', visual: 'Media buyer rubbing forehead looking at laptop with red CPA metrics', audio: '“If your Meta CPA doubled this month, stop touching your bidding strategy.”' },
            { time: '3-12s (Agitate)', visual: 'Over-the-shoulder screen recording showing high CPM and low CTR', audio: '“In 90% of accounts we audit, the problem isn’t Broad vs Advantage+. It’s that your first 3 seconds don’t state a painful problem.”' },
            { time: '12-25s (Proof)', visual: 'Side-by-side split screen showing old ad vs winning problem-led hook', audio: `“We restructured ${client.businessName}’s opening angle and CPA plummeted by 38% in 14 days.”` },
            { time: '25-35s (CTA)', visual: 'Clicking button to open Performance Marketing Intelligence audit report', audio: `“Click below to run an autonomous audit on your ad account with ${client.name}.”` }
          ]
        },
        {
          title: 'Script 2: Whiteboard Unit Economics Teardown',
          duration: '30 Seconds',
          breakdown: [
            { time: '0-3s (Hook)', visual: 'Writing “₹1,200 CPA ➔ ₹380 CPA” in green and red marker on whiteboard', audio: '“This is how we cut acquisition costs by 68% for DTC brands.”' },
            { time: '3-12s (Method)', visual: 'Drawing simple funnel diagram: Hook ➔ LP Hero ➔ Offer Continuity', audio: '“Most brands test 50 different audiences. High-growth media buyers test 10 different hooks on the same winning offer.”' },
            { time: '12-22s (Breakthrough)', visual: 'Holding up smartphone playing high-retention UGC reel', audio: '“When the ad hook matches the exact above-the-fold headline on your landing page, conversion rate doubles.”' },
            { time: '22-30s (CTA)', visual: 'Pointing down to link with agency onboarding calendar', audio: '“Get our battle-tested creative playbook today.”' }
          ]
        },
        {
          title: 'Script 3: Native TikTok / Reels Fast-Paced Direct-Response',
          duration: '25 Seconds',
          breakdown: [
            { time: '0-3s (Hook)', visual: 'Fast zoom on phone screen showing notification sound and high ROAS', audio: '“Stop running static image ads on Meta in 2026. Here is what actually prints.”' },
            { time: '3-10s (Fast cuts)', visual: 'Rapid cuts: founder talking head, customer unboxing, live chat proof', audio: '“Raw, high-contrast video creative with bold on-screen text overlays.”' },
            { time: '10-18s (Value)', visual: 'Showing the 7-day action plan dashboard with clear P0 priorities', audio: `“Our diagnostic engine tears down your creatives second-by-second to eliminate budget bleed.”` },
            { time: '18-25s (CTA)', visual: 'Hand tapping button with instant access animation', audio: '“Tap below to analyze your funnel now.”' }
          ]
        }
      ];

  return (
    <div className="space-y-6">
      {/* Studio Header Banner */}
      <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold shadow-xs">
                <Wand2 className="w-5 h-5 text-[#e2f976]" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Creative Iteration Engine
              </span>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#e2f976] text-[#141517]">
                Trained On Winners
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#141517] tracking-tight">
              Ad Generator Studio for {client.name}
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Systematic creative expansions engineered from validated high-ROAS angles. 
              Copy direct-response hooks, headlines, primary copy blocks, and UGC scripts in 1 click.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenModal}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#141517] hover:bg-black text-[#e2f976] rounded-full text-xs font-black shadow-sm transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#e2f976]" />
              <span>Launch AI Prompt Generator</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-6 mt-6 border-t border-[#f4f5f2] overflow-x-auto">
          {[
            { id: 'all', label: 'All Creative Assets' },
            { id: 'hooks', label: `10 Hooks (${hooks.length})` },
            { id: 'headlines', label: `5 Headlines (${headlines.length})` },
            { id: 'primary', label: `Primary Copy (${primaryTexts.length})` },
            { id: 'scripts', label: `3 UGC Scripts (${scripts.length})` }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#141517] text-white shadow-xs'
                  : 'bg-[#f1f3ee] text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. 10 DIRECT-RESPONSE HOOKS */}
      {(activeCategory === 'all' || activeCategory === 'hooks') && (
        <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f4f5f2]">
            <div>
              <h3 className="text-sm font-extrabold text-[#141517] flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#141517]" />
                <span>10 Data-Backed Hook Variations (0–3s Feed Scroll-Stoppers)</span>
              </h3>
              <p className="text-xs text-slate-500">Categorized by psychological conversion mechanism</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">1-Click Copy</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {hooks.map((h, i) => {
              const isCopied = copiedKey === `hook-${i}`;
              return (
                <div
                  key={i}
                  className="bg-[#fbfcfb] border border-[#eef0ec] hover:border-slate-300 rounded-2xl p-4 transition flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#141517] text-[#e2f976]">
                        {h.type}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">Hook #{i + 1}</span>
                    </div>
                    <p className="text-xs font-bold text-[#141517] leading-relaxed">
                      {h.text}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#f4f5f2] flex justify-end">
                    <button
                      onClick={() => copyToClipboard(h.text, `hook-${i}`)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 border border-[#e4e7e0] rounded-lg text-[11px] font-bold text-slate-700 transition cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                      <span>{isCopied ? 'Copied!' : 'Copy Hook'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. 5 HIGH-IMPACT HEADLINES */}
      {(activeCategory === 'all' || activeCategory === 'headlines') && (
        <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f4f5f2]">
            <div>
              <h3 className="text-sm font-extrabold text-[#141517] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#141517]" />
                <span>5 High-Impact Ad Headlines (Direct-Response Optimized)</span>
              </h3>
              <p className="text-xs text-slate-500">Character-efficient titles designed for Meta feed and story placements</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">1-Click Copy</span>
          </div>

          <div className="space-y-3">
            {headlines.map((hl, i) => {
              const isCopied = copiedKey === `headline-${i}`;
              return (
                <div
                  key={i}
                  className="bg-[#fbfcfb] border border-[#eef0ec] hover:border-slate-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-[#141517] text-[#e2f976] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-xs font-bold text-[#141517] truncate">{hl}</span>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                    <span className="text-[10px] text-slate-400 font-medium">{hl.length} chars</span>
                    <button
                      onClick={() => copyToClipboard(hl, `headline-${i}`)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 border border-[#e4e7e0] rounded-lg text-[11px] font-bold text-slate-700 transition cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. PRIMARY COPY BLOCKS */}
      {(activeCategory === 'all' || activeCategory === 'primary') && (
        <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f4f5f2]">
            <div>
              <h3 className="text-sm font-extrabold text-[#141517] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#141517]" />
                <span>Primary Text Blocks (3 Battle-Tested Frameworks)</span>
              </h3>
              <p className="text-xs text-slate-500">From problem-agitate-solve to short punchy direct response</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Full Formatting Preserved</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {primaryTexts.map((pt, i) => {
              const isCopied = copiedKey === `primary-${i}`;
              return (
                <div
                  key={i}
                  className="bg-[#fbfcfb] border border-[#eef0ec] hover:border-slate-300 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                      {pt.label}
                    </span>
                    <div className="text-xs text-[#141517] leading-relaxed whitespace-pre-line font-medium bg-white p-3.5 rounded-xl border border-[#ecefec]">
                      {pt.text}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#f4f5f2] flex justify-end">
                    <button
                      onClick={() => copyToClipboard(pt.text, `primary-${i}`)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#141517] hover:bg-black text-[#e2f976] rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-[#e2f976]" /> : <Copy className="w-3.5 h-3.5 text-[#e2f976]" />}
                      <span>{isCopied ? 'Copied to Clipboard' : 'Copy Primary Copy'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. 3 COMPLETE UGC VIDEO SCRIPTS */}
      {(activeCategory === 'all' || activeCategory === 'scripts') && (
        <div className="bg-white border border-[#eef0ec] rounded-[32px] p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#f4f5f2]">
            <div>
              <h3 className="text-sm font-extrabold text-[#141517] flex items-center gap-2">
                <Video className="w-4 h-4 text-[#141517]" />
                <span>3 Complete Short-Form Video UGC Scripts (TikTok / Reels / Shorts)</span>
              </h3>
              <p className="text-xs text-slate-500">Second-by-second visual framing, on-screen text, and dialogue cues</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Creator-Ready</span>
          </div>

          <div className="space-y-6">
            {scripts.map((script, idx) => {
              const fullScriptText = script.breakdown.map((b) => `${b.time}\nVisual: ${b.visual}\nAudio: ${b.audio}`).join('\n\n');
              const isCopied = copiedKey === `script-${idx}`;
              return (
                <div
                  key={idx}
                  className="bg-[#fbfcfb] border border-[#eef0ec] rounded-2xl p-5 sm:p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ecefec]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-[#141517] text-[#e2f976] flex items-center justify-center font-extrabold text-xs">
                        #{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-[#141517]">{script.title}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{script.duration} Target Duration</span>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(fullScriptText, `script-${idx}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-[#e4e7e0] rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer self-start sm:self-auto"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{isCopied ? 'Script Copied!' : 'Copy Entire Script'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {script.breakdown.map((scene, sIdx) => (
                      <div
                        key={sIdx}
                        className="bg-white border border-[#ecefec] rounded-xl p-3.5 text-xs flex flex-col justify-between space-y-2 shadow-2xs"
                      >
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-black uppercase text-[#141517] bg-[#e2f976] px-2 py-0.5 rounded inline-block">
                            {scene.time}
                          </span>
                          <div className="text-[11px] text-slate-500 font-medium">
                            <strong className="text-slate-700 block text-[10px] uppercase font-bold">Visual Cue:</strong>
                            {scene.visual}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-[#f4f5f2]">
                          <strong className="text-slate-700 block text-[10px] uppercase font-bold">Voiceover:</strong>
                          <p className="text-[11px] font-bold text-[#141517] leading-relaxed">
                            {scene.audio}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
