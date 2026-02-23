import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({}).select("name virtualBalance holdings initialBalance").lean();

    const leaderboard = users.map(user => {
      const holdingsValue = (user.holdings || []).reduce((acc, holding) => {
        return acc + (holding.avgPrice * holding.quantity);
      }, 0);
      
      const virtualBalance = user.virtualBalance || 0;
      const initialBalance = user.initialBalance || 0;

      const totalValue = virtualBalance + holdingsValue;
      const pnl = totalValue - initialBalance;
      const pnlPercent = initialBalance > 0 ? (pnl / initialBalance) * 100 : 0;

      return {
        id: user._id,
        name: user.name,
        totalValue,
        pnl,
        pnlPercent,
      };
    });

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
