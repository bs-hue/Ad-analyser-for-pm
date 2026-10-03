import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { ClientProfile, UnifiedAdRecord, AccountDiagnosisResult } from '@/lib/types';
import { runClaudePerformanceAnalysis } from '@/lib/claudeEngine';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  let body: any = null;
  try {
    body = await request.json();
  } catch (parseErr) {
    return NextResponse.json({ error: 'Invalid JSON request payload' }, { status: 400 });
  }

  const { client, records, creativeMap, lpAnalysis, dateRangeLabel } = (body || {}) as {
    client: ClientProfile;
    records: UnifiedAdRecord[];
    creativeMap: Record<string, any>;
    lpAnalysis: any;
    dateRangeLabel?: string;
  };

  if (!records || records.length === 0) {
    return NextResponse.json({ error: 'No ad records provided for diagnosis.' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback if no Gemini API key configured
  if (!apiKey) {
    const diagnosis = await runClaudePerformanceAnalysis(
      client,
      records,
      creativeMap || {},
      lpAnalysis || {},
      dateRangeLabel || 'Last 7 Days'
    );
    return NextResponse.json({ success: true, diagnosis, source: 'deterministic_engine' });
  }

  try {
    // Live Gemini AI Strategic Synthesis
    const ai = new GoogleGenAI({ apiKey });

    // Calculate core metrics deterministically first (Never let AI do basic arithmetic)
    const totalSpend = records.reduce((s, r) => s + (r.spend || 0), 0);
    const totalConversions = records.reduce((s, r) => s + (r.conversions || r.purchases || r.leads || 0), 0);
    const totalRevenue = records.reduce((s, r) => s + (r.revenue || 0), 0);
    const blendedRoas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0';
    const averageCpa = totalConversions > 0 ? (totalSpend / totalConversions).toFixed(2) : '0';

    const sortedBySpend = [...records].sort((a, b) => b.spend - a.spend);
    const topSpenders = sortedBySpend.slice(0, 4);
    const winners = records
      .filter((r) => (r.purchases || r.conversions || 0) > 0)
      .sort((a, b) => (b.roas || 0) - (a.roas || 0))
      .slice(0, 3);
    const zeroConvBleeders = records
      .filter((r) => (r.purchases || r.conversions || 0) === 0 && r.spend > 500)
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 3);

    const currencySymbol = client?.currency === 'USD' ? '$' : '₹';

    const prompt = `
You are a World-Class Performance Marketing Director & CRO Strategist.
Perform an in-depth, Full-Funnel Account Audit for:
- Client Name: "${client?.name || 'Client'}" (${client?.businessName || ''})
- Product / Service: "${client?.productService || 'Direct Response Offer'}"
- Front-End Offer / Pricing: "${client?.pricing || client?.mainOffer || 'Product Offer'}"
- Target Audience: "${client?.targetAudience || 'Target Audience'}"
- Landing Page URL: "${client?.website || ''}"
- Past Historical Learnings: ${JSON.stringify(client?.pastLearnings || [])}

ACCOUNT PERFORMANCE DATA (Pre-calculated deterministically):
- Total Spend: ${currencySymbol}${totalSpend.toLocaleString()}
- Total Conversions: ${totalConversions}
- Blended ROAS: ${blendedRoas}x
- Average CPA: ${currencySymbol}${averageCpa}
- Time Window: ${dateRangeLabel || 'Last 7 Days'}

TOP ACTIVE ADS:
${topSpenders.map((a) => `• "${a.adName}" [${a.creativeId || a.adId}]: Spend ${currencySymbol}${a.spend}, Sales: ${a.purchases || a.conversions}, CPA: ${currencySymbol}${a.cpa}, CTR: ${a.ctr}%, ROAS: ${a.roas}x`).join('\n')}

TOP ROAS WINNERS:
${winners.map((a) => `• "${a.adName}": Spend ${currencySymbol}${a.spend}, Sales: ${a.purchases || a.conversions}, CPA: ${currencySymbol}${a.cpa}, ROAS: ${a.roas}x`).join('\n')}

ZERO-CONVERSION BUDGET BLEEDERS:
${zeroConvBleeders.map((a) => `• "${a.adName}": Spend ${currencySymbol}${a.spend} with 0 conversions`).join('\n')}

INSTRUCTIONS:
1. Identify the 2 biggest Winning Creative Patterns (Hook angle, visual style).
2. Identify the 2 critical Patterns to Avoid (e.g. Budget Bleeders, Message mismatch, fatigue).
3. Create a 5-step prioritized 7-Day Action Plan:
   - P0 (Immediate): Cut burning ads with 0 sales and fix landing page leaks.
   - P1 (Test): Hook-Swap variations on high-spend fatigue stacks.
   - P2 (Explore): Scaling breakout winners with new creative formats.
4. Output 10 high-converting Direct-Response Hook scripts tailored directly to "${client?.productService || 'Offer'}" and "${client?.name || 'Brand'}".

OUTPUT FORMAT:
Return a JSON object strictly matching this structure (no markdown, no code fences):
{
  "executiveSummary": [
    "Observation 1 on account health...",
    "Observation 2 on top winning ads...",
    "Observation 3 on wasted spend...",
    "Observation 4 on immediate scaling priority..."
  ],
  "winningPatterns": [
    {
      "id": "win-1",
      "title": "Title of winning pattern",
      "type": "Hook",
      "frequency": "Appeared in top winning ads",
      "averageRoas": ${winners[0]?.roas || 1.88},
      "averageCpa": ${winners[0]?.cpa || 265},
      "patternDescription": "Why it converts...",
      "exampleAdIds": ["${winners[0]?.adId || 'ad_1'}"],
      "newHooks": ["Hook 1", "Hook 2", "Hook 3", "Hook 4", "Hook 5"],
      "newPrimaryTexts": ["Copy 1", "Copy 2", "Copy 3"],
      "newHeadlines": ["Headline 1", "Headline 2", "Headline 3"],
      "newCtas": ["Order Now", "Get Report"],
      "newCreativeConcepts": ["Concept 1", "Concept 2"],
      "newUgcConcepts": ["UGC script 1"],
      "newVideoConcepts": ["Video concept 1"]
    }
  ],
  "patternsToAvoid": [
    {
      "id": "avoid-1",
      "patternName": "Zero Conversion Budget Bleeders",
      "category": "Creative",
      "occurrenceCount": ${zeroConvBleeders.length || 1},
      "evidenceExplanation": "Explanation citing real ads...",
      "adExamples": ["${zeroConvBleeders[0]?.adId || 'ad_bleed'}"],
      "actionableAvoidRule": "Rule to never repeat..."
    }
  ],
  "next7DaysPlan": [
    {
      "id": "act-1",
      "priority": "PRIORITY 1 - Immediate",
      "title": "Pause Zero-Converting Spenders",
      "category": "Budget/Scaling",
      "action": "Pause ads that have spent >1.5x target CPA without sales...",
      "why": "Stops capital destruction...",
      "supportingEvidence": "Citing exact spend and CPA numbers...",
      "kpi": "Account CPA",
      "expectedLearning": "Immediately restores blended ROAS"
    }
  ],
  "generatedAds": [
    {
      "hook": "Hook script 1",
      "primaryText": "Primary text block...",
      "headline": "Headline...",
      "cta": "Order Now",
      "creativeConcept": "Visual concept description...",
      "videoScript": "Second by second video script..."
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const responseText = response.text || '{}';
    const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const aiOutput = JSON.parse(cleanJson);

    // Merge AI insights with deterministic funnel and classified tiers
    const baseDiagnosis = await runClaudePerformanceAnalysis(
      client,
      records,
      creativeMap || {},
      lpAnalysis || {},
      dateRangeLabel || 'Last 7 Days'
    );

    const finalDiagnosis: AccountDiagnosisResult = {
      ...baseDiagnosis,
      executiveSummary: aiOutput.executiveSummary || baseDiagnosis.executiveSummary,
      winningPatterns: aiOutput.winningPatterns?.length ? aiOutput.winningPatterns : baseDiagnosis.winningPatterns,
      patternsToAvoid: aiOutput.patternsToAvoid?.length ? aiOutput.patternsToAvoid : baseDiagnosis.patternsToAvoid,
      next7DaysPlan: aiOutput.next7DaysPlan?.length ? aiOutput.next7DaysPlan : baseDiagnosis.next7DaysPlan,
      generatedAds: aiOutput.generatedAds?.length ? aiOutput.generatedAds : baseDiagnosis.generatedAds
    };

    return NextResponse.json({
      success: true,
      diagnosis: finalDiagnosis,
      source: 'gemini_2.5_flash_live'
    });
  } catch (error: any) {
    console.warn('Gemini live diagnosis fallback to deterministic engine:', error);
    // Graceful fallback to deterministic engine on any API error or quota issue
    const diagnosis = await runClaudePerformanceAnalysis(
      client,
      records,
      creativeMap || {},
      lpAnalysis || {},
      dateRangeLabel || 'Last 7 Days'
    );
    return NextResponse.json({ success: true, diagnosis, source: 'fallback_engine' });
  }
}
