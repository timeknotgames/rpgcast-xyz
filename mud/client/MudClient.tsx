// ═══════════════════════════════════════════════════════════════
// CRYING DEPTHS MUD — React Web Client
// Browser-based MUD terminal with WebSocket connection
// React island component for rpgcast.xyz (Astro)
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useEffect, useCallback, type FormEvent, type KeyboardEvent } from 'react';

// ── TYPES ──
interface WSMessage {
  type: 'welcome' | 'output' | 'error' | 'room_update' | 'pong' | 'system_info';
  message?: string;
  data?: Record<string, unknown>;
}

interface OutputLine {
  id: number;
  text: string;
  type: 'output' | 'input' | 'system' | 'error';
  timestamp: Date;
}

interface GameState {
  connected: boolean;
  playerName: string;
  system: string;
  roomId: string;
  roomName: string;
  roomEmoji: string;
  hp: number;
  maxHp: number;
  karma: number;
  roomsVisited: number;
}

// ── COMPONENT ──
export default function MudClient() {
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [gameState, setGameState] = useState<GameState>({
    connected: false,
    playerName: '',
    system: 'dice-godz',
    roomId: '',
    roomName: '',
    roomEmoji: '',
    hp: 0,
    maxHp: 0,
    karma: 50,
    roomsVisited: 0,
  });
  const [connectionPhase, setConnectionPhase] = useState<'name' | 'system' | 'playing'>('name');
  const [playerName, setPlayerName] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('dice-godz');

  const wsRef = useRef<WebSocket | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lineCounter = useRef(0);

  const WS_URL = typeof window !== 'undefined'
    ? `ws://${window.location.hostname}:4001`
    : 'ws://localhost:4001';

  // ── ADD OUTPUT LINE ──
  const addLine = useCallback((text: string, type: OutputLine['type'] = 'output') => {
    lineCounter.current++;
    setOutput(prev => [...prev.slice(-500), {
      id: lineCounter.current,
      text,
      type,
      timestamp: new Date(),
    }]);
  }, []);

  // ── SCROLL TO BOTTOM ──
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // ── FOCUS INPUT ──
  useEffect(() => {
    inputRef.current?.focus();
  }, [connectionPhase]);

  // ── WEBSOCKET CONNECTION ──
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      addLine('Connected to The Crying Depths server.', 'system');
    };

    ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data);

        switch (msg.type) {
          case 'welcome':
            addLine(msg.message || '', 'system');
            break;

          case 'output':
            addLine(msg.message || '', 'output');
            // Update game state from data
            if (msg.data) {
              setGameState(prev => ({
                ...prev,
                connected: true,
                roomId: (msg.data?.roomId as string) || prev.roomId,
                roomName: (msg.data?.roomName as string) || prev.roomName,
                roomEmoji: (msg.data?.roomEmoji as string) || prev.roomEmoji,
                hp: (msg.data?.hp as number) ?? prev.hp,
                maxHp: (msg.data?.maxHp as number) ?? prev.maxHp,
                karma: (msg.data?.karma as number) ?? prev.karma,
                system: (msg.data?.system as string) || prev.system,
                roomsVisited: (msg.data?.roomsVisited as number) ?? prev.roomsVisited,
              }));
            }
            break;

          case 'error':
            addLine(msg.message || 'Unknown error', 'error');
            break;

          case 'pong':
            break;
        }
      } catch {
        addLine(event.data, 'output');
      }
    };

    ws.onclose = () => {
      addLine('Disconnected from server.', 'system');
      setGameState(prev => ({ ...prev, connected: false }));
      setConnectionPhase('name');
    };

    ws.onerror = () => {
      addLine('Connection error. Is the MUD server running?', 'error');
    };
  }, [WS_URL, addLine]);

  // ── SEND COMMAND ──
  const sendCommand = useCallback((cmd: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: 'command', input: cmd }));
    addLine(`> ${cmd}`, 'input');
    setCommandHistory(prev => [...prev.slice(-50), cmd]);
    setHistoryIndex(-1);
  }, [addLine]);

  // ── CONNECT TO GAME ──
  const connectToGame = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({
      type: 'connect',
      name: playerName || 'Adventurer',
      system: selectedSystem,
    }));
    setGameState(prev => ({
      ...prev,
      connected: true,
      playerName: playerName || 'Adventurer',
      system: selectedSystem,
    }));
    setConnectionPhase('playing');
  }, [playerName, selectedSystem]);

  // ── HANDLE SUBMIT ──
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    if (connectionPhase === 'playing') {
      sendCommand(trimmed);
    }

    setInput('');
  };

  // ── HISTORY NAVIGATION ──
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
  };

  // ── RENDER ──
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', minHeight: '600px',
      backgroundColor: '#0a0a0a', color: '#e0e0e0',
      fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", monospace',
      fontSize: '14px', borderRadius: '8px', overflow: 'hidden',
      border: '1px solid #333',
    }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 16px', backgroundColor: '#1a1a2e',
        borderBottom: '1px solid #333',
      }}>
        <span style={{ fontWeight: 'bold', color: '#e94560' }}>
          ⚔️ The Crying Depths MUD
        </span>
        {gameState.connected && (
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#888' }}>
            <span>{gameState.roomEmoji} {gameState.roomName}</span>
            {gameState.hp > 0 && (
              <span>❤️ {gameState.hp}/{gameState.maxHp}</span>
            )}
            <span>☯️ {gameState.karma}%</span>
            <span>🎮 {gameState.system}</span>
            <span>🗺️ {gameState.roomsVisited} rooms</span>
          </div>
        )}
      </div>

      {/* Output Area */}
      <div ref={outputRef} style={{
        flex: 1, overflowY: 'auto', padding: '16px',
        whiteSpace: 'pre-wrap', wordWrap: 'break-word',
        lineHeight: '1.5',
      }}>
        {output.map(line => (
          <div key={line.id} style={{
            color: line.type === 'input' ? '#4ecdc4'
                 : line.type === 'system' ? '#f7dc6f'
                 : line.type === 'error' ? '#e94560'
                 : '#e0e0e0',
            opacity: line.type === 'system' ? 0.8 : 1,
          }}>
            {line.text}
          </div>
        ))}
      </div>

      {/* Connection Phase: Name + System Selection */}
      {connectionPhase !== 'playing' && (
        <div style={{
          padding: '16px', backgroundColor: '#1a1a2e',
          borderTop: '1px solid #333',
        }}>
          {connectionPhase === 'name' && (
            <div>
              <div style={{ marginBottom: '8px', color: '#f7dc6f' }}>
                Enter your character name:
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  ref={inputRef}
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && playerName.trim()) setConnectionPhase('system'); }}
                  placeholder="Your name..."
                  maxLength={30}
                  style={{
                    flex: 1, padding: '8px 12px',
                    backgroundColor: '#0a0a0a', color: '#e0e0e0',
                    border: '1px solid #444', borderRadius: '4px',
                    fontFamily: 'inherit', fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => {
                    if (playerName.trim()) setConnectionPhase('system');
                  }}
                  style={{
                    padding: '8px 16px', backgroundColor: '#e94560',
                    color: 'white', border: 'none', borderRadius: '4px',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {connectionPhase === 'system' && (
            <div>
              <div style={{ marginBottom: '8px', color: '#f7dc6f' }}>
                Choose your game system:
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {[
                  { id: 'dice-godz', label: '🎲 Dice Godz', desc: 'TEK8 attainment system' },
                  { id: 'pathfinder', label: '📜 Pathfinder 1e', desc: 'd20 + modifiers' },
                  { id: 'mm3e', label: '🦸 M&M 3e', desc: 'Power levels' },
                ].map(sys => (
                  <button
                    key={sys.id}
                    onClick={() => setSelectedSystem(sys.id)}
                    style={{
                      flex: 1, padding: '12px',
                      backgroundColor: selectedSystem === sys.id ? '#e94560' : '#1a1a2e',
                      color: 'white',
                      border: `1px solid ${selectedSystem === sys.id ? '#e94560' : '#444'}`,
                      borderRadius: '4px', cursor: 'pointer',
                      fontFamily: 'inherit', textAlign: 'center',
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{sys.label}</div>
                    <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>{sys.desc}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  connect();
                  // Small delay to ensure WS is open before sending connect
                  setTimeout(connectToGame, 500);
                }}
                style={{
                  width: '100%', padding: '12px',
                  backgroundColor: '#4ecdc4', color: '#0a0a0a',
                  border: 'none', borderRadius: '4px',
                  cursor: 'pointer', fontFamily: 'inherit',
                  fontWeight: 'bold', fontSize: '16px',
                }}
              >
                Enter The Crying Depths
              </button>
            </div>
          )}
        </div>
      )}

      {/* Command Input (playing mode) */}
      {connectionPhase === 'playing' && (
        <form onSubmit={handleSubmit} style={{
          display: 'flex', gap: '8px', padding: '12px 16px',
          backgroundColor: '#111', borderTop: '1px solid #333',
        }}>
          <span style={{ color: '#4ecdc4', alignSelf: 'center' }}>&gt;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command..."
            autoComplete="off"
            autoFocus
            style={{
              flex: 1, padding: '8px',
              backgroundColor: 'transparent', color: '#e0e0e0',
              border: 'none', fontFamily: 'inherit', fontSize: '14px',
              outline: 'none',
            }}
          />
          <button type="submit" style={{
            padding: '8px 16px', backgroundColor: '#333',
            color: '#e0e0e0', border: '1px solid #444',
            borderRadius: '4px', cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            Send
          </button>
        </form>
      )}

      {/* Quick Commands Bar */}
      {connectionPhase === 'playing' && (
        <div style={{
          display: 'flex', gap: '4px', padding: '4px 16px 8px',
          backgroundColor: '#111', flexWrap: 'wrap',
        }}>
          {[
            { label: '⬆️ N', cmd: 'north' },
            { label: '⬇️ S', cmd: 'south' },
            { label: '➡️ E', cmd: 'east' },
            { label: '⬅️ W', cmd: 'west' },
            { label: '👀 Look', cmd: 'look' },
            { label: '🔍 Search', cmd: 'search' },
            { label: '🎒 Inv', cmd: 'inventory' },
            { label: '📊 Stats', cmd: 'stats' },
            { label: '🗺️ Map', cmd: 'map' },
            { label: '❓ Help', cmd: 'help' },
          ].map(btn => (
            <button
              key={btn.cmd}
              onClick={() => sendCommand(btn.cmd)}
              style={{
                padding: '4px 8px', backgroundColor: '#1a1a2e',
                color: '#888', border: '1px solid #333',
                borderRadius: '3px', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: '11px',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
