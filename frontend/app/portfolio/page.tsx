'use client';

import { useState } from 'react';
import { getPortfolioAnalytics } from '@/lib/api';

interface PortfolioData {
  wallet: string;
  collection_size: number;
  total_value: number;
  average_score: number;
  style_distribution: { style: string; count: number }[];
  rarity_distribution: { rarity: string; count: number }[];
  complexity_scores: { card_name: string; complexity: number }[];
  primary_style: string;
  collector_type: string;
}

export default function PortfolioPage() {
  const [wallet, setWallet] = useState('');
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!wallet.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await getPortfolioAnalytics(wallet);
      setPortfolio(data);
    } catch (err) {
      setError('Failed to analyze portfolio');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E8] p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <a href="/" className="text-[#8A8A80] hover:text-[#1F2421] mb-4 inline-flex items-center">
          ← Back
        </a>
        <h1 className="text-4xl font-bold text-[#1F2421] font-serif mb-2">
          📊 Portfolio <span className="text-[#C8853F] italic">Analytics</span>
        </h1>
        <p className="text-[#8A8A80]">Deep dive into your collection's DNA</p>
      </div>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto mb-8 bg-[#FBF7EF] border border-[#E2D9C8] rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-[#C8853F] mb-2">Demo Disclaimer</h3>
            <p className="text-sm text-[#8A8A80]">
              <strong>Data Source:</strong> Mock data (20 sample cards for demo purposes).<br />
              <strong>AI Analysis:</strong> Illustrative prototype - not for investment decisions.<br />
              <strong>Privacy:</strong> No real wallet data collected.
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E2D9C8]">
          <h2 className="text-xl font-semibold mb-4 text-[#1F2421]">Enter Wallet Address</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
              className="flex-1 px-4 py-3 border border-[#E2D9C8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8853F] bg-[#FBF7EF]"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-8 py-3 bg-[#C8853F] text-white rounded-lg hover:bg-[#A86B2C] transition disabled:opacity-50 font-semibold"
            >
              {loading ? '🧬 Analyzing...' : '🧬 Analyze Portfolio'}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {portfolio && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E2D9C8]">
              <div className="text-sm text-[#8A8A80] mb-1">Collection Size</div>
              <div className="text-3xl font-bold text-[#1F2421]">{portfolio.collection_size}</div>
              <div className="text-xs text-[#8A8A80] mt-1">cards</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E2D9C8]">
              <div className="text-sm text-[#8A8A80] mb-1">Total Value</div>
              <div className="text-3xl font-bold text-[#C8853F]">${portfolio.total_value}</div>
              <div className="text-xs text-[#8A8A80] mt-1">ETH equivalent</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E2D9C8]">
              <div className="text-sm text-[#8A8A80] mb-1">Avg DNA Score</div>
              <div className="text-3xl font-bold text-[#1F2421]">{portfolio.average_score}/10</div>
              <div className="text-xs text-[#8A8A80] mt-1">collection quality</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E2D9C8]">
              <div className="text-sm text-[#8A8A80] mb-1">Collector Type</div>
              <div className="text-lg font-bold text-[#1F2421] mt-2">{portfolio.collector_type}</div>
              <div className="text-xs text-[#8A8A80] mt-1">{portfolio.primary_style}</div>
            </div>
          </div>

          {/* Style Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E2D9C8]">
            <h3 className="text-xl font-semibold mb-4 text-[#1F2421]">🎨 Style Distribution</h3>
            <div className="space-y-3">
              {portfolio.style_distribution.slice(0, 10).map((item, index) => {
                const percentage = (item.count / portfolio.collection_size) * 100;
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#1F2421] font-medium capitalize">{item.style.replace('_', ' ')}</span>
                      <span className="text-[#8A8A80]">{item.count} cards ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-[#E2D9C8] rounded-full h-2">
                      <div
                        className="bg-[#C8853F] rounded-full h-2 transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rarity Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E2D9C8]">
            <h3 className="text-xl font-semibold mb-4 text-[#1F2421]">💎 Rarity Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {portfolio.rarity_distribution.map((item, index) => {
                const percentage = (item.count / portfolio.collection_size) * 100;
                const colors = {
                  legendary: 'bg-amber-500',
                  epic: 'bg-purple-500',
                  rare: 'bg-blue-500',
                  common: 'bg-gray-400'
                };
                const color = colors[item.rarity as keyof typeof colors] || 'bg-[#C8853F]';

                return (
                  <div key={index} className="text-center p-4 bg-[#FBF7EF] rounded-lg">
                    <div className={`text-4xl font-bold ${color.replace('bg-', 'text-')}`}>{item.count}</div>
                    <div className="text-sm text-[#8A8A80] mt-1 capitalize">{item.rarity}</div>
                    <div className="text-xs text-[#8A8A80]">({percentage.toFixed(0)}%)</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Complexity Scores */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E2D9C8]">
            <h3 className="text-xl font-semibold mb-4 text-[#1F2421]">🧩 Top Cards by Complexity</h3>
            <div className="space-y-3">
              {portfolio.complexity_scores.slice(0, 10).map((item, index) => {
                const percentage = (item.complexity / 10) * 100;
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#1F2421] font-medium">{item.card_name}</span>
                      <span className="text-[#8A8A80]">{item.complexity.toFixed(1)}/10</span>
                    </div>
                    <div className="w-full bg-[#E2D9C8] rounded-full h-2">
                      <div
                        className="bg-[#A86B2C] rounded-full h-2 transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
