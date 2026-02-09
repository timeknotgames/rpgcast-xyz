import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db';
import { TEK8_GUILDS } from '../../../lib/tek8-guilds';

// Fetch token metadata from Solana
async function fetchSolanaTokenMetadata(mintAddress: string) {
  // Try Helius DAS API for token metadata
  const heliusKey = import.meta.env.HELIUS_API_KEY || process.env.HELIUS_API_KEY || '';

  try {
    const res = await fetch(`https://mainnet.helius-rpc.com/?api-key=${heliusKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'get-asset',
        method: 'getAsset',
        params: { id: mintAddress },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.result) {
        return {
          name: data.result.content?.metadata?.name || null,
          symbol: data.result.content?.metadata?.symbol || null,
          image: data.result.content?.links?.image || data.result.content?.files?.[0]?.uri || null,
          description: data.result.content?.metadata?.description || null,
          decimals: data.result.token_info?.decimals || 9,
        };
      }
    }
  } catch (e) {
    console.warn('[TokenImport] Helius DAS failed:', e);
  }

  // Fallback: try pump.fun API
  try {
    const pumpRes = await fetch(`https://frontend-api.pump.fun/coins/${mintAddress}`);
    if (pumpRes.ok) {
      const pumpData = await pumpRes.json();
      return {
        name: pumpData.name || null,
        symbol: pumpData.symbol || null,
        image: pumpData.image_uri || null,
        description: pumpData.description || null,
        decimals: 6, // pump.fun tokens are 6 decimals
      };
    }
  } catch (e) {
    console.warn('[TokenImport] pump.fun API failed:', e);
  }

  return null;
}

// POST: Import an existing Solana token
export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await request.json();
    const {
      mintAddress,
      importedBy,
      tek8Guild,
      rainbowRoad,
      gameRole,
      // Optional overrides if metadata fetch fails
      name: providedName,
      symbol: providedSymbol,
      description: providedDescription,
      imageUrl: providedImage,
    } = body;

    // Validation
    if (!mintAddress || mintAddress.length < 32) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid mint address',
      }), { status: 400, headers });
    }

    if (!importedBy) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Importer wallet required',
      }), { status: 400, headers });
    }

    if (tek8Guild && !TEK8_GUILDS.find(g => g.id === tek8Guild)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid TEK8 guild',
      }), { status: 400, headers });
    }

    const sql = getDb();

    // Check if already imported
    const existingImport = await sql`
      SELECT id FROM imported_tokens WHERE mint_address = ${mintAddress}
    `;

    if (existingImport.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Token already imported',
        tokenId: existingImport[0].id,
      }), { status: 400, headers });
    }

    // Check if it's a registered token (created via rpgcast.xyz)
    const existingRegistered = await sql`
      SELECT id FROM registered_tokens WHERE mint_address = ${mintAddress}
    `;

    if (existingRegistered.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Token already registered as a created token',
        tokenId: existingRegistered[0].id,
      }), { status: 400, headers });
    }

    // Fetch metadata from chain
    const metadata = await fetchSolanaTokenMetadata(mintAddress);

    // Use fetched data or provided overrides
    const tokenName = providedName || metadata?.name || null;
    const tokenSymbol = providedSymbol || metadata?.symbol || null;
    const tokenImage = providedImage || metadata?.image || null;
    const tokenDescription = providedDescription || metadata?.description || null;
    const tokenDecimals = metadata?.decimals || 9;

    // Determine source
    let source = 'solana';
    if (metadata?.decimals === 6) {
      source = 'pump.fun'; // pump.fun tokens have 6 decimals
    }

    // Insert imported token
    const result = await sql`
      INSERT INTO imported_tokens (
        mint_address,
        source,
        name,
        symbol,
        image_url,
        description,
        decimals,
        tek8_guild,
        rainbow_road,
        game_role,
        imported_by
      ) VALUES (
        ${mintAddress},
        ${source},
        ${tokenName},
        ${tokenSymbol},
        ${tokenImage},
        ${tokenDescription},
        ${tokenDecimals},
        ${tek8Guild || null},
        ${rainbowRoad || null},
        ${gameRole || 'general'},
        ${importedBy}
      )
      RETURNING id
    `;

    return new Response(JSON.stringify({
      success: true,
      tokenId: result[0].id,
      token: {
        mintAddress,
        name: tokenName,
        symbol: tokenSymbol,
        image: tokenImage,
        source,
        tek8Guild,
        rainbowRoad,
        gameRole: gameRole || 'general',
      },
      message: 'Token imported successfully',
    }), { headers });

  } catch (error: any) {
    console.error('[TokenImport] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to import token',
    }), { status: 500, headers });
  }
};

// GET: Search imported tokens
export const GET: APIRoute = async ({ url }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const guild = url.searchParams.get('guild');
    const wallet = url.searchParams.get('wallet');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    const sql = getDb();

    let tokens;

    if (wallet) {
      tokens = await sql`
        SELECT * FROM imported_tokens
        WHERE imported_by = ${wallet}
        ORDER BY imported_at DESC
        LIMIT ${limit}
      `;
    } else if (guild) {
      tokens = await sql`
        SELECT * FROM imported_tokens
        WHERE tek8_guild = ${guild}
        ORDER BY imported_at DESC
        LIMIT ${limit}
      `;
    } else {
      tokens = await sql`
        SELECT * FROM imported_tokens
        ORDER BY imported_at DESC
        LIMIT ${limit}
      `;
    }

    return new Response(JSON.stringify({
      success: true,
      tokens,
    }), { headers });

  } catch (error: any) {
    console.error('[TokenImport] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to fetch imported tokens',
    }), { status: 500, headers });
  }
};
