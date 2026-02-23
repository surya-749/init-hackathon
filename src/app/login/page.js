"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Post-login: account selection step
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [step, setStep] = useState("auth"); // "auth" | "select-account"

  const getUsers = () => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("safestart_users")) || [];
  };

  const saveUsers = (users) => {
    localStorage.setItem("safestart_users", JSON.stringify(users));
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setPassword("");
    setConfirmPassword("");
  };

  const selectAccount = (mode) => {
    localStorage.setItem("safestart_accountMode", mode);
    router.push("/dashboard-sim");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getUsers();

    if (isLogin) {
      const user = users.find(
        (u) => u.email === email.trim() && u.password === password.trim()
      );
      if (user) {
        localStorage.setItem("safestart_currentUser", JSON.stringify(user));
        setLoggedInUser(user);
        setStep("select-account");
      } else {
        setError("Invalid email or password!");
      }
    } else {
      if (!name.trim()) {
        setError("Please enter your name!");
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters!");
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match!");
        setIsLoading(false);
        return;
      }
      const userExists = users.some((u) => u.email === email.trim());
      if (userExists) {
        setError("User already exists!");
      } else {
        const newUser = {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          virtualBalance: 10000,
          realBalance: 0,
        };
        users.push(newUser);
        saveUsers(users);
        setIsLogin(true);
        setPassword("");
        setConfirmPassword("");
        setName("");
        setError("");
      }
    }

    setIsLoading(false);
  };

  // ─── Account Selection Screen ───
  if (step === "select-account") {
    return (
      <div className="min-h-screen flex flex-col bg-bg-app">
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          <Link href="/" className="text-xl font-bold text-text-primary tracking-tight">
            SafeStart
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-text-primary">
                Welcome, {loggedInUser?.name || "Investor"}!
              </h1>
              <p className="text-text-muted text-sm mt-2">
                Choose which account you&apos;d like to use
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Virtual Account */}
              <button
                onClick={() => selectAccount("virtual")}
                className="group rounded-2xl bg-bg-card border border-border p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-text-primary mb-1">
                  Virtual Account
                </h2>
                <p className="text-text-secondary text-sm mb-3">
                  Practice with virtual money. No risk, pure learning.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-lg">₹10,000</span>
                  <span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                    Virtual
                  </span>
                </div>
                <div className="mt-4 flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                  <span>Enter Simulation</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Real Account */}
              <button
                onClick={() => selectAccount("real")}
                className="group rounded-2xl bg-bg-card border border-border p-6 text-left transition-all hover:border-warning hover:shadow-lg hover:shadow-warning/10"
              >
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4 group-hover:bg-warning/20 transition-colors">
                  <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-text-primary mb-1">
                  Real Account
                </h2>
                <p className="text-text-secondary text-sm mb-3">
                  Invest real money with micro-SIPs starting at ₹10.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-warning font-bold text-lg">₹0.00</span>
                  <span className="px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                    Real
                  </span>
                </div>
                <div className="mt-4 flex items-center text-warning font-medium text-sm group-hover:gap-2 transition-all">
                  <span>Go to Real Investing</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>

            <p className="text-center text-text-muted text-xs mt-6">
              You can switch between accounts anytime from the dashboard.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ─── Auth Form (Login / Sign Up) ───
  return (
    <div className="min-h-screen flex flex-col bg-bg-app">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Link href="/" className="text-xl font-bold text-text-primary tracking-tight">
          SafeStart
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl bg-bg-card border border-border p-8">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-text-primary">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-text-muted text-sm mt-2">
                {isLogin
                  ? "Sign in to continue your investing journey"
                  : "Start your safe investing journey today"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name (Sign Up only) */}
              {!isLogin && (
                <div>
                  <label className="block text-text-secondary text-sm mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-border text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-text-secondary text-sm mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-border text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-text-secondary text-sm mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={isLogin ? "Enter password" : "Create a password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-border text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-text-muted text-xs mt-1">
                    Must be at least 6 characters
                  </p>
                )}
              </div>

              {/* Confirm Password (Sign Up only) */}
              {!isLogin && (
                <div>
                  <label className="block text-text-secondary text-sm mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-bg-elevated border border-border text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-danger/10 border border-danger/20">
                  <svg
                    className="w-5 h-5 text-danger flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-danger text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </span>
                  </>
                ) : (
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <p className="text-center text-text-muted text-sm mt-6">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Privacy Note */}
          <p className="text-center text-text-muted text-xs mt-6">
            By continuing, you agree to SafeStart&apos;s{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
