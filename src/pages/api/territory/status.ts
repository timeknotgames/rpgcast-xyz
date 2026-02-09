import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db';

// GET: Fetch territory control status
export const GET: APIRoute = async ({ url }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const territoryId = url.searchParams.get('id');
    const guildId = url.searchParams.get('guild'); // Filter by guild (D12, D8, etc.)

    const sql = getDb();

    let territories;

    if (territoryId) {
      // Single territory with detailed info
      territories = await sql`
        SELECT tc.*,
          (SELECT COUNT(*) FROM token_positions WHERE territory_id = tc.territory_id) as commitment_count,
          (SELECT json_agg(json_build_object(
            'wallet', tp.wallet_address,
            'token', tp.token_mint,
            'influence', tp.influence_score,
            'since', tp.committed_at
          )) FROM token_positions tp WHERE tp.territory_id = tc.territory_id) as commitments
        FROM territory_control tc
        WHERE tc.territory_id = ${territoryId}
      `;
    } else if (guildId) {
      // All territories for a specific guild
      territories = await sql`
        SELECT tc.*,
          (SELECT COUNT(*) FROM token_positions WHERE territory_id = tc.territory_id) as commitment_count
        FROM territory_control tc
        WHERE tc.territory_id LIKE ${guildId + '%'}
        ORDER BY tc.territory_id
      `;
    } else {
      // All territories summary
      territories = await sql`
        SELECT tc.*,
          (SELECT COUNT(*) FROM token_positions WHERE territory_id = tc.territory_id) as commitment_count
        FROM territory_control tc
        ORDER BY tc.territory_id
      `;
    }

    // Get total stats
    const stats = await sql`
      SELECT
        COUNT(DISTINCT territory_id) as total_territories,
        COUNT(DISTINCT CASE WHEN controlling_token_mint IS NOT NULL THEN territory_id END) as controlled_territories,
        (SELECT COUNT(*) FROM token_positions) as total_commitments
      FROM territory_control
    `;

    return new Response(JSON.stringify({
      success: true,
      territories,
      stats: stats[0],
    }), { headers });

  } catch (error: any) {
    console.error('[TerritoryStatus] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to fetch territory status',
    }), { status: 500, headers });
  }
};
