import type { AgeGroup, GoalId } from '@/types'
import type { IconName } from '@/components/Icon'

/**
 * Learning goals shown as tappable cards. Picking a few personalizes the
 * home screen, recommendations, and daily scenarios — the learner is
 * building their own version of Mannerly, not filling out a form.
 */
export interface Goal {
  id: GoalId
  label: string
  icon: IconName
}

export const GOALS: Goal[] = [
  { id: 'everyday', label: 'Everyday manners', icon: 'check-badge' },
  { id: 'conversation', label: 'Conversation', icon: 'chat' },
  { id: 'confidence', label: 'Confidence', icon: 'spark' },
  { id: 'dining', label: 'Dining', icon: 'utensils' },
  { id: 'school', label: 'School', icon: 'pencil' },
  { id: 'friends', label: 'Friends', icon: 'people' },
  { id: 'digital', label: 'Digital life', icon: 'phone' },
  { id: 'work', label: 'Work', icon: 'briefcase' },
  { id: 'travel', label: 'Travel', icon: 'plane' },
  { id: 'culture', label: 'Culture', icon: 'globe' },
  { id: 'family', label: 'Family', icon: 'house' },
  { id: 'kindness', label: 'Respect & kindness', icon: 'heart' },
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
