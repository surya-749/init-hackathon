"use client";

import { useState, useRef, useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";

// Suggestion chips based on context
const getSuggestions = (holdings, lastTopic) => {
  const suggestions = [];
  
  if (!holdings || holdings.length === 0) {
    suggestions.push("How do I start investing?", "What is an ETF?", "What is SIP?");
  } else {
    suggestions.push("Analyze my portfolio", "Am I diversified?", "How to reduce risk?");
  }
  
  if (lastTopic === "etf") {
    suggestions.push("Tell me about Nifty 50", "What is diversification?");
  } else if (lastTopic === "risk") {
    suggestions.push("Low risk options", "What are safe investments?");
  } else if (lastTopic === "portfolio") {
    suggestions.push("What should I buy next?", "Explain my risk level");
  }
  
  return suggestions.slice(0, 4);
};

// Detect topic from message for suggestions
const detectTopic = (message) => {
  const lower = message.toLowerCase();
  if (lower.includes("etf")) return "etf";
  if (lower.includes("risk")) return "risk";
  if (lower.includes("portfolio") || lower.includes("holding")) return "portfolio";
  if (lower.includes("sip")) return "sip";
  return "";
};

export default function ChatBot() {
  const { portfolio, isLoaded, getActiveHoldings, getActiveBalance } = usePortfolio();
  const activeHoldings = isLoaded ? getActiveHoldings() : [];
  const activeBalance = isLoaded ? getActiveBalance() : 0;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hi! 👋 I'm SafeStart AI, powered by Groq. Ask me anything about investing, your portfolio, or financial concepts!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastTopic, setLastTopic] = useState("");
  const messagesEndRef = useRef(null);

  const suggestions = getSuggestions(isLoaded ? activeHoldings : null, lastTopic);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setLastTopic(detectTopic(text));

    try {
      // Call Groq API via our backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          portfolio: isLoaded
            ? {
                holdings: activeHoldings,
                virtualBalance: activeBalance,
                accountMode: portfolio.accountMode,
              }
            : null,
          conversationHistory: messages.slice(-6), // Last 6 messages for context
        }),
      });

      const data = await response.json();

      if (data.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          text: data.response,
          timestamp: new Date(),
          source: data.source, // 'groq' or 'fallback'
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: "Sorry, I'm having trouble connecting. Please try again! 🔄",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Parse markdown-like formatting
  const formatMessage = (text) => {
    return text
      .split("\n")
      .map((line) => {
        // Bold
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>');
        // Italic
        line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Bullet points
        if (line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ")) {
          return `<div class="flex gap-2 ml-2"><span>•</span><span>${line.slice(2)}</span></div>`;
        }
        // Numbered lists
        const numberedMatch = line.match(/^(\d+[\.\)]\s*)/);
        if (numberedMatch) {
          return `<div class="flex gap-2 ml-2"><span>${numberedMatch[1]}</span><span>${line.slice(numberedMatch[1].length)}</span></div>`;
        }
        return line;
      })
      .join("<br/>");
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-bg-elevated rotate-0"
            : "bg-primary hover:bg-primary-light hover:scale-105"
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[70vh] rounded-2xl bg-bg-card border border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border bg-bg-elevated">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary">SafeStart AI</h3>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Online - Here to help
              </p>
            </div>
            <button
              onClick={() => setMessages([messages[0]])}
              className="p-2 rounded-lg hover:bg-bg-card transition-colors"
              title="Clear chat"
            >
              <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.type === "user"
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-bg-elevated text-text-secondary rounded-bl-md"
                  }`}
                >
                  <div
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                  />
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-bg-elevated rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="px-4 py-2 border-t border-border bg-bg-elevated/50">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(suggestion)}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border bg-bg-card">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about investing..."
                className="flex-1 px-4 py-3 rounded-xl bg-bg-elevated border border-border text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none text-sm"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="px-4 py-3 rounded-xl bg-primary text-white hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
