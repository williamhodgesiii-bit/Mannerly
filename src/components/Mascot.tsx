import { motion } from 'framer-motion'

export type Pose = 'idle' | 'wave' | 'think' | 'cheer' | 'bow' | 'offer'
export type Expression = 'smile' | 'neutral' | 'oops' | 'surprise'

interface MascotProps {
  color?: 'navy' | 'teal' | 'gold'
  pose?: Pose
  expression?: Expression
  size?: number
  bob?: boolean
  flip?: boolean
}

const FILL = {
  navy: 'var(--navy-600)',
  teal: 'var(--teal-500)',
  gold: 'var(--gold-500)',
}

/**
 * Friendly stand-in built from the logo's two "people" shapes:
 * a head circle + a rounded body. Poses/expressions are simple,
 * on-brand affordances — not the full character rig.
 */
export default function Mascot({
  color = 'navy',
  pose = 'idle',
  expression = 'smile',
  size = 120,
  bob = true,
  flip = false,
}: MascotProps) {
  const fill = FILL[color]

  const armAnim =
    pose === 'wave'
      ? { rotate: [0, 18, -6, 18, 0] }
      : pose === 'cheer'
        ? { rotate: -55 }
        : pose === 'offer'
          ? { rotate: 40 }
          : { rotate: 0 }

  const bodyTilt = pose === 'bow' ? 14 : pose === 'think' ? -4 : 0

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 140"
      style={{ transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible' }}
      initial={false}
      animate={bob ? { y: [0, -5, 0] } : { y: 0 }}
      transition={bob ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
      aria-hidden
    >
      <motion.g
        animate={{ rotate: bodyTilt }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
        style={{ originX: '60px', originY: '120px' }}
      >
        {/* shadow */}
        <ellipse cx="60" cy="132" rx="30" ry="6" fill="rgba(12,32,74,0.10)" />

        {/* body */}
        <rect x="34" y="62" width="52" height="62" rx="26" fill={fill} />

        {/* raised arm (animatable) */}
        <motion.g
          animate={armAnim}
          transition={{ duration: pose === 'wave' ? 1 : 0.4, repeat: pose === 'wave' ? Infinity : 0, ease: 'easeInOut' }}
          style={{ originX: '84px', originY: '84px' }}
        >
          <rect x="80" y="78" width="14" height="40" rx="7" fill={fill} />
        </motion.g>

        {/* head */}
        <circle cx="60" cy="38" r="26" fill={fill} />

        {/* face */}
        <g fill="#fff">
          <circle cx={pose === 'think' ? 53 : 51} cy="36" r="3.4" />
          <circle cx="69" cy="36" r="3.4" />
        </g>
        {expression === 'smile' && (
          <path d="M50 46 q10 9 20 0" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
        )}
        {expression === 'neutral' && (
          <path d="M51 47 h18" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
        )}
        {expression === 'oops' && (
          <path d="M50 49 q10 -7 20 0" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
        )}
        {expression === 'surprise' && <circle cx="60" cy="48" r="4" fill="#fff" />}
      </motion.g>
    </motion.svg>
  )
}
