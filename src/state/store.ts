import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  A11yPrefs,
  AccountType,
  AgeGroup,
  CountryCode,
  GoalId,
  LanguageCode,
  NotifyPref,
} from '@/types'
import { DEFAULT_A11Y } from '@/types'
import { LESSON_MAP } from '@/data/content'
import { EMPTY_PROGRESS, type ProgressSnapshot } from '@/lib/sync'

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10)
}
function dayDiff(a: string, b: string): number {
  const ms = new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()
  return Math.round(ms / 86_400_000)
}

/* ---------- charge (energy) ----------
   A daily limit that keeps sessions bite-size (like Duolingo energy).
   One lesson costs one bolt; a bolt refills every REGEN_MS. Manners+
   (and Family / School) make it unlimited — that check lives in the UI
   via held permissions, so this store stays pure. */
export const CHARGE_MAX = 5
export const REGEN_MS = 30 * 60 * 1000 // 30 min per bolt

function regen(charge: number, chargeAt: number, now = Date.now()) {
  if (charge >= CHARGE_MAX || !chargeAt) return { charge: Math.min(CHARGE_MAX, charge || CHARGE_MAX), chargeAt: 0 }
  const gained = Math.floor((now - chargeAt) / REGEN_MS)
  if (gained <= 0) return { charge, chargeAt }
  const next = Math.min(CHARGE_MAX, charge + gained)
  return { charge: next, chargeAt: next >= CHARGE_MAX ? 0 : chargeAt + gained * REGEN_MS }
}

/** What onboarding collects about the learner, saved in one shot. */
export interface LearnerProfileInit {
  accountType: AccountType
  ageGroup: AgeGroup
  language: LanguageCode
  goals: GoalId[]
  avatarId: string
  notify: NotifyPref
  a11y: A11yPrefs
}

interface ProgressState {
  onboarded: boolean
  accountType: AccountType | null
  ageGroup: AgeGroup | null
  language: LanguageCode
  goals: GoalId[]
  avatarId: string | null
  notify: NotifyPref
  a11y: A11yPrefs
  xp: number
  streak: number
  lastActive: string | null
  completed: Record<string, true>

  /** which world (course) the Learn tab shows */
  activeCourseId: string
  /** current energy balance + when a bolt was last spent (0 = full) */
  charge: number
  chargeAt: number

  setActiveCourse: (id: string) => void
  currentCharge: () => number
  msToNextCharge: () => number | null
  spendCharge: () => boolean
  refillCharge: () => void

  setAgeGroup: (a: AgeGroup) => void
  /** Persist the full onboarding profile in one step (also marks onboarded). */
  completeOnboarding: (p: LearnerProfileInit) => void
  setLanguage: (l: LanguageCode) => void
  setGoals: (g: GoalId[]) => void
  setAvatar: (id: string) => void
  setNotify: (n: NotifyPref) => void
  setA11y: (a: A11yPrefs) => void
  completeLesson: (lessonId: string) => { xpGained: number; streak: number }
  isCompleted: (lessonId: string) => boolean
  stampedCountries: () => CountryCode[]
  reset: () => void

  /** Snapshot for the account sync layer. */
  exportSnapshot: () => ProgressSnapshot
  /** Replace all progress with an account's snapshot (on sign-in / sign-out). */
  hydrate: (s: ProgressSnapshot) => void
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      onboarded: false,
      accountType: null,
      ageGroup: null,
      language: 'en',
      goals: [],
      avatarId: null,
      notify: 'off',
      a11y: DEFAULT_A11Y,
      xp: 0,
      streak: 0,
      lastActive: null,
      completed: {},
      activeCourseId: 'core',
      charge: CHARGE_MAX,
      chargeAt: 0,

      setActiveCourse: (id) => set({ activeCourseId: id }),
      currentCharge: () => {
        const s = get()
        return regen(s.charge, s.chargeAt).charge
      },
      msToNextCharge: () => {
        const s = get()
        const r = regen(s.charge, s.chargeAt)
        if (r.charge >= CHARGE_MAX || !r.chargeAt) return null
        return REGEN_MS - ((Date.now() - r.chargeAt) % REGEN_MS)
      },
      spendCharge: () => {
        const s = get()
        const r = regen(s.charge, s.chargeAt)
        if (r.charge <= 0) { set({ charge: 0, chargeAt: r.chargeAt || Date.now() }); return false }
        const wasFull = r.charge >= CHARGE_MAX
        set({ charge: r.charge - 1, chargeAt: wasFull ? Date.now() : r.chargeAt })
        return true
      },
      refillCharge: () => set({ charge: CHARGE_MAX, chargeAt: 0 }),

      setAgeGroup: (a) => set({ ageGroup: a, onboarded: true }),

      completeOnboarding: (p) =>
        set({
          accountType: p.accountType,
          ageGroup: p.ageGroup,
          language: p.language,
          goals: p.goals,
          avatarId: p.avatarId,
          notify: p.notify,
          a11y: p.a11y,
          onboarded: true,
        }),

      setLanguage: (l) => set({ language: l }),
      setGoals: (g) => set({ goals: g }),
      setAvatar: (id) => set({ avatarId: id }),
      setNotify: (n) => set({ notify: n }),
      setA11y: (a) => set({ a11y: a }),

      completeLesson: (lessonId) => {
        const lesson = LESSON_MAP[lessonId]
        const xpGained = lesson?.xp ?? 10
        const state = get()
        const today = todayKey()

        // streak logic
        let streak = state.streak
        if (state.lastActive == null) {
          streak = 1
        } else {
          const diff = dayDiff(state.lastActive, today)
          if (diff === 0) streak = Math.max(1, streak)
          else if (diff === 1) streak = streak + 1
          else streak = 1
        }

        const alreadyDone = !!state.completed[lessonId]
        set({
          completed: { ...state.completed, [lessonId]: true },
          xp: state.xp + (alreadyDone ? Math.round(xpGained / 2) : xpGained),
          streak,
          lastActive: today,
        })
        return { xpGained: alreadyDone ? Math.round(xpGained / 2) : xpGained, streak }
      },

      isCompleted: (lessonId) => !!get().completed[lessonId],

      stampedCountries: () => {
        const done = get().completed
        const set2 = new Set<CountryCode>()
        for (const id of Object.keys(done)) {
          const c = LESSON_MAP[id]?.country
          if (c) set2.add(c)
        }
        return [...set2]
      },

      reset: () => set({ ...EMPTY_PROGRESS }),

      exportSnapshot: () => {
        const s = get()
        return {
          onboarded: s.onboarded,
          accountType: s.accountType,
          ageGroup: s.ageGroup,
          language: s.language,
          goals: s.goals,
          avatarId: s.avatarId,
          notify: s.notify,
          a11y: s.a11y,
          xp: s.xp,
          streak: s.streak,
          lastActive: s.lastActive,
          completed: s.completed,
          activeCourseId: s.activeCourseId,
          charge: s.charge,
          chargeAt: s.chargeAt,
        }
      },

      hydrate: (s) =>
        set({
          onboarded: s.onboarded,
          accountType: s.accountType ?? null,
          ageGroup: s.ageGroup,
          language: s.language ?? 'en',
          goals: s.goals ?? [],
          avatarId: s.avatarId ?? null,
          notify: s.notify ?? 'off',
          a11y: s.a11y ?? DEFAULT_A11Y,
          xp: s.xp,
          streak: s.streak,
          lastActive: s.lastActive,
          completed: s.completed,
          activeCourseId: s.activeCourseId ?? 'core',
          charge: s.charge ?? CHARGE_MAX,
          chargeAt: s.chargeAt ?? 0,
        }),
    }),
    { name: 'mannerly-progress-v1' },
  ),
)

/** Level ladder from the summary: Beginner → Comfortable → Confident → Ambassador. */
export const LEVELS = [
  { name: 'Beginner', min: 0, icon: 'sprout' },
  { name: 'Comfortable', min: 60, icon: 'leaf' },
  { name: 'Confident', min: 160, icon: 'star' },
  { name: 'Ambassador', min: 320, icon: 'trophy' },
] as const

export function levelFor(xp: number) {
  let idx = 0
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].min) idx = i
  const current = LEVELS[idx]
  const next = LEVELS[idx + 1] ?? null
  const span = next ? next.min - current.min : 1
  const into = xp - current.min
  const pct = next ? Math.min(100, Math.round((into / span) * 100)) : 100
  return { current, next, pct, idx }
}
