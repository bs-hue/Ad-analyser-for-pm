import { NextRequest, NextResponse } from 'next/server';
import { downloadPublicDriveVideo } from '@/lib/driveDownloader';
import { optimizeVideoForAI, cleanupTempVideo } from '@/lib/videoProcessor';
import { analyzeVideoWithGemini } from '@/lib/geminiVideoAnalyzer';
import { UnifiedAdRecord } from '@/lib/types';

export const maxDuration = 60; // Next.js extended execution limit

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { driveUrl, adRecord, productName, offerDescription, targetCpa } = body as {
      driveUrl?: string;
      adRecord: UnifiedAdRecord;
      productName?: string;
      offerDescription?: string;
      targetCpa?: number;
    };

    if (!adRecord) {
      return NextResponse.json({ error: 'Missing adRecord in request body.' }, { status: 400 });
    }

    const videoUrl = driveUrl || adRecord.driveUrl || adRecord.creativeUrl;
    if (!videoUrl) {
      return NextResponse.json(
        { error: 'No video link or Google Drive URL provided for this creative.' },
        { status: 400 }
      );
    }

    // Step 1: Download from public Google Drive or external URL
    const { filePath, sizeBytes } = await downloadPublicDriveVideo(
      videoUrl,
      `ad_${adRecord.creativeId || 'creative'}`
    );

    // Step 2: 720p Ephemeral Optimization (shrinks 97MB to ~5MB)
    const { processedFilePath, wasCompressed, optimizedSizeBytes } = await optimizeVideoForAI(filePath);

    // Step 3: Run Gemini Multimodal Video Analysis
    const creativeIntelligence = await analyzeVideoWithGemini({
      localFilePath: processedFilePath,
      adRecord,
      productName,
      offerDescription,
      targetCpa
    });

    return NextResponse.json({
      success: true,
      creativeIntelligence,
      meta: {
        originalSizeBytes: sizeBytes,
        optimizedSizeBytes,
        wasCompressed
      }
    });
  } catch (error: any) {
    console.error('Error analyzing video with Gemini:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze creative video.' },
      { status: 500 }
    );
  }
}
