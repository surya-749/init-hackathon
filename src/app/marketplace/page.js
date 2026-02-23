"use client";

import { useState } from "react";
import Link from "next/link";

// Extended ETF Data
const allETFs = [
  {
    id: 1,
    name: "Nifty 50 ETF",
    symbol: "NIFTYBEES",
    price: 245.50,
    change: 2.35,
    changePercent: 0.97,
    sector: "Index",
    risk: "Low",
    description: "Tracks the Nifty 50 index, representing top 50 companies by market cap.",
    aum: "₹15,420 Cr",
    expenseRatio: "0.05%",
    weekHigh52: 268.90,
    weekLow52: 198.20,
    returns: { "1M": 2.4, "3M": 5.8, "1Y": 12.5, "3Y": 42.3 },
  },
  {
    id: 2,
    name: "Bank ETF",
    symbol: "BANKBEES",
    price: 485.20,
    change: -5.80,
    changePercent: -1.18,
    sector: "Banking",
    risk: "Medium",
    description: "Tracks the Nifty Bank index, covering major banking stocks.",
    aum: "₹8,230 Cr",
    expenseRatio: "0.20%",
    weekHigh52: 520.00,
    weekLow52: 380.50,
    returns: { "1M": -1.2, "3M": 3.2, "1Y": 8.9, "3Y": 35.6 },
  },
  {
    id: 3,
    name: "IT ETF",
    symbol: "ITBEES",
    price: 38.75,
    change: 1.25,
    changePercent: 3.34,
    sector: "Technology",
    risk: "Medium",
    description: "Tracks the Nifty IT index, covering major IT companies.",
    aum: "₹2,840 Cr",
    expenseRatio: "0.15%",
    weekHigh52: 45.80,
    weekLow52: 28.90,
    returns: { "1M": 5.8, "3M": 12.4, "1Y": 22.1, "3Y": 68.4 },
  },
  {
    id: 4,
    name: "Gold ETF",
    symbol: "GOLDBEES",
    price: 58.90,
    change: 0.45,
    changePercent: 0.77,
    sector: "Commodity",
    risk: "Low",
    description: "Tracks domestic gold prices, ideal for portfolio diversification.",
    aum: "₹6,120 Cr",
    expenseRatio: "0.50%",
    weekHigh52: 62.50,
    weekLow52: 48.20,
    returns: { "1M": 1.2, "3M": 4.5, "1Y": 15.8, "3Y": 38.2 },
  },
  {
    id: 5,
    name: "Junior Nifty ETF",
    symbol: "JUNIORBEES",
    price: 625.40,
    change: 8.20,
    changePercent: 1.33,
    sector: "Index",
    risk: "Medium",
    description: "Tracks the Nifty Next 50 index, representing emerging large caps.",
    aum: "₹3,560 Cr",
    expenseRatio: "0.12%",
    weekHigh52: 680.00,
    weekLow52: 520.30,
    returns: { "1M": 3.2, "3M": 8.9, "1Y": 18.4, "3Y": 52.1 },
  },
  {
    id: 6,
    name: "Pharma ETF",
    symbol: "PHARMABEES",
    price: 18.45,
    change: -0.32,
    changePercent: -1.71,
    sector: "Healthcare",
    risk: "Medium",
    description: "Tracks the Nifty Pharma index, covering pharmaceutical companies.",
    aum: "₹1,280 Cr",
    expenseRatio: "0.18%",
    weekHigh52: 22.80,
    weekLow52: 15.60,
    returns: { "1M": -2.1, "3M": 1.8, "1Y": 5.2, "3Y": 28.9 },
  },
  {
    id: 7,
    name: "Liquid ETF",
    symbol: "LIQUIDBEES",
    price: 1000.05,
    change: 0.02,
    changePercent: 0.002,
    sector: "Debt",
    risk: "Low",
    description: "Invests in overnight securities, ideal for parking surplus funds.",
    aum: "₹12,450 Cr",
    expenseRatio: "0.08%",
    weekHigh52: 1000.10,
    weekLow52: 999.80,
    returns: { "1M": 0.5, "3M": 1.6, "1Y": 6.5, "3Y": 18.2 },
  },
  {
    id: 8,
    name: "Infrastructure ETF",
    symbol: "INFRABEES",
    price: 542.80,
    change: 12.45,
    changePercent: 2.35,
    sector: "Infrastructure",
    risk: "High",
    description: "Tracks the Nifty Infrastructure index, covering infra companies.",
    aum: "₹890 Cr",
    expenseRatio: "0.25%",
    weekHigh52: 580.00,
    weekLow52: 420.50,
    returns: { "1M": 4.8, "3M": 15.2, "1Y": 32.5, "3Y": 85.4 },
  },
];

const sectors = ["All", "Index", "Banking", "Technology", "Commodity", "Healthcare", "Debt", "Infrastructure"];
const riskLevels = ["All", "Low", "Medium", "High"];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [selectedETF, setSelectedETF] = useState(null);

  // Filter and sort ETFs
  const filteredETFs = allETFs
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
          return b.returns["1Y"] - a.returns["1Y"];
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Market summary
  const gainers = allETFs.filter((e) => e.change > 0).length;
  const losers = allETFs.filter((e) => e.change < 0).length;
  const avgChange = (allETFs.reduce((sum, e) => sum + e.changePercent, 0) / allETFs.length).toFixed(2);

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
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-text-muted hover:text-text-primary transition-colors text-sm">
              Dashboard
            </Link>
            <Link href="/marketplace" className="text-primary font-medium text-sm">
              Market
            </Link>
            <Link href="/learn" className="text-text-muted hover:text-text-primary transition-colors text-sm">
              Learn
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Page Title & Market Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">ETF Marketplace</h1>
            <p className="text-text-secondary text-sm mt-1">
              Explore curated ETF baskets for your simulation portfolio
            </p>
          </div>
          <div className="flex items-center gap-4">
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
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
            <option value="returns">Sort by 1Y Returns</option>
          </select>
        </div>

        {/* ETF Grid */}
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
                  <p className="text-2xl font-bold text-text-primary">₹{etf.price.toFixed(2)}</p>
                  <p className={`text-sm ${etf.change >= 0 ? "text-success" : "text-danger"}`}>
                    {etf.change >= 0 ? "+" : ""}{etf.change.toFixed(2)} ({etf.changePercent.toFixed(2)}%)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-text-muted text-xs">1Y Return</p>
                  <p className={`font-medium ${etf.returns["1Y"] >= 0 ? "text-success" : "text-danger"}`}>
                    {etf.returns["1Y"] >= 0 ? "+" : ""}{etf.returns["1Y"]}%
                  </p>
                </div>
              </div>

              {/* Mini Chart Placeholder */}
              <div className="h-12 bg-bg-elevated rounded-lg flex items-center justify-center mb-4">
                <div className="flex items-end gap-1 h-8">
                  {[40, 55, 45, 60, 50, 70, 65, 75, 68, 72].map((h, i) => (
                    <div
                      key={i}
                      className={`w-2 rounded-sm ${etf.change >= 0 ? "bg-success/50" : "bg-danger/50"}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Sector & AUM */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">{etf.sector}</span>
                <span className="text-text-muted">AUM: {etf.aum}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredETFs.length === 0 && (
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
                  <p className="text-3xl font-bold text-text-primary">₹{selectedETF.price.toFixed(2)}</p>
                  <p className={`text-sm mt-1 ${selectedETF.change >= 0 ? "text-success" : "text-danger"}`}>
                    {selectedETF.change >= 0 ? "+" : ""}{selectedETF.change.toFixed(2)} ({selectedETF.changePercent.toFixed(2)}%) today
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-text-muted text-xs">52W Range</p>
                  <p className="text-text-primary text-sm">
                    ₹{selectedETF.weekLow52} - ₹{selectedETF.weekHigh52}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-text-primary font-medium mb-2">About</h3>
              <p className="text-text-secondary text-sm">{selectedETF.description}</p>
            </div>

            {/* Returns Grid */}
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

            {/* Key Stats */}
            <div className="mb-6">
              <h3 className="text-text-primary font-medium mb-3">Key Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-bg-elevated">
                  <p className="text-text-muted text-xs">Assets Under Management</p>
                  <p className="text-text-primary font-medium">{selectedETF.aum}</p>
                </div>
                <div className="p-3 rounded-lg bg-bg-elevated">
                  <p className="text-text-muted text-xs">Expense Ratio</p>
                  <p className="text-text-primary font-medium">{selectedETF.expenseRatio}</p>
                </div>
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
              <Link
                href="/dashboard"
                className="flex-1 py-3 rounded-xl bg-primary text-white font-medium text-center hover:bg-primary-light transition-colors"
              >
                Buy in Simulation
              </Link>
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
    </div>
  );
}