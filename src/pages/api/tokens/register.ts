import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db';
import { TEK8_GUILDS } from '../../../lib/tek8-guilds';

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await request.json();
    const {
      mintAddress,
      creatorWallet,
      tek8Guild,
      rainbowRoad,
      gameRole,
      nationName,
      signature,
      message,
      // Additional fields when creating token directly via PumpPortal
      name: providedName,
      symbol: providedSymbol,
      description: providedDescription,
      imageUrl: providedImageUrl,
    } = body;

    // Validation
    if (!mintAddress || mintAddress.length < 32) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid mint address',
      }), { status: 400, headers });
    }

    if (!creatorWallet) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Creator wallet required',
      }), { status: 400, headers });
    }

    if (!tek8Guild || !TEK8_GUILDS.find(g => g.id === tek8Guild)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid TEK8 guild',
      }), { status: 400, headers });
    }

    if (!signature || !message) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Signature required for verification',
      }), { status: 400, headers });
    }

    // TODO: Verify signature cryptographically
    // For now, we trust the wallet adapter's signing process

    // Fetch token data from pump.fun (optional enhancement)
    let pumpfunData = null;
    try {
      const res = await fetch(`https://frontend-api.pump.fun/coins/${mintAddress}`);
      if (res.ok) {
        pumpfunData = await res.json();
      }
    } catch (e) {
      console.warn('[TokenRegister] Could not fetch pump.fun data:', e);
    }

    const sql = getDb();

    // Check if token already registered
    const existing = await sql`
      SELECT id FROM registered_tokens WHERE mint_address = ${mintAddress}
    `;

    if (existing.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Token already registered',
        tokenId: existing[0].id,
      }), { status: 400, headers });
    }

    // Insert new token (use provided values first, then fallback to pump.fun data)
    const tokenName = providedName || pumpfunData?.name || null;
    const tokenSymbol = providedSymbol || pumpfunData?.symbol || null;
    const tokenImageUrl = providedImageUrl || pumpfunData?.image_uri || null;
    const tokenDescription = providedDescription || pumpfunData?.description || null;

    const result = await sql`
      INSERT INTO registered_tokens (
        mint_address,
        creator_wallet,
        tek8_guild,
        rainbow_road,
        game_role,
        nation_name,
        verification_status,
        name,
        symbol,
        image_url,
        description,
        bonding_curve_complete,
        registered_at
      ) VALUES (
        ${mintAddress},
        ${creatorWallet},
        ${tek8Guild},
        ${rainbowRoad || null},
        ${gameRole || 'general'},
        ${nationName || null},
        'pending',
        ${tokenName},
        ${tokenSymbol},
        ${tokenImageUrl},
        ${tokenDescription},
        ${pumpfunData?.complete || false},
        NOW()
      )
      RETURNING id
    `;

    return new Response(JSON.stringify({
      success: true,
      tokenId: result[0].id,
      message: 'Token registered successfully! It will appear after verification.',
    }), { headers });

  } catch (error: any) {
    console.error('[TokenRegister] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Registration failed',
    }), { status: 500, headers });
  }
};
