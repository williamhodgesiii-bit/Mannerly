import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { AgeGroup, CountryCode } from '@/types'
import { useProgress } from '@/state/store'
import { useEntitlements } from '@/state/entitlements'
import { countryList } from '@/data/countries'
import { haptic } from '@/lib/haptics'
import Mascot from '@/components/Mascot'

const AGES: { id: AgeGroup; name: string; range: string; emoji: string }[] = [
  { id: 'kids', name: 'Kids', range: '5–7', emoji: '🧸' },
  { id: 'tweens', name: 'Tweens', range: '8–12', emoji: '🎒' },
  { id: 'teens', name: 'Teens', range: '13–17', emoji: '🎧' },
  { id: 'adults', name: 'Adults', range: '18+', emoji: '💼' },
]

const stepAnim = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

export default function Onboarding() {
  const navigate = useNavigate()
  const setAgeGroup = useProgress((s) => s.setAgeGroup)
  const setHomeRegion = useEntitlements((s) => s.setHomeRegion)

  const [step, setStep] = useState<0 | 1 | 2 | 3>(0)
  const [age, setAge] = useState<AgeGroup | null>(null)
  const [home, setHome] = useState<CountryCode>('US')

  // Persist the onboarding choices (this also marks the learner onboarded).
  const commit = () => {
    if (!age) return
    setHomeRegion(home)
    setAgeGroup(age)
  }

  const finishAsGuest = () => { haptic('success'); commit(); navigate('/', { replace: true }) }
  const finishToAuth = () => { haptic('tap'); commit(); navigate('/account', { replace: true }) }

  return (
    <div className="screen screen--padded" style={{ justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="welcome" {...stepAnim}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22 }}>
            <div className="center" style={{ gap: 2 }}>
              <div className="row" style={{ gap: 0 }}>
                <Mascot color="navy" pose="wave" size={116} />
                <Mascot color="teal" pose="idle" size={116} flip />
              </div>
              <img src="/brand/wordmark-stacked.png" alt="Mannerly" style={{ width: 200, marginTop: -6 }} />
            </div>
            <div className="center" style={{ gap: 8, textAlign: 'center' }}>
              <h1 className="title" style={{ fontSize: 24 }}>Good manners, made fun.</h1>
              <p className="subtitle" style={{ maxWidth: 300 }}>
                Bite-size lessons in kindness, etiquette & world cultures.
              </p>
            </div>
            <button className="btn" onClick={() => { haptic('tap'); setStep(1) }}>Get started</button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="age" {...stepAnim}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ marginTop: 10 }}>
              <span className="eyebrow">Step 1 of 3</span>
              <h1 className="title" style={{ marginTop: 6 }}>Who's learning?</h1>
              <p className="subtitle">Lessons adapt to each age.</p>
            </div>
            <div className="age-grid grow" style={{ alignContent: 'center' }}>
              {AGES.map((a) => (
                <button key={a.id} className={`age-card ${age === a.id ? 'age-card--on' : ''}`}
                  onClick={() => { haptic('select'); setAge(a.id) }}>
                  <span className="age-emoji">{a.emoji}</span>
                  <span className="age-name">{a.name}</span>
                  <span className="age-range">Ages {a.range}</span>
                </button>
              ))}
            </div>
            <button className="btn btn--teal" disabled={!age} onClick={() => { haptic('tap'); setStep(2) }}>
              Continue →
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="home" {...stepAnim}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ marginTop: 10 }}>
              <span className="eyebrow">Step 2 of 3</span>
              <h1 className="title" style={{ marginTop: 6 }}>Where do you live?</h1>
              <p className="subtitle">Your home region's pack is free. Change it anytime.</p>
            </div>
            <div className="age-grid grow hide-scroll" style={{ alignContent: 'start', overflowY: 'auto' }}>
              {countryList().map((c) => (
                <button key={c.code} className={`age-card ${home === c.code ? 'age-card--on' : ''}`}
                  onClick={() => { haptic('select'); setHome(c.code) }}>
                  <span className="age-emoji">{c.flag}</span>
                  <span className="age-name">{c.name}</span>
                  <span className="age-range">{c.hello}</span>
                </button>
              ))}
            </div>
            <button className="btn btn--teal" onClick={() => { haptic('tap'); setStep(3) }}>Continue →</button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="account" {...stepAnim}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ marginTop: 10 }}>
              <span className="eyebrow">Step 3 of 3</span>
              <h1 className="title" style={{ marginTop: 6 }}>Save your progress</h1>
              <p className="subtitle">
                Create a free account to keep your streak and packs on every device — phone,
                tablet, and the web.
              </p>
            </div>
            <div className="grow center" style={{ justifyContent: 'center' }}>
              <Mascot color="gold" pose="wave" size={128} />
            </div>
            <div className="stack" style={{ gap: 10 }}>
              <button className="btn" onClick={finishToAuth}>Create free account</button>
              <button className="btn btn--ghost" onClick={finishToAuth}>I already have one</button>
              <button className="btn btn--ghost" onClick={finishAsGuest}>Maybe later</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
