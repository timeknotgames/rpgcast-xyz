import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db';

export const GET: APIRoute = async ({ url }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const upcoming = url.searchParams.get('upcoming') === 'true';
    const championId = url.searchParams.get('championId');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const sql = getDb();

    let sessions;

    if (championId) {
      sessions = await sql`
        SELECT gs.*, c.display_name as champion_name
        FROM game_sessions gs
        JOIN champions c ON gs.champion_id = c.id
        WHERE gs.champion_id = ${parseInt(championId)}
        ORDER BY gs.session_date DESC
        LIMIT ${limit}
      `;
    } else if (upcoming) {
      sessions = await sql`
        SELECT gs.*, c.display_name as champion_name
        FROM game_sessions gs
        JOIN champions c ON gs.champion_id = c.id
        WHERE gs.session_date > NOW()
        AND gs.status = 'scheduled'
        ORDER BY gs.session_date ASC
        LIMIT ${limit}
      `;
    } else {
      sessions = await sql`
        SELECT gs.*, c.display_name as champion_name
        FROM game_sessions gs
        JOIN champions c ON gs.champion_id = c.id
        ORDER BY gs.session_date DESC
        LIMIT ${limit}
      `;
    }

    return new Response(JSON.stringify({
      success: true,
      sessions: sessions || [],
      count: sessions?.length || 0,
    }), { headers });

  } catch (error: any) {
    console.error('[ChampionSessions] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      sessions: [],
    }), { status: 500, headers });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const body = await request.json();
    const {
      championId,
      title,
      description,
      sessionDate,
      platform,
      joinLink,
      featuredTokenIds,
    } = body;

    if (!championId || !title || !sessionDate) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: championId, title, sessionDate',
      }), { status: 400, headers });
    }

    const sql = getDb();

    const result = await sql`
      INSERT INTO game_sessions (
        champion_id,
        title,
        description,
        session_date,
        platform,
        join_link,
        featured_token_ids,
        status,
        created_at
      ) VALUES (
        ${championId},
        ${title},
        ${description || null},
        ${sessionDate},
        ${platform || 'discord'},
        ${joinLink || null},
        ${featuredTokenIds || null},
        'scheduled',
        NOW()
      )
      RETURNING id
    `;

    return new Response(JSON.stringify({
      success: true,
      sessionId: result[0].id,
      message: 'Game session created!',
    }), { headers });

  } catch (error: any) {
    console.error('[CreateSession] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), { status: 500, headers });
  }
};
