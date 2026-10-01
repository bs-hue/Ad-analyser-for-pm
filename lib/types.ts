export type PerformanceTier = 'Strong Performer' | 'Promising' | 'Average' | 'Underperforming' | 'Insufficient Data';

export type RootCauseCategory = 
  | 'Hook' 
  | 'Creative' 
  | 'Copy' 
  | 'Offer' 
  | 'Audience' 
  | 'Landing Page' 
  | 'Conversion' 
  | 'Funnel';

export interface UnifiedAdRecord {
  clientId: string;
  platform: 'meta' | 'manual' | 'google_sheet';
  account: string;
  campaign: string;
  adSet: string;
  adName: string;
  adId: string;
  date: string;
  objective: 'LEADS' | 'SALES' | 'CONVERSIONS' | 'TRAFFIC' | 'ENGAGEMENT';
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number; // in percentage (e.g. 2.4%)
  cpc: number;
  cpm: number;
  landingPageViews: number;
  leads: number;
  purchases: number;
  conversions: number;
  conversionRate: number; // in percentage
  cpl: number;
  cpa: number;
  revenue: number;
  roas: number;
  primaryText: string;
  headline: string;
  description: string;
  cta: string;
  creativeId?: string;
  creativeUrl?: string;
  driveUrl?: string;
  landingPageUrl?: string;
  
  // Classification & Diagnostics calculated
  tier?: PerformanceTier;
  tierScore?: number;
  tierReasoning?: string[];
  evidence?: string[];
  rootCause?: RootCauseCategory;
  recommendedTest?: string;
}

export interface CreativeIntelligence {
  adId: string;
  adName: string;
  creativeType: 'video' | 'image';
  format: 'UGC' | 'Talking Head' | 'Founder' | 'Testimonial' | 'Product Demonstration' | 'Before/After' | 'Motion Graphic' | 'Screen Recording' | 'Static High-Contrast' | 'Carousel/Infographic';
  durationSeconds?: number;
  hookType: 'Problem-led' | 'Curiosity' | 'Contrarian' | 'Direct Offer' | 'Story/Testimonial' | 'Stats/Proof' | 'Visual Shock';
  hookFirst3Seconds: string;
  mainAngle: 'pain_point' | 'desire' | 'objection_handling' | 'social_proof' | 'urgency_pricing';
  audiencePainPoint: string;
  promise: string;
  offer: string;
  cta: string;
  speaker: boolean;
  textOverlay: boolean;
  pacing: 'Fast' | 'Moderate' | 'Deliberate';
  productRevealSeconds: number;
  creativeStrengths: string[];
  creativeWeaknesses: string[];
  transcript?: string;
  visualHierarchyScore: number; // 1-10
  headlineClarityScore: number; // 1-10
  driveUrlStatus: 'public_accessible' | 'permission_required' | 'not_provided';
  thumbnailUrl?: string;
}

export interface LandingPageAnalysis {
  url: string;
  headline: string;
  subheadline: string;
  mainOffer: string;
  cta: string;
  aboveFoldClarityScore: number; // 1-10
  benefitsIdentified: string[];
  proofElements: string[];
  objectionsAddressed: string[];
  formFrictionScore: 'Low' | 'Medium' | 'High';
  messageMatchScore: number; // 1-10
  messageMatchFeedback: string;
  alignmentChain: {
    adHook: string;
    adPromise: string;
    lpHeadline: string;
    lpOffer: string;
    conversionFriction: string;
  };
  recommendedCROFixes: string[];
}

export interface FunnelStage {
  name: 'Impressions' | 'Clicks' | 'Landing Page Views' | 'Leads / Carts' | 'Purchases / Conversions' | 'Revenue';
  count: number;
  rateFromPrevious: number; // percentage
  benchmarkRate: number;
  status: 'Healthy' | 'Warning' | 'Bottleneck';
  diagnosis: string;
  suggestedFix: string;
}

export interface ActionPlanItem {
  id: string;
  priority: 'PRIORITY 1 - Immediate' | 'PRIORITY 2 - Test' | 'PRIORITY 3 - Explore';
  title: string;
  action: string;
  why: string;
  supportingEvidence: string;
  kpi: string;
  expectedLearning: string;
  category: 'Creative' | 'Copy' | 'Landing Page' | 'Budget/Scaling' | 'Audience';
}

export interface WinningPattern {
  id: string;
  title: string;
  type: 'Hook' | 'Angle' | 'Visual Style' | 'Offer Framing' | 'Copy Structure';
  frequency: string;
  averageRoas: number;
  averageCpa: number;
  patternDescription: string;
  exampleAdIds: string[];
  newHooks: string[]; // 5 variations
  newPrimaryTexts: string[]; // 3 variations
  newHeadlines: string[]; // 3 variations
  newCtas: string[]; // 3 variations
  newCreativeConcepts: string[]; // 5 variations
  newUgcConcepts: string[]; // 2 variations
  newVideoConcepts: string[]; // 2 variations
}

export interface AvoidPattern {
  id: string;
  patternName: string;
  category: RootCauseCategory;
  occurrenceCount: number;
  evidenceExplanation: string;
  adExamples: string[];
  actionableAvoidRule: string;
}

export interface ExperimentItem {
  id: string;
  clientId: string;
  title: string;
  hypothesis: string;
  variable: 'Hook' | 'Visual Format' | 'Headline' | 'LP Headline' | 'Offer Framing' | 'Audience' | 'CTA';
  kpi: 'CTR' | 'CPL' | 'CPA' | 'ROAS' | 'Conversion Rate';
  status: 'Planned' | 'Running' | 'Completed' | 'Winner' | 'Loser' | 'Needs Review';
  baselineMetric: string;
  targetMetric: string;
  currentResult?: string;
  startDate: string;
  learnings?: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  businessName: string;
  website: string;
  productService: string;
  mainOffer: string;
  targetAudience: string;
  geography: string;
  usp: string;
  painPoints: string[];
  desires: string[];
  customerObjections: string[];
  competitors: string[];
  brandTone: string;
  approvedClaims: string[];
  restrictedClaims: string[];
  metaConnected: boolean;
  metaAccountId?: string;
  lastAnalysisDate: string;
  activeExperimentsCount: number;
  currency: string;
}

export interface HistoricalAnalysisRun {
  id: string;
  clientId: string;
  timestamp: string;
  dateRangeLabel: string;
  totalSpend: number;
  totalRevenue: number;
  roas: number;
  totalConversions: number;
  topWinningHook: string;
  keyFinding: string;
  winningPatternsCount: number;
  experimentsLaunched: number;
}

export interface AccountDiagnosisResult {
  clientId: string;
  generatedAt: string;
  dateRange: string;
  summary: {
    totalSpend: number;
    totalRevenue: number;
    blendedRoas: number;
    totalImpressions: number;
    totalClicks: number;
    averageCtr: number;
    averageCpc: number;
    averageCpm: number;
    totalLeads: number;
    averageCpl: number;
    totalPurchases: number;
    totalConversions: number;
    averageCpa: number;
    conversionRate: number;
    strongPerformersCount: number;
    promisingCount: number;
    underperformingCount: number;
    insufficientDataCount: number;
  };
  executiveSummary: string[];
  records: UnifiedAdRecord[];
  creativeIntelligence: Record<string, CreativeIntelligence>;
  landingPageAnalysis: LandingPageAnalysis;
  funnelStages: FunnelStage[];
  winningPatterns: WinningPattern[];
  underperformingDiagnosis: {
    adId: string;
    adName: string;
    spend: number;
    cpa: number;
    ctr: number;
    possibleIssue: RootCauseCategory;
    evidence: string;
    recommendedTest: string;
  }[];
  patternsToAvoid: AvoidPattern[];
  next7DaysPlan: ActionPlanItem[];
  generatedAds: {
    hook: string;
    primaryText: string;
    headline: string;
    cta: string;
    creativeConcept: string;
    videoScript: string;
  }[];
}

export interface ColumnMappingState {
  [uploadedColumn: string]: keyof UnifiedAdRecord | 'ignore';
}

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  affectedCount?: number;
  affectedAds?: string[];
}
