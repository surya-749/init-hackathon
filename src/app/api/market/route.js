// Real-time market data API using Yahoo Finance
const ETF_SYMBOLS = [
  { id: 1, symbol: "NIFTYBEES.NS", name: "Nifty 50 ETF", shortSymbol: "NIFTYBEES", sector: "Index", risk: "Low" },
  { id: 2, symbol: "BANKBEES.NS", name: "Bank ETF", shortSymbol: "BANKBEES", sector: "Banking", risk: "Medium" },
  { id: 3, symbol: "ITBEES.NS", name: "IT ETF", shortSymbol: "ITBEES", sector: "Technology", risk: "Medium" },
  { id: 4, symbol: "GOLDBEES.NS", name: "Gold ETF", shortSymbol: "GOLDBEES", sector: "Commodity", risk: "Low" },
  { id: 5, symbol: "JUNIORBEES.NS", name: "Junior Nifty ETF", shortSymbol: "JUNIORBEES", sector: "Index", risk: "Medium" },
  { id: 6, symbol: "PSUBNKBEES.NS", name: "PSU Bank ETF", shortSymbol: "PSUBNKBEES", sector: "Banking", risk: "High" },
  { id: 7, symbol: "LIQUIDBEES.NS", name: "Liquid ETF", shortSymbol: "LIQUIDBEES", sector: "Debt", risk: "Low" },
  { id: 8, symbol: "INFRABEES.NS", name: "Infrastructure ETF", shortSymbol: "INFRABEES", sector: "Infrastructure", risk: "High" },
];

async function fetchYahooFinanceData(symbol) {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${symbol}`);
    }

    const data = await response.json();
    const result = data.chart.result[0];
    const meta = result.meta;
    const quote = result.indicators.quote[0];

    // Get current price and previous close
    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.previousClose || meta.chartPreviousClose;
    const change = currentPrice - previousClose;
    const changePercent = ((change / previousClose) * 100);

    // Get historical data for returns calculation
    const closes = quote.close.filter((c) => c !== null);
    const highs = quote.high.filter((h) => h !== null);
    const lows = quote.low.filter((l) => l !== null);

    // Calculate 1-month return
    const oneMonthReturn = closes.length > 0
      ? ((currentPrice - closes[0]) / closes[0] * 100)
      : 0;

    return {
      price: currentPrice,
      change: change,
      changePercent: changePercent,
      previousClose: previousClose,
      dayHigh: meta.regularMarketDayHigh,
      dayLow: meta.regularMarketDayLow,
      weekHigh52: meta.fiftyTwoWeekHigh,
      weekLow52: meta.fiftyTwoWeekLow,
      volume: meta.regularMarketVolume,
      marketCap: meta.marketCap,
      oneMonthReturn: oneMonthReturn,
      historicalData: closes.slice(-10), // Last 10 days for mini chart
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    const etfPromises = ETF_SYMBOLS.map(async (etf) => {
      const marketData = await fetchYahooFinanceData(etf.symbol);

      if (marketData) {
        return {
          id: etf.id,
          name: etf.name,
          symbol: etf.shortSymbol,
          sector: etf.sector,
          risk: etf.risk,
          price: marketData.price,
          change: marketData.change,
          changePercent: marketData.changePercent,
          previousClose: marketData.previousClose,
          dayHigh: marketData.dayHigh,
          dayLow: marketData.dayLow,
          weekHigh52: marketData.weekHigh52,
          weekLow52: marketData.weekLow52,
          volume: marketData.volume,
          historicalData: marketData.historicalData,
          returns: {
            "1M": parseFloat(marketData.oneMonthReturn.toFixed(2)),
          },
          isLive: true,
        };
      }

      // Return fallback data if API fails
      return {
        id: etf.id,
        name: etf.name,
        symbol: etf.shortSymbol,
        sector: etf.sector,
        risk: etf.risk,
        price: 0,
        change: 0,
        changePercent: 0,
        isLive: false,
      };
    });

    const etfData = await Promise.all(etfPromises);
    const liveData = etfData.filter((e) => e.isLive);

    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: liveData.length > 0 ? liveData : etfData,
      liveCount: liveData.length,
      totalCount: ETF_SYMBOLS.length,
    });
  } catch (error) {
    console.error("Market API error:", error);
    return Response.json(
      { success: false, error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
