"use client";

import { useState } from "react";
import Link from "next/link";

// Mock ETF Data
const etfBaskets = [
  {
    id: 1,
    name: "Nifty 50 ETF",
    symbol: "NIFTYBEES",
    price: 245.50,
    change: 2.35,
    changePercent: 0.97,
    sector: "Index",
    risk: "Low",
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
  },
];

// Mock Portfolio Data
const initialPortfolio = {
  cash: 10000,
  holdings: [],
  transactions: [],
};

export default function SimulationDashboard() {
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [selectedETF, setSelectedETF] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [aiExplanation, setAiExplanation] = useState(
    "Welcome to your simulation! Start by exploring ETF baskets below. We recommend beginning with diversified index funds like Nifty 50 ETF for lower risk."
  );

  // Calculate portfolio value
  const holdingsValue = portfolio.holdings.reduce((total, holding) => {
    const etf = etfBaskets.find((e) => e.id === holding.etfId);
    return total + (etf ? etf.price * holding.quantity : 0);
  }, 0);

  const totalValue = portfolio.cash + holdingsValue;
  const totalPnL = totalValue - 10000;
  const pnlPercent = ((totalPnL / 10000) * 100).toFixed(2);

  // Calculate risk score based on holdings
  const calculateRiskScore = () => {
    if (portfolio.holdings.length === 0) return "Not Invested";
    const riskWeights = { Low: 1, Medium: 2, High: 3 };
    let totalRisk = 0;
    let totalInvestment = 0;

    portfolio.holdings.forEach((holding) => {
      const etf = etfBaskets.find((e) => e.id === holding.etfId);
      if (etf) {
        const value = etf.price * holding.quantity;
        totalRisk += riskWeights[etf.risk] * value;
        totalInvestment += value;
      }
    });

    const avgRisk = totalInvestment > 0 ? totalRisk / totalInvestment : 0;
    if (avgRisk <= 1.5) return "Low";
    if (avgRisk <= 2.5) return "Medium";
    return "High";
  };

  const handleBuy = () => {
    if (!selectedETF) return;

    const cost = selectedETF.price * quantity;
    if (cost > portfolio.cash) {
      alert("Insufficient balance!");
      return;
    }

    const existingHolding = portfolio.holdings.find(
      (h) => h.etfId === selectedETF.id
    );

    let newHoldings;
    if (existingHolding) {
      newHoldings = portfolio.holdings.map((h) =>
        h.etfId === selectedETF.id
          ? { ...h, quantity: h.quantity + quantity, avgPrice: selectedETF.price }
          : h
      );
    } else {
      newHoldings = [
        ...portfolio.holdings,
        {
          etfId: selectedETF.id,
          quantity,
          avgPrice: selectedETF.price,
        },
      ];
    }

    const newTransaction = {
      type: "BUY",
      etf: selectedETF.symbol,
      quantity,
      price: selectedETF.price,
      total: cost,
      timestamp: new Date().toLocaleString(),
    };

    setPortfolio({
      cash: portfolio.cash - cost,
      holdings: newHoldings,
      transactions: [newTransaction, ...portfolio.transactions],
    });

    setAiExplanation(
      `Great choice! You bought ${quantity} units of ${selectedETF.name}. ${
        selectedETF.risk === "Low"
          ? "This is a conservative investment with lower volatility."
          : selectedETF.risk === "Medium"
          ? "This has moderate risk. Consider balancing with low-risk ETFs."
          : "This is a higher-risk investment. Ensure your portfolio is diversified."
      }`
    );

    setShowBuyModal(false);
    setQuantity(1);
    setSelectedETF(null);
  };

  const handleSell = (holding) => {
    const etf = etfBaskets.find((e) => e.id === holding.etfId);
    if (!etf) return;

    const saleValue = etf.price * holding.quantity;
    const pnl = (etf.price - holding.avgPrice) * holding.quantity;

    setPortfolio({
      cash: portfolio.cash + saleValue,
      holdings: portfolio.holdings.filter((h) => h.etfId !== holding.etfId),
      transactions: [
        {
          type: "SELL",
          etf: etf.symbol,
          quantity: holding.quantity,
          price: etf.price,
          total: saleValue,
          pnl,
          timestamp: new Date().toLocaleString(),
        },
        ...portfolio.transactions,
      ],
    });

    setAiExplanation(
      pnl >= 0
        ? `You sold ${etf.name} with a profit of ₹${pnl.toFixed(2)}! Remember, patience often leads to better returns.`
        : `You sold ${etf.name} at a loss of ₹${Math.abs(pnl).toFixed(2)}. This is part of learning. Market volatility is normal, and long-term holding often recovers losses.`
    );
  };

  const riskScore = calculateRiskScore();
  const riskColor =
    riskScore === "Low"
      ? "text-success"
      : riskScore === "Medium"
      ? "text-warning"
      : riskScore === "High"
      ? "text-danger"
      : "text-text-muted";

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
              Simulation Mode
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-text-muted text-xs">Virtual Balance</p>
              <p className="text-text-primary font-semibold">
                ₹{portfolio.cash.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* AI Explanation Banner */}
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
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
              ₹{totalValue.toFixed(2)}
            </p>
          </div>

          {/* P&L */}
          <div className="rounded-xl bg-bg-card border border-border p-4">
            <p className="text-text-muted text-xs mb-1">Total P&L</p>
            <p
              className={`text-2xl font-bold ${
                totalPnL >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {totalPnL >= 0 ? "+" : ""}₹{totalPnL.toFixed(2)}
            </p>
            <p
              className={`text-xs ${
                totalPnL >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {totalPnL >= 0 ? "+" : ""}
              {pnlPercent}%
            </p>
          </div>

          {/* Holdings */}
          <div className="rounded-xl bg-bg-card border border-border p-4">
            <p className="text-text-muted text-xs mb-1">Holdings Value</p>
            <p className="text-2xl font-bold text-text-primary">
              ₹{holdingsValue.toFixed(2)}
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
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                Your Holdings
              </h2>
              {portfolio.holdings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-bg-elevated mx-auto flex items-center justify-center mb-3">
                    <svg
                      className="w-8 h-8 text-text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <p className="text-text-muted">No holdings yet</p>
                  <p className="text-text-muted text-sm">
                    Start by buying ETFs below
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio.holdings.map((holding) => {
                    const etf = etfBaskets.find((e) => e.id === holding.etfId);
                    if (!etf) return null;
                    const currentValue = etf.price * holding.quantity;
                    const investedValue = holding.avgPrice * holding.quantity;
                    const pnl = currentValue - investedValue;
                    const pnlPercent = ((pnl / investedValue) * 100).toFixed(2);

                    return (
                      <div
                        key={holding.etfId}
                        className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-text-primary">
                              {etf.name}
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
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
                          <p className="text-text-muted text-sm">
                            {holding.quantity} units @ ₹{holding.avgPrice.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right mr-4">
                          <p className="font-medium text-text-primary">
                            ₹{currentValue.toFixed(2)}
                          </p>
                          <p
                            className={`text-sm ${
                              pnl >= 0 ? "text-success" : "text-danger"
                            }`}
                          >
                            {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)} ({pnlPercent}%)
                          </p>
                        </div>
                        <button
                          onClick={() => handleSell(holding)}
                          className="px-4 py-2 rounded-lg bg-danger/10 text-danger text-sm font-medium hover:bg-danger/20 transition-colors"
                        >
                          Sell
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ETF Marketplace */}
            <div className="rounded-xl bg-bg-card border border-border p-5">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                ETF Baskets
              </h2>
              <div className="space-y-3">
                {etfBaskets.map((etf) => (
                  <div
                    key={etf.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated hover:bg-bg-elevated/80 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-text-primary">{etf.name}</p>
                        <span className="text-text-muted text-xs">
                          {etf.symbol}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
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
                      <p className="text-text-muted text-sm">{etf.sector}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-medium text-text-primary">
                        ₹{etf.price.toFixed(2)}
                      </p>
                      <p
                        className={`text-sm ${
                          etf.change >= 0 ? "text-success" : "text-danger"
                        }`}
                      >
                        {etf.change >= 0 ? "+" : ""}
                        {etf.change.toFixed(2)} ({etf.changePercent.toFixed(2)}%)
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedETF(etf);
                        setShowBuyModal(true);
                      }}
                      className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors"
                    >
                      Buy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Transaction History */}
            <div className="rounded-xl bg-bg-card border border-border p-5">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                Recent Transactions
              </h2>
              {portfolio.transactions.length === 0 ? (
                <p className="text-text-muted text-sm text-center py-4">
                  No transactions yet
                </p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {portfolio.transactions.slice(0, 10).map((tx, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg bg-bg-elevated"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.type === "BUY"
                            ? "bg-success/10 text-success"
                            : "bg-danger/10 text-danger"
                        }`}
                      >
                        {tx.type === "BUY" ? (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">
                          {tx.type} {tx.etf}
                        </p>
                        <p className="text-xs text-text-muted">
                          {tx.quantity} × ₹{tx.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${
                            tx.type === "BUY" ? "text-danger" : "text-success"
                          }`}
                        >
                          {tx.type === "BUY" ? "-" : "+"}₹{tx.total.toFixed(2)}
                        </p>
                        <p className="text-xs text-text-muted">{tx.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Learning Progress */}
            <div className="rounded-xl bg-bg-card border border-border p-5">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                Unlock Real Mode
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-muted">Learning Modules</span>
                    <span className="text-text-primary">0/5</span>
                  </div>
                  <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-primary rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-muted">Risk Assessment</span>
                    <span className="text-warning">Pending</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-muted">Parent Approval</span>
                    <span className="text-warning">Pending</span>
                  </div>
                </div>
                <button className="w-full py-3 rounded-lg bg-bg-elevated text-text-muted text-sm font-medium cursor-not-allowed">
                  Complete Requirements to Unlock
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Buy Modal */}
      {showBuyModal && selectedETF && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card border border-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-primary">
                Buy {selectedETF.name}
              </h3>
              <button
                onClick={() => setShowBuyModal(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-bg-elevated">
                <div className="flex justify-between mb-2">
                  <span className="text-text-muted">Current Price</span>
                  <span className="text-text-primary font-medium">
                    ₹{selectedETF.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Risk Level</span>
                  <span
                    className={`${
                      selectedETF.risk === "Low"
                        ? "text-success"
                        : selectedETF.risk === "Medium"
                        ? "text-warning"
                        : "text-danger"
                    }`}
                  >
                    {selectedETF.risk}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-text-muted text-sm mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-full px-4 py-3 rounded-lg bg-bg-elevated border border-border text-text-primary focus:border-primary focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-lg bg-bg-elevated">
                <div className="flex justify-between mb-2">
                  <span className="text-text-muted">Total Cost</span>
                  <span className="text-text-primary font-bold text-lg">
                    ₹{(selectedETF.price * quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Available Balance</span>
                  <span
                    className={`${
                      portfolio.cash >= selectedETF.price * quantity
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    ₹{portfolio.cash.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleBuy}
                disabled={portfolio.cash < selectedETF.price * quantity}
                className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}