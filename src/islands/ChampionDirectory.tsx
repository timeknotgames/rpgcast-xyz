import { useState, useEffect } from 'react';
import { TEK8_GUILDS } from '../lib/tek8-guilds';

interface Champion {
  id: number;
  wallet_address: string;
  display_name: string;
  bio: string;
  profile_image_url: string;
  primary_guild: string;
  discord_handle: string;
  twitter_handle: string;
  is_verified: boolean;
  created_at: string;
}

interface GameSession {
  id: number;
  title: string;
  description: string;
  session_date: string;
  platform: string;
  join_link: string;
  status: string;
}

export default function ChampionDirectory() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'champions' | 'sessions'>('champions');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch champions
      const champRes = await fetch('/api/champions/list');
      const champData = await champRes.json();
      if (champData.success) {
        setChampions(champData.champions || []);
      }

      // Fetch upcoming sessions
      const sessRes = await fetch('/api/champions/sessions?upcoming=true');
      const sessData = await sessRes.json();
      if (sessData.success) {
        setSessions(sessData.sessions || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getGuildInfo = (guildId: string) => {
    return TEK8_GUILDS.find(g => g.id === guildId);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gray-400">Loading champions...</p>
      </div>
    );
  }

  return (
    <div>
      {/* View Toggle */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setView('champions')}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            view === 'champions'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Champions ({champions.length})
        </button>
        <button
          onClick={() => setView('sessions')}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            view === 'sessions'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Upcoming Sessions ({sessions.length})
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-8 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Champions View */}
      {view === 'champions' && (
        <div>
          {champions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No champions registered yet.</p>
              <a href="/champions/register" className="btn btn-gold">
                Be the First Champion
              </a>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {champions.map(champ => {
                const guild = getGuildInfo(champ.primary_guild);
                return (
                  <div key={champ.id} className="card hover:border-gray-600 transition">
                    {/* Profile Image */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800">
                        {champ.profile_image_url ? (
                          <img
                            src={champ.profile_image_url}
                            alt={champ.display_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl text-gray-600">
                            {champ.display_name?.charAt(0) || '?'}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          {champ.display_name}
                          {champ.is_verified && (
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </h3>
                        {guild && (
                          <span
                            className="text-xs px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${guild.color}20`, color: guild.color }}
                          >
                            {guild.dice} {guild.element}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    {champ.bio && (
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{champ.bio}</p>
                    )}

                    {/* Social Links */}
                    <div className="flex gap-3">
                      {champ.discord_handle && (
                        <span className="text-xs text-gray-500">Discord: @{champ.discord_handle}</span>
                      )}
                      {champ.twitter_handle && (
                        <a
                          href={`https://twitter.com/${champ.twitter_handle}`}
                          target="_blank"
                          className="text-xs text-blue-400 hover:underline"
                        >
                          @{champ.twitter_handle}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sessions View */}
      {view === 'sessions' && (
        <div>
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No upcoming sessions scheduled.</p>
              <p className="text-sm text-gray-500">
                Champions can create sessions from their dashboard.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map(session => (
                <div key={session.id} className="card hover:border-gray-600 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{session.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{session.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-purple-400">{formatDate(session.session_date)}</span>
                        <span className="text-gray-500">via {session.platform}</span>
                      </div>
                    </div>
                    {session.join_link && (
                      <a
                        href={session.join_link}
                        target="_blank"
                        className="btn btn-primary text-sm"
                      >
                        Join
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
