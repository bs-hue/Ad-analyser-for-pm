import { NextRequest, NextResponse } from 'next/server';
import { verifyPublicDriveAccess } from '@/lib/driveDownloader';

/**
 * Google Drive Connection API Route
 * Tests if a Google Drive folder or file link is public and accessible.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'Google Drive URL is required.' },
        { status: 400 }
      );
    }

    const result = await verifyPublicDriveAccess(url);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error checking Google Drive link.' },
      { status: 400 }
    );
  }
}
