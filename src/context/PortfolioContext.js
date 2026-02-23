"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Initial virtual wallet state
const INITIAL_VIRTUAL_BALANCE = 10000; // ₹10,000 virtual starting balance
const INITIAL_REAL_BALANCE = 0; // ₹0 real starting balance

const initialState = {
  // Account mode: "virtual" or "real"
  accountMode: "virtual",

  // Virtual account
  virtualBalance: INITIAL_VIRTUAL_BALANCE,
  virtualHoldings: [],
  virtualTransactions: [],

  // Real account
  realBalance: INITIAL_REAL_BALANCE,
  realHoldings: [],
  realTransactions: [],

  // Parent funding (for future parent portal integration)
  parentFunded: false,
  parentFundedAmount: 0,

  // Learning progress
  completedModules: 0,
  riskAssessmentPassed: false,
  parentApproved: false,
};

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("safestart_portfolio");
    const savedMode = localStorage.getItem("safestart_accountMode");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPortfolio((prev) => ({
          ...prev,
          ...parsed,
          accountMode: savedMode || parsed.accountMode || "virtual",
        }));
      } catch (e) {
        console.error("Failed to load portfolio:", e);
      }
    } else if (savedMode) {
      setPortfolio((prev) => ({ ...prev, accountMode: savedMode }));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("safestart_portfolio", JSON.stringify(portfolio));
    }
  }, [portfolio, isLoaded]);

  // Switch account mode
  const switchAccountMode = (mode) => {
    setPortfolio((prev) => ({ ...prev, accountMode: mode }));
    localStorage.setItem("safestart_accountMode", mode);
  };

  // Get active balance, holdings, transactions based on current mode
  const getActiveBalance = () =>
    portfolio.accountMode === "real"
      ? portfolio.realBalance
      : portfolio.virtualBalance;

  const getActiveHoldings = () =>
    portfolio.accountMode === "real"
      ? portfolio.realHoldings
      : portfolio.virtualHoldings;

  const getActiveTransactions = () =>
    portfolio.accountMode === "real"
      ? portfolio.realTransactions
      : portfolio.virtualTransactions;

  const getInitialBalance = () =>
    portfolio.accountMode === "real"
      ? INITIAL_REAL_BALANCE
      : INITIAL_VIRTUAL_BALANCE;

  // Calculate holdings value (needs current ETF prices)
  const calculateHoldingsValue = (etfPrices) => {
    const holdings = getActiveHoldings();
    return holdings.reduce((total, holding) => {
      const price = etfPrices[holding.symbol] || holding.avgPrice;
      return total + price * holding.quantity;
    }, 0);
  };

  // Buy ETF (works on the active account mode)
  const buyETF = (etf, quantity) => {
    const cost = etf.price * quantity;
    const balKey =
      portfolio.accountMode === "real" ? "realBalance" : "virtualBalance";
    const holdKey =
      portfolio.accountMode === "real" ? "realHoldings" : "virtualHoldings";
    const txKey =
      portfolio.accountMode === "real"
        ? "realTransactions"
        : "virtualTransactions";

    if (cost > portfolio[balKey]) {
      return { success: false, error: "Insufficient balance" };
    }

    const holdings = portfolio[holdKey];
    const existingHolding = holdings.find((h) => h.symbol === etf.symbol);

    let newHoldings;
    if (existingHolding) {
      const totalQuantity = existingHolding.quantity + quantity;
      const totalCost =
        existingHolding.avgPrice * existingHolding.quantity +
        etf.price * quantity;
      const newAvgPrice = totalCost / totalQuantity;

      newHoldings = holdings.map((h) =>
        h.symbol === etf.symbol
          ? { ...h, quantity: totalQuantity, avgPrice: newAvgPrice }
          : h
      );
    } else {
      newHoldings = [
        ...holdings,
        {
          id: etf.id,
          symbol: etf.symbol,
          name: etf.name,
          sector: etf.sector,
          risk: etf.risk,
          quantity,
          avgPrice: etf.price,
          purchaseDate: new Date().toISOString(),
        },
      ];
    }

    const newTransaction = {
      id: Date.now(),
      type: "BUY",
      symbol: etf.symbol,
      name: etf.name,
      quantity,
      price: etf.price,
      total: cost,
      timestamp: new Date().toISOString(),
    };

    setPortfolio((prev) => ({
      ...prev,
      [balKey]: prev[balKey] - cost,
      [holdKey]: newHoldings,
      [txKey]: [newTransaction, ...prev[txKey]],
    }));

    return { success: true, transaction: newTransaction };
  };

  // Sell ETF
  const sellETF = (symbol, quantity, currentPrice) => {
    const holdKey =
      portfolio.accountMode === "real" ? "realHoldings" : "virtualHoldings";
    const balKey =
      portfolio.accountMode === "real" ? "realBalance" : "virtualBalance";
    const txKey =
      portfolio.accountMode === "real"
        ? "realTransactions"
        : "virtualTransactions";

    const holdings = portfolio[holdKey];
    const holding = holdings.find((h) => h.symbol === symbol);

    if (!holding) {
      return { success: false, error: "Holding not found" };
    }

    if (quantity > holding.quantity) {
      return { success: false, error: "Insufficient quantity" };
    }

    const saleValue = currentPrice * quantity;
    const costBasis = holding.avgPrice * quantity;
    const pnl = saleValue - costBasis;

    let newHoldings;
    if (quantity === holding.quantity) {
      newHoldings = holdings.filter((h) => h.symbol !== symbol);
    } else {
      newHoldings = holdings.map((h) =>
        h.symbol === symbol ? { ...h, quantity: h.quantity - quantity } : h
      );
    }

    const newTransaction = {
      id: Date.now(),
      type: "SELL",
      symbol,
      name: holding.name,
      quantity,
      price: currentPrice,
      total: saleValue,
      pnl,
      timestamp: new Date().toISOString(),
    };

    setPortfolio((prev) => ({
      ...prev,
      [balKey]: prev[balKey] + saleValue,
      [holdKey]: newHoldings,
      [txKey]: [newTransaction, ...prev[txKey]],
    }));

    return { success: true, transaction: newTransaction, pnl };
  };

  // Add funds to real account
  const addRealFunds = (amount) => {
    setPortfolio((prev) => ({
      ...prev,
      realBalance: prev.realBalance + amount,
      realTransactions: [
        {
          id: Date.now(),
          type: "FUND",
          source: "Deposit",
          amount,
          timestamp: new Date().toISOString(),
        },
        ...prev.realTransactions,
      ],
    }));
  };

  // Add parent funding
  const addParentFunding = (amount) => {
    const balKey =
      portfolio.accountMode === "real" ? "realBalance" : "virtualBalance";
    const txKey =
      portfolio.accountMode === "real"
        ? "realTransactions"
        : "virtualTransactions";

    setPortfolio((prev) => ({
      ...prev,
      [balKey]: prev[balKey] + amount,
      parentFunded: true,
      parentFundedAmount: prev.parentFundedAmount + amount,
      [txKey]: [
        {
          id: Date.now(),
          type: "FUND",
          source: "Parent",
          amount,
          timestamp: new Date().toISOString(),
        },
        ...prev[txKey],
      ],
    }));
  };

  // Update learning progress
  const updateProgress = (updates) => {
    setPortfolio((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Reset portfolio (for testing/demo)
  const resetPortfolio = () => {
    setPortfolio(initialState);
    localStorage.removeItem("safestart_portfolio");
  };

  // Calculate portfolio risk score (uses active holdings)
  const calculateRiskScore = () => {
    const holdings = getActiveHoldings();
    if (holdings.length === 0) return "Not Invested";

    const riskWeights = { Low: 1, Medium: 2, High: 3 };
    let totalRisk = 0;
    let totalQuantity = 0;

    holdings.forEach((holding) => {
      totalRisk += (riskWeights[holding.risk] || 2) * holding.quantity;
      totalQuantity += holding.quantity;
    });

    const avgRisk = totalQuantity > 0 ? totalRisk / totalQuantity : 0;
    if (avgRisk <= 1.5) return "Low";
    if (avgRisk <= 2.5) return "Medium";
    return "High";
  };

  const value = {
    portfolio,
    isLoaded,
    // Account mode
    switchAccountMode,
    getActiveBalance,
    getActiveHoldings,
    getActiveTransactions,
    getInitialBalance,
    // Actions
    buyETF,
    sellETF,
    addRealFunds,
    addParentFunding,
    updateProgress,
    resetPortfolio,
    calculateHoldingsValue,
    calculateRiskScore,
    INITIAL_BALANCE: getInitialBalance(),
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
