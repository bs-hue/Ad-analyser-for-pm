import { createClient, Client } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { 
  ClientProfile, 
  UnifiedAdRecord, 
  ExperimentItem, 
  HistoricalAnalysisRun, 
  CreativeIntelligence 
} from './types';

let dbClient: Client | null = null;
let isSchemaInitialized = false;

/**
 * Returns a singleton LibSQL/SQLite database client.
 * Connects to a local embedded database file without requiring external servers or credentials.
 * ZERO CREDENTIALS NEEDED: Runs automatically on the local filesystem.
 */
export function getDb(): Client {
  if (dbClient) return dbClient;

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (e) {
      console.warn('[LocalDB] Could not ensure data directory:', e);
    }
  }

  // Support either mysql.db or local.db in ./data/
  const dbFileName = process.env.LOCAL_DB_FILE || 'mysql.db';
  const dbFilePath = path.join(dataDir, dbFileName).replace(/\\/g, '/');
  const url = `file:${dbFilePath}`;

  try {
    dbClient = createClient({ url });
    return dbClient;
  } catch (err) {
    console.error('[LocalDB] Failed to initialize embedded database:', err);
    throw err;
  }
}

/**
 * Verifies if the local database connection is active.
 */
export async function testDbConnection(): Promise<{ connected: boolean; message: string; dbPath: string }> {
  try {
    const db = getDb();
    const result = await db.execute('SELECT 1 as test');
    return {
      connected: result.rows.length > 0,
      message: 'Local embedded SQL database is active (zero-cred file: data/mysql.db)',
      dbPath: 'data/mysql.db'
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Database error: ${err.message}`,
      dbPath: 'data/mysql.db'
    };
  }
}

/**
 * Initializes database tables automatically.
 * GUARANTEE: Never stores video files or heavy binary blobs (BLOB).
 * Only stores links, numerical metrics, and structured text metadata.
 */
export async function initDbSchema(): Promise<boolean> {
  if (isSchemaInitialized) return true;
  const db = getDb();

  try {
    // 1. Clients Table (Stores brand DNA, offer, target CPA, drive links - NO heavy binaries)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        business_name TEXT,
        website TEXT,
        product_service TEXT,
        main_offer TEXT,
        pricing TEXT,
        target_audience TEXT,
        geography TEXT,
        usp TEXT,
        brand_tone TEXT,
        currency TEXT DEFAULT 'INR',
        target_cpa REAL,
        drive_creative_folder_url TEXT,
        drive_video_folder_url TEXT,
        meta_connected INTEGER DEFAULT 0,
        meta_account_id TEXT,
        meta_access_token TEXT,
        past_learnings TEXT,
        primary_texts TEXT,
        headlines TEXT,
        descriptions TEXT,
        ctas TEXT,
        audience_insights TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Ad Performance Records Table (Strictly numerical & metadata; video/image is link-only)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ad_performance_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id TEXT NOT NULL,
        period_label TEXT NOT NULL,
        ad_id TEXT NOT NULL,
        ad_name TEXT NOT NULL,
        campaign TEXT,
        ad_set TEXT,
        creative_id TEXT,
        spend REAL NOT NULL DEFAULT 0.0,
        impressions INTEGER DEFAULT 0,
        reach INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        ctr REAL DEFAULT 0.0,
        cpc REAL DEFAULT 0.0,
        cpm REAL DEFAULT 0.0,
        landing_page_views INTEGER DEFAULT 0,
        leads INTEGER DEFAULT 0,
        purchases INTEGER DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        conversion_rate REAL DEFAULT 0.0,
        cpl REAL DEFAULT 0.0,
        cpa REAL DEFAULT 0.0,
        revenue REAL DEFAULT 0.0,
        roas REAL DEFAULT 0.0,
        headline TEXT,
        primary_text TEXT,
        cta TEXT,
        drive_url TEXT,
        landing_page_url TEXT,
        UNIQUE (client_id, period_label, ad_id)
      );
    `);

    // 3. Creative Intelligence Metadata Table (Teardown insights & external thumbnails; NO raw video files)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS creative_metadata (
        ad_id TEXT PRIMARY KEY,
        ad_name TEXT,
        creative_type TEXT DEFAULT 'video',
        format TEXT,
        duration_seconds INTEGER DEFAULT 0,
        hook_type TEXT,
        hook_first_3s TEXT,
        main_angle TEXT,
        promise TEXT,
        offer TEXT,
        cta TEXT,
        pacing TEXT,
        visual_hierarchy_score INTEGER DEFAULT 0,
        headline_clarity_score INTEGER DEFAULT 0,
        creative_strengths TEXT,
        creative_weaknesses TEXT,
        transcript TEXT,
        thumbnail_url TEXT,
        recommended_hook_swaps TEXT,
        drive_url_status TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Experiments Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS experiments (
        id TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        title TEXT NOT NULL,
        hypothesis TEXT,
        variable_name TEXT,
        kpi TEXT,
        status TEXT DEFAULT 'Planned',
        baseline_metric TEXT,
        target_metric TEXT,
        current_result TEXT,
        start_date TEXT,
        learnings TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Historical Analysis Runs Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS historical_analysis_runs (
        id TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        timestamp_label TEXT,
        date_range_label TEXT,
        total_spend REAL DEFAULT 0.0,
        total_revenue REAL DEFAULT 0.0,
        roas REAL DEFAULT 0.0,
        total_conversions INTEGER DEFAULT 0,
        top_winning_hook TEXT,
        key_finding TEXT,
        winning_patterns_count INTEGER DEFAULT 0,
        experiments_launched INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    isSchemaInitialized = true;
    return true;
  } catch (err) {
    console.error('[LocalDB] Schema initialization error:', err);
    return false;
  }
}

// ============================================================================
// CRUD OPERATIONS (Zero Credentials, Embedded Local SQL)
// ============================================================================

export async function dbSaveClientProfile(client: ClientProfile): Promise<boolean> {
  const db = getDb();
  await initDbSchema();

  try {
    const query = `
      INSERT INTO clients (
        id, name, business_name, website, product_service, main_offer, pricing,
        target_audience, geography, usp, brand_tone, currency, target_cpa,
        drive_creative_folder_url, drive_video_folder_url, meta_connected,
        meta_account_id, meta_access_token, past_learnings, primary_texts,
        headlines, descriptions, ctas, audience_insights, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        business_name = excluded.business_name,
        website = excluded.website,
        product_service = excluded.product_service,
        main_offer = excluded.main_offer,
        pricing = excluded.pricing,
        target_audience = excluded.target_audience,
        geography = excluded.geography,
        usp = excluded.usp,
        brand_tone = excluded.brand_tone,
        currency = excluded.currency,
        target_cpa = excluded.target_cpa,
        drive_creative_folder_url = excluded.drive_creative_folder_url,
        drive_video_folder_url = excluded.drive_video_folder_url,
        meta_connected = excluded.meta_connected,
        meta_account_id = excluded.meta_account_id,
        meta_access_token = excluded.meta_access_token,
        past_learnings = excluded.past_learnings,
        primary_texts = excluded.primary_texts,
        headlines = excluded.headlines,
        descriptions = excluded.descriptions,
        ctas = excluded.ctas,
        audience_insights = excluded.audience_insights,
        updated_at = CURRENT_TIMESTAMP;
    `;

    await db.execute({
      sql: query,
      args: [
        client.id,
        client.name,
        client.businessName || '',
        client.website || '',
        client.productService || '',
        client.mainOffer || '',
        client.pricing || '',
        client.targetAudience || '',
        client.geography || '',
        client.usp || '',
        client.brandTone || '',
        client.currency || 'INR',
        client.targetCpa || null,
        client.driveCreativeFolderUrl || '',
        client.driveVideoFolderUrl || '',
        client.metaConnected ? 1 : 0,
        client.metaAccountId || '',
        client.metaAccessToken || '',
        JSON.stringify(client.pastLearnings || []),
        JSON.stringify(client.primaryTexts || []),
        JSON.stringify(client.headlines || []),
        JSON.stringify(client.descriptions || []),
        JSON.stringify(client.ctas || []),
        client.audienceInsights || ''
      ]
    });

    return true;
  } catch (err) {
    console.error('[LocalDB] Error saving client profile:', err);
    return false;
  }
}

export async function dbGetClientProfile(clientId: string): Promise<ClientProfile | null> {
  const db = getDb();
  await initDbSchema();

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM clients WHERE id = ? LIMIT 1',
      args: [clientId]
    });

    if (!result.rows || result.rows.length === 0) return null;

    const r: any = result.rows[0];
    return {
      id: r.id as string,
      name: r.name as string,
      businessName: (r.business_name as string) || '',
      website: (r.website as string) || '',
      productService: (r.product_service as string) || '',
      mainOffer: (r.main_offer as string) || '',
      pricing: (r.pricing as string) || '',
      targetAudience: (r.target_audience as string) || '',
      geography: (r.geography as string) || '',
      usp: (r.usp as string) || '',
      painPoints: [],
      desires: [],
      customerObjections: [],
      competitors: [],
      brandTone: (r.brand_tone as string) || '',
      approvedClaims: [],
      restrictedClaims: [],
      metaConnected: Boolean(r.meta_connected),
      metaAccountId: (r.meta_account_id as string) || '',
      metaAccessToken: (r.meta_access_token as string) || '',
      lastAnalysisDate: r.updated_at ? String(r.updated_at).split(' ')[0] : '2026-03-01',
      activeExperimentsCount: 0,
      currency: (r.currency as string) || 'INR',
      targetCpa: r.target_cpa ? Number(r.target_cpa) : undefined,
      driveCreativeFolderUrl: (r.drive_creative_folder_url as string) || '',
      driveVideoFolderUrl: (r.drive_video_folder_url as string) || '',
      pastLearnings: typeof r.past_learnings === 'string' ? JSON.parse(r.past_learnings) : r.past_learnings || [],
      primaryTexts: typeof r.primary_texts === 'string' ? JSON.parse(r.primary_texts) : r.primary_texts || [],
      headlines: typeof r.headlines === 'string' ? JSON.parse(r.headlines) : r.headlines || [],
      descriptions: typeof r.descriptions === 'string' ? JSON.parse(r.descriptions) : r.descriptions || [],
      ctas: typeof r.ctas === 'string' ? JSON.parse(r.ctas) : r.ctas || [],
      audienceInsights: (r.audience_insights as string) || ''
    };
  } catch (err) {
    console.error('[LocalDB] Error getting client profile:', err);
    return null;
  }
}

export async function dbSavePeriodRecords(
  clientId: string,
  periodLabel: string,
  records: UnifiedAdRecord[]
): Promise<boolean> {
  const db = getDb();
  if (records.length === 0) return false;
  await initDbSchema();

  try {
    // Delete existing records for this client & period
    await db.execute({
      sql: 'DELETE FROM ad_performance_records WHERE client_id = ? AND period_label = ?',
      args: [clientId, periodLabel]
    });

    const insertStatements = records.map((r) => ({
      sql: `
        INSERT OR REPLACE INTO ad_performance_records (
          client_id, period_label, ad_id, ad_name, campaign, ad_set, creative_id,
          spend, impressions, reach, clicks, ctr, cpc, cpm, landing_page_views,
          leads, purchases, conversions, conversion_rate, cpl, cpa, revenue, roas,
          headline, primary_text, cta, drive_url, landing_page_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        clientId,
        periodLabel,
        r.adId,
        r.adName,
        r.campaign || '',
        r.adSet || '',
        r.creativeId || '',
        r.spend || 0,
        r.impressions || 0,
        r.reach || 0,
        r.clicks || 0,
        r.ctr || 0,
        r.cpc || 0,
        r.cpm || 0,
        r.landingPageViews || 0,
        r.leads || 0,
        r.purchases || 0,
        r.conversions || r.purchases || r.leads || 0,
        r.conversionRate || 0,
        r.cpl || 0,
        r.cpa || 0,
        r.revenue || 0,
        r.roas || 0,
        r.headline || '',
        r.primaryText || '',
        r.cta || 'Order Now',
        r.driveUrl || '',
        r.landingPageUrl || ''
      ]
    }));

    await db.batch(insertStatements, 'write');
    return true;
  } catch (err) {
    console.error('[LocalDB] Error saving period records:', err);
    return false;
  }
}

export async function dbGetPeriodRecords(
  clientId: string,
  periodLabel: string
): Promise<UnifiedAdRecord[] | null> {
  const db = getDb();
  await initDbSchema();

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM ad_performance_records WHERE client_id = ? AND period_label = ? ORDER BY spend DESC',
      args: [clientId, periodLabel]
    });

    if (!result.rows || result.rows.length === 0) return null;

    return result.rows.map((r: any): UnifiedAdRecord => ({
      clientId: r.client_id as string,
      platform: 'meta',
      account: 'Local Embedded SQL DB',
      campaign: (r.campaign as string) || '',
      adSet: (r.ad_set as string) || '',
      adName: r.ad_name as string,
      adId: r.ad_id as string,
      date: r.period_label as string,
      objective: 'SALES',
      spend: Number(r.spend) || 0,
      impressions: Number(r.impressions) || 0,
      reach: Number(r.reach) || 0,
      clicks: Number(r.clicks) || 0,
      ctr: Number(r.ctr) || 0,
      cpc: Number(r.cpc) || 0,
      cpm: Number(r.cpm) || 0,
      landingPageViews: Number(r.landing_page_views) || 0,
      leads: Number(r.leads) || 0,
      purchases: Number(r.purchases) || 0,
      conversions: Number(r.conversions) || 0,
      conversionRate: Number(r.conversion_rate) || 0,
      cpl: Number(r.cpl) || 0,
      cpa: Number(r.cpa) || 0,
      revenue: Number(r.revenue) || 0,
      roas: Number(r.roas) || 0,
      primaryText: (r.primary_text as string) || '',
      headline: (r.headline as string) || '',
      description: '',
      cta: (r.cta as string) || 'Order Now',
      creativeId: (r.creative_id as string) || '',
      driveUrl: (r.drive_url as string) || '',
      landingPageUrl: (r.landing_page_url as string) || ''
    }));
  } catch (err) {
    console.error('[LocalDB] Error getting period records:', err);
    return null;
  }
}

export async function dbSaveExperiments(clientId: string, experiments: ExperimentItem[]): Promise<boolean> {
  const db = getDb();
  await initDbSchema();

  try {
    await db.execute({
      sql: 'DELETE FROM experiments WHERE client_id = ?',
      args: [clientId]
    });

    if (experiments.length === 0) return true;

    const stmts = experiments.map(exp => ({
      sql: `
        INSERT OR REPLACE INTO experiments (
          id, client_id, title, hypothesis, variable_name, kpi, status,
          baseline_metric, target_metric, current_result, start_date, learnings, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
      args: [
        exp.id,
        clientId,
        exp.title,
        exp.hypothesis,
        exp.variable,
        exp.kpi,
        exp.status,
        exp.baselineMetric || '',
        exp.targetMetric || '',
        exp.currentResult || '',
        exp.startDate || '',
        exp.learnings || ''
      ]
    }));

    await db.batch(stmts, 'write');
    return true;
  } catch (err) {
    console.error('[LocalDB] Error saving experiments:', err);
    return false;
  }
}

export async function dbGetExperiments(clientId: string): Promise<ExperimentItem[] | null> {
  const db = getDb();
  await initDbSchema();

  try {
    const res = await db.execute({
      sql: 'SELECT * FROM experiments WHERE client_id = ?',
      args: [clientId]
    });

    if (!res.rows || res.rows.length === 0) return null;

    return res.rows.map((r: any): ExperimentItem => ({
      id: r.id as string,
      clientId: r.client_id as string,
      title: r.title as string,
      hypothesis: (r.hypothesis as string) || '',
      variable: (r.variable_name as any) || 'Creative Angle',
      kpi: (r.kpi as any) || 'ROAS',
      status: (r.status as any) || 'Planned',
      baselineMetric: (r.baseline_metric as string) || '',
      targetMetric: (r.target_metric as string) || '',
      currentResult: (r.current_result as string) || '',
      startDate: (r.start_date as string) || '',
      learnings: (r.learnings as string) || ''
    }));
  } catch (err) {
    console.error('[LocalDB] Error getting experiments:', err);
    return null;
  }
}

// Aliases for compatibility
export const getDbPool = getDb;
