import { NextRequest, NextResponse } from 'next/server';
import { generateLlmCompletion } from '@/lib/llmProvider';
import { ClientProfile } from '@/lib/types';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      client,
      product,
      offer,
      audience,
      winningInsight,
      platform,
      format,
      tone,
      objective
    } = body as {
      client: ClientProfile;
      product?: string;
      offer?: string;
      audience?: string;
      winningInsight?: string;
      platform?: string;
      format?: string;
      tone?: string;
      objective?: string;
    };

    const hasAiKey = Boolean(
      process.env.OPENROUTER_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.ANTHROPIC_API_KEY
    );

    const isAstrology = 
      (client?.name || '').toLowerCase().includes('btra') || 
      (product || client?.productService || '').toLowerCase().includes('kundali') ||
      (client?.businessName || '').toLowerCase().includes('astro');

    // If an AI key exists, invoke OpenRouter / Gemini / Claude
    if (hasAiKey) {
      const prompt = `
You are an elite Direct Response Performance Marketer, Creative Director, and Copywriter.
Generate a complete, high-converting ad creative concept and script.

CAMPAIGN PARAMETERS:
- Client / Brand: "${client?.name || 'Brand'}" (${client?.businessName || ''})
- Product / Service: "${product || client?.productService || 'Flagship Offer'}"
- Core Front-End Offer: "${offer || client?.mainOffer || 'Introductory Offer'}"
- Target Demographic / Audience: "${audience || client?.targetAudience || 'Target Audience'}"
- Format: "${format || 'Raw UGC Video'}"
- Ad Platform: "${platform || 'Meta Ads'}"
- Target Objective: "${objective || 'LEADS'}"
- Brand Tone: "${tone || client?.brandTone || 'Direct, Authoritative, High Urgency'}"
- Winning Insight / Angle: "${winningInsight || 'Address customer primary pain point in first 2 seconds'}"
- Brand Pain Points: ${JSON.stringify(client?.painPoints || [])}
- Target Desires: ${JSON.stringify(client?.desires || [])}
- Customer Objections: ${JSON.stringify(client?.customerObjections || [])}

INSTRUCTIONS:
1. Hook (0-3s): Punchy, stopping power, high curiosity or visceral problem call-out.
2. Primary Text: Direct response copy with clear problem-agitation-solution, bulleted proof points, and call to action.
3. Headline: Punchy 6-9 word headline for Meta Ads / feed placement.
4. CTA Button: Action-oriented CTA label (e.g., Order Now, Book Call, Get Report).
5. Creative Concept: Precise visual description of the visual scene, talent, camera angle, and on-screen overlays.
6. Video Script: Second-by-second timeline script (0-3s hook, 3-10s agitation, 10-25s solution/proof, 25-35s CTA).

OUTPUT FORMAT:
Return strictly a valid raw JSON object (no markdown, no backticks):
{
  "hook": "Opening hook text...",
  "primaryText": "Primary caption copy...",
  "headline": "Headline...",
  "cta": "CTA text...",
  "creativeConcept": "Visual layout and scene description...",
  "videoScript": "Timeline script..."
}
`;

      const llmResult = await generateLlmCompletion({
        prompt,
        systemPrompt: 'You are a direct-response creative strategist. Always respond in valid raw JSON only.',
        responseJson: true
      });

      if (llmResult?.text) {
        try {
          const cleanJson = llmResult.text.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          if (parsed.hook && parsed.primaryText) {
            return NextResponse.json({
              success: true,
              result: parsed,
              source: `${llmResult.source}_${llmResult.model}`
            });
          }
        } catch (parseErr) {
          console.warn('Failed parsing LLM ad response, using fallback:', parseErr);
        }
      }
    }

    // High quality deterministic fallback if no API key or failed parse
    const fallbackResult = isAstrology ? {
      hook: `“Career aur marriage mein lagatar rukawat aa rahi hai? Problem aapki mehnat mein nahi, 7th house aur Rahu-Ketu ke dosh mein ho sakti hai.”`,
      primaryText: `${client?.primaryTexts?.[0] || 'Aapki mehnat ke bawajood career mein progress nahi ho rahi? Ya marriage mein baar-baar delays aa rahe hain?'}\n\nDr. Ankiit Btra ki Master Kundali Report se jaaniye apne grah-nakshatro ke sahi upaay.\n\n✅ 100% Personalised Analysis\n✅ Simple Doable Remedies\n✅ Express PDF Delivery\n\n👉 Apni Kundali Report aaj hi claim karein (${client?.pricing || '₹499'}).`,
      headline: client?.headlines?.[1] || `Delay In Marriage & Career? Find Remedies Now 💍✨`,
      cta: client?.ctas?.[0] || `Order Now`,
      creativeConcept: `Dr. Ankiit Btra on-camera holding a Kundali birth chart, highlighting the 7th house and Saturn transit, cutting to WhatsApp testimonial screenshot showing marriage fixed in 90 days.`,
      videoScript: `0-3s: (Direct Eye-Contact Hook) "Aapka career aur shaadi kyu delay ho raha hai? Shayad aapke 7th house par dosh hai."\n3-10s: "90% log galat timing par decisions lete hain. Jab tak aapke graho ki sthiti align nahi hogi, tab tak rukaavate aati rahengi."\n10-25s: "Dr. Ankiit Btra ki Master Kundali Report mein hum aapko batate hain exact samay aur aasan upaay jo aapki life ki rukaavato ko door kare."\n25-35s: "Neeche diye gaye button par click karein aur apni personalized report sirf ${client?.pricing || '₹499'} mein order karein."`
    } : {
      hook: `“If your customer acquisition cost spiked this week, stop touching your bidding strategy—fix your first 3 seconds.”`,
      primaryText: `If your Meta CPA doubled this month, don't blame the algorithm. In 90% of the funnels we audited at ${client?.businessName || 'our agency'}, the bleed is never targeting—it's creative message match.\n\nHere is how we restructure ad hooks for ${product || client?.productService || 'your offer'} to generate qualified conversions under target CPA consistently.\n\nClaim your ${offer || client?.mainOffer || 'Growth Session'} today.`,
      headline: client?.headlines?.[0] || `Why Your Ads Bleed Cash (And The 3-Second Fix)`,
      cta: client?.ctas?.[0] || `Book Now`,
      creativeConcept: `Handheld smartphone camera zoom in on frustrated marketer reviewing live Ads Manager dashboard, switching to screen share of CPA drop with ${client?.usp || 'creative iteration'}.`,
      videoScript: `0-3s: (Frustrated face) "If your Meta CPA doubled this month, stop touching your bidding strategy."\n3-10s: "In 90% of accounts we audit, the problem isn't broad targeting. It's that your first 3 seconds don't call out a specific painful problem."\n10-25s: "Look at this campaign: we restructured the opening angle to directly address ${client?.painPoints?.[0] || 'the core pain point'} and CPA dropped in 14 days."\n25-35s: "Click below to get started with ${client?.name || 'us'} today."`
    };

    return NextResponse.json({
      success: true,
      result: fallbackResult,
      source: 'deterministic_template'
    });
  } catch (error: any) {
    console.error('Error generating ad:', error);
    return NextResponse.json({ error: error.message || 'Ad generation failed' }, { status: 500 });
  }
}
