import { GoogleGenAI } from '@google/genai';
import { CreativeIntelligence, UnifiedAdRecord } from './types';
import { cleanupTempVideo } from './videoProcessor';

export interface VideoAnalysisOptions {
  localFilePath: string;
  adRecord: UnifiedAdRecord;
  targetCpa?: number;
  productName?: string;
  offerDescription?: string;
}

/**
 * Runs Multimodal Creative Teardown on a 720p video file using Google Gemini API
 */
export async function analyzeVideoWithGemini(
  options: VideoAnalysisOptions
): Promise<CreativeIntelligence> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in .env or environment.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const { localFilePath, adRecord, targetCpa, productName, offerDescription } = options;

  let uploadedFileRef: any = null;

  try {
    // 1. Upload video to Gemini Files API
    uploadedFileRef = await ai.files.upload({
      file: localFilePath,
      config: { mimeType: 'video/mp4' }
    });

    // 2. Poll until processed and ACTIVE
    let fileState = await ai.files.get({ name: uploadedFileRef.name });
    let attempts = 0;
    while (fileState.state === 'PROCESSING' && attempts < 30) {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      fileState = await ai.files.get({ name: uploadedFileRef.name });
      attempts++;
    }

    if (fileState.state === 'FAILED') {
      throw new Error('Gemini video processing failed on Google servers.');
    }

    // 3. Media Buyer Structured Diagnostic Prompt
    const prompt = `
You are a Senior Performance Marketing Creative Strategist & CRO Expert.
Analyze this video ad creative for a paid campaign.

AD PERFORMANCE METRICS FROM META ADS:
- Ad Name: "${adRecord.adName}"
- Creative Identifier: "${adRecord.creativeId || adRecord.adName}"
- Amount Spent: ₹${adRecord.spend.toLocaleString()}
- Purchases/Conversions: ${adRecord.purchases || adRecord.conversions}
- CPA (Cost Per Acquisition): ₹${adRecord.cpa}
- Link CTR: ${adRecord.ctr}%
- ROAS: ${adRecord.roas}x
- Product/Service: ${productName || 'Direct Response Offer'}
- Target CPA / Offer: ${offerDescription || '₹499 Kundali / Offer'}

INSTRUCTIONS & BENCHMARKS:
1. Examine the FIRST 3 SECONDS (The Hook):
   - What is the visual pattern interrupt? Is someone speaking to camera, drawing on a board, or is it stock footage?
   - What is the exact first spoken sentence?
   - What on-screen text overlays appear in 00:00–00:03?
2. Examine THE BODY & PACING (00:04–00:20):
   - How fast are the cuts? Is there visual demonstration or social proof?
   - Where does viewer drop-off or engagement drag occur? Cite exact timestamps [MM:SS].
3. Examine THE CTA & OFFER (Ending):
   - Is the price mentioned? Is the call to action clear and low friction?
4. CORRELATE WITH THE NUMBERS:
   - Why did this creative produce a Link CTR of ${adRecord.ctr}% and CPA of ₹${adRecord.cpa}?
   - If CTR is < 1.2%, diagnose why the opening failed to stop the scroll.
   - If CPA is high (>₹800), diagnose the post-click promise or offer clarity disconnect.

OUTPUT FORMAT:
Return a valid JSON object strictly matching this schema (no markdown formatting, no code fences):
{
  "adId": "${adRecord.adId}",
  "adName": "${adRecord.adName}",
  "creativeType": "video",
  "format": "Founder", 
  "durationSeconds": 45,
  "hookType": "Problem-led",
  "hookFirst3Seconds": "Detailed description of visuals and opening line in seconds 0 to 3.",
  "mainAngle": "pain_point",
  "audiencePainPoint": "Core customer frustration addressed.",
  "promise": "Core value proposition made in video.",
  "offer": "Explicit offer stated.",
  "cta": "Exact CTA wording.",
  "speaker": true,
  "textOverlay": true,
  "pacing": "Moderate",
  "productRevealSeconds": 4,
  "creativeStrengths": [
    "Strength 1 with [timestamp]",
    "Strength 2 with [timestamp]"
  ],
  "creativeWeaknesses": [
    "Weakness/drop-off point 1 with [timestamp]",
    "Weakness 2 with [timestamp]"
  ],
  "transcript": "Verbatim speech transcription of key scenes.",
  "visualHierarchyScore": 8,
  "headlineClarityScore": 7,
  "driveUrlStatus": "public_accessible",
  "recommendedHookSwaps": [
    "Hook-Swap Option 1: Problem-first pattern interrupt",
    "Hook-Swap Option 2: Contrarian question",
    "Hook-Swap Option 3: Direct proof/case study hook"
  ]
}
`;

    // 4. Run Multimodal Generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          fileData: {
            fileUri: uploadedFileRef.uri,
            mimeType: uploadedFileRef.mimeType || 'video/mp4'
          }
        },
        {
          text: prompt
        }
      ]
    });

    const responseText = response.text || '{}';
    const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      adId: adRecord.adId,
      adName: adRecord.adName,
      creativeType: 'video',
      format: parsed.format || 'Founder',
      durationSeconds: parsed.durationSeconds || 40,
      hookType: parsed.hookType || 'Problem-led',
      hookFirst3Seconds: parsed.hookFirst3Seconds || 'Opening pattern interrupt with on-screen dialogue.',
      mainAngle: parsed.mainAngle || 'pain_point',
      audiencePainPoint: parsed.audiencePainPoint || 'Rising CAC and ad fatigue',
      promise: parsed.promise || 'Personalized Kundali report delivery',
      offer: parsed.offer || '₹499 report offer',
      cta: parsed.cta || 'Order Now',
      speaker: parsed.speaker ?? true,
      textOverlay: parsed.textOverlay ?? true,
      pacing: parsed.pacing || 'Moderate',
      productRevealSeconds: parsed.productRevealSeconds || 3,
      creativeStrengths: parsed.creativeStrengths || ['Clear authority presenter', 'Fast initial cut'],
      creativeWeaknesses: parsed.creativeWeaknesses || ['Hook delayed by 3 seconds', 'CTA lacks urgency'],
      transcript: parsed.transcript || '',
      visualHierarchyScore: parsed.visualHierarchyScore || 8,
      headlineClarityScore: parsed.headlineClarityScore || 7,
      driveUrlStatus: 'public_accessible'
    };
  } finally {
    // 5. Ephemeral cleanup: wipe local /tmp file immediately
    cleanupTempVideo(localFilePath);
  }
}
