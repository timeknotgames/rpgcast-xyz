// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Main Server Entry Point
// Launches telnet + WebSocket servers with shared world state
// ═══════════════════════════════════════════════════════════════
import { World } from '../engine/world.js';
import { GameLoop } from '../engine/game-loop.js';
import { ALL_ROOMS } from '../data/rooms.js';
import { FUGITIVE_SEAS_ROOMS } from '../data/rooms-fugitive-seas.js';
import { createTelnetServer } from './telnet.js';
import { createWebSocketServer } from './websocket.js';
import { initializeSchema, pool } from '../auth/db.js';
import { isPersistenceEnabled } from '../auth/db.js';
// ── CONFIGURATION ──
const TELNET_PORT = parseInt(process.env.MUD_TELNET_PORT || '4000', 10);
const WS_PORT = parseInt(process.env.MUD_WS_PORT || '4001', 10);
// ── BOOT SEQUENCE ──
async function boot() {
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('  ⚔️  THE CRYING DEPTHS MUD');
    console.log('  A Quillverse Adventure');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    // 0. Initialize database schema (if DATABASE_URL set)
    if (isPersistenceEnabled()) {
        console.log('🗄️  Initializing database (crying_depths schema)...');
        await initializeSchema();
    }
    else {
        console.log('⚠️  No DATABASE_URL — running in anonymous/ephemeral mode');
    }
    // 1. Initialize world with all rooms (both campaigns)
    const allRooms = [...ALL_ROOMS, ...FUGITIVE_SEAS_ROOMS];
    console.log(`📦 Loading ${allRooms.length} rooms (${ALL_ROOMS.length} Crying Depths + ${FUGITIVE_SEAS_ROOMS.length} Fugitive Seas)...`);
    const world = new World(allRooms);
    console.log(`✅ World initialized: ${world.getRoomList().length} rooms loaded`);
    // 2. Create game loop
    const gameLoop = new GameLoop(world);
    // 3. Start servers
    console.log('');
    const telnetServer = createTelnetServer(gameLoop, TELNET_PORT);
    const wsServer = createWebSocketServer(gameLoop, WS_PORT);
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('  🟢 MUD SERVER IS RUNNING');
    console.log(`  Telnet:    telnet localhost ${TELNET_PORT}`);
    console.log(`  WebSocket: ws://localhost ${WS_PORT}`);
    console.log(`  Mudlet:    Connect to localhost:${TELNET_PORT}`);
    if (isPersistenceEnabled()) {
        console.log('  🗄️  Auth & persistence ENABLED');
    }
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    // ── GRACEFUL SHUTDOWN ──
    function shutdown(signal) {
        console.log(`\n📴 Received ${signal}. Shutting down gracefully...`);
        telnetServer.close(() => {
            console.log('  ✅ Telnet server closed');
        });
        wsServer.close(() => {
            console.log('  ✅ WebSocket server closed');
        });
        // Close database pool
        if (pool) {
            pool.end().then(() => console.log('  ✅ Database pool closed')).catch(() => { });
        }
        // Give connections 5 seconds to close
        setTimeout(() => {
            console.log('  👋 Goodbye from the Crying Depths.');
            process.exit(0);
        }, 5000);
    }
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}
// Run boot
boot().catch((err) => {
    console.error('❌ Boot failed:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map