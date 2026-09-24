import { useCallback, useMemo, useState } from 'react'
import { COUNTRIES, flagUrl, pickQuestion, type Country } from './countries'
import './App.css'

type Mode = 'flags' | 'capitals' | 'geography'

function App() {
  const [mode, setMode] = useState<Mode>('flags')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const [question, setQuestion] = useState(() => pickQuestion())

  const next = useCallback(() => {
    setQuestion(pickQuestion(question.answer.code))
    setAnswered(false)
    setPicked(null)
  }, [question.answer.code])

  const onPick = (country: Country) => {
    if (answered) return
    setPicked(country.code)
    setAnswered(true)
    if (country.code === question.answer.code) {
      setScore((s) => s + 1)
      setStreak((s) => s + 1)
    } else {
      setStreak(0)
    }
  }

  const reset = () => {
    setScore(0)
    setStreak(0)
    setAnswered(false)
    setPicked(null)
    setQuestion(pickQuestion())
    setMode('flags')
  }

  const countryCount = useMemo(() => COUNTRIES.length, [])

  return (
    <div className="layout">
      <aside className="sidebar" aria-label="More games">
        <div className="brand">Flag Quiz</div>
        <nav>
          <p className="nav-label">More games</p>
          <ul>
            <li>
              <a
                href="#flags"
                className={mode === 'flags' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault()
                  setMode('flags')
                }}
              >
                Flag Quiz
              </a>
            </li>
            <li>
              <a
                href="#capitals"
                className={mode === 'capitals' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault()
                  setMode('capitals')
                }}
              >
                Capitals Quiz
              </a>
            </li>
            <li>
              <a
                href="#geography"
                className={mode === 'geography' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault()
                  setMode('geography')
                }}
              >
                Geography Quiz
              </a>
            </li>
          </ul>
        </nav>
        <p className="aside-note">{countryCount} countries</p>
      </aside>

      <main className="main">
        <header className="hero">
          <h1>Flag Quiz</h1>
          <p className="tagline">
            Free world flag quiz. Guess the country, keep score, play in your
            browser.
          </p>
        </header>

        {mode === 'flags' ? (
          <section className="quiz" aria-live="polite">
            <div className="stats">
              <span>
                Score: <strong>{score}</strong>
              </span>
              <span>
                Streak: <strong>{streak}</strong>
              </span>
              <button type="button" className="linkish" onClick={reset}>
                Reset
              </button>
            </div>

            <div className="flag-wrap">
              <img
                key={question.answer.code}
                src={flagUrl(question.answer.code)}
                alt="Mystery national flag"
                width={320}
                height={213}
                decoding="async"
              />
            </div>

            <p className="prompt">Which country is this flag from?</p>

            <div className="choices" role="group" aria-label="Answer choices">
              {question.options.map((opt) => {
                let cls = 'choice'
                if (answered) {
                  if (opt.code === question.answer.code) cls += ' correct'
                  else if (opt.code === picked) cls += ' wrong'
                }
                return (
                  <button
                    key={opt.code}
                    type="button"
                    className={cls}
                    disabled={answered}
                    onClick={() => onPick(opt)}
                  >
                    {opt.name}
                  </button>
                )
              })}
            </div>

            {answered && (
              <div className="feedback">
                {picked === question.answer.code ? (
                  <p className="ok">Correct!</p>
                ) : (
                  <p className="no">
                    Wrong — it&apos;s <strong>{question.answer.name}</strong>
                  </p>
                )}
                <button type="button" className="next" onClick={next}>
                  Next flag
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="coming">
            <h2>
              {mode === 'capitals' ? 'Capitals Quiz' : 'Geography Quiz'}
            </h2>
            <p>Coming soon — play Flag Quiz above for now.</p>
            <button
              type="button"
              className="next"
              onClick={() => setMode('flags')}
            >
              Back to Flag Quiz
            </button>
          </section>
        )}

        <footer className="geo">
          <p>
            Flag Quiz is a free browser game where you guess countries from their flags — not a study guide.
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App
