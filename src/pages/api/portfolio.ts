import type { APIRoute } from 'astro';
import { getDb } from '../../lib/db';

// GET: Fetch wallet's complete game state
export const GET: APIRoute = async ({ url }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const wallet = url.searchParams.get('wallet');

    if (!wallet) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Wallet address required',
      }), { status: 400, headers });
    }

    const sql = getDb();

    // Get registered tokens created by this wallet
    const createdTokens = await sql`
      SELECT * FROM registered_tokens
      WHERE creator_wallet = ${wallet}
      ORDER BY registered_at DESC
    `;

    // Get imported tokens by this wallet
    const importedTokens = await sql`
      SELECT * FROM imported_tokens
      WHERE imported_by = ${wallet}
      ORDER BY imported_at DESC
    `;

    // Get token positions (commitments to territories)
    const positions = await sql`
      SELECT tp.*, tc.controlling_token_mint, tc.control_strength, tc.contested
      FROM token_positions tp
      LEFT JOIN territory_control tc ON tp.territory_id = tc.territory_id
      WHERE tp.wallet_address = ${wallet}
      ORDER BY tp.committed_at DESC
    `;

    // Get cryptofae discoveries
    const cryptofae = await sql`
      SELECT cd.*, cs.name, cs.element, cs.guild_id, cs.rarity, cs.description, cs.image_url
      FROM cryptofae_discoveries cd
      JOIN cryptofae_species cs ON cd.species_id = cs.id
      WHERE cd.wallet_address = ${wallet}
      ORDER BY cd.discovered_at DESC
    `;

    // Get champion profile if exists
    const champion = await sql`
      SELECT * FROM champions WHERE wallet_address = ${wallet}
    `;

    return new Response(JSON.stringify({
      success: true,
      wallet,
      createdTokens,
      importedTokens,
      positions,
      cryptofae,
      champion: champion[0] || null,
      stats: {
        tokensCreated: createdTokens.length,
        tokensImported: importedTokens.length,
        territoriesCommitted: positions.length,
        cryptofaeDiscovered: cryptofae.length,
        isChampion: champion.length > 0,
      }
    }), { headers });

  } catch (error: any) {
    console.error('[Portfolio] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to fetch portfolio',
    }), { status: 500, headers });
  }
};
