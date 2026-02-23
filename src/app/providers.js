"use client";

import { PortfolioProvider } from "@/context/PortfolioContext";
import ChatBot from "@/components/ChatBot";

export function Providers({ children }) {
  return (
    <PortfolioProvider>
      {children}
      <ChatBot />
    </PortfolioProvider>
  );
}
