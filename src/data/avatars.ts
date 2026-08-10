import type { Avatar } from '@/types'

/**
 * Friendly, illustrated stand-in avatars — no photos, ever. Kids and
 * adults alike pick one during onboarding to make a profile feel theirs.
 * Accessories (chef hat, passport backpack, graduation cap…) are earned
 * through learning later, not sold individually.
 */
export const AVATARS: Avatar[] = [
  { id: 'fox', emoji: '🦊', color: 'gold' },
  { id: 'panda', emoji: '🐼', color: 'navy' },
  { id: 'owl', emoji: '🦉', color: 'teal' },
  { id: 'cat', emoji: '🐱', color: 'gold' },
  { id: 'bear', emoji: '🐻', color: 'navy' },
  { id: 'rabbit', emoji: '🐰', color: 'teal' },
  { id: 'penguin', emoji: '🐧', color: 'navy' },
  { id: 'koala', emoji: '🐨', color: 'teal' },
  { id: 'frog', emoji: '🐸', color: 'teal' },
  { id: 'lion', emoji: '🦁', color: 'gold' },
  { id: 'unicorn', emoji: '🦄', color: 'navy' },
  { id: 'dog', emoji: '🐶', color: 'gold' },
]

export const AVATAR_MAP: Record<string, Avatar> = Object.fromEntries(
  AVATARS.map((a) => [a.id, a]),
)

export const DEFAULT_AVATAR = 'fox'

export const avatarEmoji = (id: string | null | undefined): string =>
  (id && AVATAR_MAP[id]?.emoji) || AVATAR_MAP[DEFAULT_AVATAR].emoji
