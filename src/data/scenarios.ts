import type { AgeGroup } from '@/types'

/**
 * One tiny interactive scenario shown during onboarding, before we ask
 * for an account. It shows the product instead of describing it, and
 * doubles as a light first read on where the learner is starting from.
 * Content shifts by age so a 6-year-old and a 36-year-old don't get the
 * same words.
 */
export interface StarterChoice {
  id: string
  label: string
  emoji: string
  correct?: boolean
  reaction: string
}

export interface StarterScenario {
  prompt: string
  choices: StarterChoice[]
}

const SCENARIOS: Record<AgeGroup, StarterScenario> = {
  kids: {
    prompt: 'Someone gives you a birthday present. What do you do?',
    choices: [
      { id: 'a', label: 'Say “thank you!”', emoji: '🎁', correct: true, reaction: 'They feel great — and so do you.' },
      { id: 'b', label: 'Rip it open, say nothing', emoji: '🙈', reaction: 'A quick “thank you” makes it even better.' },
      { id: 'c', label: 'Ask for a different one', emoji: '😬', reaction: 'Ouch — that stings a little. Thanks first.' },
    ],
  },
  tweens: {
    prompt: 'A new kid just joined your class and is sitting alone. You…',
    choices: [
      { id: 'a', label: 'Say hi and sit with them', emoji: '🙋', correct: true, reaction: 'That’s how a friendship starts.' },
      { id: 'b', label: 'Stay with your friends', emoji: '👀', reaction: 'Understandable — but a small hello goes a long way.' },
      { id: 'c', label: 'Wait for them to talk first', emoji: '⏳', reaction: 'They might be nervous too. Go first.' },
    ],
  },
  teens: {
    prompt: 'A friend shares something personal in the group chat by mistake. You…',
    choices: [
      { id: 'a', label: 'DM them privately', emoji: '💬', correct: true, reaction: 'Quiet and kind — you protected them.' },
      { id: 'b', label: 'Screenshot it', emoji: '📸', reaction: 'That can really hurt. Keep it between you two.' },
      { id: 'c', label: 'React with a laughing emoji', emoji: '😂', reaction: 'Feels harmless, but it can land badly.' },
    ],
  },
  adults: {
    prompt: 'You’re introduced to someone at a work event. What do you do first?',
    choices: [
      { id: 'a', label: 'Smile, say your name, listen', emoji: '🤝', correct: true, reaction: 'Warm and easy — you set the tone.' },
      { id: 'b', label: 'Launch into your pitch', emoji: '📊', reaction: 'Slow down — connect before you sell.' },
      { id: 'c', label: 'Check your phone first', emoji: '📱', reaction: 'A small thing they’ll remember. Look up first.' },
    ],
  },
}

export const starterFor = (age: AgeGroup | null): StarterScenario =>
  SCENARIOS[age ?? 'adults']
