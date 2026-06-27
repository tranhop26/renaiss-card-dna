'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dna, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { getCards, getCardDNA, Card, CardDNA } from '@/lib/api';

export default function AnalyzerPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [dnaResult, setDnaResult] = useState<CardDNA | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const data = await getCards();
      setCards(data.cards);
    } catch (err) {
      console.error('Failed to load cards:', err);
      setError('Failed to load cards. Please check your connection and try again.');
    }
  };

  const analyzeCard = async () => {
    if (!selectedCard) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getCardDNA(selectedCard);
      setDnaResult(result);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to analyze card. Please try again.';
      setError(errorMessage);
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'bg-gray-100 text-gray-700',
      rare: 'bg-blue-100 text-blue-700',
      epic: 'bg-purple-100 text-purple-700',
      legendary: 'bg-amber-light text-amber-dark',
    };
    return colors[rarity] || colors.common;
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
              <Dna className="w-6 h-6 text-amber" />
              <span className="text-xl font-display font-bold">Card DNA Analyzer</span>
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
                <strong>Data Source:</strong> Mock data (20 sample cards for demo purposes).
                <br />
                <strong>AI Analysis:</strong> Illustrative prototype - not for investment decisions.
                <br />
                <strong>Privacy:</strong> No real wallet data collected.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Card Selection */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-paper-dark">
              <h2 className="text-2xl font-display font-bold mb-4">Select a Card</h2>

              <div className="space-y-4">
                <select
                  className="w-full px-4 py-3 border-2 border-paper-dark rounded-lg focus:outline-none focus:border-amber transition"
                  value={selectedCard}
                  onChange={(e) => setSelectedCard(e.target.value)}
                >
                  <option value="">Choose a card...</option>
                  {cards.map((card) => (
                    <option key={card.card_id} value={card.card_id}>
                      {card.card_name} ({card.card_id}) - {card.rarity}
                    </option>
                  ))}
                </select>

                <button
                  onClick={analyzeCard}
                  disabled={!selectedCard || loading}
                  className="w-full px-6 py-3 bg-amber hover:bg-amber-dark text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing DNA...
                    </>
                  ) : (
                    <>
                      <Dna className="w-5 h-5" />
                      Analyze DNA
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

            {/* Card Grid Preview */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-paper-dark">
              <h3 className="text-lg font-display font-bold mb-4">Available Cards</h3>
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {cards.slice(0, 8).map((card) => (
                  <button
                    key={card.card_id}
                    onClick={() => setSelectedCard(card.card_id)}
                    className={`p-3 border-2 rounded-lg text-left transition hover:border-amber ${
                      selectedCard === card.card_id ? 'border-amber bg-amber-light' : 'border-paper-dark'
                    }`}
                  >
                    <p className="font-semibold text-sm truncate">{card.card_name}</p>
                    <p className="text-xs text-muted">{card.card_id}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${getRarityColor(card.rarity)}`}>
                      {card.rarity}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: DNA Results */}
          <div className="space-y-6">
            {dnaResult ? (
              <>
                {/* Header Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-paper-dark">
                  <div className="flex items-start gap-4">
                    <Dna className="w-12 h-12 text-amber flex-shrink-0" />
                    <div className="flex-1">
                      <h2 className="text-2xl font-display font-bold">{dnaResult.card_name}</h2>
                      <p className="text-muted">{dnaResult.card_id}</p>
                      {dnaResult.artist && (
                        <p className="text-sm text-muted mt-1">by {dnaResult.artist}</p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRarityColor(dnaResult.rarity || 'common')}`}>
                          {dnaResult.rarity}
                        </span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-paper-light text-ink">
                          Score: {dnaResult.overall_score}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personality Summary */}
                <div className="bg-amber-light p-6 rounded-xl border-2 border-amber/30">
                  <h3 className="text-lg font-display font-bold mb-2">🧬 Personality</h3>
                  <p className="text-muted leading-relaxed">{dnaResult.personality_summary}</p>
                </div>

                {/* Visual DNA */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-paper-dark">
                  <h3 className="text-lg font-display font-bold mb-4">🎨 Visual DNA</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted">Style</span>
                      <span className="font-semibold capitalize">{dnaResult.visual_dna.style}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Complexity</span>
                      <span className="font-semibold">{dnaResult.visual_dna.complexity_score}/10</span>
                    </div>
                    <div className="w-full bg-paper-dark rounded-full h-2">
                      <div
                        className="bg-amber rounded-full h-2"
                        style={{ width: `${dnaResult.visual_dna.complexity_score * 10}%` }}
                      ></div>
                    </div>
                    {dnaResult.visual_dna.mood && (
                      <div className="flex justify-between">
                        <span className="text-muted">Mood</span>
                        <span className="font-semibold capitalize">{dnaResult.visual_dna.mood}</span>
                      </div>
                    )}
                    <div className="pt-2">
                      <span className="text-sm text-muted">Color Palette:</span>
                      <div className="flex gap-2 mt-2">
                        {dnaResult.visual_dna.color_palette.map((color, i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-lg border-2 border-paper-dark"
                            style={{ backgroundColor: color }}
                            title={color}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Behavioral DNA */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-paper-dark">
                  <h3 className="text-lg font-display font-bold mb-4">📊 Trading Behavior</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted">Collector Type</span>
                      <span className="font-semibold">{dnaResult.behavioral_dna.collector_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Avg Hold Time</span>
                      <span className="font-semibold">{dnaResult.behavioral_dna.avg_hold_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Trading Velocity</span>
                      <span className="font-semibold capitalize">{dnaResult.behavioral_dna.trading_velocity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Activity Score</span>
                      <span className="font-semibold">{dnaResult.behavioral_dna.activity_score}</span>
                    </div>
                  </div>
                </div>

                {/* Market DNA */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-paper-dark">
                  <h3 className="text-lg font-display font-bold mb-4">💎 Market DNA</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted">Price Momentum</span>
                      <span className={`font-semibold capitalize ${
                        dnaResult.market_dna.price_momentum === 'bullish' ? 'text-green-600' :
                        dnaResult.market_dna.price_momentum === 'bearish' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {dnaResult.market_dna.price_momentum}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Volatility</span>
                      <span className="font-semibold">{dnaResult.market_dna.volatility}</span>
                    </div>
                    <div className="pt-2">
                      <span className="text-sm text-muted mb-2 block">Collection Synergy:</span>
                      <div className="flex flex-wrap gap-2">
                        {dnaResult.market_dna.collection_synergy.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-paper-light rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white p-12 rounded-xl shadow-lg border border-paper-dark text-center">
                <Dna className="w-16 h-16 text-paper-dark mx-auto mb-4" />
                <h3 className="text-xl font-display font-bold text-muted mb-2">
                  No Card Selected
                </h3>
                <p className="text-muted">
                  Select a card from the left to analyze its DNA
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
