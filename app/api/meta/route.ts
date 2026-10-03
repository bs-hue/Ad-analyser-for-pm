import { NextRequest, NextResponse } from 'next/server';
import { UnifiedAdRecord } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, adAccountId, accessToken, dateRange } = body;

    if (!adAccountId || !accessToken) {
      return NextResponse.json(
        { error: 'Meta Ad Account ID and Access Token are required.' },
        { status: 400 }
      );
    }

    const cleanAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;

    // Action 1: Test Connection
    if (action === 'test') {
      // Allow testing with simulated tokens
      if (accessToken.startsWith('demo_') || accessToken.startsWith('test_')) {
        return NextResponse.json({
          success: true,
          accountName: `Demo Meta Account (${cleanAccountId})`,
          currency: 'INR',
          timezone: 'Asia/Kolkata',
          isDemo: true
        });
      }

      const testUrl = `https://graph.facebook.com/v20.0/${cleanAccountId}?fields=name,account_status,currency,timezone_name&access_token=${encodeURIComponent(
        accessToken
      )}`;

      const testRes = await fetch(testUrl);
      const testData = await testRes.json();

      if (testData.error) {
        return NextResponse.json(
          { error: testData.error.message || 'Meta connection test failed.' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        accountName: testData.name || cleanAccountId,
        currency: testData.currency || 'INR',
        timezone: testData.timezone_name || 'UTC'
      });
    }

    // Action 2: Fetch Live Performance Records
    if (action === 'fetch') {
      // Map date range to Meta API date_preset
      let datePreset = 'last_7d';
      if (dateRange?.includes('14')) datePreset = 'last_14d';
      if (dateRange?.includes('30')) datePreset = 'last_30d';
      if (dateRange?.includes('Lifetime') || dateRange?.includes('All')) datePreset = 'maximum';

      if (accessToken.startsWith('demo_') || accessToken.startsWith('test_')) {
        return NextResponse.json({
          success: true,
          source: 'demo_simulation',
          recordsCount: 0,
          message: 'Connected in demo mode.'
        });
      }

      const insightsUrl = `https://graph.facebook.com/v20.0/${cleanAccountId}/insights?level=ad&date_preset=${datePreset}&fields=campaign_name,adset_name,ad_name,ad_id,spend,impressions,reach,clicks,cpc,cpm,actions,action_values,cost_per_action_type&access_token=${encodeURIComponent(
        accessToken
      )}&limit=100`;

      const insightsRes = await fetch(insightsUrl);
      const insightsData = await insightsRes.json();

      if (insightsData.error) {
        return NextResponse.json(
          { error: insightsData.error.message || 'Failed to fetch Meta insights.' },
          { status: 400 }
        );
      }

      const rawList = insightsData.data || [];
      const normalizedRecords: UnifiedAdRecord[] = rawList.map((row: any) => {
        const spend = parseFloat(row.spend || '0');
        const impressions = parseInt(row.impressions || '0', 10);
        const reach = parseInt(row.reach || '0', 10);
        const clicks = parseInt(row.clicks || '0', 10);
        const cpc = parseFloat(row.cpc || '0');
        const cpm = parseFloat(row.cpm || '0');
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

        // Extract purchases and leads from actions
        const actions = Array.isArray(row.actions) ? row.actions : [];
        const purchaseAction = actions.find((a: any) => a.action_type === 'purchase' || a.action_type === 'omni_purchase');
        const leadAction = actions.find((a: any) => a.action_type === 'lead');
        const lpViewAction = actions.find((a: any) => a.action_type === 'landing_page_view');

        const purchases = purchaseAction ? parseInt(purchaseAction.value || '0', 10) : 0;
        const leads = leadAction ? parseInt(leadAction.value || '0', 10) : 0;
        const lpViews = lpViewAction ? parseInt(lpViewAction.value || '0', 10) : clicks;
        const conversions = purchases > 0 ? purchases : leads;

        // Revenue from action_values
        const actionValues = Array.isArray(row.action_values) ? row.action_values : [];
        const purchaseValue = actionValues.find((a: any) => a.action_type === 'purchase' || a.action_type === 'omni_purchase');
        const revenue = purchaseValue ? parseFloat(purchaseValue.value || '0') : 0;

        const cpa = conversions > 0 ? spend / conversions : 0;
        const roas = spend > 0 && revenue > 0 ? revenue / spend : 0;

        return {
          clientId: body.clientId || 'meta-sync',
          platform: 'meta',
          account: cleanAccountId,
          campaign: row.campaign_name || 'Campaign',
          adSet: row.adset_name || 'Ad Set',
          adName: row.ad_name || 'Ad Creative',
          adId: row.ad_id || `meta-${Date.now()}`,
          date: dateRange || 'Last 7 Days',
          objective: purchases > 0 ? 'SALES' : 'LEADS',
          spend: Number(spend.toFixed(2)),
          impressions,
          reach,
          clicks,
          ctr: Number(ctr.toFixed(2)),
          cpc: Number(cpc.toFixed(2)),
          cpm: Number(cpm.toFixed(2)),
          landingPageViews: lpViews,
          leads,
          purchases,
          conversions,
          conversionRate: lpViews > 0 ? Number(((conversions / lpViews) * 100).toFixed(2)) : 0,
          cpl: leads > 0 ? Number((spend / leads).toFixed(2)) : 0,
          cpa: Number(cpa.toFixed(2)),
          revenue: Number(revenue.toFixed(2)),
          roas: Number(roas.toFixed(2)),
          primaryText: '',
          headline: row.ad_name || '',
          description: '',
          cta: 'LEARN_MORE'
        };
      });

      return NextResponse.json({
        success: true,
        records: normalizedRecords,
        count: normalizedRecords.length
      });
    }

    return NextResponse.json({ error: 'Invalid action specified.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error processing Meta API.' },
      { status: 500 }
    );
  }
}
