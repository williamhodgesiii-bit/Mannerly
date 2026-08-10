import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { AgeGroup } from '@/types'
import { useProgress } from '@/state/store'
import { haptic } from '@/lib/haptics'
import Mascot from '@/components/Mascot'

const AGES: { id: AgeGroup; name: string; range: string; emoji: string }[] = [
  { id: 'kids', name: 'Kids', range: '5–7', emoji: '🧸' },
  { id: 'tweens', name: 'Tweens', range: '8–12', emoji: '🎒' },
  { id: 'teens', name: 'Teens', range: '13–17', emoji: '🎧' },
  { id: 'adults', name: 'Adults', range: '18+', emoji: '💼' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const setAgeGroup = useProgress((s) => s.setAgeGroup)
  const [step, setStep] = useState<0 | 1>(0)
  const [pick, setPick] = useState<AgeGroup | null>(null)

  const finish = () => {
    if (!pick) return
    haptic('success')
    setAgeGroup(pick)
    navigate('/', { replace: true })
  }

  return (
    <div className="screen screen--padded" style={{ justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22 }}
          >
            <div className="center" style={{ gap: 2 }}>
              <div className="row" style={{ gap: 0 }}>
                <Mascot color="navy" pose="wave" size={116} />
                <Mascot color="teal" pose="idle" size={116} flip />
              </div>
              <img
                src="/brand/wordmark-stacked.png"
                alt="Mannerly"
                style={{ width: 200, marginTop: -6 }}
              />
            </div>
            <div className="center" style={{ gap: 8, textAlign: 'center' }}>
              <h1 className="title" style={{ fontSize: 24 }}>Good manners, made fun.</h1>
              <p className="subtitle" style={{ maxWidth: 300 }}>
                Bite-size lessons in kindness, etiquette & world cultures.
              </p>
            </div>
            <button className="btn" onClick={() => { haptic('tap'); setStep(1) }}>
              Get started
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="age"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}
          >
            <div style={{ marginTop: 10 }}>
              <span className="eyebrow">Step 1</span>
              <h1 className="title" style={{ marginTop: 6 }}>Who's learning?</h1>
              <p className="subtitle">Lessons adapt to each age.</p>
            </div>

            <div className="age-grid grow" style={{ alignContent: 'center' }}>
              {AGES.map((a) => (
                <button
                  key={a.id}
                  className={`age-card ${pick === a.id ? 'age-card--on' : ''}`}
                  onClick={() => { haptic('select'); setPick(a.id) }}
                >
                  <span className="age-emoji">{a.emoji}</span>
                  <span className="age-name">{a.name}</span>
                  <span className="age-range">Ages {a.range}</span>
                </button>
              ))}
            </div>

            <button className="btn btn--teal" disabled={!pick} onClick={finish}>
              Start learning →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
