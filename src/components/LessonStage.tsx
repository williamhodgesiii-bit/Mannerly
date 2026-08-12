import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

/* ============================================================
   LessonStage — the lesson's video beat.

   Plays one lesson clip inside the lesson card: the intro situation
   (before the choices) or the reward (after a correct answer). It
   mirrors the branded IntroVideo's playback rules — muted-autoplay,
   the only kind browsers allow without a gesture, with an
   opportunistic un-mute where the platform permits; the clip's
   burned-in captions keep it learnable while muted.

   The clip is shown whole (never cropped): it sits centered and
   contained, and any space left beside a vertical clip is filled by a
   soft, blurred, zoomed copy of the same video — so there are no black
   letterbox bars, just an on-brand backdrop.

   It fires onDone() exactly once — on ended, skip, error, or when
   there is no clip — so the lesson flow never stalls waiting on a
   video. With no `src` (or a load failure) it renders `fallback`, the
   branded <Scene> placeholder, so lessons without a clip behave
   exactly as before.
   ============================================================ */

interface LessonStageProps {
  /** clip URL; when absent, `fallback` is shown and onDone fires immediately */
  src?: string
  /** branded placeholder shown when there is no clip or it fails to load */
  fallback: ReactNode
  /** reserved height (px) until the clip's real aspect ratio is known */
  height: number
  /** cap the stage height as a share of the viewport (vh) — lets a tall
      portrait clip play big, then "dock" smaller when choices appear */
  maxVh?: number
  autoPlay?: boolean
  /** fired once when the clip ends, is skipped, errors, or is absent */
  onDone?: () => void
  /** show a small "Skip" control a beat after playback starts */
  skippable?: boolean
}

export default function LessonStage({
  src,
  fallback,
  height,
  maxVh = 58,
  autoPlay = true,
  onDone,
  skippable,
}: LessonStageProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const bgRef = useRef<HTMLVideoElement>(null)
  const doneRef = useRef(false)
  const [failed, setFailed] = useState(false)
  const [muted, setMuted] = useState(true)
  const [ar, setAr] = useState<number | null>(null)
  const [showSkip, setShowSkip] = useState(false)

  const done = () => {
    if (doneRef.current) return
    doneRef.current = true
    onDone?.()
  }

  // reset per clip
  useEffect(() => {
    doneRef.current = false
    setFailed(false)
    setAr(null)
    setShowSkip(false)
  }, [src])

  // no clip → let the flow proceed and render the fallback
  useEffect(() => {
    if (!src) done()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  // muted-autoplay, then reach for sound where allowed (never block on it)
  useEffect(() => {
    const v = ref.current
    if (!v || !src || !autoPlay) return
    const play = () => {
      const p = v.play()
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          v.muted = true
          void v.play().catch(() => {})
        })
      }
    }
    v.muted = true
    play()
    v.muted = false
    play()
    void bgRef.current?.play().catch(() => {}) // decorative backdrop, always muted
    const t = window.setTimeout(() => setShowSkip(true), 1400)
    return () => window.clearTimeout(t)
  }, [src, autoPlay])

  if (!src || failed) return <>{fallback}</>

  const toggleSound = () => {
    const v = ref.current
    if (!v) return
    v.muted = !v.muted
    if (!v.muted) void v.play().catch(() => {})
  }

  return (
    <div className="stage" style={ar ? { aspectRatio: String(ar), maxHeight: `${maxVh}vh` } : { height }}>
      {/* blurred, zoomed copy fills the space beside a vertical clip — no black bars */}
      <video
        ref={bgRef}
        className="stage__bg"
        src={src}
        autoPlay={autoPlay}
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
        aria-hidden
      />

      {/* the clip itself, shown whole (contained) and centered */}
      <video
        ref={ref}
        className="stage__video"
        src={src}
        autoPlay={autoPlay}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={(e) => {
          const el = e.currentTarget
          if (el.videoWidth && el.videoHeight) setAr(el.videoWidth / el.videoHeight)
        }}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        onEnded={done}
        onError={() => {
          setFailed(true)
          done()
        }}
      />

      <button
        type="button"
        className="stage__sound"
        onClick={toggleSound}
        aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      {skippable && showSkip && (
        <motion.button
          type="button"
          className="stage__skip"
          onClick={done}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Skip ▸
        </motion.button>
      )}
    </div>
  )
}
