import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AgeGroup, ChildProfile, Classroom, LanguageCode } from '@/types'
import {
  type AccountSnapshot,
  EMPTY_PROGRESS,
  loadSnapshot,
  removeSnapshot,
  saveSnapshot,
} from '@/lib/sync'
import { useEntitlements } from '@/state/entitlements'
import { applyLive, snapshotLive, useAccount } from '@/state/account'

/* ============================================================
   Household & classroom profiles.

   Plan (Bill 2 · "Account Architecture"): separate the Account
   (auth, billing, permissions) from the Learner Profile (age,
   region, language, goals, progress). One family account owns
   several learner profiles; one teacher account owns several
   classes; a student belongs to a class.

   Each child is a real learner profile with its own progress,
   stored in the same sync vault as accounts (keyed `learner_<id>`),
   so switching learners loads the right world. Point the vault at
   the real backend (src/lib/sync.ts) and households sync too.

   Classrooms and student class codes are stored locally here. A real
   classroom (roster, assignments, SSO) is a backend/service concern —
   this is the client model it will plug into.
   ============================================================ */

const now = () => new Date().toISOString()
const newId = () => `p_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36)}`
const learnerKey = (id: string) => `learner_${id}`

/** MANNER-1234 — friendly, uppercase, easy to read aloud in a classroom. */
function makeJoinCode(): string {
  const n = Math.floor(1000 + Math.random() * 9000)
  return `MANNER-${n}`
}

interface ProfilesState {
  children: ChildProfile[]
  /** null = the account holder's own profile is active. */
  activeChildId: string | null
  classroom: Classroom | null
  joinedClassCode: string | null

  addChild: (input: { name: string; ageGroup: AgeGroup; avatarId: string }) => ChildProfile
  removeChild: (id: string) => void
  switchToChild: (id: string) => void
  switchToPrimary: () => void
  /** Save the live stores to whichever learner is active. */
  persistLive: () => void
  activeChild: () => ChildProfile | undefined

  createClassroom: (input: {
    name: string
    gradeAge: AgeGroup
    language: LanguageCode
    homeRegion: import('@/types').CountryCode
  }) => Classroom
  joinClass: (code: string) => void

  /** Wipe everything (account deletion / reset). */
  resetProfiles: () => void
}

export const useProfiles = create<ProfilesState>()(
  persist(
    (set, get) => ({
      children: [],
      activeChildId: null,
      classroom: null,
      joinedClassCode: null,

      addChild: ({ name, ageGroup, avatarId }) => {
        const child: ChildProfile = { id: newId(), name: name.trim(), ageGroup, avatarId }
        // Seed the child's own learner snapshot: onboarded, their age/avatar,
        // sharing the household's current home region.
        const seed: AccountSnapshot = {
          progress: {
            ...EMPTY_PROGRESS,
            onboarded: true,
            accountType: 'family',
            ageGroup,
            avatarId,
          },
          entitlements: {
            homeRegion: useEntitlements.getState().homeRegion,
            ledger: [],
          },
          updatedAt: now(),
        }
        saveSnapshot(learnerKey(child.id), seed)
        set({ children: [...get().children, child] })
        return child
      },

      removeChild: (id) => {
        removeSnapshot(learnerKey(id))
        const wasActive = get().activeChildId === id
        set({ children: get().children.filter((c) => c.id !== id) })
        if (wasActive) get().switchToPrimary()
      },

      switchToChild: (id) => {
        if (!get().children.some((c) => c.id === id)) return
        get().persistLive() // save whoever is active now
        set({ activeChildId: id })
        applyLive(loadSnapshot(learnerKey(id)))
      },

      switchToPrimary: () => {
        get().persistLive()
        set({ activeChildId: null })
        applyLive(loadSnapshot(useAccount.getState().activeId()))
      },

      persistLive: () => {
        const id = get().activeChildId
        if (id) saveSnapshot(learnerKey(id), snapshotLive())
        else useAccount.getState().persistActive()
      },

      activeChild: () => {
        const id = get().activeChildId
        return id ? get().children.find((c) => c.id === id) : undefined
      },

      createClassroom: ({ name, gradeAge, language, homeRegion }) => {
        const classroom: Classroom = {
          id: newId(),
          name: name.trim() || 'My class',
          joinCode: makeJoinCode(),
          gradeAge,
          language,
          homeRegion,
          createdAt: now(),
        }
        set({ classroom })
        return classroom
      },

      joinClass: (code) => set({ joinedClassCode: code.trim().toUpperCase() }),

      resetProfiles: () => {
        for (const c of get().children) removeSnapshot(learnerKey(c.id))
        set({ children: [], activeChildId: null, classroom: null, joinedClassCode: null })
      },
    }),
    { name: 'mannerly-profiles-v1' },
  ),
)
