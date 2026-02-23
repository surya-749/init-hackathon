// src/app/leaderboard/LeaderboardTable.js
import React from "react";

export default function LeaderboardTable({ traders }) {
  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full rounded-xl bg-[#111827] border border-[#1E293B] text-[#F9FAFB] shadow-lg">
        <thead className="bg-[#1F2937]">
          <tr>
            <th className="py-3 px-4 text-left">Rank</th>
            <th className="py-3 px-4 text-left">Trader Name</th>
            <th className="py-3 px-4 text-left">Category</th>
            <th className="py-3 px-4 text-left">Streak</th>
            <th className="py-3 px-4 text-left">Alerts</th>
            <th className="py-3 px-4 text-left">Trades</th>
            <th className="py-3 px-4 text-left">Avg Gain</th>
            <th className="py-3 px-4 text-left">X Score</th>
          </tr>
        </thead>
        <tbody>
          {traders.map((trader, idx) => (
            <tr
              key={trader.id}
              className="transition-all duration-200 hover:bg-[#1F2937] border-b border-[#1E293B]"
            >
              <td className="py-3 px-4 font-bold">
                <span className={`text-lg ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-[#2563EB]'}`}>{trader.rank}</span>
              </td>
              <td className="py-3 px-4 flex items-center gap-2">
                <img src={trader.avatar} alt={trader.name} className="w-8 h-8 rounded-full border border-[#2563EB]" />
                <span className="font-semibold">{trader.name}</span>
              </td>
              <td className="py-3 px-4 text-[#9CA3AF]">{trader.category}</td>
              <td className="py-3 px-4 text-[#22C55E]">{trader.streak}</td>
              <td className="py-3 px-4">{trader.alerts}</td>
              <td className="py-3 px-4">{trader.trades}</td>
              <td className="py-3 px-4">
                <span className={trader.avgGain >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}>{trader.avgGain}%</span>
              </td>
              <td className="py-3 px-4 text-[#2563EB] font-bold">{trader.xScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
