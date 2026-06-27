'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCards, compareCards, Card, CompareResponse } from '@/lib/api';

export default function ComparePage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [cardId1, setCardId1] = useState('');
  const [cardId2, setCardId2] = useState('');
  const [comparison, setComparison] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const data = await getCards();
      setCards(data.cards);
    } catch (err) {
      console.error('Failed to load cards:', err);
    }
  };

  const handleCompare = async () => {
    if (!cardId1 || !cardId2) {
      setError('Please select two cards to compare');
      return;
    }

    if (cardId1 === cardId2) {
      setError('Please select two different cards');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await compareCards(cardId1, cardId2);
      setComparison(result);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to compare cards. Please try again.');
      console.error('Comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'bg-gray-100 text-gray-700',
      rare: 'bg-blue-100 text-blue-700',
      epic: 'bg-purple-100 text-purple-700',
      legendary: 'bg-[#F0E3D0] text-[#C8853F]',
    };
    return colors[rarity] || colors.common;
  };

  return (
    <div className="min-h-screen bg-[#F6F1E8] p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link href="/" className="text-[#8A8A80] hover:text-[#1F2421] mb-4 inline-flex items-center">
          ← Back
        </Link>
        <h1 className="text-4xl font-bold text-[#1F2421] font-serif mb-2">
          ⚖️ Card <span className="text-[#C8853F] italic">Comparison</span>
        </h1>
        <p className="text-[#8A8A80]">Compare two cards side-by-side with AI analysis</p>
      </div>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto mb-8 bg-[#FBF7EF] border border-[#E2D9C8] rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-[#C8853F] mb-2">Demo Disclaimer</h3>
            <p className="text-sm text-[#8A8A80]">
              <strong>Data Source:</strong> Mock data (23 sample cards for demo purposes).<br />
              <strong>AI Analysis:</strong> Illustrative prototype - not for investment decisions.<br />
              <strong>Privacy:</strong> No real wallet data collected.
            </p>
          </div>
        </div>
      </div>

      {/* Selection */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E2D9C8]">
          <h2 className="text-xl font-semibold mb-4 text-[#1F2421]">Select Two Cards</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[#8A8A80] mb-2">Card 1</label>
              <select
                value={cardId1}
                onChange={(e) => setCardId1(e.target.value)}
                className="w-full px-4 py-3 border border-[#E2D9C8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8853F] bg-[#FBF7EF]"
              >
                <option value="">Choose first card...</option>
                {cards.map((card) => (
                  <option key={card.card_id} value={card.card_id}>
                    {card.card_name} ({card.card_id}) - {card.rarity}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8A8A80] mb-2">Card 2</label>
              <select
                value={cardId2}
                onChange={(e) => setCardId2(e.target.value)}
                className="w-full px-4 py-3 border border-[#E2D9C8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8853F] bg-[#FBF7EF]"
              >
                <option value="">Choose second card...</option>
                {cards.map((card) => (
                  <option key={card.card_id} value={card.card_id}>
                    {card.card_name} ({card.card_id}) - {card.rarity}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCompare}
            disabled={!cardId1 || !cardId2 || loading}
            className="w-full px-8 py-3 bg-[#C8853F] text-white rounded-lg hover:bg-[#A86B2C] transition disabled:opacity-50 font-semibold"
          >
            {loading ? '⚖️ Comparing...' : '⚖️ Compare Cards'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E2D9C8] animate-pulse">
            <div className="h-8 bg-[#E2D9C8] rounded w-48 mb-4"></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64 bg-[#E2D9C8] rounded"></div>
              <div className="h-64 bg-[#E2D9C8] rounded"></div>
            </div>
          </div>
        </div>
      )}

      {comparison && !loading && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* AI Recommendation */}
          <div className="bg-[#F0E3D0] border-2 border-[#C8853F] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#1F2421] mb-3 flex items-center gap-2">
              🤖 AI Recommendation
              {comparison.winner === 'card_1' && <span className="text-[#C8853F]">(Card 1 Wins)</span>}
              {comparison.winner === 'card_2' && <span className="text-[#C8853F]">(Card 2 Wins)</span>}
              {comparison.winner === 'tie' && <span className="text-[#8A8A80]">(Close Match)</span>}
            </h3>
            <p className="text-[#1F2421] leading-relaxed">{comparison.ai_recommendation}</p>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-[#E2D9C8]">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-[#1F2421]">{comparison.card_1.card_name}</h3>
                <p className="text-[#8A8A80] text-sm">{comparison.card_1.card_id}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRarityColor(comparison.card_1.rarity || 'common')}`}>
                    {comparison.card_1.rarity}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#FBF7EF] text-[#1F2421]">
                    Score: {comparison.card_1.overall_score}/10
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#8A8A80] mb-1">Visual DNA</p>
                  <p className="text-sm"><strong>Style:</strong> {comparison.card_1.visual_dna.style}</p>
                  <p className="text-sm"><strong>Complexity:</strong> {comparison.card_1.visual_dna.complexity_score}/10</p>
                </div>

                <div>
                  <p className="text-xs text-[#8A8A80] mb-1">Behavioral DNA</p>
                  <p className="text-sm"><strong>Type:</strong> {comparison.card_1.behavioral_dna.collector_type}</p>
                  <p className="text-sm"><strong>Velocity:</strong> {comparison.card_1.behavioral_dna.trading_velocity}</p>
                </div>

                <div>
                  <p className="text-xs text-[#8A8A80] mb-1">Market DNA</p>
                  <p className="text-sm"><strong>Momentum:</strong> {comparison.card_1.market_dna.price_momentum}</p>
                  <p className="text-sm"><strong>Volatility:</strong> {comparison.card_1.market_dna.volatility.toFixed(3)}</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-[#E2D9C8]">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-[#1F2421]">{comparison.card_2.card_name}</h3>
                <p className="text-[#8A8A80] text-sm">{comparison.card_2.card_id}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRarityColor(comparison.card_2.rarity || 'common')}`}>
                    {comparison.card_2.rarity}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#FBF7EF] text-[#1F2421]">
                    Score: {comparison.card_2.overall_score}/10
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#8A8A80] mb-1">Visual DNA</p>
                  <p className="text-sm"><strong>Style:</strong> {comparison.card_2.visual_dna.style}</p>
                  <p className="text-sm"><strong>Complexity:</strong> {comparison.card_2.visual_dna.complexity_score}/10</p>
                </div>

                <div>
                  <p className="text-xs text-[#8A8A80] mb-1">Behavioral DNA</p>
                  <p className="text-sm"><strong>Type:</strong> {comparison.card_2.behavioral_dna.collector_type}</p>
                  <p className="text-sm"><strong>Velocity:</strong> {comparison.card_2.behavioral_dna.trading_velocity}</p>
                </div>

                <div>
                  <p className="text-xs text-[#8A8A80] mb-1">Market DNA</p>
                  <p className="text-sm"><strong>Momentum:</strong> {comparison.card_2.market_dna.price_momentum}</p>
                  <p className="text-sm"><strong>Volatility:</strong> {comparison.card_2.market_dna.volatility.toFixed(3)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E2D9C8]">
            <h3 className="text-xl font-bold text-[#1F2421] mb-4">📊 Key Differences</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#FBF7EF] rounded-lg">
                <p className="text-xs text-[#8A8A80] mb-1">Overall Score Diff</p>
                <p className="text-2xl font-bold text-[#C8853F]">
                  {comparison.comparison.overall_score_diff > 0 ? '+' : ''}{comparison.comparison.overall_score_diff}
                </p>
              </div>

              <div className="p-4 bg-[#FBF7EF] rounded-lg">
                <p className="text-xs text-[#8A8A80] mb-1">Complexity Diff</p>
                <p className="text-2xl font-bold text-[#C8853F]">
                  {comparison.comparison.visual.complexity_diff > 0 ? '+' : ''}{comparison.comparison.visual.complexity_diff}
                </p>
              </div>

              <div className="p-4 bg-[#FBF7EF] rounded-lg">
                <p className="text-xs text-[#8A8A80] mb-1">Style Match</p>
                <p className="text-2xl font-bold">
                  {comparison.comparison.visual.style_match ? '✓ Yes' : '✗ No'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
