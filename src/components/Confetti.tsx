import { useMemo } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#082F71', '#52B7A4', '#FEB20B', '#123F94', '#7ECCBC', '#FFC94D']

/** Brand-colored confetti burst. Mount it briefly on a win. */
export default function Confetti({ count = 44 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.25,
        duration: 1.5 + Math.random() * 1.2,
        rotate: Math.random() * 360,
        drift: (Math.random() - 0.5) * 120,
      })),
    [count],
  )

  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p) => (
        <motion.i
          key={p.id}
          style={{ left: `${p.left}%`, background: p.color }}
          initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
          animate={{ y: '105vh', x: p.drift, opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}
