import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db';

export const GET: APIRoute = async ({ url }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const verifiedOnly = url.searchParams.get('verified') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '50');

    const sql = getDb();

    let champions;
    if (verifiedOnly) {
      champions = await sql`
        SELECT * FROM champions
        WHERE is_active = true AND is_verified = true
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    } else {
      champions = await sql`
        SELECT * FROM champions
        WHERE is_active = true
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    }

    return new Response(JSON.stringify({
      success: true,
      champions: champions || [],
      count: champions?.length || 0,
    }), { headers });

  } catch (error: any) {
    console.error('[ChampionList] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      champions: [],
    }), { status: 500, headers });
  }
};
