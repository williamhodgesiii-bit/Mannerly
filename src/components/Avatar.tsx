import Icon from '@/components/Icon'
import { avatarOf } from '@/data/avatars'

/** A brand avatar sticker: a coloured squircle with a white icon glyph. */
export default function Avatar({ id, size = 48 }: { id?: string | null; size?: number }) {
  const a = avatarOf(id)
  return (
    <span
      className={`avatar avatar--${a.color}`}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.3) }}
    >
      <Icon name={a.glyph} size={Math.round(size * 0.54)} color="#fff" strokeWidth={2.2} />
    </span>
  )
}
