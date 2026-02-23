import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are SafeStart AI, a friendly and educational financial assistant for a teen investing simulation app called SafeStart Invest.

Your role:
- Help teens (ages 15-21) learn about investing in a simple, engaging way
- Explain financial concepts using analogies and examples they can relate to
- Analyze their virtual portfolio and give suggestions
- Encourage safe, long-term investing habits
- Use emojis sparingly to keep it friendly but professional

Important guidelines:
- Keep responses concise (max 200 words unless explaining a complex topic)
- Use bullet points and formatting for clarity
- Always emphasize this is a SIMULATION for learning
- Never give specific financial advice for real money
- Focus on Indian market context (NSE, Nifty, Indian ETFs)
- Encourage diversification and risk management
- Remind them to involve parents for real investments

You know about these ETFs available in the app:
- NIFTYBEES: Tracks Nifty 50, Low Risk, ~₹245
- BANKBEES: Banking sector, Medium Risk, ~₹485
- ITBEES: IT sector, Medium Risk, ~₹39
- GOLDBEES: Gold ETF, Low Risk, ~₹59
- JUNIORBEES: Nifty Next 50, Medium Risk, ~₹625
- PSUBNKBEES: PSU Banks, High Risk, ~₹78
- LIQUIDBEES: Liquid fund, Very Low Risk, ~₹1000
- INFRABEES: Infrastructure, High Risk, ~₹543

Be encouraging, educational, and make learning about money fun!`;

export async function POST(request) {
  try {
    const { message, portfolio, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      // Fallback to local responses if no API key
      return NextResponse.json({
        success: true,
        response: getFallbackResponse(message, portfolio),
        source: "fallback",
      });
    }

    // Build context about user's portfolio
    let portfolioContext = "";
    if (portfolio) {
      if (portfolio.holdings && portfolio.holdings.length > 0) {
        const holdingsList = portfolio.holdings
          .map((h) => `${h.name} (${h.symbol}): ${h.quantity} units at ₹${h.avgPrice}, ${h.risk} risk`)
          .join("; ");
        portfolioContext = `\n\nUser's current portfolio:\n- Virtual Balance: ₹${portfolio.virtualBalance?.toFixed(2)}\n- Holdings: ${holdingsList}`;
      } else {
        portfolioContext = `\n\nUser's portfolio is empty. They have ₹${portfolio.virtualBalance?.toFixed(2)} virtual balance to invest.`;
      }
    }

    // Build messages array
    const messages = [
      { role: "system", content: SYSTEM_PROMPT + portfolioContext },
    ];

    // Add conversation history (last 6 messages for context)
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-6);
      recentHistory.forEach((msg) => {
        messages.push({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.text,
        });
      });
    }

    // Add current message
    messages.push({ role: "user", content: message });

    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      return NextResponse.json({
        success: true,
        response: getFallbackResponse(message, portfolio),
        source: "fallback",
      });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json({
        success: true,
        response: getFallbackResponse(message, portfolio),
        source: "fallback",
      });
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      source: "groq",
      model: data.model,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process message" },
      { status: 500 }
    );
  }
}

// Fallback responses when API is not available
function getFallbackResponse(message, portfolio) {
  const lower = message.toLowerCase();

  if (lower.match(/^(hi|hello|hey|hii|help)/)) {
    return "Hi there! 👋 I'm SafeStart AI. I can help you learn about investing! Ask me about ETFs, risk management, or your portfolio. What would you like to know?";
  }

  if (lower.includes("etf")) {
    return "**ETF (Exchange-Traded Fund)** is like a basket of stocks! 📦\n\nInstead of buying one company, you buy a mix of many. Benefits:\n• Instant diversification\n• Lower fees\n• Easy to trade\n• Great for beginners!\n\nTry NIFTYBEES - it tracks India's top 50 companies!";
  }

  if (lower.includes("portfolio") || lower.includes("holding")) {
    if (!portfolio || portfolio.holdings?.length === 0) {
      return "Your portfolio is empty! 📭\n\nVisit the **Marketplace** to buy your first ETF. I recommend starting with **NIFTYBEES** (Low Risk) - it's perfect for beginners!";
    }
    return `You have ${portfolio.holdings.length} holding(s) and ₹${portfolio.virtualBalance?.toFixed(2)} balance. Visit the Dashboard to see details and manage your investments!`;
  }

  if (lower.includes("risk")) {
    return "**Risk Levels Explained:**\n\n🟢 **Low Risk:** Stable, slow growth (NIFTYBEES, GOLDBEES)\n🟡 **Medium Risk:** Moderate swings (ITBEES, BANKBEES)\n🔴 **High Risk:** Big ups and downs (INFRABEES, PSUBNKBEES)\n\n**Tip:** Mix different risk levels for a balanced portfolio!";
  }

  if (lower.includes("buy") || lower.includes("recommend") || lower.includes("suggest")) {
    return "**Beginner Recommendations:**\n\n🥇 **NIFTYBEES** - Nifty 50 Index, Low Risk\n🥈 **GOLDBEES** - Gold ETF, Low Risk\n🥉 **ITBEES** - IT Sector, Medium Risk\n\nStart small, learn as you go! Visit the Marketplace to explore.";
  }

  if (lower.includes("sip")) {
    return "**SIP (Systematic Investment Plan)** = Invest fixed amount regularly! 📈\n\nBenefits:\n• Buy more when prices drop\n• Removes emotional decisions\n• Builds discipline\n• Small amounts grow big!\n\n**Example:** ₹500/month for 10 years at 12% = ₹1.16 lakh!";
  }

  return "I can help you with:\n• Understanding ETFs and stocks\n• Analyzing your portfolio\n• Learning about risk\n• Investment suggestions\n• SIP and compound interest\n\nTry asking \"What is an ETF?\" or \"Analyze my portfolio\"!";
}
