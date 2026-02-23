"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Initial virtual wallet state
const INITIAL_BALANCE = 10000; // ₹10,000 virtual starting balance

const initialState = {
  // Wallet info
  virtualBalance: INITIAL_BALANCE,
  initialBalance: INITIAL_BALANCE,
  
  // Portfolio holdings
  holdings: [],
  
  // Transaction history
  transactions: [],
  
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
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPortfolio(parsed);
      } catch (e) {
        console.error("Failed to load portfolio:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("safestart_portfolio", JSON.stringify(portfolio));
    }
  }, [portfolio, isLoaded]);

  // Calculate holdings value (needs current ETF prices)
  const calculateHoldingsValue = (etfPrices) => {
    return portfolio.holdings.reduce((total, holding) => {
      const price = etfPrices[holding.symbol] || holding.avgPrice;
      return total + price * holding.quantity;
    }, 0);
  };

  // Buy ETF
  const buyETF = (etf, quantity) => {
    const cost = etf.price * quantity;
    
    if (cost > portfolio.virtualBalance) {
      return { success: false, error: "Insufficient balance" };
    }

    const existingHolding = portfolio.holdings.find(h => h.symbol === etf.symbol);
    
    let newHoldings;
    if (existingHolding) {
      // Average the price
      const totalQuantity = existingHolding.quantity + quantity;
      const totalCost = existingHolding.avgPrice * existingHolding.quantity + etf.price * quantity;
      const newAvgPrice = totalCost / totalQuantity;
      
      newHoldings = portfolio.holdings.map(h =>
        h.symbol === etf.symbol
          ? { ...h, quantity: totalQuantity, avgPrice: newAvgPrice }
          : h
      );
    } else {
      newHoldings = [
        ...portfolio.holdings,
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

    setPortfolio(prev => ({
      ...prev,
      virtualBalance: prev.virtualBalance - cost,
      holdings: newHoldings,
      transactions: [newTransaction, ...prev.transactions],
    }));

    return { success: true, transaction: newTransaction };
  };

  // Sell ETF
  const sellETF = (symbol, quantity, currentPrice) => {
    const holding = portfolio.holdings.find(h => h.symbol === symbol);
    
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
      // Sell all
      newHoldings = portfolio.holdings.filter(h => h.symbol !== symbol);
    } else {
      // Partial sell
      newHoldings = portfolio.holdings.map(h =>
        h.symbol === symbol
          ? { ...h, quantity: h.quantity - quantity }
          : h
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

    setPortfolio(prev => ({
      ...prev,
      virtualBalance: prev.virtualBalance + saleValue,
      holdings: newHoldings,
      transactions: [newTransaction, ...prev.transactions],
    }));

    return { success: true, transaction: newTransaction, pnl };
  };

  // Add parent funding (for future parent portal)
  const addParentFunding = (amount) => {
    setPortfolio(prev => ({
      ...prev,
      virtualBalance: prev.virtualBalance + amount,
      parentFunded: true,
      parentFundedAmount: prev.parentFundedAmount + amount,
      transactions: [
        {
          id: Date.now(),
          type: "FUND",
          source: "Parent",
          amount,
          timestamp: new Date().toISOString(),
        },
        ...prev.transactions,
      ],
    }));
  };

  // Update learning progress
  const updateProgress = (updates) => {
    setPortfolio(prev => ({
      ...prev,
      ...updates,
    }));
  };

  // Reset portfolio (for testing/demo)
  const resetPortfolio = () => {
    setPortfolio(initialState);
    localStorage.removeItem("safestart_portfolio");
  };

  // Calculate portfolio risk score
  const calculateRiskScore = () => {
    if (portfolio.holdings.length === 0) return "Not Invested";
    
    const riskWeights = { Low: 1, Medium: 2, High: 3 };
    let totalRisk = 0;
    let totalQuantity = 0;

    portfolio.holdings.forEach(holding => {
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
    buyETF,
    sellETF,
    addParentFunding,
    updateProgress,
    resetPortfolio,
    calculateHoldingsValue,
    calculateRiskScore,
    INITIAL_BALANCE,
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
