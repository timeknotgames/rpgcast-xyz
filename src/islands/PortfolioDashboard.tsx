import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import WalletProvider from './WalletProvider';
import { TEK8_GUILDS } from '../lib/tek8-guilds';
import { PETALS, POSITIONS } from '../lib/tek8-roads';

interface Token {
  id: number;
  mint_address: string;
  name: string;
  symbol: string;
  image_url: string;
  tek8_guild: string;
  rainbow_road: string;
  game_role: string;
}

interface Position {
  id: number;
  token_mint: string;
  territory_id: string;
  committed_at: string;
  influence_score: number;
}

interface Cryptofae {
  id: number;
  name: string;
  element: string;
  guild_id: string;
  rarity: string;
  description: string;
  image_url: string;
  nickname: string;
  bonded_token_mint: string;
}

interface Portfolio {
  createdTokens: Token[];
  importedTokens: Token[];
  positions: Position[];
  cryptofae: Cryptofae[];
  champion: any;
  stats: {
    tokensCreated: number;
    tokensImported: number;
    territoriesCommitted: number;
    cryptofaeDiscovered: number;
    isChampion: boolean;
  };
}

function PortfolioDashboardInner() {
  const { publicKey } = useWallet();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'tokens' | 'territories' | 'cryptofae'>('tokens');

  // Import modal state
  const [showImport, setShowImport] = useState(false);
  const [importMint, setImportMint] = useState('');
  const [importGuild, setImportGuild] = useState('');
  const [importing, setImporting] = useState(false);

  // Commit modal state
  const [showCommit, setShowCommit] = useState(false);
  const [commitToken, setCommitToken] = useState<Token | null>(null);
  const [commitTerritory, setCommitTerritory] = useState('');
  const [committing, setCommitting] = useState(false);

  useEffect(() => {
    if (publicKey) {
      fetchPortfolio();
    }
  }, [publicKey]);

  const fetchPortfolio = async () => {
    if (!publicKey) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/portfolio?wallet=${publicKey.toBase58()}`);
      const data = await res.json();

      if (data.success) {
        setPortfolio(data);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImportToken = async () => {
    if (!publicKey || !importMint) return;

    try {
      setImporting(true);
      const res = await fetch('/api/tokens/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mintAddress: importMint,
          importedBy: publicKey.toBase58(),
          tek8Guild: importGuild || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowImport(false);
        setImportMint('');
        setImportGuild('');
        fetchPortfolio();
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setImporting(false);
    }
  };

  const handleCommitToken = async () => {
    if (!publicKey || !commitToken || !commitTerritory) return;

    try {
      setCommitting(true);
      const res = await fetch('/api/territory/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: publicKey.toBase58(),
          tokenMint: commitToken.mint_address,
          territoryId: commitTerritory,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowCommit(false);
        setCommitToken(null);
        setCommitTerritory('');
        fetchPortfolio();
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCommitting(false);
    }
  };

  const getGuildInfo = (guildId: string) => {
    return TEK8_GUILDS.find(g => g.id === guildId);
  };

  const getTerritoryName = (territoryId: string) => {
    const match = territoryId.match(/^(D\d+)(OUT|UP|DWN|U45|D45)$/);
    if (!match) return territoryId;

    const [, guild, pos] = match;
    const petal = PETALS[guild];
    const position = POSITIONS[pos as keyof typeof POSITIONS];

    return `${petal?.element || guild} ${position?.name || pos}`;
  };

  const allTokens = [
    ...(portfolio?.createdTokens || []),
    ...(portfolio?.importedTokens || []),
  ];

  if (!publicKey) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-400 mb-6">
          View your tokens, territories, and cryptofae discoveries.
        </p>
        <WalletMultiButton />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading your portfolio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-purple-400">{portfolio?.stats.tokensCreated || 0}</p>
          <p className="text-sm text-gray-400">Tokens Created</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-blue-400">{portfolio?.stats.tokensImported || 0}</p>
          <p className="text-sm text-gray-400">Tokens Imported</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-400">{portfolio?.stats.territoriesCommitted || 0}</p>
          <p className="text-sm text-gray-400">Territories</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-yellow-400">{portfolio?.stats.cryptofaeDiscovered || 0}</p>
          <p className="text-sm text-gray-400">Cryptofae</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700">
        {(['tokens', 'territories', 'cryptofae'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tokens Tab */}
      {activeTab === 'tokens' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Your Tokens</h3>
            <button
              onClick={() => setShowImport(true)}
              className="btn btn-secondary text-sm"
            >
              + Import Token
            </button>
          </div>

          {allTokens.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-400 mb-4">No tokens yet</p>
              <div className="flex justify-center gap-4">
                <a href="/launch" className="btn btn-primary">Create Token</a>
                <button onClick={() => setShowImport(true)} className="btn btn-secondary">
                  Import Existing
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {allTokens.map(token => {
                const guild = getGuildInfo(token.tek8_guild);
                const hasPosition = portfolio?.positions.some(p => p.token_mint === token.mint_address);

                return (
                  <div key={token.mint_address} className="card flex items-center gap-4">
                    {token.image_url ? (
                      <img src={token.image_url} alt={token.name} className="w-12 h-12 rounded-lg" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center">
                        <span className="text-xl">{token.symbol?.[0] || '?'}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold">{token.name || 'Unknown'}</h4>
                      <p className="text-sm text-gray-400">{token.symbol}</p>
                      {guild && (
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-1"
                          style={{ backgroundColor: guild.color + '30', color: guild.color }}>
                          {guild.dice} {guild.element}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {hasPosition ? (
                        <span className="text-green-400 text-sm">Committed</span>
                      ) : (
                        <button
                          onClick={() => { setCommitToken(token); setShowCommit(true); }}
                          className="btn btn-primary text-sm"
                        >
                          Commit to Territory
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Territories Tab */}
      {activeTab === 'territories' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Your Territory Commitments</h3>

          {(portfolio?.positions?.length || 0) === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-400 mb-4">No territory commitments yet</p>
              <p className="text-sm text-gray-500">
                Commit your tokens to territories to influence the Quillverse map.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {portfolio?.positions.map(pos => (
                <div key={pos.id} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold">{getTerritoryName(pos.territory_id)}</h4>
                      <p className="text-sm text-gray-400 font-mono">{pos.token_mint.slice(0, 8)}...</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400">+{pos.influence_score} Influence</p>
                      <p className="text-xs text-gray-500">
                        Since {new Date(pos.committed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cryptofae Tab */}
      {activeTab === 'cryptofae' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Cryptofae Collection</h3>

          {(portfolio?.cryptofae?.length || 0) === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-400 mb-4">No cryptofae discovered yet</p>
              <p className="text-sm text-gray-500">
                Explore territories to discover cryptofae companions!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {portfolio?.cryptofae.map(cf => {
                const guild = getGuildInfo(cf.guild_id);
                return (
                  <div key={cf.id} className="card">
                    <div className="flex items-start gap-4">
                      {cf.image_url ? (
                        <img src={cf.image_url} alt={cf.name} className="w-16 h-16 rounded-lg" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: guild?.color + '30' }}>
                          <span className="text-2xl">🔮</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold">{cf.nickname || cf.name}</h4>
                        <p className="text-sm text-gray-400">{cf.element} • {cf.rarity}</p>
                        <p className="text-xs text-gray-500 mt-1">{cf.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Import Existing Token</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Token Mint Address *</label>
                <input
                  type="text"
                  value={importMint}
                  onChange={(e) => setImportMint(e.target.value)}
                  placeholder="Enter Solana token mint address..."
                  className="input font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">TEK8 Guild (Optional)</label>
                <select
                  value={importGuild}
                  onChange={(e) => setImportGuild(e.target.value)}
                  className="input"
                >
                  <option value="">Select a guild...</option>
                  {TEK8_GUILDS.map(guild => (
                    <option key={guild.id} value={guild.id}>
                      {guild.dice} - {guild.element}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowImport(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportToken}
                  disabled={importing || !importMint}
                  className="btn btn-primary flex-1"
                >
                  {importing ? 'Importing...' : 'Import'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Commit Modal */}
      {showCommit && commitToken && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Commit to Territory</h3>
            <p className="text-gray-400 mb-4">
              Commit <strong>{commitToken.name || commitToken.symbol}</strong> to influence a territory.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Select Territory *</label>
                <select
                  value={commitTerritory}
                  onChange={(e) => setCommitTerritory(e.target.value)}
                  className="input"
                >
                  <option value="">Choose a territory...</option>
                  {TEK8_GUILDS.map(guild => (
                    <optgroup key={guild.id} label={`${guild.dice} - ${guild.element}`}>
                      {Object.entries(POSITIONS).map(([posId, pos]) => (
                        <option key={guild.id + posId} value={guild.id + posId}>
                          {guild.element} {pos.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => { setShowCommit(false); setCommitToken(null); }}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommitToken}
                  disabled={committing || !commitTerritory}
                  className="btn btn-gold flex-1"
                >
                  {committing ? 'Committing...' : 'Commit Token'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PortfolioDashboard() {
  return (
    <WalletProvider>
      <PortfolioDashboardInner />
    </WalletProvider>
  );
}
