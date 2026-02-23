"use client";

import { PortfolioProvider } from "@/context/PortfolioContext";

export function Providers({ children }) {
  return (
    <PortfolioProvider>
      {children}
    </PortfolioProvider>
  );
}
