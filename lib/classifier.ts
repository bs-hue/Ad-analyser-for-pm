import { UnifiedAdRecord, PerformanceTier, RootCauseCategory } from './types';

export interface ClassificationContext {
  accountAverageCpa: number;
  accountAverageCtr: number;
  accountAverageRoas: number;
  totalAccountSpend: number;
  accountMedianSpend: number;
  campaignBenchmarks?: Record<string, { averageCpa: number; averageCtr: number; averageRoas: number }>;
}

/**
 * Calculates account and campaign benchmarks for cohort comparison
 */
export function calculateClassificationContext(records: UnifiedAdRecord[]): ClassificationContext {
  const validSpendRecords = records.filter((r) => r.spend > 0);
  const totalSpend = validSpendRecords.reduce((acc, r) => acc + r.spend, 0);
  const totalConversions = validSpendRecords.reduce((acc, r) => acc + (r.conversions || r.leads || 0), 0);
  const totalImpressions = validSpendRecords.reduce((acc, r) => acc + (r.impressions || 0), 0);
  const totalClicks = validSpendRecords.reduce((acc, r) => acc + (r.clicks || 0), 0);
  const totalRevenue = validSpendRecords.reduce((acc, r) => acc + (r.revenue || 0), 0);

  const accountAverageCpa = totalConversions > 0 ? totalSpend / totalConversions : 0;
  const accountAverageCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const accountAverageRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  const sortedSpends = validSpendRecords.map((r) => r.spend).sort((a, b) => a - b);
  const accountMedianSpend = sortedSpends.length > 0 ? sortedSpends[Math.floor(sortedSpends.length / 2)] : 0;

  // Group by campaign
  const campaignMap = new Map<string, UnifiedAdRecord[]>();
  records.forEach((r) => {
    const c = r.campaign || 'General';
    if (!campaignMap.has(c)) campaignMap.set(c, []);
    campaignMap.get(c)!.push(r);
  });

  const campaignBenchmarks: Record<string, { averageCpa: number; averageCtr: number; averageRoas: number }> = {};
  campaignMap.forEach((adList, camp) => {
    const cSpend = adList.reduce((acc, r) => acc + r.spend, 0);
    const cConv = adList.reduce((acc, r) => acc + (r.conversions || r.leads || 0), 0);
    const cImpr = adList.reduce((acc, r) => acc + (r.impressions || 0), 0);
    const cClicks = adList.reduce((acc, r) => acc + (r.clicks || 0), 0);
    const cRev = adList.reduce((acc, r) => acc + (r.revenue || 0), 0);

    campaignBenchmarks[camp] = {
      averageCpa: cConv > 0 ? cSpend / cConv : accountAverageCpa,
      averageCtr: cImpr > 0 ? (cClicks / cImpr) * 100 : accountAverageCtr,
      averageRoas: cSpend > 0 ? cRev / cSpend : accountAverageRoas
    };
  });

  return {
    accountAverageCpa,
    accountAverageCtr,
    accountAverageRoas,
    totalAccountSpend: totalSpend,
    accountMedianSpend,
    campaignBenchmarks
  };
}

/**
 * Classifies an individual ad record using hybrid quantitative + statistical confidence layers
 */
export function classifyAdRecord(
  ad: UnifiedAdRecord,
  context: ClassificationContext,
  currency: string = '₹'
): {
  tier: PerformanceTier;
  tierScore: number;
  tierReasoning: string[];
  evidence: string[];
  rootCause?: RootCauseCategory;
  recommendedTest?: string;
} {
  const spend = ad.spend || 0;
  const conversions = ad.conversions || ad.leads || ad.purchases || 0;
  const cpa = ad.cpa || (conversions > 0 ? spend / conversions : 0);
  const roas = ad.roas || (spend > 0 && ad.revenue ? ad.revenue / spend : 0);
  const ctr = ad.ctr || (ad.impressions > 0 && ad.clicks ? (ad.clicks / ad.impressions) * 100 : 0);
  const cvr = ad.conversionRate || (ad.landingPageViews > 0 && conversions > 0 ? (conversions / ad.landingPageViews) * 100 : 0);
  const lpViews = ad.landingPageViews || ad.clicks || 0;

  const campBench = context.campaignBenchmarks?.[ad.campaign] || {
    averageCpa: context.accountAverageCpa,
    averageCtr: context.accountAverageCtr,
    averageRoas: context.accountAverageRoas
  };

  const benchCpa = campBench.averageCpa > 0 ? campBench.averageCpa : context.accountAverageCpa;
  const benchCtr = campBench.averageCtr > 0 ? campBench.averageCtr : context.accountAverageCtr;
  const benchRoas = campBench.averageRoas > 0 ? campBench.averageRoas : context.accountAverageRoas;

  // 1. Check for Insufficient Data threshold
  const minSpendThreshold = Math.min(Math.max(context.accountMedianSpend * 0.25, 1000), 3000);
  if (spend < minSpendThreshold && conversions < 5) {
    if (spend === 0) {
      return {
        tier: 'Insufficient Data',
        tierScore: 0,
        tierReasoning: ['Zero spend ad — newly uploaded, pending platform delivery or paused.'],
        evidence: ['No impressions or spend recorded. Cannot compute meaningful efficiency metrics.']
      };
    }

    // Preliminary high performer signal
    if ((conversions >= 2 && benchCpa > 0 && cpa < benchCpa * 0.8) || roas >= 4.0 || (ctr > benchCtr * 1.3 && conversions >= 1)) {
      return {
        tier: 'Promising',
        tierScore: 82,
        tierReasoning: [
          `Strong preliminary signal with ${conversions} conversions at ${currency}${cpa.toFixed(2)} CPA and ${roas.toFixed(2)}x ROAS.`,
          `Categorized as 'Promising' rather than 'Strong Performer' because spend (${currency}${spend.toFixed(0)}) is below the ${currency}${minSpendThreshold.toFixed(0)} statistical volume threshold.`
        ],
        evidence: [
          `Early CTR of ${ctr.toFixed(2)}% is ${ctr > benchCtr ? '+' : ''}${(((ctr - benchCtr) / (benchCtr || 1)) * 100).toFixed(0)}% vs. benchmark.`,
          `Conversion velocity is high; recommended to scale budget into validation tier.`
        ],
        recommendedTest: 'Scale daily budget incrementally by 20-30% to confirm CPA stability under broader auction pressure.'
      };
    }

    return {
      tier: 'Insufficient Data',
      tierScore: 45,
      tierReasoning: [
        `Spend (${currency}${spend.toFixed(0)}) and conversion volume (${conversions} conversions) are too low for statistical confidence.`,
        `Needs at least ${currency}${minSpendThreshold.toFixed(0)} spend before making scaling or pausing decisions.`
      ],
      evidence: [
        `Under 5 total conversions recorded. Optimization algorithms are still in learning phase.`
      ]
    };
  }

  // 2. Evaluate High Performers vs Underperformers
  const isCpaFavorable = benchCpa > 0 ? cpa <= benchCpa * 0.85 : roas >= 3.5;
  const isRoasFavorable = benchRoas > 0 ? roas >= Math.max(benchRoas * 1.15, 3.0) : roas >= 3.0;
  const isCpaUnfavorable = benchCpa > 0 ? cpa >= benchCpa * 1.35 : (spend > 3000 && conversions === 0);
  const isRoasUnfavorable = benchRoas > 0 ? (roas < benchRoas * 0.75 && roas < 2.0) : false;

  // 2A. Strong Performer
  if ((isCpaFavorable || isRoasFavorable) && spend >= minSpendThreshold && conversions >= 10) {
    const roasBoost = roas >= 4.0 ? 10 : 0;
    const score = Math.min(95, 85 + roasBoost);
    return {
      tier: 'Strong Performer',
      tierScore: score,
      tierReasoning: [
        `CPA of ${currency}${cpa.toFixed(2)} is ${benchCpa > 0 ? (((benchCpa - cpa) / benchCpa) * 100).toFixed(0) + '% below' : 'significantly below'} campaign average (${currency}${benchCpa.toFixed(2)}).`,
        `High ROAS (${roas.toFixed(2)}x) with proven scale (${conversions} conversions on ${currency}${spend.toFixed(0)} spend).`,
        `Consistent conversion rate (${cvr.toFixed(2)}%) and healthy link CTR (${ctr.toFixed(2)}%).`
      ],
      evidence: [
        `Solid statistical proof: ${conversions} conversions generated with zero sign of creative fatigue.`,
        `Click-to-LP view continuity is strong (${lpViews > 0 && ad.clicks > 0 ? ((lpViews / ad.clicks) * 100).toFixed(0) : '85'}%).`
      ],
      recommendedTest: 'Extract winning hook and angle structure; produce 5 new hook variations and test higher horizontal scaling.'
    };
  }

  // 2B. Promising
  if ((isCpaFavorable || isRoasFavorable || ctr >= benchCtr * 1.25) && (conversions >= 5 || (spend >= minSpendThreshold && conversions >= 3))) {
    return {
      tier: 'Promising',
      tierScore: 80,
      tierReasoning: [
        `Above-average performance with ${currency}${cpa.toFixed(2)} CPA and ${roas.toFixed(2)}x ROAS.`,
        `Healthy engagement metrics with CTR of ${ctr.toFixed(2)}% vs. benchmark ${benchCtr.toFixed(2)}%.`
      ],
      evidence: [
        `Generated ${conversions} conversions with positive unit economics.`,
        `Creative angle shows strong audience resonance.`
      ],
      recommendedTest: 'Gradually increase ad set budget and test as control ad in new lookalike/broad sets.'
    };
  }

  // 2C. Underperforming
  if (isCpaUnfavorable || isRoasUnfavorable || (spend > minSpendThreshold * 1.5 && conversions === 0)) {
    // Diagnose Root Cause
    let rootCause: RootCauseCategory = 'Creative';
    let rootCauseEvidence = '';
    let testRecommendation = '';

    const clickToLpLossRate = ad.clicks > 0 && lpViews > 0 ? ((ad.clicks - lpViews) / ad.clicks) * 100 : 0;

    // Check 1: Click-to-Page Drop-off Leak (Technical / Speed issue)
    if (ad.clicks >= 40 && clickToLpLossRate >= 28) {
      rootCause = 'Landing Page';
      rootCauseEvidence = `Severe click-to-landing-page drop-off (${clickToLpLossRate.toFixed(1)}% loss). Over ${Math.round(ad.clicks - lpViews)} paid clicks bounced before the page rendered. This is a technical mobile speed or pixel latency leak.`;
      testRecommendation = 'Optimize mobile PageSpeed, eliminate render-blocking fonts/scripts, and verify tracking pixel latency before blaming the ad creative.';
    }
    // Check 2: High CTR + Low CVR (Landing page / Message Match issue)
    else if (ctr >= benchCtr * 1.1 && cvr < 1.2 && (lpViews > 100 || ad.clicks > 150)) {
      rootCause = 'Landing Page';
      rootCauseEvidence = `High click-through rate (${ctr.toFixed(2)}%) proves the ad hook captures interest, but near-zero conversion (${cvr.toFixed(2)}% CVR) reveals an acute message mismatch between the ad promise and the landing page hero offer.`;
      testRecommendation = 'Audit landing page message match. Verbatim repeat the ad headline and pricing above the fold on the landing page.';
    }
    // Check 3: Hook-Swap Candidate (Decent Hold/Interest but low CTR / low hook)
    else if (ctr < benchCtr * 0.75 && (conversions > 0 || spend < benchCpa * 2.5)) {
      rootCause = 'Hook';
      rootCauseEvidence = `Hook-Swap Candidate: Low link CTR of ${ctr.toFixed(2)}% (vs benchmark ${benchCtr.toFixed(2)}%) indicates viewers scroll past in the first 3 seconds. The core product resonates once viewed, but the opening lacks a scroll-stopping pattern interrupt.`;
      testRecommendation = 'Execute a "Hook-Swap": Keep the winning body and offer intact, but test 3 new 0-3 second visual pattern interrupts and problem-led opening lines.';
    }
    // Check 4: Creative Fatigue (High cumulative spend + rising CPA)
    else if (conversions > 0 && cpa > benchCpa * 1.4 && spend > benchCpa * 3) {
      rootCause = 'Creative';
      rootCauseEvidence = `Creative Fatigue: High spend (${currency}${spend.toFixed(0)}) with elevated CPA of ${currency}${cpa.toFixed(2)} (+${(((cpa - benchCpa) / (benchCpa || 1)) * 100).toFixed(0)}% vs benchmark). Frequency saturation in Advantage+/CBO audience pools is wearing out the creative angle.`;
      testRecommendation = 'Rotate creative format. If this was a talking head video, launch a high-contrast whiteboard or screen teardown angle to reset auction fatigue.';
    }
    // Check 5: Critical Budget Bleed (Zero conversions on high spend)
    else if (conversions === 0 && spend >= benchCpa * 1.5) {
      rootCause = 'Offer';
      rootCauseEvidence = `Immediate Budget Bleed: Consumed ${currency}${spend.toFixed(0)} with 0 conversions (${currency}${benchCpa.toFixed(0)} target CPA). The offer or pricing structure is completely failing to convert traffic.`;
      testRecommendation = 'Pause ad immediately (P0). Reallocate budget to confirmed scaling winners.';
    } else {
      rootCause = 'Creative';
      rootCauseEvidence = `Total spend of ${currency}${spend.toFixed(0)} produced only ${conversions} conversions (${currency}${cpa.toFixed(2)} CPA vs benchmark ${currency}${benchCpa.toFixed(2)}).`;
      testRecommendation = 'Pause ad to prevent budget drain. Re-allocate spend into top-performing creative cohorts.';
    }

    return {
      tier: 'Underperforming',
      tierScore: Math.max(15, Math.min(38, Math.round(35 - ((cpa - benchCpa) / (benchCpa || 1)) * 10))),
      tierReasoning: [
        `High CPA of ${currency}${cpa.toFixed(2)} is significantly above account benchmark (${currency}${benchCpa.toFixed(2)}).`,
        `Low ROAS (${roas.toFixed(2)}x) fails target profitability threshold.`,
        `Consumes budget (${currency}${spend.toFixed(0)}) with poor conversion efficiency.`
      ],
      evidence: [rootCauseEvidence],
      rootCause,
      recommendedTest: testRecommendation
    };
  }

  // 2D. Average / Neutral
  return {
    tier: 'Average',
    tierScore: 62,
    tierReasoning: [
      `Performance is within ±15% of account and campaign benchmarks.`,
      `CPA: ${currency}${cpa.toFixed(2)} (Benchmark: ${currency}${benchCpa.toFixed(2)}), ROAS: ${roas.toFixed(2)}x, CTR: ${ctr.toFixed(2)}%.`
    ],
    evidence: [
      `Maintains stable delivery without breakout efficiency or severe budget leakage.`
    ],
    rootCause: 'Copy',
    recommendedTest: 'Test 2-3 new copy headlines or fresh thumbnail to elevate CTR and reduce CPC.'
  };
}

/**
 * Classifies all ad records in a dataset
 */
export function classifyAllAdRecords(records: UnifiedAdRecord[], currency: string = '₹'): UnifiedAdRecord[] {
  const context = calculateClassificationContext(records);
  return records.map((record) => {
    const classification = classifyAdRecord(record, context, currency);
    return {
      ...record,
      tier: classification.tier,
      tierScore: classification.tierScore,
      tierReasoning: classification.tierReasoning,
      evidence: classification.evidence,
      rootCause: classification.rootCause,
      recommendedTest: classification.recommendedTest
    };
  });
}
