// src/app/leaderboard/UserLeaderboard.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    category: String,
    streak: Number,
    alerts: Number,
    trades: Number,
    avgGain: Number,
    xScore: Number,
    avatar: String,
  },
  { timestamps: true }
);

export default mongoose.models.UserLeaderboard || mongoose.model("UserLeaderboard", UserSchema);
