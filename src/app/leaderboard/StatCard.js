// src/app/leaderboard/StatCard.js
import React from "react";

export default function StatCard({ icon, title, value, accent }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl p-4 min-w-[120px] shadow-lg border border-[#1E293B] bg-[#1F2937] backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_16px_4px_rgba(37,99,235,0.15)] ${accent}`}
      style={{ background: "rgba(31,41,55,0.85)" }}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm text-[#9CA3AF]">{title}</div>
      <div className="text-lg font-bold text-[#F9FAFB]">{value}</div>
    </div>
  );
}
