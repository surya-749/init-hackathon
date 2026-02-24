import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// Fetch current market prices from the market API
async function fetchCurrentPrices() {
  const ETF_SYMBOLS = [
    { id: 1, symbol: "NIFTYBEES.NS", shortSymbol: "NIFTYBEES" },
    { id: 2, symbol: "BANKBEES.NS", shortSymbol: "BANKBEES" },
    { id: 3, symbol: "ITBEES.NS", shortSymbol: "ITBEES" },
    { id: 4, symbol: "GOLDBEES.NS", shortSymbol: "GOLDBEES" },
    { id: 5, symbol: "JUNIORBEES.NS", shortSymbol: "JUNIORBEES" },
    { id: 6, symbol: "PSUBNKBEES.NS", shortSymbol: "PSUBNKBEES" },
    { id: 7, symbol: "LIQUIDBEES.NS", shortSymbol: "LIQUIDBEES" },
    { id: 8, symbol: "INFRABEES.NS", shortSymbol: "INFRABEES" },
  ];

  const priceMap = {};
  
  try {
    const etfPromises = ETF_SYMBOLS.map(async (etf) => {
      try {
        const response = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${etf.symbol}?interval=1d&range=1d`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            next: { revalidate: 60 }, // Cache for 60 seconds
          }
        );

        if (response.ok) {
          const data = await response.json();
          const result = data.chart.result[0];
          const currentPrice = result.meta.regularMarketPrice;
          
          if (currentPrice) {
            priceMap[etf.shortSymbol] = currentPrice;
          }
        }
      } catch (error) {
        console.error(`Failed to fetch price for ${etf.symbol}:`, error);
      }
    });

    await Promise.all(etfPromises);
  } catch (error) {
    console.error("Failed to fetch market prices:", error);
  }

  return priceMap;
}

export async function GET() {
  try {
    await connectDB();

    // Fetch current market prices
    const currentPrices = await fetchCurrentPrices();

    const users = await User.find({}).select("name virtualBalance holdings initialBalance transactions").lean();

    const leaderboard = users
      .map(user => {
        // Calculate holdings value using current market prices
        const holdingsValue = (user.holdings || []).reduce((acc, holding) => {
          // Use current market price if available, fall back to average price
          const currentPrice = currentPrices[holding.symbol] || holding.avgPrice;
          return acc + (currentPrice * holding.quantity);
        }, 0);
        
        const virtualBalance = user.virtualBalance || 0;
        const initialBalance = user.initialBalance || 10000; // Default to 10000 if not set
        const hasTransactions = (user.transactions || []).length > 0;
        const hasHoldings = (user.holdings || []).length > 0;

        const totalValue = virtualBalance + holdingsValue;
        
        // Handle edge case: users who haven't started trading
        let pnl, pnlPercent;
        if (totalValue === 0 && !hasHoldings && !hasTransactions) {
          // User hasn't started trading yet - show as 0% instead of -100%
          pnl = 0;
          pnlPercent = 0;
        } else {
          // Normal P&L calculation for active traders
          pnl = totalValue - initialBalance;
          pnlPercent = initialBalance > 0 ? (pnl / initialBalance) * 100 : 0;
        }

        return {
          id: user._id,
          name: user.name,
          totalValue,
          pnl,
          pnlPercent,
          isActive: hasTransactions || hasHoldings, // Track if user has actually traded
        };
      })
      .filter(user => user.isActive || user.totalValue > 0); // Only show users who have traded or have money

    // Sort by highest PnL percentage
    leaderboard.sort((a, b) => b.pnlPercent - a.pnlPercent);

    return NextResponse.json({ success: true, leaderboard });

  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch leaderboard data" },
      { status: 500 }
    );
  }
}
