"use client"

import { useMemo, useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const BANK = [
  { q: 'What is micro-investing?', opts: ['Investing millions of dollars', 'Investing small amounts of money regularly', 'Gambling online', 'Buying only expensive stocks'], a: 1 },
  { q: 'Who usually supervises a teen investing account?', opts: ['Friend', 'Teacher', 'Parent/Guardian', 'Neighbor'], a: 2 },
  { q: 'What is a custodial account?', opts: ['A bank loan', 'An account managed by an adult for a minor', 'A savings jar', 'A credit card'], a: 1 },
  { q: 'Fractional shares allow you to:', opts: ['Buy part of a stock', 'Buy only whole companies', 'Avoid risk completely', 'Get free stocks'], a: 0 },
  { q: 'What is a stock?', opts: ['A type of savings account', 'Ownership in a company', 'A loan to a friend', 'A lottery ticket'], a: 1 },
  { q: 'What does “buy” mean in investing?', opts: ['Cancel investment', 'Purchase shares', 'Delete account', 'Borrow money'], a: 1 },
  { q: 'What does “sell” mean?', opts: ['Keep shares forever', 'Purchase more shares', 'Give away shares', 'Exchange shares for money'], a: 3 },
  { q: 'What is diversification?', opts: ['Investing in only one stock', 'Investing in different assets', 'Spending all money', 'Avoiding investing'], a: 1 },
  { q: 'What is a portfolio?', opts: ['Wallet', 'Collection of investments', 'Phone app', 'Bank building'], a: 1 },
  { q: 'What is an ETF?', opts: ['A single company', 'A fund holding many investments', 'A loan', 'A savings plan'], a: 1 },

  { q: 'What is profit?', opts: ['Loss', 'Gain from investment', 'Tax', 'Fee'], a: 1 },
  { q: 'What is loss?', opts: ['Gain', 'Money earned', 'Money lost on investment', 'Dividend'], a: 2 },
  { q: 'What is a dividend?', opts: ['Bonus payment from a company', 'App fee', 'Loan interest', 'Tax'], a: 0 },
  { q: 'Why is saving important before investing?', opts: ['To avoid risk', 'To build emergency fund', 'To stop spending', 'No reason'], a: 1 },
  { q: 'What is compound growth?', opts: ['Growth with reinvested earnings', 'Fixed money', 'Losing money', 'Tax payment'], a: 0 },
  { q: 'What does recurring investment mean?', opts: ['One-time buy', 'Automatic regular investing', 'Selling daily', 'Gambling'], a: 1 },
  { q: 'What is risk?', opts: ['Guarantee', 'Possibility of losing money', 'Free profit', 'Interest rate'], a: 1 },
  { q: 'What is a market price?', opts: ['Fixed forever', 'Current trading price', 'Tax value', 'Loan value'], a: 1 },
  { q: 'Why do teen platforms include education?', opts: ['For fun only', 'To teach investing basics', 'To charge fees', 'To avoid rules'], a: 1 },
  { q: 'What is financial literacy?', opts: ['Knowing math only', 'Understanding money management', 'Reading books', 'Gambling skills'], a: 1 },

  { q: 'What is account verification?', opts: ['Deleting account', 'Confirming identity', 'Selling stock', 'Borrowing money'], a: 1 },
  { q: 'What is a dashboard?', opts: ['Car feature', 'Investment summary screen', 'Bank branch', 'Tax report'], a: 1 },
  { q: 'What is automatic investing?', opts: ['Manual buying', 'Scheduled investing', 'No investing', 'Random buying'], a: 1 },
  { q: 'What is a transaction history?', opts: ['Stock list', 'Record of buys and sells', 'Password list', 'Account rules'], a: 1 },
  { q: 'What is long-term investing?', opts: ['1 day', 'Several years', '1 hour', '1 week'], a: 1 },
  { q: 'Why avoid “get rich quick” schemes?', opts: ['They are safe', 'They are risky and often scams', 'They guarantee profit', 'They are legal investments'], a: 1 },
  { q: 'What is interest?', opts: ['Fee', 'Money earned on savings', 'Loss', 'Tax'], a: 1 },
  { q: 'What is a balance?', opts: ['Amount in account', 'App name', 'Fee', 'Risk'], a: 0 },
  { q: 'Why is patience important?', opts: ['Markets move daily', 'Growth takes time', 'It prevents fees', 'It stops taxes'], a: 1 },
  { q: 'What is goal-based investing?', opts: ['Random investing', 'Investing for a purpose', 'Gambling', 'Avoiding risk'], a: 1 },

  { q: 'What is online fraud?', opts: ['Safe investment', 'Financial scam', 'Dividend', 'Interest'], a: 1 },
  { q: 'What protects passwords?', opts: ['Sharing them', 'Strong unique passwords', 'Posting online', 'Ignoring security'], a: 1 },
  { q: 'What is an emergency fund?', opts: ['Vacation fund', 'Money for unexpected expenses', 'Investment stock', 'Loan'], a: 1 },
  { q: 'What is a brokerage?', opts: ['Bank', 'Company that helps buy/sell investments', 'School', 'Government'], a: 1 },
  { q: 'What is a mobile investing app?', opts: ['Game', 'Investment platform on phone', 'Bank loan', 'Tax tool'], a: 1 },
  { q: 'What is deposit?', opts: ['Withdraw money', 'Add money', 'Lose money', 'Sell stock'], a: 1 },
  { q: 'What is withdrawal?', opts: ['Add funds', 'Remove funds', 'Buy ETF', 'Tax'], a: 1 },
  { q: 'What is minimum investment?', opts: ['Highest price', 'Smallest amount required', 'Profit', 'Loss'], a: 1 },
  { q: 'What is a savings account?', opts: ['Investing account', 'Bank account for storing money', 'Loan', 'ETF'], a: 1 },
  { q: 'What is inflation?', opts: ['Price increase over time', 'Profit', 'Dividend', 'Bonus'], a: 0 },

  { q: 'What does “hold” mean?', opts: ['Sell immediately', 'Keep investment', 'Cancel account', 'Withdraw money'], a: 1 },
  { q: 'What is market volatility?', opts: ['Stable prices', 'Rapid price changes', 'No risk', 'Fixed interest'], a: 1 },
  { q: 'What is a user interface?', opts: ['Code', 'App design users interact with', 'Tax', 'Fee'], a: 1 },
  { q: 'What is tracking performance?', opts: ['Ignoring account', 'Checking investment growth', 'Deleting app', 'Borrowing money'], a: 1 },
  { q: 'What is identity verification for?', opts: ['Security', 'Fees', 'Profit', 'Dividend'], a: 0 },
  { q: 'What is a fee?', opts: ['Free money', 'Cost charged by platform', 'Dividend', 'Profit'], a: 1 },
  { q: 'What is SIP (Systematic Investment Plan)?', opts: ['One-time sell', 'Regular investing plan', 'Gambling', 'Loan'], a: 1 },
  { q: 'What is investing consistency?', opts: ['Random investing', 'Investing regularly', 'Selling daily', 'Ignoring market'], a: 1 },
  { q: 'What is a beginner mistake?', opts: ['Diversifying', 'Emotional selling', 'Long-term investing', 'Learning'], a: 1 },
  { q: 'Why start early?', opts: ['More time for growth', 'More fees', 'More taxes', 'Less learning'], a: 0 },
]

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Page() {
  const router = useRouter()
  const [quiz, setQuiz] = useState(BANK.slice(0, 10))
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)
  const [willRedirect, setWillRedirect] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  // Shuffle questions on client only to avoid hydration mismatch
  useEffect(() => {
    setQuiz(shuffle(BANK).slice(0, 10))
  }, [])

  const restart = () => {
    setQuiz(shuffle(BANK).slice(0, 10))
    setAnswers({})
    setSubmitted(false)
    setScore(null)
    setErrMsg('')
  }

  function handleSelect(idx, optIdx) {
    if (submitted) return
    // If clicking the same option again, deselect it
    if (answers[idx] === optIdx) {
      setAnswers(a => {
        const newAnswers = { ...a }
        delete newAnswers[idx]
        return newAnswers
      })
    } else {
      setAnswers(a => ({ ...a, [idx]: optIdx }))
    }
  }

  function handleSubmit() {
    // require all answered
    if (Object.keys(answers).length < quiz.length) {
      setErrMsg('Please answer all questions before submitting.')
      return
    }
    let s = 0
    quiz.forEach((q, i) => {
      if (answers[i] === q.a) s++
    })
    setScore(s)
    setSubmitted(true)
    // If user scored 7 or more, show score briefly then redirect to dashboard-sim
    if (s >= 7) {
      setWillRedirect(true)
      setTimeout(() => {
        router.push('/dashboard-sim')
      }, 2000)
    }
  }

  const needsRetest = submitted && score < 7

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Header */}
      <header className="border-b border-gray-700 bg-gray-800/90 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard-sim" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-white font-semibold">SafeStart</span>
            </Link>
            <span className="px-2 py-1 rounded-full bg-blue-600/10 text-blue-400 text-xs font-medium">Quiz</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard-sim" className="text-gray-400 hover:text-white transition-colors text-sm">Dashboard</Link>
            <Link href="/marketplace" className="text-gray-400 hover:text-white transition-colors text-sm">Market</Link>
            <Link href="/news" className="text-gray-400 hover:text-white transition-colors text-sm">News</Link>
            <Link href="/quest" className="text-blue-400 font-medium text-sm">Quiz</Link>
            <Link href="/learn" className="text-gray-400 hover:text-white transition-colors text-sm">Learn</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Quick Investing Quiz</h1>

        <div className="space-y-5 mt-4">
          {quiz.map((q, i) => (
            <div key={i} className="p-5 rounded-2xl bg-gradient-to-r from-slate-800 via-gray-800 to-slate-700 border border-gray-700 group transition duration-300 hover:shadow-xl hover:ring-4 hover:ring-primary/30 hover:-translate-y-1">
              <div className="font-semibold mb-4 text-lg text-gray-50">{i + 1}. {q.q}</div>
              <div className="space-y-3">
                {q.opts.map((opt, oi) => (
                  <label key={oi} className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all duration-200 ${answers[i] === oi ? 'bg-primary/15 ring-2 ring-primary/50' : 'hover:bg-white/10'} ${submitted && q.a === oi ? 'bg-green-500/20 ring-2 ring-green-400/50 text-green-300' : 'text-gray-200'}`}>
                    <input
                      className="accent-primary w-5 h-5 cursor-pointer"
                      type="radio"
                      name={`q-${i}`}
                      checked={answers[i] === oi}
                      onChange={() => handleSelect(i, oi)}
                      disabled={submitted}
                    />
                    <span className="select-none font-medium">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!submitted ? (
          <div className="mt-8 flex flex-col items-center gap-3">
            {errMsg && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium w-full text-center">
                ⚠️ {errMsg}
              </div>
            )}
            <button onClick={handleSubmit} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">Submit Quiz</button>
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Your Score</p>
              <div className={`text-5xl font-bold mb-3 ${score >= 7 ? 'text-green-400' : 'text-yellow-400'}`}>{score}/{quiz.length}</div>
              <p className="text-gray-300">{score >= 7 ? '🎉 Great job! Redirecting...' : '📚 Keep practicing!'}</p>
            </div>
            {needsRetest && (
              <button onClick={restart} className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 rounded-xl font-semibold shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105">Retake: New 10 Questions</button>
            )}
          </div>
        )}
      </div>
    </main>
  )
}