'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dna, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { getCards, getCardDNA, searchRenaissIndex, Card, CardDNA, RenaissIndexCard } from '@/lib/api';

export default function AnalyzerPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [dnaResult, setDnaResult] = useState<CardDNA | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [indexQuery, setIndexQuery] = useState('charizard');
  const [indexResults, setIndexResults] = useState<RenaissIndexCard[]>([]);
  const [indexLoading, setIndexLoading] = useState(false);
  const [indexError, setIndexError] = useState<string | null>(null);

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

  const getDaysSince = (dateString?: string | null) => {
    if (!dateString) return null;
    const timestamp = new Date(dateString).getTime();
    if (Number.isNaN(timestamp)) return null;
    return Math.max(0, Math.round((Date.now() - timestamp) / 86400000));
  };

  const inferIndexStyle = (card: RenaissIndexCard) => {
    const haystack = `${card.name} ${card.setName} ${card.variation || ''} ${card.game}`.toLowerCase();
    if (haystack.includes('charizard') || haystack.includes('dragon') || haystack.includes('fire')) return 'elemental';
    if (haystack.includes('cyber') || haystack.includes('future') || haystack.includes('tech')) return 'tech';
    if (haystack.includes('one-piece') || haystack.includes('zoro') || haystack.includes('luffy')) return 'anime';
    if (haystack.includes('pokemon')) return 'creature';
    if (haystack.includes('trainer') || haystack.includes('supporter')) return 'character';
    return card.game === 'one-piece' ? 'anime' : 'collectible';
  };

  const buildIndexCardDNA = (card: RenaissIndexCard): CardDNA => {
    const priceUsd = card.priceUsdCents ? card.priceUsdCents / 100 : 0;
    const delta = card.deltaPct ?? 0;
    const confidenceScore = card.confidence === 'high' ? 1.2 : card.confidence === 'medium' ? 0.8 : 0.4;
    const priceScore = Math.min(3, Math.log10(Math.max(priceUsd, 1)) * 1.4);
    const momentumScore = Math.min(2, Math.abs(delta) / 30);
    const overallScore = Math.min(10, Math.max(4, 4 + priceScore + momentumScore + confidenceScore));
    const freshnessDays = getDaysSince(card.lastSaleAt);
    const momentum = delta > 5 ? 'bullish' : delta < -5 ? 'bearish' : 'stable';
    const rarityTier = card.gradeLabel || card.grade || 'indexed';
    const style = inferIndexStyle(card);
    const palette: string[] = card.game === 'one-piece' ? ['#E63946', '#F1FAEE', '#1D3557'] : ['#F59E0B', '#2563EB', '#111827'];

    return {
      card_id: `${card.game}:${card.cardNumber}:${card.name}` ,
      card_name: card.name,
      image_url: card.imageUrl || card.imageUrlThumb || undefined,
      rarity: rarityTier,
      artist: card.setName,
      visual_dna: {
        color_palette: palette,
        dominant_colors: palette,
        style,
        complexity_score: Number(Math.min(10, Math.max(5, 6 + Math.abs(delta) / 25)).toFixed(1)),
        mood: momentum === 'bullish' ? 'rising' : momentum === 'bearish' ? 'cooling' : 'balanced',
      },
      behavioral_dna: {
        avg_hold_time: freshnessDays === null ? 'Unknown' : `${freshnessDays} days since last sale`,
        trading_velocity: freshnessDays !== null && freshnessDays <= 14 ? 'active' : 'observed',
        collector_type: card.company ? `${card.company} ${card.gradeLabel || card.grade || 'collector'}` : 'Index collector',
        activity_score: Number(Math.min(10, Math.max(3, 10 - (freshnessDays ?? 45) / 15)).toFixed(1)),
      },
      market_dna: {
        volatility: Number(Math.min(1, Math.abs(delta) / 100).toFixed(3)),
        rarity_tier: rarityTier,
        collection_synergy: [card.game, card.language, card.setCode || card.setName].filter((tag): tag is string => Boolean(tag)),
        price_momentum: momentum,
        current_price: Number(priceUsd.toFixed(2)),
      },
      overall_score: Number(overallScore.toFixed(1)),
      personality_summary: `${card.name} is an indexed ${card.game} card from ${card.setName}. Renaiss OS Index reports ${priceUsd ? `USD ${priceUsd.toFixed(2)}` : 'no public price yet'} with ${card.confidence || 'unknown'} confidence and ${momentum} momentum (${delta.toFixed(2)}%). The DNA layer is generated by this app on top of live Index fields, so it is an experimental collector-fit interpretation rather than financial advice.`,
      data_source: 'Renaiss OS Index API beta + Renaiss Card DNA scoring',
      source_url: `https://index.renaissos.com${card.href}` ,
      source_confidence: card.confidence || undefined,
      source_freshness: freshnessDays === null ? 'Unknown freshness' : `${freshnessDays} days since last sale`,
    };
  };

  const searchIndexCards = async () => {
    if (indexQuery.trim().length < 2) {
      setIndexError('Enter at least 2 characters to search Renaiss OS Index.');
      return;
    }

    setIndexLoading(true);
    setIndexError(null);

    try {
      const data = await searchRenaissIndex(indexQuery.trim(), 8);
      setIndexResults(data.results || []);
      if (!data.results?.length) setIndexError('No indexed cards found for that search.');
    } catch (err: any) {
      setIndexError(err.message || 'Failed to search Renaiss OS Index.');
    } finally {
      setIndexLoading(false);
    }
  };

  const analyzeIndexCard = (card: RenaissIndexCard) => {
    setSelectedCard('');
    setError(null);
    setDnaResult(buildIndexCardDNA(card));
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
                <strong>Data Source:</strong> Demo cards use mock data. Renaiss Index Search uses live Renaiss OS Index API beta data.
                <br />
                <strong>AI Analysis:</strong> Illustrative prototype - not for investment decisions.
                <br />
                <strong>Privacy:</strong> No real wallet data collected.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-paper-dark">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-display font-bold mb-2">Renaiss OS Index Search</h2>
              <p className="text-sm text-muted mb-3">Search live indexed cards, then generate a Card DNA preview using Renaiss OS Index beta fields.</p>
              <input
                className="w-full px-4 py-3 border-2 border-paper-dark rounded-lg focus:outline-none focus:border-amber transition"
                value={indexQuery}
                onChange={(e) => setIndexQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') searchIndexCards(); }}
                placeholder="Search Charizard, Zoro, Pikachu..."
              />
            </div>
            <button
              onClick={searchIndexCards}
              disabled={indexLoading}
              className="px-6 py-3 bg-ink hover:bg-black text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {indexLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              Search Index
            </button>
          </div>

          {indexError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {indexError}
            </div>
          )}

          {indexResults.length > 0 && (
            <div className="mt-5 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              {indexResults.map((card) => (
                <button
                  key={card.href}
                  onClick={() => analyzeIndexCard(card)}
                  className="p-4 border-2 border-paper-dark rounded-lg text-left hover:border-amber transition bg-paper-light"
                >
                  <div className="flex gap-3">
                    {card.imageUrlThumb || card.imageUrl ? (
                      <img src={card.imageUrlThumb || card.imageUrl || ""} alt={card.name} className="w-14 h-20 object-cover rounded border border-paper-dark" />
                    ) : null}
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{card.name}</p>
                      <p className="text-xs text-muted truncate">{card.setName}</p>
                      <p className="text-xs text-muted">{card.gradeLabel || card.grade || card.language}</p>
                      <p className="text-xs font-semibold text-amber-dark mt-1">
                        {card.priceUsdCents ? `${(card.priceUsdCents / 100).toFixed(2)}` : "No price"} · {card.confidence || "unknown"}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
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
                    {dnaResult.image_url ? (
                      <img src={dnaResult.image_url} alt={dnaResult.card_name} className="w-16 h-24 object-cover rounded-lg border border-paper-dark flex-shrink-0" />
                    ) : (
                      <Dna className="w-12 h-12 text-amber flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h2 className="text-2xl font-display font-bold">{dnaResult.card_name}</h2>
                      <p className="text-muted">{dnaResult.card_id}</p>
                      {dnaResult.artist && (
                        <p className="text-sm text-muted mt-1">by {dnaResult.artist}</p>
                      )}
                      {dnaResult.data_source && (
                        <p className="text-xs text-muted mt-2">Source: {dnaResult.data_source}</p>
                      )}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRarityColor(dnaResult.rarity || 'common')}`}>
                          {dnaResult.rarity}
                        </span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-paper-light text-ink">
                          Score: {dnaResult.overall_score}/10
                        </span>
                        {dnaResult.source_confidence && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
                            {dnaResult.source_confidence} confidence
                          </span>
                        )}
                        {dnaResult.source_url && (
                          <a href={dnaResult.source_url} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100">
                            View Index Source
                          </a>
                        )}
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
