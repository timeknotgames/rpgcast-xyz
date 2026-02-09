import { useState, useEffect } from 'react';
import { TEK8_GUILDS } from '../lib/tek8-guilds';
import { PETALS } from '../lib/tek8-roads';
import { GAME_ROLES } from '../lib/config';
import UnverifiedDisclaimer, { hasAcceptedDisclaimer, VerificationBadge } from './UnverifiedDisclaimer';

interface RegisteredToken {
  id: number;
  mint_address: string;
  name: string;
  symbol: string;
  image_url: string;
  tek8_guild: string;
  rainbow_road: string;
  game_role: string;
  nation_name: string;
  verification_status: string;
  bonding_curve_complete: boolean;
  registered_at: string;
}

export default function TokenDiscovery() {
  const [tokens, setTokens] = useState<RegisteredToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [guildFilter, setGuildFilter] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [gameRoleFilter, setGameRoleFilter] = useState('');

  // Disclaimer
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  useEffect(() => {
    fetchTokens();
    setDisclaimerAccepted(hasAcceptedDisclaimer());
  }, []);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (guildFilter) params.set('guild', guildFilter);
      if (verifiedOnly) params.set('verified', 'true');
      if (gameRoleFilter) params.set('role', gameRoleFilter);

      const res = await fetch(`/api/tokens/search?${params}`);
      const data = await res.json();

      if (data.success) {
        setTokens(data.tokens || []);
      } else {
        setError(data.error || 'Failed to fetch tokens');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [guildFilter, verifiedOnly, gameRoleFilter]);

  const handleShowUnverified = () => {
    if (!disclaimerAccepted) {
      setShowDisclaimer(true);
    } else {
      setVerifiedOnly(false);
    }
  };

  const handleDisclaimerAccept = () => {
    setDisclaimerAccepted(true);
    setShowDisclaimer(false);
    setVerifiedOnly(false);
  };

  const getGuildInfo = (guildId: string) => {
    return TEK8_GUILDS.find(g => g.id === guildId);
  };

  return (
    <div>
      {/* Filters */}
      <div className="card mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Guild Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-400 mb-1">TEK8 Guild</label>
            <select
              value={guildFilter}
              onChange={(e) => setGuildFilter(e.target.value)}
              className="input"
            >
              <option value="">All Guilds</option>
              {TEK8_GUILDS.map(guild => (
                <option key={guild.id} value={guild.id}>
                  {guild.dice} - {guild.element} ({guild.name})
                </option>
              ))}
            </select>
          </div>

          {/* Game Role Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-400 mb-1">Game Role</label>
            <select
              value={gameRoleFilter}
              onChange={(e) => setGameRoleFilter(e.target.value)}
              className="input"
            >
              <option value="">All Roles</option>
              {GAME_ROLES.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          {/* Verified Toggle */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => {
                  if (!e.target.checked) {
                    handleShowUnverified();
                  } else {
                    setVerifiedOnly(true);
                  }
                }}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-500"
              />
              <span className="text-sm text-gray-300">Verified Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Loading tokens...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
          <button onClick={fetchTokens} className="btn btn-secondary mt-4">
            Try Again
          </button>
        </div>
      ) : tokens.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No tokens found matching your filters.</p>
          <a href="/launch" className="btn btn-primary">
            Launch the First Token
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map(token => {
            const guild = getGuildInfo(token.tek8_guild);
            return (
              <div key={token.id} className="card hover:border-gray-600 transition group">
                {/* Token Image */}
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-800 mb-4">
                  {token.image_url ? (
                    <img
                      src={token.image_url}
                      alt={token.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">
                      {token.symbol?.charAt(0) || '?'}
                    </div>
                  )}
                </div>

                {/* Token Info */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{token.name}</h3>
                    <p className="text-sm text-gray-400">${token.symbol}</p>
                  </div>
                  <VerificationBadge status={token.verification_status} />
                </div>

                {/* Guild Badge */}
                {guild && (
                  <div
                    className="inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium mb-3"
                    style={{ backgroundColor: `${guild.color}20`, color: guild.color }}
                  >
                    <span>{guild.dice}</span>
                    <span>{guild.element}</span>
                  </div>
                )}

                {/* Nation/Role */}
                {token.nation_name && (
                  <p className="text-sm text-gray-400 mb-3">
                    Nation: <span className="text-white">{token.nation_name}</span>
                  </p>
                )}

                {/* Bonding Curve Status */}
                {token.bonding_curve_complete && (
                  <span className="inline-block px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded mb-3">
                    Graduated
                  </span>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-700">
                  <a
                    href={`https://pump.fun/coin/${token.mint_address}`}
                    target="_blank"
                    className="flex-1 btn btn-secondary text-sm py-2"
                  >
                    Trade on pump.fun
                  </a>
                  <a
                    href={`/tokens/${token.mint_address}`}
                    className="btn btn-primary text-sm py-2"
                  >
                    Details
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Disclaimer Modal */}
      <UnverifiedDisclaimer
        isOpen={showDisclaimer}
        onAccept={handleDisclaimerAccept}
        onDecline={() => setShowDisclaimer(false)}
      />
    </div>
  );
}
