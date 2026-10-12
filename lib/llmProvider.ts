import { GoogleGenAI } from '@google/genai';

export interface LlmRequestOptions {
  prompt: string;
  systemPrompt?: string;
  responseJson?: boolean;
}

export interface LlmResponse {
  text: string;
  model: string;
  source: 'openrouter' | 'gemini' | 'anthropic' | 'none';
}

/**
 * Universal LLM gateway supporting OpenRouter, Google Gemini, and Anthropic
 */
export async function generateLlmCompletion(options: LlmRequestOptions): Promise<LlmResponse | null> {
  const { prompt, systemPrompt, responseJson } = options;

  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  // 1. Prioritize OpenRouter if configured
  if (openrouterKey && openrouterKey.trim().length > 0) {
    const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';
    try {
      const messages: Array<{ role: string; content: string }> = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const requestBody: any = {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 3000,
      };

      if (responseJson) {
        requestBody.response_format = { type: 'json_object' };
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openrouterKey.trim()}`,
          'HTTP-Referer': 'https://github.com/bs-hue/Ad-analyser-for-pm',
          'X-Title': 'Ad Analyser for PM',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter API error (${response.status}):`, errorText);
        throw new Error(`OpenRouter error: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content || '';

      return {
        text: content,
        model,
        source: 'openrouter'
      };
    } catch (err) {
      console.error('Failed generating with OpenRouter, falling back to other providers:', err);
    }
  }

  // 2. Google Gemini fallback / provider
  if (geminiKey && geminiKey.trim().length > 0) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey.trim() });
      const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      
      const contents = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
      const response = await ai.models.generateContent({
        model: geminiModel,
        contents
      });

      return {
        text: response.text || '',
        model: geminiModel,
        source: 'gemini'
      };
    } catch (err) {
      console.error('Failed generating with Gemini:', err);
    }
  }

  // 3. Direct Anthropic Claude API fallback
  if (anthropicKey && anthropicKey.trim().length > 0) {
    try {
      const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
      const messages: Array<{ role: string; content: string }> = [
        { role: 'user', content: prompt }
      ];

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey.trim(),
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          system: systemPrompt || undefined,
          messages
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Anthropic error: ${errText}`);
      }

      const data = await response.json();
      const content = data?.content?.[0]?.text || '';

      return {
        text: content,
        model,
        source: 'anthropic'
      };
    } catch (err) {
      console.error('Failed generating with Anthropic:', err);
    }
  }

  return null;
}
