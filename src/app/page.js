"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard-sim" },
    { name: "Learn", href: "/learn" },
    { name: "Marketplace", href: "/marketplace" },
  ];

  return (
    <div className="min-h-screen bg-bg-app flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-bg-app/80 backdrop-blur-lg border-b border-border">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-text-primary font-semibold text-xl">SafeStart</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-lg text-text-secondary text-sm font-medium hover:text-text-primary hover:bg-bg-elevated transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2 rounded-xl text-text-secondary text-sm font-medium hover:text-text-primary border border-border hover:border-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-bg-card px-6 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-text-secondary text-sm font-medium hover:text-text-primary hover:bg-bg-elevated transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-border space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl text-text-secondary text-sm font-medium border border-border hover:border-primary hover:text-text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-light transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      <div className="h-4" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-md">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Learn Before You Earn
          </h1>
          <p className="text-text-secondary text-lg">
            A flight simulator for investing — master risk before money, build discipline before profit.
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="w-full max-w-2xl grid md:grid-cols-2 gap-6">
          {/* Simulation Mode Card */}
          <button
            onClick={() => router.push("/simulation")}
            className="group relative rounded-2xl bg-bg-card border border-border p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Content */}
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Simulation Mode
            </h2>
            <p className="text-text-secondary text-sm mb-4">
              Practice with ₹10,000 virtual money. Learn market dynamics risk-free before investing real money.
            </p>

            {/* Features */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>₹10,000 virtual balance</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Real market scenarios</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No risk, pure learning</span>
              </div>
            </div>

            {/* Badge */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                Recommended
              </span>
            </div>

            {/* Arrow */}
            <div className="mt-6 flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
              <span>Start Learning</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Real Mode Card */}
          <button
            onClick={() => router.push("/real")}
            className="group relative rounded-2xl bg-bg-card border border-border p-6 text-left transition-all hover:border-warning hover:shadow-lg hover:shadow-warning/10"
          >
            {/* Lock Overlay */}
            <div className="absolute inset-0 rounded-2xl bg-bg-app/50 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-center">
                <svg className="w-8 h-8 text-warning mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-text-primary text-sm font-medium">Complete simulation first</p>
              </div>
            </div>

            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-warning/10 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Content */}
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Real Investing
            </h2>
            <p className="text-text-secondary text-sm mb-4">
              Start micro-SIPs from ₹10. Invest real money in curated ETF baskets with parental approval.
            </p>

            {/* Features */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <svg className="w-4 h-4 text-text-muted" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>₹10–₹50 SIPs</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <svg className="w-4 h-4 text-text-muted" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Parent-approved</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <svg className="w-4 h-4 text-text-muted" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Curated ETF baskets</span>
              </div>
            </div>

            {/* Badge */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                Locked
              </span>
            </div>

            {/* Arrow */}
            <div className="mt-6 flex items-center text-text-muted font-medium text-sm">
              <span>Unlock After Training</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-text-muted text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>100% Safe Learning</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Parent Controls</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Financial Education</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-text-muted text-sm">
        <p>Built for teens, trusted by parents</p>
      </footer>
    </div>
  );
}
