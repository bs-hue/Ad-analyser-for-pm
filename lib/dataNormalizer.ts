import { UnifiedAdRecord, ColumnMappingState, ClientProfile, AgencyAuditWorkbookResult, AgencyAuditPeriod } from './types';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface SpreadsheetParseOutput {
  headers: string[];
  rows: Record<string, any>[];
  agencyWorkbook?: AgencyAuditWorkbookResult;
}

// Canonical schema keys for mapping
export const CANONICAL_FIELD_LABELS: Record<keyof UnifiedAdRecord, string> = {
  clientId: 'Client ID',
  platform: 'Platform',
  account: 'Account Name',
  campaign: 'Campaign Name',
  adSet: 'Ad Set Name',
  adName: 'Ad Name',
  adId: 'Ad ID',
  date: 'Date / Period',
  objective: 'Objective',
  spend: 'Amount Spent (Spend)',
  impressions: 'Impressions',
  reach: 'Reach',
  clicks: 'Link / Outbound Clicks',
  ctr: 'Link CTR (%)',
  cpc: 'Cost Per Click (CPC)',
  cpm: 'CPM',
  landingPageViews: 'Landing Page Views',
  leads: 'Leads',
  purchases: 'Purchases',
  conversions: 'Conversions / Results',
  conversionRate: 'Conversion Rate (%)',
  cpl: 'Cost Per Lead (CPL)',
  cpa: 'Cost Per Acquisition (CPA / Cost Per Result)',
  revenue: 'Revenue / Purchase Value',
  roas: 'ROAS (Return on Ad Spend)',
  primaryText: 'Primary Text / Ad Copy',
  headline: 'Headline',
  description: 'Description',
  cta: 'Call To Action (CTA)',
  creativeId: 'Creative ID',
  creativeUrl: 'Creative Asset URL',
  driveUrl: 'Google Drive Creative Link',
  landingPageUrl: 'Landing Page URL',
  tier: 'Performance Tier',
  tierScore: 'Tier Score',
  tierReasoning: 'Tier Reasoning',
  evidence: 'Evidence',
  rootCause: 'Root Cause Category',
  recommendedTest: 'Recommended Test',
  localMediaUrl: 'Local Media URL',
  localMediaType: 'Local Media Type',
  localFileName: 'Local File Name'
};

// Aliases for intelligent auto-detection
const COLUMN_ALIASES: Record<keyof UnifiedAdRecord, string[]> = {
  spend: ['amount spent', 'spend', 'cost', 'total spend', 'spent (inr)', 'spent (usd)', 'spent', 'investment'],
  impressions: ['impressions', 'impr', 'views'],
  reach: ['reach', 'unique users', 'people reached'],
  clicks: ['link clicks', 'clicks (all)', 'clicks', 'outbound clicks', 'inline link clicks'],
  ctr: ['ctr (link click-through rate)', 'ctr', 'link ctr', 'ctr (all)', 'click-through rate'],
  cpc: ['cpc (cost per link click)', 'cpc', 'cost per click', 'avg cpc'],
  cpm: ['cpm (cost per 1,000 impressions)', 'cpm', 'cost per mille'],
  landingPageViews: ['landing page views', 'lp views', 'page views', 'sessions'],
  leads: ['leads', 'lead', 'meta leads', 'on-facebook leads', 'crm leads'],
  purchases: ['purchases', 'orders', 'sales', 'conversions (purchases)'],
  conversions: ['results', 'conversions', 'total conversions', 'actions', 'key events'],
  conversionRate: ['conversion rate', 'cvr', 'cvr (%)', 'result rate'],
  cpl: ['cost per lead', 'cpl', 'cost/lead'],
  cpa: ['cost per result', 'cpa', 'cost per acquisition', 'cost per action', 'cost/result'],
  revenue: ['purchase roas value', 'revenue', 'conversion value', 'purchase conversion value', 'total revenue'],
  roas: ['purchase roas', 'roas', 'return on ad spend', 'website purchase roas'],
  adName: ['ad name', 'ad', 'creative name', 'ad title', 'variation'],
  adId: ['ad id', 'adid', 'creative id', 'meta ad id'],
  campaign: ['campaign name', 'campaign', 'campaign_name'],
  adSet: ['ad set name', 'adset name', 'ad set', 'adset', 'adset_name'],
  account: ['account name', 'ad account', 'account'],
  primaryText: ['primary text', 'ad copy', 'body copy', 'text', 'ad text', 'copy'],
  headline: ['headline', 'title', 'ad headline', 'link headline'],
  description: ['description', 'subheadline', 'link description'],
  cta: ['call to action', 'cta', 'button label', 'cta button'],
  driveUrl: ['drive url', 'google drive link', 'drive link', 'creative drive url', 'asset link', 'creative url', 'video link', 'creative_url'],
  creativeUrl: ['creative url', 'image url', 'video url', 'preview link', 'thumbnail url'],
  landingPageUrl: ['landing page url', 'destination url', 'website url', 'lp url', 'link url', 'final url'],
  date: ['reporting starts', 'date', 'day', 'time', 'period', 'date range'],
  objective: ['objective', 'campaign objective', 'goal'],
  clientId: ['client id', 'client'],
  platform: ['platform', 'source', 'channel'],
  creativeId: ['creative id', 'creative_id'],
  tier: [],
  tierScore: [],
  tierReasoning: [],
  evidence: [],
  rootCause: [],
  recommendedTest: [],
  localMediaUrl: [],
  localMediaType: [],
  localFileName: []
};

export function autoDetectColumnMapping(headers: string[]): ColumnMappingState {
  const mapping: ColumnMappingState = {};

  headers.forEach((header) => {
    const cleanHeader = header.trim().toLowerCase().replace(/[_-]/g, ' ');
    let matchedField: keyof UnifiedAdRecord | 'ignore' = 'ignore';

    for (const [canonicalKey, aliases] of Object.entries(COLUMN_ALIASES)) {
      const key = canonicalKey as keyof UnifiedAdRecord;
      if (cleanHeader === key.toLowerCase() || aliases.some((alias) => cleanHeader === alias || cleanHeader.includes(alias))) {
        matchedField = key;
        break;
      }
    }

    mapping[header] = matchedField;
  });

  return mapping;
}

export function normalizeRawRow(
  rawRow: Record<string, any>,
  mapping: ColumnMappingState,
  clientId: string,
  platform: 'meta' | 'manual' | 'google_sheet' = 'manual'
): UnifiedAdRecord {
  const record: Partial<UnifiedAdRecord> = {
    clientId,
    platform,
    account: 'Manual Upload',
    campaign: 'General Campaign',
    adSet: 'Default AdSet',
    adName: 'Untitled Ad',
    adId: `ad_${Math.random().toString(36).substring(2, 9)}`,
    date: new Date().toISOString().split('T')[0],
    objective: 'LEADS',
    spend: 0,
    impressions: 0,
    reach: 0,
    clicks: 0,
    ctr: 0,
    cpc: 0,
    cpm: 0,
    landingPageViews: 0,
    leads: 0,
    purchases: 0,
    conversions: 0,
    conversionRate: 0,
    cpl: 0,
    cpa: 0,
    revenue: 0,
    roas: 0,
    primaryText: '',
    headline: '',
    description: '',
    cta: 'Learn More',
    driveUrl: '',
    landingPageUrl: ''
  };

  Object.entries(mapping).forEach(([uploadedCol, targetKey]) => {
    if (targetKey === 'ignore') return;
    const rawVal = rawRow[uploadedCol];

    if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
      if (
        [
          'spend', 'impressions', 'reach', 'clicks', 'ctr', 'cpc', 'cpm',
          'landingPageViews', 'leads', 'purchases', 'conversions',
          'conversionRate', 'cpl', 'cpa', 'revenue', 'roas'
        ].includes(targetKey)
      ) {
        const cleaned = String(rawVal).replace(/[$,₹€£%]/g, '').trim();
        const num = parseFloat(cleaned);
        (record as any)[targetKey] = isNaN(num) ? 0 : num;
      } else {
        (record as any)[targetKey] = String(rawVal).trim();
      }
    }
  });

  const spend = record.spend || 0;
  const clicks = record.clicks || 0;
  const impressions = record.impressions || 0;
  const conversions = record.conversions || record.leads || record.purchases || 0;
  const lpViews = record.landingPageViews || clicks;
  const revenue = record.revenue || 0;

  if (!record.ctr && impressions > 0) {
    record.ctr = Number(((clicks / impressions) * 100).toFixed(2));
  }
  if (!record.cpc && clicks > 0) {
    record.cpc = Number((spend / clicks).toFixed(2));
  }
  if (!record.cpm && impressions > 0) {
    record.cpm = Number(((spend / impressions) * 1000).toFixed(2));
  }
  if (!record.conversions) {
    record.conversions = conversions;
  }
  if (!record.conversionRate && lpViews > 0 && conversions > 0) {
    record.conversionRate = Number(((conversions / lpViews) * 100).toFixed(2));
  }
  if (!record.cpa && conversions > 0 && spend > 0) {
    record.cpa = Number((spend / conversions).toFixed(2));
  }
  if (!record.cpl && record.leads && record.leads > 0 && spend > 0) {
    record.cpl = Number((spend / record.leads).toFixed(2));
  }
  if (!record.roas && spend > 0 && revenue > 0) {
    record.roas = Number((revenue / spend).toFixed(2));
  }

  if (!record.driveUrl && record.creativeUrl && record.creativeUrl.includes('drive.google.com')) {
    record.driveUrl = record.creativeUrl;
  }

  return record as UnifiedAdRecord;
}

/**
 * Parses multi-tab agency audit workbooks (such as MKR-DATA-AI.xlsx)
 */
export function parseAgencyAuditWorkbook(workbook: XLSX.WorkBook, clientId: string = 'client-mkr-audit'): AgencyAuditWorkbookResult | null {
  const sheetNames = workbook.SheetNames;
  const lowerSheetNames = sheetNames.map((s) => s.toLowerCase());

  // Check if workbook contains agency audit sheets (Assets, Past Testing, or period sheets)
  const hasAssets = lowerSheetNames.some((s) => s.includes('asset') || s.includes('client'));
  const hasTesting = lowerSheetNames.some((s) => s.includes('past testing') || s.includes('learning'));
  const hasPeriods = lowerSheetNames.some((s) => s.includes('7-day') || s.includes('14 day') || s.includes('30 day') || s.includes('performance'));

  if (!hasAssets && !hasPeriods) {
    return null;
  }

  // 1. Parse Assets sheet for Client Profile & Resource URLs
  const clientProfile: Partial<ClientProfile> = {
    id: clientId,
    name: 'Audited Brand',
    businessName: 'Audited Business',
    website: 'https://example.com',
    productService: 'Product / Service',
    mainOffer: 'Main Offer',
    pricing: '499',
    currency: 'INR'
  };

  const assetsSheetName = sheetNames.find((s) => s.toLowerCase().includes('asset') || s.toLowerCase().includes('client'));
  if (assetsSheetName) {
    const sheet = workbook.Sheets[assetsSheetName];
    const assetRows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });

    assetRows.forEach((row) => {
      if (!row || row.length === 0) return;
      const label = String(row[0] || '').trim().toLowerCase();
      const content = String(row[1] || '').trim();

      // 1. Client & Offer Database block
      if (label.includes('client & offer') || label.includes('client database') || label.includes('client name')) {
        const textToParse = content || String(row[0] || '');
        const lines = textToParse.split('\n');
        lines.forEach((line: string) => {
          const clean = line.replace(/^[-*•\s]+/, '').trim();
          const [rawKey, ...rest] = clean.split(/[-:]/);
          if (rawKey && rest.length) {
            const val = rest.join('-').trim();
            const k = rawKey.trim().toLowerCase();
            if (k.includes('client name')) clientProfile.name = val;
            if (k.includes('product') || k.includes('service')) clientProfile.productService = val;
            if (k.includes('offer')) clientProfile.mainOffer = val;
            if (k.includes('pricing')) clientProfile.pricing = val;
            if (k.includes('usp')) clientProfile.usp = val;
            if (k.includes('target audience')) clientProfile.targetAudience = val;
          }
        });
      }

      // 2. Primary Text / Ad Copy blocks
      if (label.includes('primary text') || label.includes('primary copy') || label.includes('ad text')) {
        if (content) {
          const copyParts = content.split(/(?:\r?\n\s*){2,}(?=\d+\.|\d+\))/g).map(s => s.trim()).filter(Boolean);
          clientProfile.primaryTexts = copyParts.length > 0 ? copyParts : [content];
        }
      }

      // 3. Headlines
      if (label.includes('headline')) {
        if (content) {
          const hlParts = content.split(/\r?\n/).map(s => s.replace(/^\d+[\.\)]\s*/, '').trim()).filter(Boolean);
          clientProfile.headlines = hlParts.length > 0 ? hlParts : [content];
        }
      }

      // 4. Descriptions
      if (label.includes('description')) {
        if (content) {
          const descParts = content.split(/\r?\n/).map(s => s.replace(/^\d+[\.\)]\s*/, '').trim()).filter(Boolean);
          clientProfile.descriptions = descParts.length > 0 ? descParts : [content];
        }
      }

      // 5. CTA
      if (label === 'cta' || label.includes('call to action')) {
        if (content) {
          const ctaClean = content.replace(/^[-*•\s\d.]+/, '').trim();
          clientProfile.ctas = [ctaClean];
        }
      }

      // 6. Audience insights
      if (label.includes('audience')) {
        if (content) {
          clientProfile.audienceInsights = content;
          if (!clientProfile.targetAudience || clientProfile.targetAudience === 'Digital Consumers & Scaled Buyers') {
            clientProfile.targetAudience = content;
          }
        }
      }

      // 7. Landing Page URL
      if (label.includes('landing page')) {
        const textToScan = content || String(row[0] || '');
        const urls = textToScan.match(/https?:\/\/[^\s\n]+/g);
        if (urls && urls.length > 0) {
          // Prefer Meta landing page if labeled, else first URL
          const metaUrl = urls.find(u => textToScan.toLowerCase().includes('meta') && textToScan.indexOf(u) > textToScan.toLowerCase().indexOf('meta')) || urls[0];
          clientProfile.website = metaUrl;
        }
      }
    });

    if (clientProfile.name) {
      clientProfile.businessName = `${clientProfile.name} Official`;
    }

    // Scan all hyperlinks and cell values for URLs (Drive folders, sheet links, etc.)
    for (const cellKey in sheet) {
      const cell = sheet[cellKey];
      if (!cell) continue;

      const targetUrl = cell.l?.Target || (typeof cell.v === 'string' && cell.v.startsWith('http') ? cell.v : null);
      if (targetUrl) {
        const textVal = String(cell.v || '').toLowerCase();
        if (textVal.includes('video') || targetUrl.includes('drive.google.com')) {
          clientProfile.driveVideoFolderUrl = targetUrl;
        } else if (textVal.includes('creative') || targetUrl.includes('spreadsheets')) {
          clientProfile.driveCreativeFolderUrl = targetUrl;
        } else if (textVal.includes('meta') || textVal.includes('ga') || targetUrl.includes('kundali') || targetUrl.includes('http')) {
          if (!clientProfile.website || clientProfile.website === 'https://example.com') {
            clientProfile.website = targetUrl;
          }
        }
      }
    }
  }

  // 2. Parse Past Testing & Learning
  const pastLearnings: { test: string; learning?: string }[] = [];
  const testingSheetName = sheetNames.find((s) => s.toLowerCase().includes('past testing') || s.toLowerCase().includes('learning'));
  if (testingSheetName) {
    const sheet = workbook.Sheets[testingSheetName];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);
    rawRows.forEach((r) => {
      const test = r['Test'] || r['test'] || r['TEST'] || r['Experiment'];
      const learning = r['Learning'] || r['learning'] || r['Outcome'] || r['Result'];
      if (test) {
        pastLearnings.push({
          test: String(test).trim(),
          learning: learning ? String(learning).trim() : undefined
        });
      }
    });
  }

  // 3. Parse Performance Sheets (7-Day, 14-Day, 30-Day, etc.)
  const periods: AgencyAuditPeriod[] = [];
  sheetNames.forEach((sheetName) => {
    const sLower = sheetName.toLowerCase();
    const isPeriodSheet = sLower.includes('7-day') || sLower.includes('7 day') || sLower.includes('14 day') || sLower.includes('30 day') || sLower.includes('performance');
    if (!isPeriodSheet) return;

    let periodLabel = 'Performance Window';
    if (sLower.includes('7-day') || sLower.includes('7 day')) periodLabel = 'Last 7 Days';
    else if (sLower.includes('14 day')) periodLabel = 'Last 14 Days';
    else if (sLower.includes('30 day')) periodLabel = 'Last 30 Days';

    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
    if (!rows || rows.length < 2) return;

    // Find header index
    let headerIdx = 0;
    for (let i = 0; i < Math.min(rows.length, 5); i++) {
      const rowStrings = (rows[i] || []).map((c: any) => String(c || '').toLowerCase());
      if (rowStrings.some((c: string) => c.includes('spend') || c.includes('ad name') || c.includes('cpa'))) {
        headerIdx = i;
        break;
      }
    }

    const headerRow = (rows[headerIdx] || []).map((c: any) => String(c || '').trim());
    const spendCol = headerRow.findIndex((h: string) => h.toLowerCase().includes('spend') || h.toLowerCase() === 'cost');
    const adNameCol = headerRow.findIndex((h: string) => h.toLowerCase().includes('ad name'));
    const linkCol = headerRow.findIndex((h: string) => h.toLowerCase() === 'link' || h.toLowerCase().includes('creative'));
    const campaignCol = headerRow.findIndex((h: string) => h.toLowerCase().includes('campaign'));
    const saleCol = headerRow.findIndex((h: string) => h.toLowerCase() === 'sale' || h.toLowerCase().includes('purchase') || h.toLowerCase().includes('conv'));
    const cpaCol = headerRow.findIndex((h: string) => h.toLowerCase().includes('cpa') || h.toLowerCase().includes('cost per'));
    const cpmCol = headerRow.findIndex((h: string) => h.toLowerCase().includes('cpm'));
    const impCol = headerRow.findIndex((h: string) => h.toLowerCase().includes('impr'));
    const ctrCol = headerRow.findIndex((h: string) => h.toLowerCase().includes('ctr'));
    const revCol = headerRow.findIndex((h: string) => h.toLowerCase().includes('revenue') || h.toLowerCase().includes('value'));
    const roasCol = headerRow.findIndex((h: string) => h.toLowerCase().includes('roas'));

    let currentGroup = '';
    const records: UnifiedAdRecord[] = [];

    for (let r = headerIdx + 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length === 0) continue;

      if (adNameCol >= 0 && row[adNameCol]) {
        currentGroup = String(row[adNameCol]).trim();
      }

      const rawSpend = spendCol >= 0 ? row[spendCol] : null;
      const spend = typeof rawSpend === 'number' ? rawSpend : parseFloat(String(rawSpend || '').replace(/[^0-9.]/g, ''));
      if (!spend || isNaN(spend) || spend <= 0) continue;

      const linkVal = linkCol >= 0 && row[linkCol] ? String(row[linkCol]).trim() : '';
      const creativeId = linkVal || currentGroup || `ad_mkr_${r}`;
      const campaign = campaignCol >= 0 && row[campaignCol] ? String(row[campaignCol]).trim() : 'Active Campaign';
      const adName = linkVal ? (currentGroup && currentGroup !== linkVal ? `${currentGroup} - ${linkVal}` : linkVal) : currentGroup || `Ad Creative ${r}`;

      const rawSale = saleCol >= 0 ? row[saleCol] : 0;
      const purchases = typeof rawSale === 'number' ? rawSale : parseFloat(String(rawSale || '').replace(/[^0-9.]/g, '')) || 0;

      const rawCpa = cpaCol >= 0 ? row[cpaCol] : 0;
      const cpa = typeof rawCpa === 'number' ? rawCpa : (purchases > 0 ? spend / purchases : 0);

      const rawCpm = cpmCol >= 0 ? row[cpmCol] : 0;
      const cpm = typeof rawCpm === 'number' ? rawCpm : 0;

      const rawImp = impCol >= 0 ? row[impCol] : 0;
      const impressions = typeof rawImp === 'number' ? rawImp : parseFloat(String(rawImp || '').replace(/[^0-9.]/g, '')) || 0;

      const rawCtr = ctrCol >= 0 ? row[ctrCol] : 0;
      let ctr = typeof rawCtr === 'number' ? rawCtr : parseFloat(String(rawCtr || '').replace(/[^0-9.]/g, '')) || 0;
      // In MKR sheet, 0.8539 is 0.85%. If CTR was expressed as a ratio < 0.05, convert or keep as percentage:
      if (ctr > 0 && ctr < 0.1 && impressions > 1000) {
        ctr = Number((ctr * 100).toFixed(2));
      }

      const rawRev = revCol >= 0 ? row[revCol] : 0;
      const revenue = typeof rawRev === 'number' ? rawRev : parseFloat(String(rawRev || '').replace(/[^0-9.]/g, '')) || 0;

      const rawRoas = roasCol >= 0 ? row[roasCol] : 0;
      const roas = typeof rawRoas === 'number' ? rawRoas : (spend > 0 ? revenue / spend : 0);

      const clicks = Math.round(impressions * (ctr / 100)) || Math.round(spend / 15);
      const cpc = clicks > 0 ? Number((spend / clicks).toFixed(2)) : 0;

      records.push({
        clientId,
        platform: 'meta',
        account: clientProfile.name || 'MKR Ads Manager',
        campaign,
        adSet: currentGroup || 'Broad AdSet',
        adName,
        adId: `mkr_${creativeId.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${r}`,
        creativeId,
        date: periodLabel,
        objective: 'SALES',
        spend: Number(spend.toFixed(2)),
        impressions,
        reach: Math.round(impressions * 0.82),
        clicks,
        ctr: Number(ctr.toFixed(2)),
        cpc,
        cpm: Number(cpm.toFixed(2)),
        landingPageViews: Math.round(clicks * 0.78),
        leads: purchases,
        purchases,
        conversions: purchases,
        conversionRate: clicks > 0 ? Number(((purchases / clicks) * 100).toFixed(2)) : 0,
        cpl: purchases > 0 ? Number((spend / purchases).toFixed(2)) : 0,
        cpa: Number(cpa.toFixed(2)),
        revenue: Number(revenue.toFixed(2)),
        roas: Number(roas.toFixed(2)),
        primaryText: clientProfile.primaryTexts && clientProfile.primaryTexts.length > 0
          ? clientProfile.primaryTexts[r % clientProfile.primaryTexts.length]
          : '',
        headline: clientProfile.headlines && clientProfile.headlines.length > 0
          ? clientProfile.headlines[r % clientProfile.headlines.length]
          : '',
        description: clientProfile.descriptions && clientProfile.descriptions.length > 0
          ? clientProfile.descriptions[r % clientProfile.descriptions.length]
          : '',
        cta: clientProfile.ctas?.[0] || 'Order Now',
        driveUrl: clientProfile.driveVideoFolderUrl || '',
        landingPageUrl: clientProfile.website || ''
      });
    }

    if (records.length > 0) {
      periods.push({
        label: periodLabel,
        sheetName,
        records
      });
    }
  });

  if (periods.length === 0) {
    return null;
  }

  // Build multi-period dataset dictionary
  const periodDatasets: Record<string, UnifiedAdRecord[]> = {};
  periods.forEach((p) => {
    periodDatasets[p.label] = p.records;
  });
  clientProfile.periodDatasets = periodDatasets;

  // Default to 7-Days if available, or first period
  const activePeriod = periods.find((p) => p.label === 'Last 7 Days') || periods[0];

  return {
    isAgencyWorkbook: true,
    clientProfile,
    pastLearnings,
    periods,
    activePeriodRecords: activePeriod.records,
    activePeriodLabel: activePeriod.label
  };
}

/**
 * Parse CSV / XLSX file and return raw parsed rows, headers, and optional agency workbook metadata
 */
export async function parseSpreadsheetFile(
  file: File,
  clientId: string = 'client-mkr-audit'
): Promise<SpreadsheetParseOutput> {
  return new Promise((resolve, reject) => {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const headers = (results.meta.fields || []).filter(Boolean);
          const rows = results.data as Record<string, any>[];
          resolve({ headers, rows });
        },
        error: (err) => reject(new Error(`Failed to parse CSV: ${err.message}`))
      });
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          // 1. First test if this is a Multi-Tab Agency Audit Workbook
          const agencyWorkbook = parseAgencyAuditWorkbook(workbook, clientId);
          if (agencyWorkbook && agencyWorkbook.periods.length > 0) {
            resolve({
              headers: ['adName', 'creativeId', 'campaign', 'spend', 'purchases', 'cpa', 'cpm', 'impressions', 'ctr', 'revenue', 'roas'],
              rows: agencyWorkbook.activePeriodRecords,
              agencyWorkbook
            });
            return;
          }

          // 2. Standard single sheet parsing fallback
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { header: 1 });

          if (jsonData.length < 2) {
            resolve({ headers: [], rows: [] });
            return;
          }

          const rawHeaders = (jsonData[0] as any[]).map((h) => String(h || '').trim());
          const headers = rawHeaders.filter(Boolean);
          const rows: Record<string, any>[] = [];

          for (let i = 1; i < jsonData.length; i++) {
            const rowData = jsonData[i] as any[];
            if (!rowData || rowData.length === 0) continue;
            const rowObj: Record<string, any> = {};
            let hasAnyVal = false;

            rawHeaders.forEach((header, idx) => {
              if (header) {
                const val = rowData[idx];
                if (val !== undefined && val !== null && val !== '') {
                  rowObj[header] = val;
                  hasAnyVal = true;
                }
              }
            });

            if (hasAnyVal) {
              rows.push(rowObj);
            }
          }

          resolve({ headers, rows });
        } catch (err: any) {
          reject(new Error(`Failed to parse Excel file: ${err.message}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error('Unsupported file format. Please upload a .csv, .xlsx, or .xls file.'));
    }
  });
}
