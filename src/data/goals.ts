import type { AgeGroup, Goal, GoalId } from '@/types'

/**
 * Learning goals shown as tappable cards. Picking a few personalizes the
 * home screen, recommendations, and daily scenarios — the learner is
 * building their own version of Mannerly, not filling out a form.
 */
export const GOALS: Goal[] = [
  { id: 'everyday', label: 'Everyday manners', emoji: '🤝' },
  { id: 'conversation', label: 'Conversation', emoji: '💬' },
  { id: 'confidence', label: 'Confidence', emoji: '✨' },
  { id: 'dining', label: 'Dining', emoji: '🍽️' },
  { id: 'school', label: 'School', emoji: '🎒' },
  { id: 'friends', label: 'Friends', emoji: '🧑‍🤝‍🧑' },
  { id: 'digital', label: 'Digital life', emoji: '📱' },
  { id: 'work', label: 'Work', emoji: '💼' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'culture', label: 'Culture', emoji: '🌍' },
  { id: 'family', label: 'Family', emoji: '🏡' },
  { id: 'kindness', label: 'Respect & kindness', emoji: '💛' },
]

export const GOAL_MAP: Record<GoalId, Goal> = Object.fromEntries(
  GOALS.map((g) => [g.id, g]),
) as Record<GoalId, Goal>

/** Sensible defaults highlighted first, tuned to the age group. */
export function suggestedGoals(age: AgeGroup | null): GoalId[] {
  switch (age) {
    case 'kids':
      return ['everyday', 'kindness', 'friends', 'family']
    case 'tweens':
      return ['friends', 'school', 'conversation', 'digital']
    case 'teens':
      return ['confidence', 'digital', 'friends', 'work']
    case 'adults':
      return ['work', 'dining', 'travel', 'conversation']
    default:
      return ['everyday', 'conversation', 'confidence']
  }
}
