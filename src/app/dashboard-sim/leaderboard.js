import React, { useEffect, useState } from "react";
import LeaderboardCard from "../leaderboard/LeaderboardCard";
import StatCard from "../leaderboard/StatCard";
import LeaderboardTable from "../leaderboard/LeaderboardTable";
import { traders, statHighlights } from "../leaderboard/traderData";

export default function LeaderboardPage() {
	const [show, setShow] = useState(false);
	useEffect(() => {
		setTimeout(() => setShow(true), 300);
	}, []);

	// Dummy virtual balance
	const virtualBalance = 1250000;

	return (
		<div className="min-h-screen bg-[#0B1220] font-[Inter,Poppins,sans-serif] text-[#F9FAFB]">
			{/* Navbar */}
			<nav className="flex items-center justify-between px-8 py-4 bg-[#111827]/80 backdrop-blur-lg border-b border-[#1E293B] shadow-lg rounded-b-xl sticky top-0 z-20">
				<div className="flex items-center gap-4">
					<img src="/logo.svg" alt="Logo" className="h-8 w-8" />
					<span className="text-xl font-bold text-[#2563EB]">INIT Markets</span>
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

			{/* Header */}
			<section className="mt-10 mb-6 px-8">
				<div className="flex items-center gap-4">
					<h1 className="text-3xl font-bold">Trading Champions</h1>
					<span className="text-[#9CA3AF] text-lg">Real-time Performance Rankings</span>
					<span className="flex items-center gap-1 ml-4 bg-[#1F2937] px-3 py-1 rounded-full text-[#22C55E] font-semibold text-sm">
						<span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span> LIVE
					</span>
				</div>
			</section>

			{/* Top 3 Traders */}
			<section className={`px-8 flex flex-col md:flex-row gap-6 transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
				{traders.slice(0, 3).map((trader) => (
					<LeaderboardCard key={trader.id} {...trader} />
				))}
			</section>

			{/* Stats Highlights */}
			<section className="mt-10 px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
				{statHighlights.map((stat, idx) => (
					<StatCard key={idx} {...stat} />
				))}
			</section>

			{/* Full Leaderboard Table */}
			<section className="mt-12 px-8">
				<LeaderboardTable traders={traders} />
			</section>
		</div>
	);
}
