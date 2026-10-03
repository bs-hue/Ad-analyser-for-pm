import { NextRequest, NextResponse } from 'next/server';
import { 
  testDbConnection, 
  initDbSchema, 
  dbSaveClientProfile, 
  dbGetClientProfile, 
  dbSavePeriodRecords, 
  dbGetPeriodRecords,
  dbSaveExperiments,
  dbGetExperiments
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'status';
  const clientId = searchParams.get('clientId');
  const periodLabel = searchParams.get('period') || 'Last 7 Days';

  if (action === 'status') {
    const status = await testDbConnection();
    return NextResponse.json({
      success: status.connected,
      message: status.message,
      dbPath: status.dbPath,
      engine: 'embedded-sql-sqlite',
      configured: true,
      credentialsRequired: false
    });
  }

  if (action === 'get_client') {
    if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 });
    const client = await dbGetClientProfile(clientId);
    return NextResponse.json({ success: Boolean(client), client });
  }

  if (action === 'get_records') {
    if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 });
    const records = await dbGetPeriodRecords(clientId, periodLabel);
    return NextResponse.json({ success: Boolean(records), records: records || [] });
  }

  if (action === 'get_experiments') {
    if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 });
    const experiments = await dbGetExperiments(clientId);
    return NextResponse.json({ success: Boolean(experiments), experiments: experiments || [] });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  let body: any = null;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { action, client, clientId, periodLabel, records, experiments } = body || {};

  if (action === 'init') {
    const ok = await initDbSchema();
    return NextResponse.json({ 
      success: ok, 
      message: ok ? 'Embedded SQL schema initialized in data/mysql.db' : 'Failed to initialize schema' 
    });
  }

  if (action === 'save_client') {
    if (!client || !client.id) {
      return NextResponse.json({ error: 'Missing client object' }, { status: 400 });
    }
    const ok = await dbSaveClientProfile(client);
    return NextResponse.json({ success: ok });
  }

  if (action === 'save_records') {
    if (!clientId || !periodLabel || !records) {
      return NextResponse.json({ error: 'Missing clientId, periodLabel, or records' }, { status: 400 });
    }
    const ok = await dbSavePeriodRecords(clientId, periodLabel, records);
    return NextResponse.json({ success: ok });
  }

  if (action === 'save_experiments') {
    if (!clientId || !experiments) {
      return NextResponse.json({ error: 'Missing clientId or experiments' }, { status: 400 });
    }
    const ok = await dbSaveExperiments(clientId, experiments);
    return NextResponse.json({ success: ok });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
