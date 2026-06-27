'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Dna, Sparkles, Users, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-paper-light/80 border-b border-paper-dark">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dna className="w-8 h-8 text-amber" />
              <span className="text-xl font-display font-bold">Renaiss DNA</span>
            </div>
            <div className="flex gap-6">
              <Link href="#analyzer" className="text-muted hover:text-ink transition">
                Analyzer
              </Link>
              <Link href="#profiler" className="text-muted hover:text-ink transition">
                Profiler
              </Link>
              <Link href="/portfolio" className="text-muted hover:text-ink transition">
                Portfolio
              </Link>
              <Link href="#about" className="text-muted hover:text-ink transition">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="space-y-6">
            {/* Eyebrow */}
            <div className="inline-block px-4 py-1.5 rounded-full bg-amber-light border border-amber/20">
              <span className="text-sm font-medium text-amber-dark">
                ✨ Now in Public Beta
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight">
              Every Card Has a{' '}
              <span className="italic text-amber">Soul</span>.
              <br />
              Discover Yours.
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-muted leading-relaxed">
              AI-powered matching for the taste-driven collector economy.
              Analyze personalities, find your tribe, build with purpose.
            </p>

            {/* CTAs */}
            <div className="flex gap-4 pt-4">
              <Link
                href="#analyzer"
                className="px-8 py-3 bg-amber hover:bg-amber-dark text-white font-semibold rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg"
              >
                Analyze a Card →
              </Link>
              <Link
                href="#profiler"
                className="px-8 py-3 bg-paper-light hover:bg-white border-2 border-paper-dark font-semibold rounded-lg transition"
              >
                Check My Profile
              </Link>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            {/* Faux Browser Window */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-paper-dark">
              {/* Browser chrome */}
              <div className="bg-paper-light px-4 py-3 flex items-center gap-2 border-b border-paper-dark">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                </div>
                <div className="flex-1 text-center text-sm text-muted">
                  renaiss-dna.app
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <Dna className="w-12 h-12 text-amber" />
                  <div>
                    <h3 className="font-display text-2xl">Cyber Samurai</h3>
                    <p className="text-sm text-muted">Card #RNS001</p>
                  </div>
                </div>

                {/* DNA Stats */}
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">Visual Complexity</span>
                    <span className="font-semibold">8.5/10</span>
                  </div>
                  <div className="w-full bg-paper-dark rounded-full h-2">
                    <div className="bg-amber rounded-full h-2 w-[85%]"></div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-muted">Collector Match</span>
                    <span className="font-semibold text-amber">94% Match</span>
                  </div>
                  <div className="w-full bg-paper-dark rounded-full h-2">
                    <div className="bg-amber rounded-full h-2 w-[94%]"></div>
                  </div>
                </div>

                {/* Personality */}
                <div className="pt-4 p-4 bg-amber-light rounded-lg border border-amber/20">
                  <p className="text-sm leading-relaxed">
                    <strong>Personality:</strong> Intense Cyberpunk aesthetic with medium trading activity.
                    Appeals to long-term investors. Currently bullish momentum.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Status Chip */}
            <div className="absolute -top-4 -right-4 px-4 py-2 bg-charcoal text-paper-light rounded-full shadow-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">DNA Match: 94%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold mb-4">
            More Than Just <span className="italic text-amber">Stats</span>
          </h2>
          <p className="text-lg text-muted">
            Multi-dimensional analysis powered by AI
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-paper-dark hover:shadow-xl transition">
            <div className="w-12 h-12 bg-amber-light rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-amber" />
            </div>
            <h3 className="text-xl font-display font-bold mb-3">Visual DNA</h3>
            <p className="text-muted leading-relaxed">
              AI analyzes color palettes, artistic style, complexity, and mood.
              Every card has a unique visual fingerprint.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-paper-dark hover:shadow-xl transition">
            <div className="w-12 h-12 bg-amber-light rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-amber" />
            </div>
            <h3 className="text-xl font-display font-bold mb-3">Trading Patterns</h3>
            <p className="text-muted leading-relaxed">
              Understand hold times, velocity, and collector archetypes.
              Match cards to your trading strategy.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-paper-dark hover:shadow-xl transition">
            <div className="w-12 h-12 bg-amber-light rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-amber" />
            </div>
            <h3 className="text-xl font-display font-bold mb-3">Find Your Tribe</h3>
            <p className="text-muted leading-relaxed">
              Discover collectors with similar taste DNA.
              Connect, trade, and build together.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="analyzer" className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-charcoal text-paper-light rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-display font-bold mb-4">
            Ready to Discover Your Collection's DNA?
          </h2>
          <p className="text-lg text-paper-dark mb-8 max-w-2xl mx-auto">
            Analyze any card, profile your collection, or find collectors like you.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/analyzer"
              className="px-8 py-3 bg-amber hover:bg-amber-dark text-white font-semibold rounded-lg transition"
            >
              Start Analyzing
            </Link>
            <Link
              href="/profiler"
              className="px-8 py-3 bg-paper hover:bg-paper-light text-ink font-semibold rounded-lg transition"
            >
              Profile My Collection
            </Link>
            <Link
              href="/portfolio"
              className="px-8 py-3 bg-paper hover:bg-paper-light text-ink font-semibold rounded-lg transition border-2 border-amber"
            >
              📊 Portfolio Analytics
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-paper-light border-t border-paper-dark">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Dna className="w-6 h-6 text-amber" />
              <span className="font-display font-bold">Renaiss DNA</span>
            </div>
            <div className="text-sm text-muted">
              Built for Renaiss Tech Hackathon S1
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
