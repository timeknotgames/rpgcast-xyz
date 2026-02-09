import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { TEK8_GUILDS } from '../lib/tek8-guilds';
import WalletProvider from './WalletProvider';

function ChampionRegistrationInner() {
  const { publicKey, signMessage } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form fields
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [primaryGuild, setPrimaryGuild] = useState('');
  const [discordHandle, setDiscordHandle] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');

  const handleRegister = async () => {
    if (!publicKey || !signMessage) {
      setError('Please connect your wallet');
      return;
    }

    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Sign message to verify ownership
      const message = `Register as Champion on RPGCast.xyz\nName: ${displayName}\nTimestamp: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      const signatureBase64 = btoa(String.fromCharCode(...signature));

      const res = await fetch('/api/champions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          displayName: displayName.trim(),
          bio: bio.trim(),
          profileImageUrl: profileImageUrl.trim(),
          primaryGuild,
          discordHandle: discordHandle.trim(),
          twitterHandle: twitterHandle.trim().replace('@', ''),
          signature: signatureBase64,
          message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card text-center py-12">
        <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome, Champion!</h2>
        <p className="text-gray-400 mb-6">
          You're now registered as a Champion.
          Start hosting game sessions and promoting tokens!
        </p>
        <a href="/champions" className="btn btn-primary">
          View All Champions
        </a>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Wallet Connection */}
      <div className="mb-6">
        <label className="block text-sm text-gray-300 mb-2">Connect Wallet</label>
        <WalletMultiButton />
        {publicKey && (
          <p className="text-xs text-gray-500 mt-2">
            Connected: {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </p>
        )}
      </div>

      {publicKey && (
        <>
          {/* Display Name */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">Display Name *</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your champion name..."
              className="input"
              maxLength={64}
            />
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself and your game sessions..."
              className="input min-h-[100px] resize-none"
              maxLength={500}
            />
          </div>

          {/* Profile Image */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">Profile Image URL</label>
            <input
              type="url"
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
              placeholder="https://..."
              className="input"
            />
          </div>

          {/* Primary Guild */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">Primary TEK8 Guild</label>
            <select
              value={primaryGuild}
              onChange={(e) => setPrimaryGuild(e.target.value)}
              className="input"
            >
              <option value="">Select a guild (optional)</option>
              {TEK8_GUILDS.map(guild => (
                <option key={guild.id} value={guild.id}>
                  {guild.dice} - {guild.element}: {guild.name}
                </option>
              ))}
            </select>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Discord Handle</label>
              <input
                type="text"
                value={discordHandle}
                onChange={(e) => setDiscordHandle(e.target.value)}
                placeholder="username"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Twitter Handle</label>
              <input
                type="text"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                placeholder="@username"
                className="input"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={loading || !displayName.trim()}
            className="btn btn-gold w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="spinner w-4 h-4"></div>
                Registering...
              </span>
            ) : (
              'Sign & Register as Champion'
            )}
          </button>
        </>
      )}
    </div>
  );
}

export default function ChampionRegistration() {
  return (
    <WalletProvider>
      <ChampionRegistrationInner />
    </WalletProvider>
  );
}
