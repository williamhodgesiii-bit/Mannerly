import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/* ============================================================
   Intro video

   The branded opening that plays over everything each time the app
   is launched. It fills the app frame, plays once, then hands off via
   onFinish() — the App fades this overlay away to reveal the screen it
   already routed to underneath (onboarding, sign-in, or the learner's
   world). Playback is muted-autoplay (the only kind every browser allows
   without a gesture); we opportunistically un-mute where the platform
   permits, and always fall back to muted so the clip runs every time.
   ============================================================ */

const INTRO_SRC = `${import.meta.env.BASE_URL}intro.mp4`

export default function IntroVideo({ onFinish }: { onFinish: () => void }) {
  const ref = useRef<HTMLVideoElement>(null)
  const finished = useRef(false)
  const [showSkip, setShowSkip] = useState(false)

  // Fire onFinish exactly once, whether the clip ended, was skipped, or failed.
  const finish = () => {
    if (finished.current) return
    finished.current = true
    onFinish()
  }

  useEffect(() => {
    const v = ref.current
    if (!v) return

    // Autoplay must start muted; try for sound, but never block playback on it.
    const play = () => {
      const p = v.play()
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          v.muted = true
          void v.play().catch(finish) // truly can't play → don't trap the user
        })
      }
    }
    v.muted = true
    play()
    // Then reach for sound where the platform allows it.
    v.muted = false
    play()

    // Offer an escape hatch shortly after it starts (it plays on every launch).
    const t = window.setTimeout(() => setShowSkip(true), 1600)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <motion.div
      className="intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden
    >
      <video
        ref={ref}
        className="intro__video"
        src={INTRO_SRC}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
      />
      {showSkip && (
        <motion.button
          type="button"
          className="intro__skip"
          onClick={finish}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Skip
        </motion.button>
      )}
    </motion.div>
  )
}
