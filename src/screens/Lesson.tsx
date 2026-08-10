import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LESSON_MAP } from '@/data/content'
import type { Choice, SceneSpec } from '@/types'
import { useProgress } from '@/state/store'
import { haptic } from '@/lib/haptics'
import Scene from '@/components/Scene'
import Mascot from '@/components/Mascot'
import Confetti from '@/components/Confetti'

type Phase = 'play' | 'reason' | 'challenge'

const FORMALITY_LABEL = { casual: 'Casual', semiformal: 'Semi-formal', formal: 'Formal' }
const NORM_LABEL = { strong: 'Strong norm', medium: 'Common', soft: 'Soft / varies' }

function shuffle<T>(arr: T[], seed: string): T[] {
  const a = [...arr]
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) & 0x7fffffff
    const j = h % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Lesson() {
  const { lessonId = '' } = useParams()
  const navigate = useNavigate()
  const lesson = LESSON_MAP[lessonId]
  const completeLesson = useProgress((s) => s.completeLesson)

  const [phase, setPhase] = useState<Phase>('play')
  const [chosen, setChosen] = useState<string | null>(null)
  const [showMeta, setShowMeta] = useState(false)
  const [done, setDone] = useState<{ xpGained: number; streak: number } | null>(null)

  const choices = useMemo(() => (lesson ? shuffle(lesson.choices, lesson.id) : []), [lesson])

  if (!lesson) {
    return (
      <div className="screen screen--padded center">
        <p className="empty">Lesson not found.</p>
        <button className="btn" onClick={() => navigate('/')}>Home</button>
      </div>
    )
  }

  const selected: Choice | undefined = choices.find((c) => c.id === chosen)
  const isCorrect = !!selected?.correct

  // scene reacts to the current choice
  const liveScene: SceneSpec = selected?.reactionState
    ? { ...lesson.scene, state: selected.reactionState, caption: undefined }
    : phase === 'reason'
      ? { ...lesson.scene, state: 'smiling', caption: undefined }
      : phase === 'challenge'
        ? { ...lesson.scene, state: 'thanking', caption: undefined }
        : lesson.scene

  const progress = phase === 'play' ? 33 : phase === 'reason' ? 66 : 100

  const choose = (c: Choice) => {
    if (chosen) return
    setChosen(c.id)
    haptic(c.correct ? 'success' : 'error')
  }
  const retry = () => { setChosen(null); haptic('tap') }
  const next = () => {
    haptic('tap')
    if (phase === 'play' && isCorrect) setPhase('reason')
    else if (phase === 'reason') setPhase('challenge')
    else if (phase === 'challenge') {
      const res = completeLesson(lesson.id)
      setDone(res)
      haptic('success')
    }
  }
  const leave = () => navigate(-1)

  return (
    <div className="screen" style={{ overflow: 'hidden' }}>
      {/* top bar */}
      <div className="row" style={{ gap: 12, padding: 'calc(env(safe-area-inset-top) + 12px) 18px 8px' }}>
        <button className="icon-btn" onClick={leave} aria-label="Close">✕</button>
        <div className="track grow">
          <motion.div className="fill" animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut', duration: 0.4 }} />
        </div>
      </div>

      <div className="screen--padded" style={{ paddingTop: 8, gap: 16, display: 'flex', flexDirection: 'column' }}>
        <Scene spec={liveScene} height={248} />

        <AnimatePresence mode="wait">
          {/* -------- PLAY -------- */}
          {phase === 'play' && (
            <motion.div key="play" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
              <h2 className="title" style={{ fontSize: 21, marginBottom: 14 }}>{lesson.prompt}</h2>
              <div className="options">
                {choices.map((c) => {
                  const state =
                    !chosen ? '' : c.id === chosen ? (c.correct ? 'option--correct' : 'option--wrong') : 'option--dim'
                  return (
                    <button key={c.id} className={`option ${state}`} disabled={!!chosen} onClick={() => choose(c)}>
                      {c.emoji && <span className="opt-emoji">{c.emoji}</span>}
                      <span className="grow">{c.label}</span>
                      {chosen && c.id === chosen && <span>{c.correct ? '✓' : '✕'}</span>}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* -------- REASON -------- */}
          {phase === 'reason' && (
            <motion.div key="reason" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
              <span className="eyebrow">Why it matters</span>
              <h2 className="title" style={{ fontSize: 20, margin: '8px 0 12px' }}>{lesson.reason}</h2>

              <div className="pill-row" style={{ marginBottom: 12 }}>
                <span className="chip">{FORMALITY_LABEL[lesson.formality]}</span>
                <span className="chip chip--teal">{NORM_LABEL[lesson.normStrength]}</span>
                {lesson.country && <span className="chip chip--gold">Country pack</span>}
              </div>

              <div className="card" style={{ padding: 14, marginBottom: 12 }}>
                <div className="meta-row"><span className="k">If unsure</span><span className="v">{lesson.whenUnsure}</span></div>
                {lesson.exceptions && (
                  <>
                    <div className="divider" />
                    <div className="meta-row"><span className="k">Exceptions</span><span className="v">{lesson.exceptions}</span></div>
                  </>
                )}
              </div>

              <button className="src-link" onClick={() => setShowMeta((v) => !v)} style={{ background: 'none', padding: 0 }}>
                {showMeta ? 'Hide sources' : 'ⓘ Sources & review'}
              </button>
              <AnimatePresence>
                {showMeta && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="card"
                    style={{ padding: 14, marginTop: 10, overflow: 'hidden' }}
                  >
                    <div className="meta-list">
                      {lesson.sources.map((s) => (
                        <a key={s.url} className="src-link" href={s.url} target="_blank" rel="noreferrer noopener">🔗 {s.label}</a>
                      ))}
                      <div className="meta-row"><span className="k">Reviewed by</span><span className="v">{lesson.reviewer}</span></div>
                      <div className="meta-row"><span className="k">Last review</span><span className="v">{lesson.reviewedOn}</span></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* -------- CHALLENGE -------- */}
          {phase === 'challenge' && (
            <motion.div key="challenge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
              <span className="eyebrow">Real-world challenge</span>
              <div className="card" style={{ padding: 20, marginTop: 10, display: 'flex', gap: 14, alignItems: 'center' }}>
                <span style={{ fontSize: 40 }}>🎯</span>
                <p style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.25 }}>{lesson.challenge}</p>
              </div>
              <div className="center" style={{ marginTop: 6 }}>
                <Mascot color="navy" pose="cheer" size={120} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* -------- feedback / continue bar -------- */}
      <AnimatePresence>
        {phase === 'play' && chosen && (
          <motion.div
            key="sheet"
            className={`sheet ${isCorrect ? 'sheet--correct' : 'sheet--wrong'}`}
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 200 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            <div className="sheet__head">{isCorrect ? '🎉 Nice!' : '💡 Not quite'}</div>
            <p className="sheet__body" style={{ marginBottom: 14 }}>{selected?.reaction}</p>
            {isCorrect ? (
              <button className="btn btn--teal" onClick={next}>Continue →</button>
            ) : (
              <button className="btn btn--coral" onClick={retry}>Try again</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* continue bar for reason/challenge */}
      {phase !== 'play' && !done && (
        <div style={{ padding: '10px 20px calc(env(safe-area-inset-bottom) + 16px)' }}>
          <button className="btn" onClick={next}>{phase === 'challenge' ? 'Finish ✓' : 'Got it →'}</button>
        </div>
      )}

      {/* -------- reward overlay -------- */}
      <AnimatePresence>
        {done && (
          <motion.div
            key="reward"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50, background: 'var(--bg)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '24px 24px calc(env(safe-area-inset-bottom) + 24px)',
              maxWidth: 'var(--app-max)', margin: '0 auto',
            }}
          >
            <Confetti />
            <div className="reward">
              <motion.div className="reward__badge" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 12 }}>
                {lesson.icon}
              </motion.div>
              <h1 className="title" style={{ marginTop: 12 }}>Lesson complete!</h1>
              <p className="subtitle">{lesson.title}</p>
              <div className="reward-stats">
                <div className="reward-stat">
                  <div className="rs-num" style={{ color: 'var(--navy-600)' }}>+{done.xpGained}</div>
                  <div className="rs-lbl">XP earned</div>
                </div>
                <div className="reward-stat">
                  <div className="rs-num" style={{ color: 'var(--gold-600)' }}>🔥 {done.streak}</div>
                  <div className="rs-lbl">Day streak</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              <button className="btn btn--teal" onClick={leave}>Continue</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
