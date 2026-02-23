// src/app/leaderboard/LeaderboardCard.js
import React from "react";

const rankGradients = {
  1: "bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500",
  2: "bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400",
  3: "bg-gradient-to-r from-orange-400 via-orange-200 to-orange-500",
};

const glowColors = {
  1: "shadow-[0_0_24px_6px_rgba(255,215,0,0.4)]",
  2: "shadow-[0_0_24px_6px_rgba(192,192,192,0.3)]",
  3: "shadow-[0_0_24px_6px_rgba(205,127,50,0.3)]",
};

export default function LeaderboardCard({
  rank,
  avatar,
  name,
  role,
  alerts,
  trades,
  avgGain,
  xScore,
}) {
  return (
    <div
      className={`relative flex items-center rounded-xl p-6 mb-4 transition-all duration-300 ${rankGradients[rank]} ${glowColors[rank]} backdrop-blur-lg border border-[#1E293B]`}
      style={{ background: "rgba(17,24,39,0.85)", boxShadow: "0 4px 32px 0 rgba(37,99,235,0.08)" }}
    >
      <div className="absolute left-4 top-4">
        <span className="text-2xl font-bold text-transparent bg-clip-text" style={{
          backgroundImage:
            rank === 1
              ? "linear-gradient(90deg,#FFD700,#FFFACD,#FFD700)"
              : rank === 2
              ? "linear-gradient(90deg,#C0C0C0,#F5F5F5,#C0C0C0)"
              : "linear-gradient(90deg,#CD7F32,#FFDAB9,#CD7F32)",
        }}>
          {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
        </span>
      </div>
      <img src={avatar} alt={name} className="w-16 h-16 rounded-full border-4 border-[#2563EB] mr-6" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-[#F9FAFB]">{name}</span>
          <span className="text-sm text-[#9CA3AF] bg-[#1F2937] px-2 py-1 rounded-lg">{role}</span>
        </div>
        <div className="flex gap-4 mt-2 text-[#9CA3AF]">
          <span>Alerts: <span className="text-[#22C55E] font-semibold">{alerts}</span></span>
          <span>Trades: <span className="text-[#2563EB] font-semibold">{trades}</span></span>
          <span>Avg Gain: <span className={avgGain >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}>{avgGain}%</span></span>
        </div>
      </div>
      <div className="ml-auto flex flex-col items-end">
        <span className="bg-[#2563EB] text-white px-4 py-2 rounded-lg font-bold shadow-md">Score: {xScore}</span>
      </div>
    </div>
  );
}
