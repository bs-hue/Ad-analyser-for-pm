import { UnifiedAdRecord, ColumnMappingState } from './types';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

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
  recommendedTest: 'Recommended Test'
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
  recommendedTest: []
};

/**
 * Automatically detects column mapping based on uploaded header names
 */
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

/**
 * Normalizes raw uploaded row into UnifiedAdRecord
 */
export function normalizeRawRow(
  rawRow: Record<string, any>,
  mapping: ColumnMappingState,
  clientId: string,
  platform: 'manual' | 'google_sheet' = 'manual'
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
        // Parse numerical values, stripping currency symbols and percentage signs
        const cleaned = String(rawVal).replace(/[$,₹€£%]/g, '').trim();
        const num = parseFloat(cleaned);
        (record as any)[targetKey] = isNaN(num) ? 0 : num;
      } else {
        (record as any)[targetKey] = String(rawVal).trim();
      }
    }
  });

  // Calculate secondary derived metrics if missing or 0
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

  // Ensure driveUrl falls back to creativeUrl if provided with google drive link
  if (!record.driveUrl && record.creativeUrl && record.creativeUrl.includes('drive.google.com')) {
    record.driveUrl = record.creativeUrl;
  }

  return record as UnifiedAdRecord;
}

/**
 * Parse CSV / XLSX file and return raw parsed rows and headers
 */
export async function parseSpreadsheetFile(file: File): Promise<{ headers: string[]; rows: Record<string, any>[] }> {
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
