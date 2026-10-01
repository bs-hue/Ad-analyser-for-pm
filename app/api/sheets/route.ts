import { NextRequest, NextResponse } from 'next/server';

/**
 * Google Sheets Proxy API Route
 * 
 * Fetches a public/shared Google Sheet as CSV to avoid CORS restrictions.
 * Accepts the full Google Sheets URL and extracts the spreadsheet ID.
 * Optionally accepts a `gid` query param to select a specific sheet tab.
 */

function extractSpreadsheetId(url: string): string | null {
  // Match patterns:
  // https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit...
  // https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/gviz/tq...
  // https://docs.google.com/spreadsheets/d/SPREADSHEET_ID
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function extractGid(url: string): string | null {
  const match = url.match(/[#&?]gid=(\d+)/);
  return match ? match[1] : null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sheetUrl = searchParams.get('url');

  if (!sheetUrl) {
    return NextResponse.json(
      { error: 'Missing "url" query parameter. Provide a Google Sheets URL.' },
      { status: 400 }
    );
  }

  const spreadsheetId = extractSpreadsheetId(sheetUrl);

  if (!spreadsheetId) {
    return NextResponse.json(
      { error: 'Invalid Google Sheets URL. Could not extract spreadsheet ID.' },
      { status: 400 }
    );
  }

  // Check for a specific sheet tab (gid)
  const gid = searchParams.get('gid') || extractGid(sheetUrl) || '0';

  // Build the CSV export URL
  const csvExportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;

  try {
    const response = await fetch(csvExportUrl, {
      headers: {
        'User-Agent': 'PerformanceMarketingIntelligence/1.0',
      },
      // Next.js edge: disable caching to always get fresh data
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Spreadsheet not found. Check if the URL is correct.' },
          { status: 404 }
        );
      }
      if (response.status === 403 || response.status === 401) {
        return NextResponse.json(
          { error: 'Access denied. Make sure the Google Sheet is shared as "Anyone with the link can view".' },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: `Failed to fetch sheet data. Google returned status ${response.status}.` },
        { status: response.status }
      );
    }

    const csvText = await response.text();

    // Check if we got an HTML response (usually means the sheet is private)
    if (csvText.trim().startsWith('<!DOCTYPE') || csvText.trim().startsWith('<html')) {
      return NextResponse.json(
        { error: 'The Google Sheet appears to be private. Please make it publicly accessible: Share → "Anyone with the link" → Viewer.' },
        { status: 403 }
      );
    }

    return new NextResponse(csvText, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Failed to connect to Google Sheets: ${err.message}` },
      { status: 500 }
    );
  }
}
