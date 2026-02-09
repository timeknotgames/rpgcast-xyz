import type { APIRoute } from 'astro';

const MOLTBOOK_API = 'https://www.moltbook.com/api/v1';

// POST: Verify a Moltbook agent's identity token
// Other services/agents can use this to verify they're talking to a legit Moltbook agent
// before interacting with rpgcast.xyz APIs
export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await request.json();
    const { token, audience } = body;

    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Identity token required',
      }), { status: 400, headers });
    }

    const appKey = process.env.MOLTBOOK_APP_KEY;
    if (!appKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Moltbook developer app not configured',
      }), { status: 500, headers });
    }

    // Verify with Moltbook
    const verifyRes = await fetch(`${MOLTBOOK_API}/agents/verify-identity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Moltbook-App-Key': appKey,
      },
      body: JSON.stringify({
        token,
        audience: audience || 'rpgcast.xyz',
      }),
    });

    const data = await verifyRes.json();

    if (!verifyRes.ok) {
      return new Response(JSON.stringify({
        success: false,
        error: data.error || 'Verification failed',
        code: data.code,
      }), { status: verifyRes.status, headers });
    }

    // Agent verified — return their identity info
    return new Response(JSON.stringify({
      success: true,
      verified: true,
      agent: data.data || data,
    }), { headers });

  } catch (error: any) {
    console.error('[Moltbook Verify] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Verification failed',
    }), { status: 500, headers });
  }
};
