import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db';

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await request.json();
    const {
      walletAddress,
      displayName,
      bio,
      profileImageUrl,
      primaryGuild,
      discordHandle,
      twitterHandle,
      signature,
      message,
    } = body;

    // Validation
    if (!walletAddress) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Wallet address required',
      }), { status: 400, headers });
    }

    if (!displayName || displayName.trim().length < 2) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Display name must be at least 2 characters',
      }), { status: 400, headers });
    }

    if (!signature || !message) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Signature required for verification',
      }), { status: 400, headers });
    }

    const sql = getDb();

    // Check if already registered
    const existing = await sql`
      SELECT id FROM champions WHERE wallet_address = ${walletAddress}
    `;

    if (existing.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'You are already registered as a Champion',
        championId: existing[0].id,
      }), { status: 400, headers });
    }

    // Insert new champion
    const result = await sql`
      INSERT INTO champions (
        wallet_address,
        display_name,
        bio,
        profile_image_url,
        primary_guild,
        discord_handle,
        twitter_handle,
        is_verified,
        is_active,
        created_at
      ) VALUES (
        ${walletAddress},
        ${displayName.trim()},
        ${bio?.trim() || null},
        ${profileImageUrl?.trim() || null},
        ${primaryGuild || null},
        ${discordHandle?.trim() || null},
        ${twitterHandle?.trim().replace('@', '') || null},
        false,
        true,
        NOW()
      )
      RETURNING id
    `;

    return new Response(JSON.stringify({
      success: true,
      championId: result[0].id,
      message: 'Successfully registered as Champion!',
    }), { headers });

  } catch (error: any) {
    console.error('[ChampionRegister] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Registration failed',
    }), { status: 500, headers });
  }
};
