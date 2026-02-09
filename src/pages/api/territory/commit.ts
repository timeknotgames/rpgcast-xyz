import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db';

// POST: Commit a token to a territory
export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await request.json();
    const { wallet, tokenMint, territoryId, signature } = body;

    // Validation
    if (!wallet || !tokenMint || !territoryId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: wallet, tokenMint, territoryId',
      }), { status: 400, headers });
    }

    // Validate territory ID format (e.g., D12OUT, D8UP)
    const validTerritoryPattern = /^D(2|4|6|8|10|12|20|100)(OUT|UP|DWN|U45|D45)$/;
    if (!validTerritoryPattern.test(territoryId)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid territory ID format',
      }), { status: 400, headers });
    }

    const sql = getDb();

    // Check if position already exists
    const existing = await sql`
      SELECT id FROM token_positions
      WHERE wallet_address = ${wallet}
        AND token_mint = ${tokenMint}
        AND territory_id = ${territoryId}
    `;

    if (existing.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Token already committed to this territory',
      }), { status: 400, headers });
    }

    // Create position
    const result = await sql`
      INSERT INTO token_positions (wallet_address, token_mint, territory_id)
      VALUES (${wallet}, ${tokenMint}, ${territoryId})
      RETURNING id
    `;

    // Update territory control strength
    // Count all positions in this territory
    const territoryPositions = await sql`
      SELECT COUNT(*) as count FROM token_positions
      WHERE territory_id = ${territoryId}
    `;

    await sql`
      UPDATE territory_control
      SET control_strength = ${territoryPositions[0].count},
          last_changed = NOW()
      WHERE territory_id = ${territoryId}
    `;

    return new Response(JSON.stringify({
      success: true,
      positionId: result[0].id,
      message: `Token committed to ${territoryId}`,
    }), { headers });

  } catch (error: any) {
    console.error('[TerritoryCommit] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to commit token',
    }), { status: 500, headers });
  }
};

// DELETE: Remove a token commitment
export const DELETE: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await request.json();
    const { wallet, tokenMint, territoryId } = body;

    if (!wallet || !tokenMint || !territoryId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields',
      }), { status: 400, headers });
    }

    const sql = getDb();

    const result = await sql`
      DELETE FROM token_positions
      WHERE wallet_address = ${wallet}
        AND token_mint = ${tokenMint}
        AND territory_id = ${territoryId}
      RETURNING id
    `;

    if (result.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Position not found',
      }), { status: 404, headers });
    }

    // Update territory control strength
    const territoryPositions = await sql`
      SELECT COUNT(*) as count FROM token_positions
      WHERE territory_id = ${territoryId}
    `;

    await sql`
      UPDATE territory_control
      SET control_strength = ${territoryPositions[0].count},
          last_changed = NOW()
      WHERE territory_id = ${territoryId}
    `;

    return new Response(JSON.stringify({
      success: true,
      message: 'Commitment removed',
    }), { headers });

  } catch (error: any) {
    console.error('[TerritoryCommit] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to remove commitment',
    }), { status: 500, headers });
  }
};
