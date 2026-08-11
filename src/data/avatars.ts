import type { IconName } from '@/components/Icon'

/**
 * Brand avatars — a coloured "sticker" (squircle + white glyph from the
 * Mannerly icon set), not stock animal emoji. No photos, ever. Accessories
 * (chef hat, passport backpack, graduation cap…) are earned through learning
 * later, not sold individually.
 */
export type AvatarColor = 'navy' | 'teal' | 'gold' | 'coral'

export interface Avatar {
  id: string
  glyph: IconName
  color: AvatarColor
}

export const AVATARS: Avatar[] = [
  { id: 'star', glyph: 'star', color: 'gold' },
  { id: 'rocket', glyph: 'rocket', color: 'navy' },
  { id: 'sprout', glyph: 'sprout', color: 'teal' },
  { id: 'compass', glyph: 'compass', color: 'gold' },
  { id: 'book', glyph: 'book', color: 'navy' },
  { id: 'planet', glyph: 'planet', color: 'teal' },
  { id: 'heart', glyph: 'heart', color: 'coral' },
  { id: 'bolt', glyph: 'bolt', color: 'gold' },
  { id: 'leaf', glyph: 'leaf', color: 'teal' },
  { id: 'moon', glyph: 'moon', color: 'navy' },
  { id: 'spark', glyph: 'spark', color: 'coral' },
  { id: 'smile', glyph: 'smile', color: 'gold' },
]

export const AVATAR_MAP: Record<string, Avatar> = Object.fromEntries(
  AVATARS.map((a) => [a.id, a]),
)

export const DEFAULT_AVATAR = 'smile'

export const avatarOf = (id: string | null | undefined): Avatar =>
  (id && AVATAR_MAP[id]) || AVATAR_MAP[DEFAULT_AVATAR]
