"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";

// Fallback ETF Data (used when API fails)
const fallbackETFs = [
  {
    id: 1, name: "Nifty 50 ETF", symbol: "NIFTYBEES", price: 245.50, change: 2.35, changePercent: 0.97,
    sector: "Index", risk: "Low", weekHigh52: 268.90, weekLow52: 198.20, returns: { "1M": 2.4 },
  },
  {
    id: 2, name: "Bank ETF", symbol: "BANKBEES", price: 485.20, change: -5.80, changePercent: -1.18,
    sector: "Banking", risk: "Medium", weekHigh52: 520.00, weekLow52: 380.50, returns: { "1M": -1.2 },
  },
  {
    id: 3, name: "IT ETF", symbol: "ITBEES", price: 38.75, change: 1.25, changePercent: 3.34,
    sector: "Technology", risk: "Medium", weekHigh52: 45.80, weekLow52: 28.90, returns: { "1M": 5.8 },
  },
  {
    id: 4, name: "Gold ETF", symbol: "GOLDBEES", price: 58.90, change: 0.45, changePercent: 0.77,
    sector: "Commodity", risk: "Low", weekHigh52: 62.50, weekLow52: 48.20, returns: { "1M": 1.2 },
  },
  {
    id: 5, name: "Junior Nifty ETF", symbol: "JUNIORBEES", price: 625.40, change: 8.20, changePercent: 1.33,
    sector: "Index", risk: "Medium", weekHigh52: 680.00, weekLow52: 520.30, returns: { "1M": 3.2 },
  },
  {
    id: 6, name: "PSU Bank ETF", symbol: "PSUBNKBEES", price: 78.45, change: -0.32, changePercent: -0.41,
    sector: "Banking", risk: "High", weekHigh52: 92.80, weekLow52: 55.60, returns: { "1M": -2.1 },
  },
  {
    id: 7, name: "Liquid ETF", symbol: "LIQUIDBEES", price: 1000.05, change: 0.02, changePercent: 0.002,
    sector: "Debt", risk: "Low", weekHigh52: 1000.10, weekLow52: 999.80, returns: { "1M": 0.5 },
  },
  {
    id: 8, name: "Infrastructure ETF", symbol: "INFRABEES", price: 542.80, change: 12.45, changePercent: 2.35,
    sector: "Infrastructure", risk: "High", weekHigh52: 580.00, weekLow52: 420.50, returns: { "1M": 4.8 },
  },
];

// ETF descriptions and static data
const etfMetadata = {
  NIFTYBEES: { description: "Tracks the Nifty 50 index, representing top 50 companies by market cap.", aum: "₹15,420 Cr", expenseRatio: "0.05%" },
  BANKBEES: { description: "Tracks the Nifty Bank index, covering major banking stocks.", aum: "₹8,230 Cr", expenseRatio: "0.20%" },
  ITBEES: { description: "Tracks the Nifty IT index, covering major IT companies.", aum: "₹2,840 Cr", expenseRatio: "0.15%" },
  GOLDBEES: { description: "Tracks domestic gold prices, ideal for portfolio diversification.", aum: "₹6,120 Cr", expenseRatio: "0.50%" },
  JUNIORBEES: { description: "Tracks the Nifty Next 50 index, representing emerging large caps.", aum: "₹3,560 Cr", expenseRatio: "0.12%" },
  PSUBNKBEES: { description: "Tracks the Nifty PSU Bank index, covering public sector banks.", aum: "₹1,280 Cr", expenseRatio: "0.18%" },
  LIQUIDBEES: { description: "Invests in overnight securities, ideal for parking surplus funds.", aum: "₹12,450 Cr", expenseRatio: "0.08%" },
  INFRABEES: { description: "Tracks the Nifty Infrastructure index, covering infra companies.", aum: "₹890 Cr", expenseRatio: "0.25%" },
};

const sectors = ["All", "Index", "Banking", "Technology", "Commodity", "Debt", "Infrastructure"];
const riskLevels = ["All", "Low", "Medium", "High"];

export default function MarketplacePage() {
  const { portfolio, buyETF, isLoaded } = usePortfolio();
  const [etfData, setEtfData] = useState(fallbackETFs);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [selectedETF, setSelectedETF] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [buySuccess, setBuySuccess] = useState(null);

  // Fetch real market data
  const fetchMarketData = useCallback(async () => {
    try {
      const response = await fetch("/api/market");
      const result = await response.json();

      if (result.success && result.data.length > 0) {
        // Merge API data with metadata
        const mergedData = result.data.map((etf) => ({
          ...etf,
          ...etfMetadata[etf.symbol],
        }));
        setEtfData(mergedData);
        setIsLive(true);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Failed to fetch market data:", error);
      setIsLive(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and refresh every 60 seconds
  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  // Filter and sort ETFs
  const filteredETFs = etfData
    .filter((etf) => {
      const matchesSearch =
        etf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        etf.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === "All" || etf.sector === selectedSector;
      const matchesRisk = selectedRisk === "All" || etf.risk === selectedRisk;
      return matchesSearch && matchesSector && matchesRisk;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return b.price - a.price;
        case "change":
          return b.changePercent - a.changePercent;
        case "returns":
          return (b.returns?.["1M"] || 0) - (a.returns?.["1M"] || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Market summary
  const gainers = etfData.filter((e) => e.change > 0).length;
  const losers = etfData.filter((e) => e.change < 0).length;
  const avgChange = (etfData.reduce((sum, e) => sum + e.changePercent, 0) / etfData.length).toFixed(2);

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
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              Simulation
            </span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <Link href="/dashboard-sim" className="text-text-muted hover:text-text-primary transition-colors text-sm">
                Dashboard
              </Link>
              <Link href="/marketplace" className="text-primary font-medium text-sm">
                Market
              </Link>
              <Link href="/learn" className="text-text-muted hover:text-text-primary transition-colors text-sm">
                Learn
              </Link>
            </nav>
            {/* Virtual Balance */}
            <div className="pl-6 border-l border-border">
              <p className="text-text-muted text-xs">Virtual Balance</p>
              <p className="text-text-primary font-semibold">
                ₹{isLoaded ? portfolio.virtualBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : "---"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Page Title & Market Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-text-primary">ETF Marketplace</h1>
              {isLive ? (
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  LIVE
                </span>
              ) : (
                <span className="px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                  Demo Data
                </span>
              )}
            </div>
            <p className="text-text-secondary text-sm mt-1">
              {isLive && lastUpdated
                ? `Real-time NSE data • Updated ${lastUpdated.toLocaleTimeString()}`
                : "Explore curated ETF baskets for your simulation portfolio"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchMarketData}
              disabled={isLoading}
              className="p-2 rounded-lg bg-bg-card border border-border hover:border-primary transition-colors disabled:opacity-50"
            >
              <svg className={`w-5 h-5 text-text-muted ${isLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-card border border-border">
              <span className="text-text-muted text-sm">Market:</span>
              <span className={`font-medium ${parseFloat(avgChange) >= 0 ? "text-success" : "text-danger"}`}>
                {parseFloat(avgChange) >= 0 ? "+" : ""}{avgChange}%
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-bg-card border border-border">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-success font-medium">{gainers}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-danger" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-danger font-medium">{losers}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search ETFs by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-card border border-border text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
          </div>

          {/* Sector Filter */}
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-4 py-3 rounded-xl bg-bg-card border border-border text-text-primary focus:border-primary focus:outline-none cursor-pointer"
          >
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector === "All" ? "All Sectors" : sector}
              </option>
            ))}
          </select>

          {/* Risk Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-4 py-3 rounded-xl bg-bg-card border border-border text-text-primary focus:border-primary focus:outline-none cursor-pointer"
          >
            {riskLevels.map((risk) => (
              <option key={risk} value={risk}>
                {risk === "All" ? "All Risk Levels" : `${risk} Risk`}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl bg-bg-card border border-border text-text-primary focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="change">Sort by Change</option>
            <option value="returns">Sort by 1M Returns</option>
          </select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-text-secondary">Fetching live market data...</span>
            </div>
          </div>
        )}

        {/* ETF Grid */}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredETFs.map((etf) => (
              <div
                key={etf.id}
                onClick={() => setSelectedETF(etf)}
                className="rounded-xl bg-bg-card border border-border p-5 hover:border-primary/50 transition-all cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-text-primary">{etf.name}</h3>
                    <p className="text-text-muted text-sm">{etf.symbol}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      etf.risk === "Low"
                        ? "bg-success/10 text-success"
                        : etf.risk === "Medium"
                        ? "bg-warning/10 text-warning"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {etf.risk}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-text-primary">₹{etf.price?.toFixed(2)}</p>
                    <p className={`text-sm ${etf.change >= 0 ? "text-success" : "text-danger"}`}>
                      {etf.change >= 0 ? "+" : ""}{etf.change?.toFixed(2)} ({etf.changePercent?.toFixed(2)}%)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-text-muted text-xs">1M Return</p>
                    <p className={`font-medium ${(etf.returns?.["1M"] || 0) >= 0 ? "text-success" : "text-danger"}`}>
                      {(etf.returns?.["1M"] || 0) >= 0 ? "+" : ""}{etf.returns?.["1M"] || 0}%
                    </p>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="h-12 bg-bg-elevated rounded-lg flex items-center justify-center mb-4">
                  <div className="flex items-end gap-1 h-8">
                    {(etf.historicalData || [40, 55, 45, 60, 50, 70, 65, 75, 68, 72]).map((h, i) => {
                      const normalized = etf.historicalData 
                        ? ((h - Math.min(...etf.historicalData)) / (Math.max(...etf.historicalData) - Math.min(...etf.historicalData) || 1)) * 100
                        : h;
                      return (
                        <div
                          key={i}
                          className={`w-2 rounded-sm ${etf.change >= 0 ? "bg-success/50" : "bg-danger/50"}`}
                          style={{ height: `${Math.max(10, normalized)}%` }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Sector & Live Badge */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">{etf.sector}</span>
                  {etf.isLive && (
                    <span className="flex items-center gap-1 text-success text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      Live
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredETFs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted">No ETFs match your filters</p>
          </div>
        )}
      </main>

      {/* ETF Detail Modal */}
      {selectedETF && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-text-primary">{selectedETF.name}</h2>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedETF.risk === "Low"
                        ? "bg-success/10 text-success"
                        : selectedETF.risk === "Medium"
                        ? "bg-warning/10 text-warning"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {selectedETF.risk} Risk
                  </span>
                  {selectedETF.isLive && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 text-success text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      Live Data
                    </span>
                  )}
                </div>
                <p className="text-text-muted">{selectedETF.symbol} • {selectedETF.sector}</p>
              </div>
              <button
                onClick={() => setSelectedETF(null)}
                className="text-text-muted hover:text-text-primary p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Price Section */}
            <div className="p-4 rounded-xl bg-bg-elevated mb-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-text-muted text-sm mb-1">Current Price</p>
                  <p className="text-3xl font-bold text-text-primary">₹{selectedETF.price?.toFixed(2)}</p>
                  <p className={`text-sm mt-1 ${selectedETF.change >= 0 ? "text-success" : "text-danger"}`}>
                    {selectedETF.change >= 0 ? "+" : ""}{selectedETF.change?.toFixed(2)} ({selectedETF.changePercent?.toFixed(2)}%) today
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-text-muted text-xs">52W Range</p>
                  <p className="text-text-primary text-sm">
                    ₹{selectedETF.weekLow52?.toFixed(2)} - ₹{selectedETF.weekHigh52?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-text-primary font-medium mb-2">About</h3>
              <p className="text-text-secondary text-sm">{selectedETF.description || "ETF tracking index performance."}</p>
            </div>

            {/* Returns */}
            {selectedETF.returns && (
              <div className="mb-6">
                <h3 className="text-text-primary font-medium mb-3">Returns</h3>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(selectedETF.returns).map(([period, value]) => (
                    <div key={period} className="p-3 rounded-lg bg-bg-elevated text-center">
                      <p className="text-text-muted text-xs mb-1">{period}</p>
                      <p className={`font-semibold ${value >= 0 ? "text-success" : "text-danger"}`}>
                        {value >= 0 ? "+" : ""}{value}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Stats */}
            <div className="mb-6">
              <h3 className="text-text-primary font-medium mb-3">Key Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-bg-elevated">
                  <p className="text-text-muted text-xs">Assets Under Management</p>
                  <p className="text-text-primary font-medium">{selectedETF.aum || "N/A"}</p>
                </div>
                <div className="p-3 rounded-lg bg-bg-elevated">
                  <p className="text-text-muted text-xs">Expense Ratio</p>
                  <p className="text-text-primary font-medium">{selectedETF.expenseRatio || "N/A"}</p>
                </div>
                {selectedETF.volume && (
                  <div className="p-3 rounded-lg bg-bg-elevated">
                    <p className="text-text-muted text-xs">Volume</p>
                    <p className="text-text-primary font-medium">{selectedETF.volume?.toLocaleString()}</p>
                  </div>
                )}
                {selectedETF.dayHigh && (
                  <div className="p-3 rounded-lg bg-bg-elevated">
                    <p className="text-text-muted text-xs">Day Range</p>
                    <p className="text-text-primary font-medium">₹{selectedETF.dayLow?.toFixed(2)} - ₹{selectedETF.dayHigh?.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Insight */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="text-primary text-sm font-medium">AI Analysis</p>
                  <p className="text-text-secondary text-sm mt-1">
                    {selectedETF.risk === "Low"
                      ? `${selectedETF.name} is a conservative choice suitable for beginners. Its low volatility makes it ideal for building your first portfolio.`
                      : selectedETF.risk === "Medium"
                      ? `${selectedETF.name} offers balanced risk-reward. Consider pairing with low-risk ETFs for diversification.`
                      : `${selectedETF.name} has higher volatility. Only invest if you understand sector-specific risks and have a diversified portfolio.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowBuyModal(true);
                  setBuyQuantity(1);
                  setBuySuccess(null);
                }}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-medium text-center hover:bg-primary-light transition-colors"
              >
                Buy in Simulation
              </button>
              <button
                onClick={() => setSelectedETF(null)}
                className="px-6 py-3 rounded-xl border border-border text-text-primary hover:bg-bg-elevated transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buy Modal */}
      {showBuyModal && selectedETF && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-bg-card border border-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-primary">
                Buy {selectedETF.name}
              </h3>
              <button
                onClick={() => {
                  setShowBuyModal(false);
                  setBuySuccess(null);
                }}
                className="text-text-muted hover:text-text-primary"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {buySuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-success/10 mx-auto flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-text-primary mb-2">Purchase Successful!</h4>
                <p className="text-text-secondary mb-4">
                  You bought {buySuccess.quantity} units of {selectedETF.symbol} for ₹{buySuccess.total.toFixed(2)}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowBuyModal(false);
                      setSelectedETF(null);
                      setBuySuccess(null);
                    }}
                    className="flex-1 py-3 rounded-xl border border-border text-text-primary hover:bg-bg-elevated transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <Link
                    href="/dashboard-sim"
                    className="flex-1 py-3 rounded-xl bg-primary text-white font-medium text-center hover:bg-primary-light transition-colors"
                  >
                    View Portfolio
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* ETF Info */}
                <div className="p-4 rounded-xl bg-bg-elevated">
                  <div className="flex justify-between mb-2">
                    <span className="text-text-muted">Current Price</span>
                    <span className="text-text-primary font-medium">₹{selectedETF.price?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Risk Level</span>
                    <span className={`${
                      selectedETF.risk === "Low" ? "text-success" :
                      selectedETF.risk === "Medium" ? "text-warning" : "text-danger"
                    }`}>
                      {selectedETF.risk}
                    </span>
                  </div>
                </div>

                {/* Quantity Input */}
                <div>
                  <label className="block text-text-muted text-sm mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setBuyQuantity(Math.max(1, buyQuantity - 1))}
                      className="w-10 h-10 rounded-lg bg-bg-elevated border border-border flex items-center justify-center text-text-primary hover:border-primary"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={buyQuantity}
                      onChange={(e) => setBuyQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 px-4 py-3 rounded-lg bg-bg-elevated border border-border text-text-primary text-center focus:border-primary focus:outline-none"
                    />
                    <button
                      onClick={() => setBuyQuantity(buyQuantity + 1)}
                      className="w-10 h-10 rounded-lg bg-bg-elevated border border-border flex items-center justify-center text-text-primary hover:border-primary"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Cost Summary */}
                <div className="p-4 rounded-xl bg-bg-elevated">
                  <div className="flex justify-between mb-2">
                    <span className="text-text-muted">Total Cost</span>
                    <span className="text-text-primary font-bold text-lg">
                      ₹{(selectedETF.price * buyQuantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Available Balance</span>
                    <span className={`font-medium ${
                      portfolio.virtualBalance >= selectedETF.price * buyQuantity ? "text-success" : "text-danger"
                    }`}>
                      ₹{portfolio.virtualBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {portfolio.virtualBalance < selectedETF.price * buyQuantity && (
                    <p className="text-danger text-sm mt-2">Insufficient balance</p>
                  )}
                </div>

                {/* Parent Funding Note */}
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <p className="text-warning text-sm">
                    💡 This is virtual money for learning. In the future, parents can add real funds through the Parent Portal.
                  </p>
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => {
                    const result = buyETF(selectedETF, buyQuantity);
                    if (result.success) {
                      setBuySuccess({
                        quantity: buyQuantity,
                        total: selectedETF.price * buyQuantity,
                      });
                    } else {
                      alert(result.error);
                    }
                  }}
                  disabled={portfolio.virtualBalance < selectedETF.price * buyQuantity}
                  className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Purchase
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
