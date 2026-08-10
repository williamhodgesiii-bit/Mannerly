import { motion } from 'framer-motion'
import type { CharacterId, CharacterState, EnvironmentId, SceneSpec } from '@/types'
import Mascot, { type Expression, type Pose } from './Mascot'

/* ============================================================
   <Scene> — the lesson stage.

   ⚠️ Animation status: this is the branded PLACEHOLDER stage.
   Per the production plan, real character motion will be authored in
   Rive (idle / talking / greeting / giving / …) and dropped in here.
   The props below already mirror a Rive state machine 1-to-1
   (environment · state · characters), so swapping in the rig will
   NOT require any change to lesson data. Until then we show a tasteful,
   reactive stand-in — no fabricated character animation.
   ============================================================ */

const ENV: Record<EnvironmentId, { from: string; to: string; prop: string; floor: string }> = {
  home: { from: '#FFF6E9', to: '#FFE9C7', prop: '🏠', floor: '#E7C99A' },
  classroom: { from: '#EAF2FF', to: '#D5E6FF', prop: '📚', floor: '#B9D2F5' },
  restaurant: { from: '#FFF1DE', to: '#FFDFAE', prop: '🍽️', floor: '#EFC98E' },
  street: { from: '#EEF3F7', to: '#DCE6EE', prop: '🌳', floor: '#C3D2DC' },
  train: { from: '#E7F0FF', to: '#CFE0FA', prop: '🚆', floor: '#AFC7E8' },
  airport: { from: '#E9F4FF', to: '#D2E9FF', prop: '✈️', floor: '#B4D6F1' },
  office: { from: '#EDF0F5', to: '#DBE1EC', prop: '💼', floor: '#C4CCDA' },
  party: { from: '#FFEFF6', to: '#FFDCEC', prop: '🎉', floor: '#F3C2DA' },
  hotel: { from: '#E7F6F2', to: '#CDEDE4', prop: '🛎️', floor: '#AEDDD0' },
  store: { from: '#E9F6EF', to: '#D2EEE0', prop: '🛍️', floor: '#B2E0CB' },
  'friends-home': { from: '#FFF3EC', to: '#FFE0CE', prop: '🛋️', floor: '#F0C7AE' },
  worship: { from: '#F1ECFF', to: '#E1D6FF', prop: '🛕', floor: '#CBBBF2' },
}

function colorFor(id: CharacterId): 'navy' | 'teal' {
  return id === 'manni' ? 'navy' : 'teal'
}

function poseFor(state: CharacterState, role: 'primary' | 'secondary'): { pose: Pose; expr: Expression } {
  const P = role === 'primary'
  switch (state) {
    case 'greeting': return { pose: P ? 'wave' : 'idle', expr: 'smile' }
    case 'giving': return { pose: P ? 'offer' : 'idle', expr: 'smile' }
    case 'receiving': return { pose: P ? 'idle' : 'offer', expr: 'smile' }
    case 'thanking': return { pose: P ? 'bow' : 'idle', expr: 'smile' }
    case 'apologizing': return { pose: P ? 'bow' : 'idle', expr: P ? 'oops' : 'neutral' }
    case 'listening': return { pose: P ? 'think' : 'idle', expr: P ? 'neutral' : 'smile' }
    case 'talking': return { pose: 'idle', expr: 'smile' }
    case 'eating': return { pose: 'idle', expr: 'smile' }
    case 'confused': return { pose: P ? 'think' : 'idle', expr: P ? 'oops' : 'neutral' }
    case 'embarrassed': return { pose: P ? 'idle' : 'idle', expr: P ? 'oops' : 'neutral' }
    case 'asking': return { pose: P ? 'wave' : 'idle', expr: P ? 'neutral' : 'smile' }
    case 'pointing': return { pose: P ? 'offer' : 'idle', expr: 'smile' }
    case 'smiling': return { pose: 'idle', expr: 'smile' }
    case 'walking': return { pose: 'idle', expr: 'smile' }
    default: return { pose: 'idle', expr: 'smile' }
  }
}

interface SceneProps {
  spec: SceneSpec
  /** shrink for inline previews (e.g. lesson node) */
  height?: number
}

export default function Scene({ spec, height = 260 }: SceneProps) {
  const env = ENV[spec.environment]
  const chars = spec.characters.length ? spec.characters : (['manni'] as CharacterId[])
  const primary = chars[0]
  const secondary = chars[1]
  const solo = !secondary

  return (
    <div
      className="scene"
      role="img"
      aria-label={`${spec.environment} scene: ${spec.caption ?? spec.state}`}
      style={{
        height,
        background: `linear-gradient(180deg, ${env.from}, ${env.to})`,
      }}
    >
      {/* soft glow */}
      <div className="scene__glow" />

      {/* faint environment prop */}
      <div className="scene__prop" aria-hidden>{env.prop}</div>

      {/* floating ambiance */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="scene__dot"
          style={{ left: `${18 + i * 30}%`, top: `${20 + (i % 2) * 12}%` }}
          animate={{ y: [0, -10, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          aria-hidden
        />
      ))}

      {/* caption */}
      {spec.caption && <div className="scene__caption">{spec.caption}</div>}

      {/* floor */}
      <div className="scene__floor" style={{ background: env.floor }} />

      {/* characters */}
      <div className={`scene__cast ${solo ? 'scene__cast--solo' : ''}`}>
        <motion.div
          key={`p-${spec.state}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        >
          <Mascot color={colorFor(primary)} size={solo ? 150 : 128} {...poseFor(spec.state, 'primary')} />
        </motion.div>

        {secondary && (
          <motion.div
            key={`s-${spec.state}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.05 }}
          >
            <Mascot color={colorFor(secondary)} size={128} flip {...poseFor(spec.state, 'secondary')} />
          </motion.div>
        )}
      </div>
    </div>
  )
}
