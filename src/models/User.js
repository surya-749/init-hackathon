import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    virtualBalance: {
      type: Number,
      default: 10000,
    },
    initialBalance: {
      type: Number,
      default: 10000,
    },
    holdings: {
      type: Array,
      default: [],
    },
    transactions: {
      type: Array,
      default: [],
    },
    parentFunded: {
      type: Boolean,
      default: false,
    },
    parentFundedAmount: {
      type: Number,
      default: 0,
    },
    completedModules: {
      type: Number,
      default: 0,
    },
    riskAssessmentPassed: {
      type: Boolean,
      default: false,
    },
    parentApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
