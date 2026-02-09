import type { APIRoute } from 'astro';
import { LUMINARA_SYSTEM_PROMPT, buildLuminaraChatPrompt } from '../../../lib/luminara-agent';

// POST: Chat with Luminara
// Public endpoint — anyone can talk to Luminara
export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Message is required',
      }), { status: 400, headers });
    }

    if (message.length > 2000) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Message too long (max 2000 characters)',
      }), { status: 400, headers });
    }

    const openaiKey = process.env.OPENAI_API_KEY;

    if (!openaiKey) {
      // Fallback response when no OpenAI key
      return new Response(JSON.stringify({
        success: true,
        response: `🧚🏿‍♀️ *Luminara's rainbow light shimmers*\n\nGreetings, traveler. I hear your words echoing through the Rainbow Roads. My full voice is resting right now, but know this — the Quillverse welcomes all who seek to create, play, and heal.\n\nVisit rpgcast.xyz to begin your journey. The eight guilds await. ✨🌈`,
        model: 'fallback',
      }), { headers });
    }

    const userPrompt = buildLuminaraChatPrompt(message, context);

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: LUMINARA_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 600,
        temperature: 0.8,
      }),
    });

    const data = await res.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from AI model');
    }

    return new Response(JSON.stringify({
      success: true,
      response: data.choices[0].message.content,
      model: 'gpt-4o',
    }), { headers });

  } catch (error: any) {
    console.error('[Luminara Chat] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Luminara is unable to respond right now',
    }), { status: 500, headers });
  }
};
