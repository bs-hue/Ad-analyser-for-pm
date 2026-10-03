import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { parseAgencyAuditWorkbook } from '@/lib/dataNormalizer';
import { dbSaveClientProfile, dbSavePeriodRecords, dbSaveExperiments } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'reference sheet', 'MKR-DATA-AI.xlsx');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Reference sheet not found at path: reference sheet/MKR-DATA-AI.xlsx' }, { status: 404 });
    }

    const fileBuf = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuf, { type: 'buffer' });
    const result = parseAgencyAuditWorkbook(workbook, 'client-ankit-batra');

    if (!result) {
      return NextResponse.json({ error: 'Could not parse reference workbook structure' }, { status: 400 });
    }

    // Auto-save to local embedded database data/mysql.db so it's persisted permanently
    if (result.clientProfile) {
      await dbSaveClientProfile(result.clientProfile as any);
    }

    for (const period of result.periods) {
      await dbSavePeriodRecords('client-ankit-batra', period.label, period.records);
    }

    if (result.pastLearnings && result.pastLearnings.length > 0) {
      const experiments = result.pastLearnings.map((l, i) => ({
        id: `exp-mkr-${i + 1}`,
        clientId: 'client-ankit-batra',
        title: l.test,
        hypothesis: l.learning || l.test,
        variable: 'Hook' as const,
        kpi: 'CPA' as const,
        status: 'Completed' as const,
        baselineMetric: 'Previous Angle Baseline',
        targetMetric: 'CPA < ₹450',
        currentResult: l.learning || 'Historical validated test',
        startDate: '2026-09-01',
        learnings: l.learning || l.test
      }));
      await dbSaveExperiments('client-ankit-batra', experiments);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully loaded MKR-DATA-AI.xlsx and synced to local mysql.db',
      periods: result.periods.map(p => ({
        label: p.label,
        recordCount: p.records.length,
        totalSpend: p.records.reduce((acc, r) => acc + (r.spend || 0), 0)
      })),
      clientProfile: result.clientProfile,
      pastLearningsCount: result.pastLearnings?.length || 0,
      workbookData: result
    });
  } catch (err: any) {
    console.error('[ReferenceSheetAPI] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
