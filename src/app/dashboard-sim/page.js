"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";

export default function SimulationDashboard() {
  const {
    portfolio,
    sellETF,
    calculateRiskScore,
    isLoaded,
    INITIAL_BALANCE,
    switchAccountMode,
    getActiveBalance,
    getActiveHoldings,
    getActiveTransactions,
    getInitialBalance,
  } = usePortfolio();

  const accountMode = portfolio.accountMode || "virtual";
  const activeBalance = getActiveBalance();
  const activeHoldings = getActiveHoldings();
  const activeTransactions = getActiveTransactions();
  const initialBalance = getInitialBalance();
  const [etfPrices, setEtfPrices] = useState({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [aiExplanation, setAiExplanation] = useState(
    "Welcome to your simulation dashboard! Your portfolio is updated in real-time. Visit the Market to buy ETFs."
  );

  // Fetch current ETF prices
  const fetchPrices = useCallback(async () => {
    try {
      const response = await fetch("/api/market");
      const result = await response.json();
      if (result.success && result.data) {
        const priceMap = {};
        result.data.forEach((etf) => {
          priceMap[etf.symbol] = etf;
        });
        setEtfPrices(priceMap);
      }
    } catch (error) {
      console.error("Failed to fetch prices:", error);
    } finally {
      setIsLoadingPrices(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Calculate portfolio value with current prices
  const holdingsValue = activeHoldings.reduce((total, holding) => {
    const currentPrice = etfPrices[holding.symbol]?.price || holding.avgPrice;
    return total + currentPrice * holding.quantity;
  }, 0);

  const investedValue = activeHoldings.reduce((total, holding) => {
    return total + holding.avgPrice * holding.quantity;
  }, 0);

  const totalValue = activeBalance + holdingsValue;
  const totalPnL = holdingsValue - investedValue;
  const pnlPercent = investedValue > 0 ? ((totalPnL / investedValue) * 100).toFixed(2) : "0.00";

  const riskScore = calculateRiskScore();
  const riskColor =
    riskScore === "Low"
      ? "text-success"
      : riskScore === "Medium"
      ? "text-warning"
      : riskScore === "High"
      ? "text-danger"
      : "text-text-muted";

  const handleSell = (holding) => {
    const currentPrice = etfPrices[holding.symbol]?.price || holding.avgPrice;
    const result = sellETF(holding.symbol, holding.quantity, currentPrice);
    
    if (result.success) {
      const pnl = result.pnl;
      setAiExplanation(
        pnl >= 0
          ? `You sold ${holding.name} with a profit of ₹${pnl.toFixed(2)}! Remember, patience often leads to better returns.`
          : `You sold ${holding.name} at a loss of ₹${Math.abs(pnl).toFixed(2)}. This is part of learning. Market volatility is normal.`
      );
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-bg-app flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-app">
      {/* Header */}
      <header className="border-b border-border bg-bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-text-primary font-semibold">SafeStart</span>
            </Link>
            {/* Account Mode Switcher */}
            <div className="flex items-center gap-1 bg-bg-elevated rounded-full p-1">
              <button
                onClick={() => switchAccountMode("virtual")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  accountMode === "virtual"
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                Virtual
              </button>
              <button
                onClick={() => switchAccountMode("real")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  accountMode === "real"
                    ? "bg-warning text-white"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                Real
              </button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <Link href="/dashboard-sim" className="text-primary font-medium text-sm">
                Dashboard
              </Link>
              <Link href="/marketplace" className="text-text-muted hover:text-text-primary transition-colors text-sm">
                Market
              </Link>
              <Link href="/leaderboard" className="text-text-muted hover:text-text-primary transition-colors text-sm">
                Leaderboard
              </Link>
              <Link href="/learn" className="text-text-muted hover:text-text-primary transition-colors text-sm">
                Learn
              </Link>
            </nav>
            <div className="pl-6 border-l border-border text-right">
              <p className="text-text-muted text-xs">
                {accountMode === "real" ? "Real Balance" : "Virtual Balance"}
              </p>
              <p className="text-text-primary font-semibold">
                ₹{activeBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* AI Explanation Banner */}
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-primary text-sm font-medium">AI Insight</p>
            <p className="text-text-secondary text-sm mt-1">{aiExplanation}</p>
          </div>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Value */}
          <div className="rounded-xl bg-bg-card border border-border p-4">
            <p className="text-text-muted text-xs mb-1">Portfolio Value</p>
            <p className="text-2xl font-bold text-text-primary">
              ₹{totalValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* P&L */}
          <div className="rounded-xl bg-bg-card border border-border p-4">
            <p className="text-text-muted text-xs mb-1">Total P&L</p>
            <p className={`text-2xl font-bold ${totalPnL >= 0 ? "text-success" : "text-danger"}`}>
              {totalPnL >= 0 ? "+" : ""}₹{totalPnL.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
            <p className={`text-xs ${totalPnL >= 0 ? "text-success" : "text-danger"}`}>
              {totalPnL >= 0 ? "+" : ""}{pnlPercent}%
            </p>
          </div>

          {/* Holdings */}
          <div className="rounded-xl bg-bg-card border border-border p-4">
            <p className="text-text-muted text-xs mb-1">Holdings Value</p>
            <p className="text-2xl font-bold text-text-primary">
              ₹{holdingsValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Risk Meter */}
          <div className="rounded-xl bg-bg-card border border-border p-4">
            <p className="text-text-muted text-xs mb-1">Risk Level</p>
            <p className={`text-2xl font-bold ${riskColor}`}>{riskScore}</p>
            <div className="mt-2 h-2 bg-bg-elevated rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  riskScore === "Low"
                    ? "w-1/3 bg-success"
                    : riskScore === "Medium"
                    ? "w-2/3 bg-warning"
                    : riskScore === "High"
                    ? "w-full bg-danger"
                    : "w-0"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Holdings Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Holdings */}
            <div className="rounded-xl bg-bg-card border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-primary">Your Holdings</h2>
                <Link href="/marketplace" className="text-primary text-sm hover:underline">
                  + Buy More
                </Link>
              </div>
              
              {activeHoldings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-bg-elevated mx-auto flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-text-muted">No holdings yet</p>
                  <p className="text-text-muted text-sm mb-4">Start investing from the marketplace</p>
                  <Link href="/marketplace" className="inline-block px-6 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light">
                    Explore ETFs
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeHoldings.map((holding) => {
                    const currentPrice = etfPrices[holding.symbol]?.price || holding.avgPrice;
                    const currentValue = currentPrice * holding.quantity;
                    const investedValue = holding.avgPrice * holding.quantity;
                    const pnl = currentValue - investedValue;
                    const pnlPercent = ((pnl / investedValue) * 100).toFixed(2);
                    const priceChange = etfPrices[holding.symbol]?.change || 0;

                    return (
                      <div
                        key={holding.symbol}
                        className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-text-primary">{holding.name}</p>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              holding.risk === "Low" ? "bg-success/10 text-success" :
                              holding.risk === "Medium" ? "bg-warning/10 text-warning" :
                              "bg-danger/10 text-danger"
                            }`}>
                              {holding.risk}
                            </span>
                          </div>
                          <p className="text-text-muted text-sm">
                            {holding.quantity} units @ ₹{holding.avgPrice.toFixed(2)} avg
                          </p>
                          <p className="text-text-muted text-xs mt-1">
                            Current: ₹{currentPrice.toFixed(2)} 
                            <span className={`ml-1 ${priceChange >= 0 ? "text-success" : "text-danger"}`}>
                              ({priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)})
                            </span>
                          </p>
                        </div>
                        <div className="text-right mr-4">
                          <p className="font-medium text-text-primary">
                            ₹{currentValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </p>
                          <p className={`text-sm ${pnl >= 0 ? "text-success" : "text-danger"}`}>
                            {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)} ({pnlPercent}%)
                          </p>
                        </div>
                        <button
                          onClick={() => handleSell(holding)}
                          className="px-4 py-2 rounded-lg bg-danger/10 text-danger text-sm font-medium hover:bg-danger/20 transition-colors"
                        >
                          Sell All
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Transaction History */}
            <div className="rounded-xl bg-bg-card border border-border p-5">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Transactions</h2>
              {activeTransactions.length === 0 ? (
                <p className="text-text-muted text-sm text-center py-4">No transactions yet</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {activeTransactions.slice(0, 10).map((tx) => (
                    <div key={tx.id} className="flex items-center gap-3 p-3 rounded-lg bg-bg-elevated">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === "BUY" ? "bg-success/10 text-success" :
                        tx.type === "SELL" ? "bg-danger/10 text-danger" :
                        "bg-primary/10 text-primary"
                      }`}>
                        {tx.type === "BUY" ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        ) : tx.type === "SELL" ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">
                          {tx.type} {tx.symbol || "Funds"}
                        </p>
                        <p className="text-xs text-text-muted">
                          {tx.quantity ? `${tx.quantity} × ₹${tx.price?.toFixed(2)}` : `Added ₹${tx.amount}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          tx.type === "BUY" ? "text-danger" :
                          tx.type === "SELL" ? "text-success" :
                          "text-primary"
                        }`}>
                          {tx.type === "BUY" ? "-" : "+"} ₹{(tx.total || tx.amount)?.toFixed(2)}
                        </p>
                        <p className="text-xs text-text-muted">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Learning Progress */}
            <div className="rounded-xl bg-bg-card border border-border p-5">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Unlock Real Mode</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-muted">Learning Modules</span>
                    <span className="text-text-primary">{portfolio.completedModules}/5</span>
                  </div>
                  <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all" 
                      style={{ width: `${(portfolio.completedModules / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-muted">Risk Assessment</span>
                    <span className={portfolio.riskAssessmentPassed ? "text-success" : "text-warning"}>
                      {portfolio.riskAssessmentPassed ? "Passed" : "Pending"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-muted">Parent Approval</span>
                    <span className={portfolio.parentApproved ? "text-success" : "text-warning"}>
                      {portfolio.parentApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Parent Funding Info */}
                <div className={`p-3 rounded-lg mt-4 ${
                  accountMode === "real"
                    ? "bg-warning/10 border border-warning/20"
                    : "bg-primary/10 border border-primary/20"
                }`}>
                  <p className={`text-sm font-medium mb-1 ${
                    accountMode === "real" ? "text-warning" : "text-primary"
                  }`}>
                    {accountMode === "real" ? "💵 Real Account" : "💰 Virtual Account"}
                  </p>
                  <p className="text-text-secondary text-xs">
                    {accountMode === "real"
                      ? "You are investing real money. Be careful with your trades!"
                      : `You started with ₹${initialBalance.toLocaleString("en-IN")} virtual money. Switch to Real Account when you're ready.`}
                  </p>
                </div>

                <button 
                  disabled={!portfolio.riskAssessmentPassed || !portfolio.parentApproved}
                  className="w-full py-3 rounded-lg bg-bg-elevated text-text-muted text-sm font-medium cursor-not-allowed disabled:opacity-50"
                >
                  Complete Requirements to Unlock
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
