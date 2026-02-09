import type { APIRoute } from 'astro';

const PUMPPORTAL_API = 'https://pumpportal.fun/api';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    console.log('[PumpTrade] Request:', JSON.stringify(body, null, 2));

    // Forward to PumpPortal trade-local endpoint
    const res = await fetch(`${PUMPPORTAL_API}/trade-local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log('[PumpTrade] Response status:', res.status);
    console.log('[PumpTrade] Response content-type:', res.headers.get('content-type'));

    // Check if response is JSON (error) or binary (transaction)
    const contentType = res.headers.get('content-type') || '';

    if (!res.ok || contentType.includes('application/json')) {
      const errText = await res.text();
      console.error('[PumpTrade] Error response:', errText);
      return new Response(JSON.stringify({
        success: false,
        error: `PumpPortal error: ${res.status} - ${errText}`,
      }), {
        status: res.ok ? 400 : res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return the raw transaction bytes
    const txData = await res.arrayBuffer();
    console.log('[PumpTrade] Transaction size:', txData.byteLength, 'bytes');

    return new Response(txData, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

  } catch (error: any) {
    console.error('[PumpTrade] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to create trade transaction',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
