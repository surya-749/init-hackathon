'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppNavbar from '@/components/AppNavbar';
import { useAuth } from '@/context/AuthContext';

export default function LearnPage() {
  const { isLoading: authLoading, logout } = useAuth();
  const [expandedStep, setExpandedStep] = useState(0);

  const steps = [
    {
      number: 1,
      title: 'Understand What Investing Means',
      icon: '💡',
      shortDesc: 'Learn the basics first',
      fullContent: (
        <div className="space-y-4">
          <p className="text-gray-300">
            <strong>Investing means using your money to buy something that can grow in value over time.</strong>
          </p>
          <div className="bg-slate-800/50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-gray-300 mb-3">💰 <strong>Instead of just saving money, you&apos;re putting it to work.</strong></p>
            <div className="space-y-2">
              <p className="text-gray-400">✓ You buy part of a company</p>
              <p className="text-gray-400">✓ If the company grows, your money grows too</p>
              <p className="text-gray-400">✓ Over time, your small investment becomes bigger</p>
            </div>
          </div>
          <p className="text-blue-300 font-semibold">Think of it like planting a seed today that grows into a tree tomorrow.</p>
        </div>
      ),
    },
    {
      number: 2,
      title: 'Learn Basic Investment Types',
      icon: '📊',
      shortDesc: 'Stocks, ETFs & Index Funds',
      fullContent: (
        <div className="space-y-6">
          <div className="bg-slate-800/50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-blue-300 font-bold mb-3">📈 STOCKS</p>
            <p className="text-gray-300 mb-2">When you buy a stock, you own a small piece of a company.</p>
            <p className="text-gray-400 text-sm mb-3"><strong>Example:</strong> Buying stock in Apple means you own a tiny part of Apple.</p>
            <div className="space-y-1">
              <p className="text-green-500 text-sm">✔ Higher growth potential</p>
              <p className="text-amber-500 text-sm">⚠ Prices go up and down</p>
              <p className="text-red-500 text-sm">⚠ More risky for beginners</p>
            </div>
          </div>

          <div className="bg-slate-800/50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-300 font-bold mb-3">📊 ETFs & INDEX FUNDS (BEST FOR BEGINNERS)</p>
            <p className="text-gray-300 mb-2">These are collections of many companies bundled together.</p>
            <p className="text-gray-400 text-sm mb-3"><strong>Example:</strong> Instead of buying 1 company, you own a mix of 100+ companies.</p>
            <div className="space-y-1">
              <p className="text-green-500 text-sm">✔ Lower risk than single stocks</p>
              <p className="text-green-500 text-sm">✔ Good for beginners</p>
              <p className="text-green-500 text-sm">✔ Automatically diversified</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 3,
      title: 'Save a Small Amount of Money',
      icon: '💵',
      shortDesc: 'Start with what you have',
      fullContent: (
        <div className="space-y-4">
          <p className="text-gray-300">
            <strong>You don&apos;t need a lot of money to start investing!</strong>
          </p>

          <div className="bg-slate-800/50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-green-500 font-bold mb-3">Where does your money come from?</p>
            <div className="space-y-2">
              <p className="text-gray-300">💰 Allowance</p>
              <p className="text-gray-300">💰 Part-time job or internship</p>
              <p className="text-gray-300">💰 Gifts from family</p>
              <p className="text-gray-300">💰 Birthday money</p>
            </div>
          </div>

          <div className="bg-blue-600/20 border border-blue-500/50 p-4 rounded">
            <p className="text-blue-300 font-bold mb-3">Start with just:</p>
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-blue-400">₹10</div>
              <div className="text-gray-300">or</div>
              <div className="text-2xl font-bold text-blue-400">₹50</div>
              <div className="text-gray-300">or</div>
              <div className="text-2xl font-bold text-blue-400">₹100</div>
            </div>
          </div>

          <p className="text-amber-500 font-semibold">⭐ Consistency matters more than amount!</p>
          <p className="text-gray-400 text-sm">Investing ₹10 every month is BETTER than investing ₹1000 once.</p>
        </div>
      ),
    },
    {
      number: 4,
      title: 'Choose a Teen-Friendly Platform',
      icon: '🛡️',
      shortDesc: 'Pick a safe broker to invest',
      fullContent: (
        <div className="space-y-4">
          <p className="text-gray-300">
            <strong>Important: Teens under 18 need a parent/guardian to help.</strong>
          </p>

          <div className="bg-slate-800/50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-300 font-bold mb-3">Teen-Friendly Platforms:</p>
            <div className="space-y-2">
              <p className="text-gray-300">🟦 Acorns - Micro-investing app</p>
              <p className="text-gray-300">🟩 Greenlight - Teen banking & investing</p>
              <p className="text-gray-300">🟦 Fidelity Youth Account - Beginner-friendly</p>
              <p className="text-gray-300">🏦 SafeStart Invest - Built for your age group</p>
            </div>
          </div>

          <div className="bg-red-600/20 border border-red-500/50 p-4 rounded">
            <p className="text-red-500 font-bold">⚠️ Always:</p>
            <div className="space-y-1 text-gray-300">
              <p>✓ Ask a parent or guardian FIRST</p>
              <p>✓ Check if the platform is regulated</p>
              <p>✓ Read reviews before signing up</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 5,
      title: 'Start With Simple Investments',
      icon: '🎯',
      shortDesc: 'Keep it simple and safe',
      fullContent: (
        <div className="space-y-4">
          <div className="bg-green-600/20 border border-green-500/50 p-4 rounded">
            <p className="text-green-500 font-bold mb-3">✅ START WITH THESE:</p>
            <div className="space-y-2 text-gray-300">
              <p>📊 ETFs (safest for beginners)</p>
              <p>📈 Index Funds (super diversified)</p>
              <p>🏢 Well-known companies like Apple, Google</p>
            </div>
          </div>

          <div className="bg-red-600/20 border border-red-500/50 p-4 rounded">
            <p className="text-red-500 font-bold mb-3">❌ AVOID THESE:</p>
            <div className="space-y-2 text-gray-300">
              <p>🚫 &quot;Get rich quick&quot; investments (SCAM!)</p>
              <p>🚫 Crypto trends you don&apos;t understand</p>
              <p>🚫 Risky day trading (gambling, not investing)</p>
              <p>🚫 Stock tips from social media</p>
            </div>
          </div>

          <p className="text-blue-300 font-semibold">💡 Remember: Boring is GOOD. Flashy is DANGEROUS.</p>
        </div>
      ),
    },
    {
      number: 6,
      title: 'Invest Regularly',
      icon: '📅',
      shortDesc: 'Consistency beats timing',
      fullContent: (
        <div className="space-y-4">
          <p className="text-gray-300">
            <strong>Instead of investing once, invest EVERY WEEK or MONTH.</strong>
          </p>

          <div className="bg-slate-800/50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-300 font-bold mb-3">How to Stay Consistent:</p>
            <div className="space-y-2">
              <p className="text-gray-300">1. Set a reminder on your phone</p>
              <p className="text-gray-300">2. Invest on the same day every month</p>
              <p className="text-gray-300">3. Treat it like a habit (like brushing teeth)</p>
              <p className="text-gray-300">4. Even small amounts add up over time</p>
            </div>
          </div>

          <div className="bg-blue-600/20 border border-blue-500/50 p-4 rounded">
            <p className="text-blue-300 font-bold mb-2">📈 Dollar-Cost Averaging</p>
            <p className="text-gray-300 text-sm">
              This strategy means investing the same amount regularly, no matter if prices are high or low. It helps reduce risk over time and removes the stress of &quot;picking the perfect moment.&quot;
            </p>
          </div>

          <p className="text-amber-500 font-semibold">💪 Small habits = Big wealth over time</p>
        </div>
      ),
    },
    {
      number: 7,
      title: 'Be Patient - Don\'t Panic',
      icon: '⏳',
      shortDesc: 'Stay calm when market moves',
      fullContent: (
        <div className="space-y-4">
          <p className="text-gray-300">
            <strong>The market goes UP and DOWN — that&apos;s NORMAL and HEALTHY.</strong>
          </p>

          <div className="bg-slate-800/50 border-l-4 border-amber-500 p-4 rounded">
            <p className="text-amber-500 font-bold mb-3">Example Timeline:</p>
            <div className="space-y-1 text-gray-300 text-sm">
              <p>📅 Month 1: You invest ₹100, it grows to ₹105 📈</p>
              <p>📅 Month 2: Market drops, it becomes ₹98 📉</p>
              <p>📅 Month 3: Market recovers, it becomes ₹112 📈</p>
              <p className="text-green-500 font-bold mt-2">✓ Over time: You WIN</p>
            </div>
          </div>

          <div className="bg-red-600/20 border border-red-500/50 p-4 rounded">
            <p className="text-red-500 font-bold mb-3">DO NOT:</p>
            <div className="space-y-1 text-gray-300">
              <p>❌ Panic when prices drop (this is normal!)</p>
              <p>❌ Sell just because others are scared</p>
              <p>❌ Check your account every hour</p>
              <p>❌ Make emotional decisions</p>
            </div>
          </div>

          <p className="text-blue-300 font-semibold">🏆 Investing is a LONG-TERM GAME. Winners are patient.</p>
        </div>
      ),
    },
    {
      number: 8,
      title: 'Keep Learning',
      icon: '📚',
      shortDesc: 'Education is your superpower',
      fullContent: (
        <div className="space-y-4">
          <p className="text-gray-300">
            <strong>The more you learn, the smarter your decisions become.</strong>
          </p>

          <div className="bg-slate-800/50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-300 font-bold mb-3">Follow & Read:</p>
            <div className="space-y-2 text-gray-300">
              <p>📺 Financial education YouTube channels</p>
              <p>📖 Books about money and investing</p>
              <p>🎧 Personal finance podcasts</p>
              <p>📰 Financial news websites</p>
              <p>💬 Join investor communities for teens</p>
            </div>
          </div>

          <div className="bg-blue-600/20 border border-blue-500/50 p-4 rounded">
            <p className="text-blue-300 font-bold mb-2">Recommended Resources:</p>
            <div className="space-y-1 text-gray-300 text-sm">
              <p>📚 &quot;The Compound Effect&quot; by Darren Hardy</p>
              <p>📚 &quot;Money Master the Game&quot; by Tony Robbins</p>
              <p>📺 Graham Stephan (YouTube)</p>
              <p>🎧 BiggerPockets Money Podcast</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const finalAdvice = [
    { emoji: '🟢', text: 'Start small.', color: 'text-green-500' },
    { emoji: '⏱️', text: 'Start early.', color: 'text-amber-500' },
    { emoji: '📍', text: 'Stay consistent.', color: 'text-blue-500' },
    { emoji: '🚀', text: 'Think long-term.', color: 'text-blue-600' },
  ];

  return (
    <main className="bg-bg-app text-text-primary min-h-screen">
      <AppNavbar />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-primary/20 border border-primary/50 rounded-full text-primary text-sm font-semibold mb-4 hover:bg-primary/30 hover:border-primary/80 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer">
            8 Easy Steps for Teens
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-text-primary">
          Learn to Invest <span className="text-primary">Step by Step</span>
        </h1>
        <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
          No experience needed. Start from ZERO. Follow 8 simple steps to become a confident investor. Perfect for teens with any amount of money.
        </p>
      </section>

      {/* Main Learning Steps */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setExpandedStep(expandedStep === idx ? -1 : idx)}
              className="w-full text-left bg-slate-900 border-2 border-slate-700 hover:border-blue-600 rounded-xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/20"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-2xl shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-blue-400 bg-blue-600/20 px-3 py-1 rounded-full">
                        STEP {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mt-2">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.shortDesc}</p>
                  </div>
                </div>
                <span className="text-xl text-blue-400 shrink-0">
                  {expandedStep === idx ? '' : ''}
                </span>
              </div>

              {/* Expanded Content */}
              {expandedStep === idx && (
                <div className="border-t border-slate-700 pt-6 mt-6">
                  {step.fullContent}
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Final Advice */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">🎯 Final Advice for Teens</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {finalAdvice.map((advice, idx) => (
            <div
              key={idx}
              className="bg-linear-to-br from-slate-800 to-slate-900 border-2 border-slate-700 rounded-xl p-8 text-center shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{advice.emoji}</div>
              <p className={`text-2xl font-bold ${advice.color}`}>{advice.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Takeaway */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-linear-to-r from-blue-600/20 to-blue-700/20 border-2 border-blue-600/50 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">You Have Everything You Need to Start</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            You don&apos;t need:
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <p className="text-red-500 font-bold text-lg">❌ A lot of money</p>
              <p className="text-gray-400 text-sm">Start with ₹10 or ₹50</p>
            </div>
            <div className="text-center">
              <p className="text-red-500 font-bold text-lg">❌ Special education</p>
              <p className="text-gray-400 text-sm">We teach you everything</p>
            </div>
            <div className="text-center">
              <p className="text-red-500 font-bold text-lg">❌ To be an expert</p>
              <p className="text-gray-400 text-sm">Learn as you go</p>
            </div>
          </div>
          <p className="text-xl text-blue-300 font-bold">
            You JUST need to start today. ✨
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Take Your First Step?</h2>
        <p className="text-xl text-gray-400 mb-10">
          Open your free simulation account and practice investing risk-free today.
        </p>
        <Link href="/dashboard-sim" className="inline-block px-10 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-blue-500/30">
          Start Investing Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>&copy; 2025 SafeStart Invest. Learn risk before money. Build discipline before profit.</p>
        </div>
      </footer>
    </main >
  );
}