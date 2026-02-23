"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        if (data.success) {
          setLeaderboard(data.leaderboard);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to load leaderboard data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankColor = (rank) => {
    if (rank === 1) return "bg-yellow-400 text-yellow-900";
    if (rank === 2) return "bg-gray-300 text-gray-800";
    if (rank === 3) return "bg-yellow-600 text-yellow-100";
    return "bg-bg-elevated text-text-muted";
  };

  return (
    <div className="min-h-screen bg-bg-app">
      {/* Header */}
      <header className="bg-bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard-sim" className="text-text-muted hover:text-text transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-text">Leaderboard</h1>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg text-primary font-semibold text-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Live Rankings
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Top 3 Podium */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* 2nd Place */}
            <div className="order-2 md:order-1 bg-bg-card border border-border rounded-2xl p-6 text-center transform hover:-translate-y-2 transition-transform duration-300">
              {leaderboard.length > 1 && (
                <>
                  <div className="w-24 h-24 rounded-full bg-gray-300/20 mx-auto flex items-center justify-center text-4xl font-bold text-gray-400 mb-3">
                    {leaderboard[1].name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold text-text">{leaderboard[1].name}</h3>
                  <p className="text-gray-400">2nd Place</p>
                  <p className={`text-2xl font-bold mt-2 ${leaderboard[1].pnl >= 0 ? "text-success" : "text-danger"}`}>
                    {leaderboard[1].pnlPercent.toFixed(2)}%
                  </p>
                </>
              )}
            </div>

            {/* 1st Place */}
            <div className="order-1 md:order-2 bg-bg-card border-2 border-yellow-400 rounded-t-2xl p-8 text-center shadow-lg shadow-yellow-400/10 transform hover:-translate-y-4 transition-transform duration-300">
              {leaderboard.length > 0 && (
                <>
                  <div className="w-32 h-32 rounded-full bg-yellow-400/20 mx-auto flex items-center justify-center text-5xl font-bold text-yellow-400 mb-4">
                    {leaderboard[0].name.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-bold text-text">{leaderboard[0].name}</h2>
                  <p className="text-yellow-400 font-semibold">1st Place</p>
                  <p className={`text-3xl font-bold mt-2 ${leaderboard[0].pnl >= 0 ? "text-success" : "text-danger"}`}>
                    {leaderboard[0].pnlPercent.toFixed(2)}%
                  </p>
                </>
              )}
            </div>

            {/* 3rd Place */}
            <div className="order-3 md:order-3 bg-bg-card border border-border rounded-2xl p-6 text-center transform hover:-translate-y-2 transition-transform duration-300">
              {leaderboard.length > 2 && (
                <>
                  <div className="w-24 h-24 rounded-full bg-yellow-600/20 mx-auto flex items-center justify-center text-4xl font-bold text-yellow-700 mb-3">
                    {leaderboard[2].name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold text-text">{leaderboard[2].name}</h3>
                  <p className="text-yellow-700">3rd Place</p>
                  <p className={`text-2xl font-bold mt-2 ${leaderboard[2].pnl >= 0 ? "text-success" : "text-danger"}`}>
                    {leaderboard[2].pnlPercent.toFixed(2)}%
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Full Leaderboard Table */}
        <section className="bg-bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-lg font-semibold text-text">Full Rankings</h2>
          </div>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-text-muted mt-2">Loading rankings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-danger">{error}</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg-elevated">
                  <th className="p-4 text-xs text-text-muted font-semibold uppercase tracking-wider">Rank</th>
                  <th className="p-4 text-xs text-text-muted font-semibold uppercase tracking-wider">Player</th>
                  <th className="p-4 text-xs text-text-muted font-semibold uppercase tracking-wider text-right">Total Value</th>
                  <th className="p-4 text-xs text-text-muted font-semibold uppercase tracking-wider text-right">P&L (%)</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player, index) => (
                  <tr key={player.id} className="border-t border-border hover:bg-bg-elevated transition-colors">
                    <td className="p-4">
                      <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${getRankColor(index + 1)}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-text">{player.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-text">
                      ₹{player.totalValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`p-4 text-right font-mono font-semibold ${player.pnlPercent >= 0 ? "text-success" : "text-danger"}`}>
                      {player.pnlPercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
