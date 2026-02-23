import React from "react";
import LeaderboardCard from "./LeaderboardCard";
import StatCard from "./StatCard";
import LeaderboardTable from "./LeaderboardTable";

export default function LeaderboardPage() {
  // Minimal static dummy data
  const traders = [
    {
      id: 1,
      name: "Aryan Mehta",
      role: "Day Trader",
      alerts: 34,
      trades: 120,
      avgGain: 8.2,
      xScore: 982,
    },
    {
      id: 2,
      name: "Riya Sharma",
      role: "Swing Trader",
      alerts: 28,
      trades: 110,
      avgGain: 6.7,
      xScore: 951,
    },
    {
      id: 3,
      name: "Kabir Singh",
      role: "Options Trader",
      alerts: 22,
      trades: 98,
      avgGain: 5.1,
      xScore: 930,
    },
  ];
  const statHighlights = [
    {
      icon: "🔥",
      title: "Most Active Trader",
      value: "Aryan Mehta",
      accent: "border-[#2563EB]",
    },
    {
      icon: "🏆",
      title: "Highest Win Rate",
      value: "Riya Sharma",
      accent: "border-[#22C55E]",
    },
    {
      icon: "⏳",
      title: "Longest Streak",
      value: "Kabir Singh",
      accent: "border-[#FFD700]",
    },
    {
      icon: "🚀",
      title: "Biggest Rank Jump",
      value: "Neha Patel",
      accent: "border-[#EF4444]",
    },
  ];
  const virtualBalance = 1250000;
  return (
    <div className="min-h-screen bg-[#0B1220] font-[Inter,Poppins,sans-serif] text-[#F9FAFB]">
      <nav className="flex items-center justify-between px-8 py-4 bg-[#111827]/80 backdrop-blur-lg border-b border-[#1E293B] shadow-lg rounded-b-xl sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-[#2563EB]">SafeStart</span>
        </div>
        <div className="flex gap-8">
          <a href="/dashboard" className="hover:text-[#2563EB] transition">Dashboard</a>
          <a href="/marketplace" className="hover:text-[#2563EB] transition">Market</a>
          <a href="/leaderboard" className="hover:text-[#2563EB] transition font-semibold">Leaderboard</a>
          <a href="/learn" className="hover:text-[#2563EB] transition">Learn</a>
        </div>
        <div className="flex items-center gap-2 bg-[#1F2937]/60 px-4 py-2 rounded-xl border border-[#1E293B] shadow-md backdrop-blur-md">
          <span className="text-[#9CA3AF]">Virtual Balance</span>
          <span className="font-bold text-[#22C55E] text-lg">₹{virtualBalance.toLocaleString()}</span>
        </div>
      </nav>
      <section className="mt-10 mb-6 px-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Trading Champions</h1>
          <span className="text-[#9CA3AF] text-lg">Real-time Performance Rankings</span>
          <span className="flex items-center gap-1 ml-4 bg-[#1F2937] px-3 py-1 rounded-full text-[#22C55E] font-semibold text-sm">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span> LIVE
          </span>
        </div>
      </section>
      <section className="px-8 flex flex-col md:flex-row gap-6">
        {traders.map((trader, idx) => (
          <div className="relative flex items-center rounded-xl p-6 mb-4 transition-all duration-300 bg-[#1F2937] border border-[#1E293B]" key={trader.id}>
            <span className="text-2xl font-bold text-[#2563EB] mr-6">{idx + 1}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[#F9FAFB]">{trader.name}</span>
                <span className="text-sm text-[#9CA3AF] bg-[#1F2937] px-2 py-1 rounded-lg">{trader.role}</span>
              </div>
              <div className="flex gap-4 mt-2 text-[#9CA3AF]">
                <span>Alerts: <span className="text-[#22C55E] font-semibold">{trader.alerts}</span></span>
                <span>Trades: <span className="text-[#2563EB] font-semibold">{trader.trades}</span></span>
                <span>Profit Percentage: <span className={trader.avgGain >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}>{trader.avgGain}%</span></span>
              </div>
            </div>
            <div className="ml-auto flex flex-col items-end">
                <span className="bg-[#2563EB] text-white px-4 py-2 rounded-lg font-bold shadow-md">Score: {trader.xScore}</span>
            </div>
          </div>
        ))}
      </section>
      <section className="mt-10 px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {statHighlights.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </section>
      <section className="mt-12 px-8">
        <table className="min-w-full rounded-xl bg-[#111827] border border-[#1E293B] text-[#F9FAFB] shadow-lg">
          <thead className="bg-[#1F2937]">
            <tr>
              <th className="py-3 px-4 text-left">Rank</th>
              <th className="py-3 px-4 text-left">Trader Name</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Alerts</th>
              <th className="py-3 px-4 text-left">Trades</th>
              <th className="py-3 px-4 text-left">Profit Percentage</th>
              <th className="py-3 px-4 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {traders.map((trader, idx) => (
              <tr key={trader.id} className="transition-all duration-200 hover:bg-[#1F2937] border-b border-[#1E293B]">
                <td className="py-3 px-4 font-bold text-[#2563EB]">{idx + 1}</td>
                <td className="py-3 px-4 font-semibold">{trader.name}</td>
                <td className="py-3 px-4 text-[#9CA3AF]">{trader.role}</td>
                <td className="py-3 px-4">{trader.alerts}</td>
                <td className="py-3 px-4">{trader.trades}</td>
                <td className="py-3 px-4"><span className={trader.avgGain >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}>{trader.avgGain}%</span></td>
                <td className="py-3 px-4 text-[#2563EB] font-bold">{trader.xScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
