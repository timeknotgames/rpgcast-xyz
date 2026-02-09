import type { APIRoute } from 'astro';
import { MoltbookClient } from '../../../lib/moltbook-client';
import { LUMINARA_IDENTITY } from '../../../lib/luminara-agent';
import { getDb } from '../../../lib/db';

// POST: Register Luminara on Moltbook
// This should only be called once. Stores credentials in the database.
export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await request.json();
    const { adminWallet } = body;

    // Basic admin check
    const adminWallets = (process.env.ADMIN_WALLETS || '').split(',');
    if (!adminWallet || !adminWallets.includes(adminWallet)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Unauthorized — admin wallet required',
      }), { status: 403, headers });
    }

    const sql = getDb();

    // Check if already registered
    const existing = await sql`
      SELECT value FROM platform_config WHERE key = 'moltbook_api_key'
    `;

    if (existing.length > 0 && existing[0].value) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Luminara is already registered on Moltbook',
        hint: 'Use GET /api/luminara/register to check status',
      }), { status: 400, headers });
    }

    // Register on Moltbook
    const credentials = await MoltbookClient.register(
      LUMINARA_IDENTITY.name,
      LUMINARA_IDENTITY.description,
    );

    // Store credentials in database
    await sql`
      INSERT INTO platform_config (key, value)
      VALUES ('moltbook_api_key', ${credentials.api_key})
      ON CONFLICT (key) DO UPDATE SET value = ${credentials.api_key}, updated_at = NOW()
    `;

    await sql`
      INSERT INTO platform_config (key, value)
      VALUES ('moltbook_agent_name', ${credentials.agent_name})
      ON CONFLICT (key) DO UPDATE SET value = ${credentials.agent_name}, updated_at = NOW()
    `;

    if (credentials.claim_url) {
      await sql`
        INSERT INTO platform_config (key, value)
        VALUES ('moltbook_claim_url', ${credentials.claim_url})
        ON CONFLICT (key) DO UPDATE SET value = ${credentials.claim_url}, updated_at = NOW()
      `;
    }

    if (credentials.verification_code) {
      await sql`
        INSERT INTO platform_config (key, value)
        VALUES ('moltbook_verification_code', ${credentials.verification_code})
        ON CONFLICT (key) DO UPDATE SET value = ${credentials.verification_code}, updated_at = NOW()
      `;
    }

    return new Response(JSON.stringify({
      success: true,
      agent_name: credentials.agent_name,
      claim_url: credentials.claim_url,
      verification_code: credentials.verification_code,
      message: 'Luminara registered on Moltbook! Visit the claim URL to verify ownership via Twitter/X.',
    }), { headers });

  } catch (error: any) {
    console.error('[Luminara Register] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to register Luminara',
    }), { status: 500, headers });
  }
};

// GET: Check Luminara's Moltbook status
export const GET: APIRoute = async () => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const sql = getDb();

    const config = await sql`
      SELECT key, value FROM platform_config
      WHERE key LIKE 'moltbook_%'
    `;

    if (config.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        registered: false,
        message: 'Luminara is not yet registered on Moltbook',
      }), { headers });
    }

    const configMap: Record<string, string> = {};
    config.forEach((row: any) => {
      configMap[row.key] = row.value;
    });

    // If we have an API key, check status on Moltbook
    let moltbookStatus = null;
    if (configMap.moltbook_api_key) {
      try {
        const client = new MoltbookClient(configMap.moltbook_api_key);
        moltbookStatus = await client.getStatus();
      } catch (e: any) {
        moltbookStatus = { error: e.message };
      }
    }

    return new Response(JSON.stringify({
      success: true,
      registered: true,
      agent_name: configMap.moltbook_agent_name,
      claim_url: configMap.moltbook_claim_url,
      verification_code: configMap.moltbook_verification_code,
      moltbook_status: moltbookStatus,
    }), { headers });

  } catch (error: any) {
    console.error('[Luminara Status] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to check status',
    }), { status: 500, headers });
  }
};
