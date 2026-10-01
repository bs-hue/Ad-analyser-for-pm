import { UnifiedAdRecord, ValidationIssue } from './types';

export interface DatasetValidationReport {
  isValid: boolean;
  canProceed: boolean;
  totalRows: number;
  totalAds: number;
  totalSpend: number;
  totalConversions: number;
  totalClicks: number;
  dateRange: { start?: string; end?: string };
  issues: ValidationIssue[];
  metricsAvailable: {
    hasSpend: boolean;
    hasImpressions: boolean;
    hasClicks: boolean;
    hasConversions: boolean;
    hasRevenue: boolean;
    hasDriveUrls: boolean;
    hasAdCopy: boolean;
    hasLandingPages: boolean;
  };
}

export function validatePerformanceDataset(records: UnifiedAdRecord[]): DatasetValidationReport {
  const issues: ValidationIssue[] = [];

  if (!records || records.length === 0) {
    return {
      isValid: false,
      canProceed: false,
      totalRows: 0,
      totalAds: 0,
      totalSpend: 0,
      totalConversions: 0,
      totalClicks: 0,
      dateRange: {},
      issues: [
        {
          type: 'error',
          code: 'EMPTY_DATASET',
          message: 'The dataset contains 0 records. Please upload a valid CSV/Excel file or connect Meta Ads.'
        }
      ],
      metricsAvailable: {
        hasSpend: false,
        hasImpressions: false,
        hasClicks: false,
        hasConversions: false,
        hasRevenue: false,
        hasDriveUrls: false,
        hasAdCopy: false,
        hasLandingPages: false
      }
    };
  }

  let totalSpend = 0;
  let totalConversions = 0;
  let totalClicks = 0;
  let totalImpressions = 0;
  let totalRevenue = 0;

  const dates: string[] = [];
  const zeroSpendAds: string[] = [];
  const missingCreativeUrls: string[] = [];
  const missingConversionsAds: string[] = [];
  const missingCopyAds: string[] = [];
  const invalidNumberAds: string[] = [];
  const duplicateAdNames = new Set<string>();
  const seenAdNames = new Set<string>();

  records.forEach((record, index) => {
    const adIdentifier = record.adName || record.adId || `Row #${index + 1}`;

    // Track duplicates
    if (record.adName) {
      if (seenAdNames.has(record.adName)) {
        duplicateAdNames.add(record.adName);
      } else {
        seenAdNames.add(record.adName);
      }
    }

    // Accumulate spend
    if (isNaN(record.spend) || record.spend < 0) {
      invalidNumberAds.push(adIdentifier);
    } else {
      totalSpend += record.spend;
      if (record.spend === 0) {
        zeroSpendAds.push(adIdentifier);
      }
    }

    // Accumulate conversions
    const conv = record.conversions || record.leads || record.purchases || 0;
    totalConversions += conv;
    if (record.spend > 0 && conv === 0) {
      missingConversionsAds.push(adIdentifier);
    }

    // Impressions & Clicks
    if (record.clicks) totalClicks += record.clicks;
    if (record.impressions) totalImpressions += record.impressions;
    if (record.revenue) totalRevenue += record.revenue;

    // Dates
    if (record.date) dates.push(record.date);

    // Creative URL check
    if (!record.driveUrl && !record.creativeUrl) {
      missingCreativeUrls.push(adIdentifier);
    }

    // Copy check
    if (!record.primaryText && !record.headline) {
      missingCopyAds.push(adIdentifier);
    }
  });

  // Calculate issue alerts
  if (missingCreativeUrls.length > 0) {
    issues.push({
      type: 'warning',
      code: 'MISSING_CREATIVE_URLS',
      message: `${missingCreativeUrls.length} ads do not have a Google Drive or asset URL. Creative vision analysis will be skipped for these ads.`,
      affectedCount: missingCreativeUrls.length,
      affectedAds: missingCreativeUrls.slice(0, 5)
    });
  }

  if (zeroSpendAds.length > 0) {
    issues.push({
      type: 'info',
      code: 'ZERO_SPEND_ADS',
      message: `${zeroSpendAds.length} ads have ₹0 spend. They will be classified as 'Insufficient Data' and excluded from CPA calculations.`,
      affectedCount: zeroSpendAds.length,
      affectedAds: zeroSpendAds.slice(0, 5)
    });
  }

  if (duplicateAdNames.size > 0) {
    issues.push({
      type: 'info',
      code: 'DUPLICATE_AD_NAMES',
      message: `${duplicateAdNames.size} ad names appear across multiple rows (likely split across multiple date intervals or ad sets).`,
      affectedCount: duplicateAdNames.size
    });
  }

  if (invalidNumberAds.length > 0) {
    issues.push({
      type: 'warning',
      code: 'INVALID_NUMERICAL_DATA',
      message: `${invalidNumberAds.length} rows contained invalid or NaN spend figures and were defaulted to 0.`,
      affectedCount: invalidNumberAds.length
    });
  }

  if (totalSpend === 0) {
    issues.push({
      type: 'error',
      code: 'NO_SPEND_RECORDED',
      message: 'Total spend across all records is ₹0. Please ensure the Amount Spent column was mapped correctly.'
    });
  }

  const sortedDates = dates.sort();
  const dateRange = {
    start: sortedDates[0] || 'Unknown',
    end: sortedDates[sortedDates.length - 1] || 'Unknown'
  };

  const hasCriticalErrors = issues.some((i) => i.type === 'error');

  return {
    isValid: !hasCriticalErrors,
    canProceed: !hasCriticalErrors && records.length > 0,
    totalRows: records.length,
    totalAds: seenAdNames.size || records.length,
    totalSpend: Number(totalSpend.toFixed(2)),
    totalConversions,
    totalClicks,
    dateRange,
    issues,
    metricsAvailable: {
      hasSpend: totalSpend > 0,
      hasImpressions: totalImpressions > 0,
      hasClicks: totalClicks > 0,
      hasConversions: totalConversions > 0,
      hasRevenue: totalRevenue > 0,
      hasDriveUrls: missingCreativeUrls.length < records.length,
      hasAdCopy: missingCopyAds.length < records.length,
      hasLandingPages: records.some((r) => !!r.landingPageUrl)
    }
  };
}
