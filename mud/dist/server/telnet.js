// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — Telnet Server
// Classic MUD telnet interface — compatible with Mudlet, TinTin++, etc.
// ═══════════════════════════════════════════════════════════════
import * as net from 'node:net';
import { createSession, removeSession, touchSession, broadcastToRoom, WELCOME_BANNER, saveSessionCharacter, } from './session.js';
import { registerUser, loginUser, loadCharacters, createCharacter } from '../auth/auth-handler.js';
import { isPersistenceEnabled } from '../auth/db.js';
// ANSI color codes for terminal clients
const ANSI = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
};
const PROMPT = `\r\n${ANSI.cyan}> ${ANSI.reset}`;
export function createTelnetServer(gameLoop, port = 4000) {
    const server = net.createServer((socket) => {
        let session = null;
        let inputBuffer = '';
        let state = 'auth_prompt';
        let authUser = null;
        let authToken = null;
        let pendingUsername = '';
        // Send with CRLF for telnet
        const send = (msg) => {
            try {
                socket.write(msg.replace(/\n/g, '\r\n') + PROMPT);
            }
            catch (_) {
                // Socket may be closed
            }
        };
        // Welcome
        socket.write(WELCOME_BANNER.replace(/\n/g, '\r\n'));
        if (isPersistenceEnabled()) {
            socket.write(`\r\n${ANSI.yellow}Choose an option:${ANSI.reset}\r\n`);
            socket.write(`  1. ${ANSI.green}Login${ANSI.reset}\r\n`);
            socket.write(`  2. ${ANSI.cyan}Register${ANSI.reset}\r\n`);
            socket.write(`  3. ${ANSI.dim}Play as Guest${ANSI.reset}\r\n`);
            socket.write(PROMPT);
        }
        else {
            socket.write(`\r\n${ANSI.yellow}What is your name, adventurer?${ANSI.reset}${PROMPT}`);
            state = 'name';
        }
        socket.on('data', async (data) => {
            // Handle telnet IAC commands (skip them)
            const bytes = Buffer.from(data);
            let text = '';
            for (let i = 0; i < bytes.length; i++) {
                if (bytes[i] === 0xFF) {
                    i += 2; // Skip IAC + command + option
                    continue;
                }
                if (bytes[i] === 0x08 || bytes[i] === 0x7F) {
                    // Backspace
                    inputBuffer = inputBuffer.slice(0, -1);
                    continue;
                }
                text += String.fromCharCode(bytes[i]);
            }
            inputBuffer += text;
            // Process on newline
            while (inputBuffer.includes('\n') || inputBuffer.includes('\r')) {
                const lineEnd = Math.min(inputBuffer.includes('\r') ? inputBuffer.indexOf('\r') : Infinity, inputBuffer.includes('\n') ? inputBuffer.indexOf('\n') : Infinity);
                const line = inputBuffer.slice(0, lineEnd).trim();
                inputBuffer = inputBuffer.slice(lineEnd + 1).replace(/^[\r\n]+/, '');
                if (!line)
                    continue;
                switch (state) {
                    // ── AUTH PROMPT ──
                    case 'auth_prompt': {
                        const choice = line.trim();
                        if (choice === '1' || choice.toLowerCase() === 'login') {
                            socket.write(`\r\n${ANSI.yellow}Username:${ANSI.reset}${PROMPT}`);
                            state = 'login_user';
                        }
                        else if (choice === '2' || choice.toLowerCase() === 'register') {
                            socket.write(`\r\n${ANSI.yellow}Choose a username:${ANSI.reset}${PROMPT}`);
                            state = 'register_user';
                        }
                        else if (choice === '3' || choice.toLowerCase() === 'guest') {
                            socket.write(`\r\n${ANSI.yellow}What is your name, adventurer?${ANSI.reset}${PROMPT}`);
                            state = 'name';
                        }
                        else {
                            send(`${ANSI.red}Choose 1, 2, or 3.${ANSI.reset}`);
                        }
                        break;
                    }
                    case 'login_user': {
                        pendingUsername = line.trim();
                        if (!pendingUsername) {
                            send(`${ANSI.red}Enter a username.${ANSI.reset}`);
                            break;
                        }
                        socket.write(`\r\n${ANSI.yellow}Password:${ANSI.reset}${PROMPT}`);
                        state = 'login_pass';
                        break;
                    }
                    case 'login_pass': {
                        const password = line.trim();
                        const result = await loginUser(pendingUsername, password);
                        if (result.success && result.user) {
                            authUser = result.user;
                            authToken = result.sessionToken || null;
                            const { characters } = await loadCharacters(result.user.id);
                            if (characters.length > 0) {
                                socket.write(`\r\n${ANSI.green}${result.message}${ANSI.reset}\r\n`);
                                socket.write(`\r\n${ANSI.yellow}Your characters:${ANSI.reset}\r\n`);
                                characters.forEach((c, i) => {
                                    socket.write(`  ${i + 1}. ${c.emoji} ${c.name} [${c.activeSystem.toUpperCase()}] Karma: ${c.karma}\r\n`);
                                });
                                socket.write(`  ${characters.length + 1}. ${ANSI.cyan}Create New Character${ANSI.reset}\r\n`);
                                socket.write(PROMPT);
                                socket.__characters = characters;
                                state = 'char_select';
                            }
                            else {
                                send(`${ANSI.green}${result.message}${ANSI.reset}\r\n${ANSI.yellow}What is your character name?${ANSI.reset}`);
                                state = 'name';
                            }
                        }
                        else {
                            send(`${ANSI.red}${result.message}${ANSI.reset}`);
                            socket.write(`\r\n${ANSI.yellow}Username:${ANSI.reset}${PROMPT}`);
                            state = 'login_user';
                        }
                        break;
                    }
                    case 'register_user': {
                        pendingUsername = line.trim().slice(0, 30).replace(/[^\w\s'-]/g, '');
                        if (pendingUsername.length < 2) {
                            send(`${ANSI.red}Username must be at least 2 characters.${ANSI.reset}`);
                            break;
                        }
                        socket.write(`\r\n${ANSI.yellow}Choose a password:${ANSI.reset}${PROMPT}`);
                        state = 'register_pass';
                        break;
                    }
                    case 'register_pass': {
                        const password = line.trim();
                        const result = await registerUser(pendingUsername, password);
                        if (result.success && result.user) {
                            authUser = result.user;
                            authToken = result.sessionToken || null;
                            send(`${ANSI.green}${result.message}${ANSI.reset}\r\n${ANSI.yellow}What is your character name?${ANSI.reset}`);
                            state = 'name';
                        }
                        else {
                            send(`${ANSI.red}${result.message}${ANSI.reset}`);
                            socket.write(`\r\n${ANSI.yellow}Choose a username:${ANSI.reset}${PROMPT}`);
                            state = 'register_user';
                        }
                        break;
                    }
                    case 'char_select': {
                        const characters = socket.__characters || [];
                        const idx = parseInt(line.trim(), 10) - 1;
                        if (idx === characters.length) {
                            // Create new character
                            send(`${ANSI.yellow}What is your new character name?${ANSI.reset}`);
                            state = 'name';
                            break;
                        }
                        if (idx < 0 || idx >= characters.length) {
                            send(`${ANSI.red}Choose 1 to ${characters.length + 1}.${ANSI.reset}`);
                            break;
                        }
                        const char = characters[idx];
                        const sys = char.activeSystem;
                        session = createSession(char.name, 'telnet', send, sys);
                        session.dbUser = authUser;
                        session.sessionToken = authToken;
                        session.dbCharacterId = char.id;
                        // Restore character state
                        session.playerState.emoji = char.emoji;
                        session.playerState.currentRoomId = char.currentRoomId;
                        session.playerState.karma = char.karma;
                        session.playerState.flags = char.flags || {};
                        session.playerState.inventory = char.inventory || [];
                        session.playerState.visitedRooms = new Set(char.visitedRooms || ['R01']);
                        if (char.diceGodzSheet)
                            session.playerState.diceGodzSheet = char.diceGodzSheet;
                        if (char.pathfinderSheet)
                            session.playerState.pathfinderSheet = char.pathfinderSheet;
                        if (char.mm3eSheet)
                            session.playerState.mm3eSheet = char.mm3eSheet;
                        gameLoop.world.addPlayer(session.playerState);
                        const lookMsg = gameLoop.world.lookRoom(session.id);
                        send(`\r\n${ANSI.green}Welcome back, ${char.name}! Resuming in ${sys.toUpperCase()}.${ANSI.reset}\r\n\r\n${lookMsg}`);
                        broadcastToRoom(session.playerState.currentRoomId, `📢 ${char.name} has entered the Crying Depths.`, session.id);
                        state = 'playing';
                        break;
                    }
                    case 'name': {
                        const name = line.slice(0, 30).replace(/[^\w\s'-]/g, '').trim();
                        if (!name || name.length < 2 || !/[a-zA-Z]/.test(name)) {
                            send(`${ANSI.red}Please enter a name (at least 2 characters, must contain a letter).${ANSI.reset}`);
                            break;
                        }
                        socket.write(`\r\n${ANSI.yellow}Choose your game system:${ANSI.reset}\r\n`);
                        socket.write(`  1. ${ANSI.cyan}Dice Godz${ANSI.reset} (TEK8 attainment system)\r\n`);
                        socket.write(`  2. ${ANSI.green}Pathfinder 1e${ANSI.reset} (d20 + modifiers)\r\n`);
                        socket.write(`  3. ${ANSI.magenta}Mutants & Masterminds 3e${ANSI.reset} (power levels)\r\n`);
                        socket.write(PROMPT);
                        // Store name temporarily
                        socket.__pendingName = name;
                        state = 'system';
                        break;
                    }
                    case 'system': {
                        const systemMap = {
                            '1': 'dice-godz', 'dice-godz': 'dice-godz', 'dg': 'dice-godz',
                            '2': 'pathfinder', 'pathfinder': 'pathfinder', 'pf': 'pathfinder', 'pf1e': 'pathfinder',
                            '3': 'mm3e', 'mm3e': 'mm3e', 'mm': 'mm3e', 'm&m': 'mm3e',
                        };
                        const system = systemMap[line.toLowerCase()];
                        if (!system) {
                            send(`${ANSI.red}Choose 1, 2, or 3.${ANSI.reset}`);
                            break;
                        }
                        socket.__pendingSystem = system;
                        socket.write(`\r\n${ANSI.yellow}Choose your campaign:${ANSI.reset}\r\n`);
                        socket.write(`  1. ${ANSI.cyan}Siege of the Crying Depths${ANSI.reset} — dungeon crawl, mogwai rebellion\r\n`);
                        socket.write(`  2. ${ANSI.green}Fugitive Seas${ANSI.reset} — pirate democracy, open ocean\r\n`);
                        socket.write(PROMPT);
                        state = 'campaign';
                        break;
                    }
                    case 'campaign': {
                        const campaignMap = {
                            '1': { room: 'R01', label: 'Siege of the Crying Depths' },
                            'depths': { room: 'R01', label: 'Siege of the Crying Depths' },
                            '2': { room: 'F01', label: 'Fugitive Seas' },
                            'seas': { room: 'F01', label: 'Fugitive Seas' },
                            'pirate': { room: 'F01', label: 'Fugitive Seas' },
                        };
                        const campaign = campaignMap[line.toLowerCase()];
                        if (!campaign) {
                            send(`${ANSI.red}Choose 1 or 2.${ANSI.reset}`);
                            break;
                        }
                        socket.__startRoom = campaign.room;
                        socket.__campaignLabel = campaign.label;
                        const system = socket.__pendingSystem;
                        if (system === 'dice-godz') {
                            socket.write(`\r\n${ANSI.yellow}Would you like to create your Dice Godz character now?${ANSI.reset}\r\n`);
                            socket.write(`  ${ANSI.cyan}Y${ANSI.reset} — Roll your Godz World Egg (full stats, combat, opulences)\r\n`);
                            socket.write(`  ${ANSI.dim}N${ANSI.reset} — Explore as guest (limited engagement — create later with "roll gwe")\r\n`);
                            socket.write(PROMPT);
                            state = 'char_create';
                        }
                        else {
                            // PF1e and MM3e: no in-MUD character creation yet — enter directly
                            const name = socket.__pendingName || 'Adventurer';
                            session = createSession(name, 'telnet', send, system, campaign.room);
                            if (authUser) {
                                session.dbUser = authUser;
                                session.sessionToken = authToken;
                                const newChar = await createCharacter(authUser.id, name, system);
                                if (newChar)
                                    session.dbCharacterId = newChar.id;
                            }
                            gameLoop.world.addPlayer(session.playerState);
                            const lookMsg = gameLoop.world.lookRoom(session.id);
                            const sysLabel = system === 'pathfinder' ? 'Pathfinder 1e' : 'M&M 3e';
                            send(`\r\n${ANSI.green}Welcome, ${name}! Playing ${sysLabel} in ${campaign.label}.${ANSI.reset}\n${ANSI.dim}Character sheets for ${sysLabel} coming soon to the MUD.${ANSI.reset}\n\n${lookMsg}`);
                            broadcastToRoom(session.playerState.currentRoomId, `📢 ${name} has entered ${campaign.label}.`, session.id);
                            state = 'playing';
                        }
                        break;
                    }
                    case 'char_create': {
                        const choice = line.toLowerCase();
                        const wantsCharacter = choice === 'y' || choice === 'yes' || choice.startsWith('roll');
                        const name = socket.__pendingName || 'Adventurer';
                        const system = (socket.__pendingSystem || 'dice-godz');
                        const startRoom = socket.__startRoom || 'R01';
                        const campaignLabel = socket.__campaignLabel || 'the Crying Depths';
                        session = createSession(name, 'telnet', send, system, startRoom);
                        if (authUser) {
                            session.dbUser = authUser;
                            session.sessionToken = authToken;
                            const newChar = await createCharacter(authUser.id, name, system);
                            if (newChar)
                                session.dbCharacterId = newChar.id;
                        }
                        gameLoop.world.addPlayer(session.playerState);
                        if (wantsCharacter) {
                            // Create character via game loop (reuses existing roll gwe handler)
                            const gweResult = gameLoop.processInput(session.id, 'roll gwe');
                            const lookMsg = gameLoop.world.lookRoom(session.id);
                            send(`\r\n${ANSI.green}Welcome, ${name}! Playing DICE GODZ in ${campaignLabel}.${ANSI.reset}\n\n${gweResult}\n\n${lookMsg}`);
                        }
                        else {
                            const lookMsg = gameLoop.world.lookRoom(session.id);
                            send(`\r\n${ANSI.green}Welcome, ${name}! Exploring ${campaignLabel} as a guest.${ANSI.reset}\n${ANSI.dim}Tip: Type "roll gwe" anytime to create your character for the full experience.${ANSI.reset}\n\n${lookMsg}`);
                        }
                        broadcastToRoom(session.playerState.currentRoomId, `📢 ${name} has entered ${campaignLabel}.`, session.id);
                        state = 'playing';
                        break;
                    }
                    case 'playing': {
                        if (!session)
                            break;
                        touchSession(session.id);
                        if (line.toLowerCase() === 'quit') {
                            const name = session.playerState.name;
                            // Save before quit
                            if (session.dbCharacterId) {
                                await saveSessionCharacter(session).catch(() => { });
                            }
                            broadcastToRoom(session.playerState.currentRoomId, `📢 ${name} has left the Crying Depths.`, session.id);
                            gameLoop.world.removePlayer(session.id);
                            removeSession(session.id);
                            socket.write(`\r\n${ANSI.yellow}Farewell, ${name}. Your progress has been saved.${ANSI.reset}\r\n`);
                            socket.end();
                            return;
                        }
                        const response = gameLoop.processInput(session.id, line);
                        send(response);
                        break;
                    }
                }
            }
        });
        socket.on('close', async () => {
            if (session) {
                if (session.dbCharacterId) {
                    await saveSessionCharacter(session).catch(() => { });
                }
                broadcastToRoom(session.playerState.currentRoomId, `📢 ${session.playerState.name} has disconnected.`, session.id);
                gameLoop.world.removePlayer(session.id);
                removeSession(session.id);
            }
        });
        socket.on('error', (err) => {
            console.error(`[TELNET] Socket error: ${err.message}`);
        });
        // Timeout inactive connections after 30 minutes
        socket.setTimeout(30 * 60 * 1000, () => {
            if (session) {
                session.send('⏰ Connection timed out due to inactivity.');
                gameLoop.world.removePlayer(session.id);
                removeSession(session.id);
            }
            socket.end();
        });
    });
    server.listen(port, () => {
        console.log(`🌐 Telnet MUD server listening on port ${port}`);
        console.log(`   Connect with: telnet localhost ${port}`);
        console.log(`   Or use Mudlet/TinTin++ pointed at localhost:${port}`);
    });
    return server;
}
//# sourceMappingURL=telnet.js.map