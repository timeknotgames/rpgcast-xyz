import type { APIRoute } from 'astro';
import { getDb } from '../../lib/db';

// GET: List all cryptofae species or wallet's discoveries
export const GET: APIRoute = async ({ url }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const wallet = url.searchParams.get('wallet');
    const guild = url.searchParams.get('guild');
    const speciesId = url.searchParams.get('id');

    const sql = getDb();

    if (speciesId) {
      // Get single species details
      const species = await sql`
        SELECT cs.*,
          (SELECT COUNT(*) FROM cryptofae_discoveries WHERE species_id = cs.id) as discovery_count
        FROM cryptofae_species cs
        WHERE cs.id = ${speciesId}
      `;

      if (species.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Species not found',
        }), { status: 404, headers });
      }

      return new Response(JSON.stringify({
        success: true,
        species: species[0],
      }), { headers });
    }

    if (wallet) {
      // Get wallet's discovered cryptofae
      const discoveries = await sql`
        SELECT cd.*, cs.name, cs.element, cs.guild_id, cs.rarity, cs.description, cs.image_url, cs.home_territory
        FROM cryptofae_discoveries cd
        JOIN cryptofae_species cs ON cd.species_id = cs.id
        WHERE cd.wallet_address = ${wallet}
        ORDER BY cd.discovered_at DESC
      `;

      // Also get undiscovered species for this wallet
      const undiscovered = await sql`
        SELECT cs.*
        FROM cryptofae_species cs
        WHERE cs.id NOT IN (
          SELECT species_id FROM cryptofae_discoveries WHERE wallet_address = ${wallet}
        )
        ORDER BY cs.guild_id
      `;

      return new Response(JSON.stringify({
        success: true,
        discovered: discoveries,
        undiscovered: undiscovered.map(s => ({
          id: s.id,
          name: '???',
          element: s.element,
          guild_id: s.guild_id,
          rarity: s.rarity,
          hint: s.discovery_hint,
          home_territory: s.home_territory,
        })),
        stats: {
          discovered: discoveries.length,
          total: discoveries.length + undiscovered.length,
        },
      }), { headers });
    }

    // List all species (public info)
    let species;
    if (guild) {
      species = await sql`
        SELECT cs.*,
          (SELECT COUNT(*) FROM cryptofae_discoveries WHERE species_id = cs.id) as discovery_count
        FROM cryptofae_species cs
        WHERE cs.guild_id = ${guild}
        ORDER BY cs.rarity DESC, cs.name
      `;
    } else {
      species = await sql`
        SELECT cs.*,
          (SELECT COUNT(*) FROM cryptofae_discoveries WHERE species_id = cs.id) as discovery_count
        FROM cryptofae_species cs
        ORDER BY cs.guild_id, cs.rarity DESC
      `;
    }

    return new Response(JSON.stringify({
      success: true,
      species,
      total: species.length,
    }), { headers });

  } catch (error: any) {
    console.error('[Cryptofae] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to fetch cryptofae',
    }), { status: 500, headers });
  }
};

// POST: Discover a cryptofae (for game mechanics)
export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await request.json();
    const { wallet, speciesId, territoryId, bondedTokenMint, nickname } = body;

    if (!wallet || !speciesId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Wallet and speciesId required',
      }), { status: 400, headers });
    }

    const sql = getDb();

    // Check if already discovered
    const existing = await sql`
      SELECT id FROM cryptofae_discoveries
      WHERE wallet_address = ${wallet} AND species_id = ${speciesId}
    `;

    if (existing.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'You have already discovered this cryptofae',
      }), { status: 400, headers });
    }

    // Verify species exists
    const species = await sql`
      SELECT * FROM cryptofae_species WHERE id = ${speciesId}
    `;

    if (species.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Species not found',
      }), { status: 404, headers });
    }

    // Create discovery
    const result = await sql`
      INSERT INTO cryptofae_discoveries (
        wallet_address,
        species_id,
        discovery_territory,
        bonded_token_mint,
        nickname
      ) VALUES (
        ${wallet},
        ${speciesId},
        ${territoryId || species[0].home_territory},
        ${bondedTokenMint || null},
        ${nickname || null}
      )
      RETURNING id
    `;

    return new Response(JSON.stringify({
      success: true,
      discoveryId: result[0].id,
      cryptofae: {
        ...species[0],
        nickname,
        bondedToken: bondedTokenMint,
      },
      message: `You discovered a ${species[0].name}!`,
    }), { headers });

  } catch (error: any) {
    console.error('[Cryptofae] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to record discovery',
    }), { status: 500, headers });
  }
};
