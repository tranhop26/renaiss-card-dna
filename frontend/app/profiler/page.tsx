'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, ArrowLeft, Loader2, TrendingUp, AlertCircle } from 'lucide-react';
import { getCollectorProfile, getRecommendations, CollectorProfile, MatchResult } from '@/lib/api';

export default function ProfilerPage() {
  const [wallet, setWallet] = useState('');
  const [profile, setProfile] = useState<CollectorProfile | null>(null);
  const [recommendations, setRecommendations] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeProfile = async () => {
    if (!wallet) return;

    setLoading(true);
    setError(null);

    try {
      const [profileData, recs] = await Promise.all([
        getCollectorProfile(wallet),
        getRecommendations(wallet, 5),
      ]);

      setProfile(profileData);
      setRecommendations(recs);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to analyze profile');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (strength: string) => {
    const colors: Record<string, string> = {
      strong: 'bg-green-100 text-green-700',
      moderate: 'bg-blue-100 text-blue-700',
      weak: 'bg-gray-100 text-gray-700',
    };
    return colors[strength] || colors.weak;
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <nav className="bg-paper-light border-b border-paper-dark">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted hover:text-ink">
              <ArrowLeft className="w-5 h-5" />
              Back
            </Link>
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-amber" />
              <span className="text-xl font-display font-bold">Collector Profiler</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Disclaimer */}
        <div className="mb-8 p-4 bg-amber-light border border-amber/30 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-dark flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-amber-dark mb-1">⚠️ Demo Disclaimer</p>
              <p className="text-muted leading-relaxed">
                <strong>Data Source:</strong> Synthetic profile generated for demo (no real blockchain data).
                <br />
                <strong>AI Recommendations:</strong> For exploration purposes only - not investment advice.
                <br />
                <strong>Privacy:</strong> Enter any string as "wallet" - no real data collected.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-paper-dark">
              <h2 className="text-2xl font-display font-bold mb-4">Enter Wallet Address</h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="0x1234... or any identifier"
                  className="w-full px-4 py-3 border-2 border-paper-dark rounded-lg focus:outline-none focus:border-amber transition"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && analyzeProfile()}
                />

                <button
                  onClick={analyzeProfile}
                  disabled={!wallet || loading}
                  className="w-full px-6 py-3 bg-amber hover:bg-amber-dark text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Profile...
                    </>
                  ) : (
                    <>
                      <User className="w-5 h-5" />
                      Analyze My DNA
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Quick Examples */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-paper-dark">
              <h3 className="text-lg font-display font-bold mb-3">Try These Examples</h3>
              <div className="space-y-2">
                {['alice.eth', 'collector_001', 'cyberpunk_fan'].map((example) => (
                  <button
                    key={example}
                    onClick={() => setWallet(example)}
                    className="w-full px-4 py-2 text-left border-2 border-paper-dark rounded-lg hover:border-amber transition"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="space-y-6">
            {profile ? (
              <>
                {/* Profile Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-paper-dark">
                  <div className="flex items-start gap-4">
                    <User className="w-12 h-12 text-amber flex-shrink-0" />
                    <div className="flex-1">
                      <h2 className="text-2xl font-display font-bold">Your Collection DNA</h2>
                      <p className="text-muted text-sm mt-1 truncate">{profile.wallet}</p>
                    </div>
                  </div>
                </div>

                {/* Collection DNA */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-paper-dark">
                  <h3 className="text-lg font-display font-bold mb-4">👤 Collector Type</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted">Primary Style</span>
                      <span className="font-semibold">{profile.collection_dna.primary_style}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Collector Type</span>
                      <span className="font-semibold">{profile.collection_dna.collector_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Total Cards</span>
                      <span className="font-semibold">{profile.collection_dna.total_cards}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Avg Hold Time</span>
                      <span className="font-semibold">{profile.collection_dna.avg_hold_time}</span>
                    </div>
                  </div>
                </div>

                {/* Style Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-paper-dark">
                  <h3 className="text-lg font-display font-bold mb-4">🎨 Style Distribution</h3>
                  <div className="space-y-3">
                    {Object.entries(profile.collection_dna.style_distribution).map(([style, value]) => (
                      <div key={style}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm capitalize">{style.replace('_', ' ')}</span>
                          <span className="text-sm font-semibold">{(value * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-paper-dark rounded-full h-2">
                          <div
                            className="bg-amber rounded-full h-2"
                            style={{ width: `${value * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Portfolio Gaps */}
                <div className="bg-amber-light p-6 rounded-xl border-2 border-amber/30">
                  <h3 className="text-lg font-display font-bold mb-3">🎯 Portfolio Gaps</h3>
                  <ul className="space-y-2">
                    {profile.portfolio_gaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-dark">•</span>
                        <span className="text-muted">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Personality Traits */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-paper-dark">
                  <h3 className="text-lg font-display font-bold mb-3">✨ Personality Traits</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.personality_traits.map((trait, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-paper-light rounded-full text-sm"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-paper-dark">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-amber" />
                      <h3 className="text-lg font-display font-bold">Recommended For You</h3>
                    </div>
                    <div className="space-y-3">
                      {recommendations.map((rec) => (
                        <div
                          key={rec.card_id}
                          className="p-4 border-2 border-paper-dark rounded-lg hover:border-amber transition"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{rec.card_name}</h4>
                              <p className="text-sm text-muted">{rec.card_id}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-amber">
                                {(rec.match_score * 100).toFixed(0)}%
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getStrengthColor(rec.recommendation_strength)}`}>
                                {rec.recommendation_strength}
                              </span>
                            </div>
                          </div>
                          <ul className="space-y-1 mt-3">
                            {rec.match_reasons.map((reason, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                                <span className="text-amber">✓</span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-12 rounded-xl shadow-lg border border-paper-dark text-center">
                <User className="w-16 h-16 text-paper-dark mx-auto mb-4" />
                <h3 className="text-xl font-display font-bold text-muted mb-2">
                  No Profile Analyzed Yet
                </h3>
                <p className="text-muted">
                  Enter a wallet address to see your collector DNA
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
