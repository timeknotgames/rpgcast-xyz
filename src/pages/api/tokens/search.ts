import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db';

export const GET: APIRoute = async ({ url }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const guild = url.searchParams.get('guild');
    const verified = url.searchParams.get('verified') === 'true';
    const role = url.searchParams.get('role');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    const sql = getDb();

    // Build query with filters
    let query = `
      SELECT * FROM registered_tokens
      WHERE 1=1
    `;
    const params: any[] = [];

    if (verified) {
      query += ` AND verification_status = 'verified'`;
    }

    if (guild) {
      params.push(guild);
      query += ` AND tek8_guild = $${params.length}`;
    }

    if (role) {
      params.push(role);
      query += ` AND game_role = $${params.length}`;
    }

    query += ` ORDER BY registered_at DESC LIMIT ${limit}`;

    // Execute with raw SQL (Neon doesn't support dynamic queries well)
    let tokens;
    if (params.length === 0) {
      if (verified) {
        tokens = await sql`
          SELECT * FROM registered_tokens
          WHERE verification_status = 'verified'
          ORDER BY registered_at DESC
          LIMIT ${limit}
        `;
      } else {
        tokens = await sql`
          SELECT * FROM registered_tokens
          ORDER BY registered_at DESC
          LIMIT ${limit}
        `;
      }
    } else if (guild && !role) {
      if (verified) {
        tokens = await sql`
          SELECT * FROM registered_tokens
          WHERE verification_status = 'verified'
          AND tek8_guild = ${guild}
          ORDER BY registered_at DESC
          LIMIT ${limit}
        `;
      } else {
        tokens = await sql`
          SELECT * FROM registered_tokens
          WHERE tek8_guild = ${guild}
          ORDER BY registered_at DESC
          LIMIT ${limit}
        `;
      }
    } else if (role && !guild) {
      if (verified) {
        tokens = await sql`
          SELECT * FROM registered_tokens
          WHERE verification_status = 'verified'
          AND game_role = ${role}
          ORDER BY registered_at DESC
          LIMIT ${limit}
        `;
      } else {
        tokens = await sql`
          SELECT * FROM registered_tokens
          WHERE game_role = ${role}
          ORDER BY registered_at DESC
          LIMIT ${limit}
        `;
      }
    } else {
      if (verified) {
        tokens = await sql`
          SELECT * FROM registered_tokens
          WHERE verification_status = 'verified'
          AND tek8_guild = ${guild}
          AND game_role = ${role}
          ORDER BY registered_at DESC
          LIMIT ${limit}
        `;
      } else {
        tokens = await sql`
          SELECT * FROM registered_tokens
          WHERE tek8_guild = ${guild}
          AND game_role = ${role}
          ORDER BY registered_at DESC
          LIMIT ${limit}
        `;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      tokens: tokens || [],
      count: tokens?.length || 0,
    }), { headers });

  } catch (error: any) {
    console.error('[TokenSearch] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      tokens: [],
    }), { status: 500, headers });
  }
};
