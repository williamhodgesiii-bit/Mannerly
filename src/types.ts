/* ============================================================
   Content model.
   Every cultural lesson answers three questions:
   what is expected · why · what to do when unsure.
   ============================================================ */

export type AgeGroup = 'kids' | 'tweens' | 'teens' | 'adults'

/* ============================================================
   Account & learner profile.

   An Account owns authentication, billing, and permissions.
   A Learner Profile owns age, region, language, goals, avatar,
   and progress. One individual account owns one profile; a family
   account owns several; a teacher account manages classes.
   ============================================================ */

export type AccountType = 'individual' | 'family' | 'teacher' | 'student'

/** Interface / narration language — kept separate from home region on purpose. */
export type LanguageCode = 'en' | 'es' | 'pt' | 'ja' | 'ko' | 'hi' | 'ar'

export interface Language {
  code: LanguageCode
  /** English name */
  name: string
  /** the language's own name */
  native: string
  /** a short spoken example the user can preview */
  sample: string
  /** right-to-left script */
  rtl?: boolean
}

/** What the learner wants to get better at — drives recommendations. */
export type GoalId =
  | 'everyday'
  | 'conversation'
  | 'confidence'
  | 'dining'
  | 'school'
  | 'friends'
  | 'digital'
  | 'work'
  | 'travel'
  | 'culture'
  | 'family'
  | 'kindness'

/** How often the learner wants a Daily Manner nudge. */
export type NotifyPref = 'daily' | 'weekly' | 'off'

/** Accessibility choices, offered in onboarding and Settings. */
export interface A11yPrefs {
  largeText: boolean
  reduceMotion: boolean
  highContrast: boolean
}

export const DEFAULT_A11Y: A11yPrefs = {
  largeText: false,
  reduceMotion: false,
  highContrast: false,
}

/** A child in a household account — a learner profile without its own login. */
export interface ChildProfile {
  id: string
  name: string
  ageGroup: AgeGroup
  avatarId: string
}

/** A teacher's class. The join code is what students enter. */
export interface Classroom {
  id: string
  name: string
  joinCode: string
  gradeAge: AgeGroup
  language: LanguageCode
  homeRegion: CountryCode
  createdAt: string
}

export type Formality = 'casual' | 'semiformal' | 'formal'
export type NormStrength = 'strong' | 'medium' | 'soft'

export type CountryCode = 'US' | 'GB' | 'MX' | 'BR' | 'JP' | 'KR' | 'IN' | 'AE'
export type RegionId =
  | 'north-america'
  | 'latin-america'
  | 'europe'
  | 'mena'
  | 'sub-saharan'
  | 'south-asia'
  | 'east-asia'
  | 'southeast-asia'
  | 'oceania'

/** Reusable stage backdrops (see summary: homes, classrooms, restaurants…). */
export type EnvironmentId =
  | 'home'
  | 'classroom'
  | 'restaurant'
  | 'street'
  | 'train'
  | 'airport'
  | 'office'
  | 'party'
  | 'hotel'
  | 'store'
  | 'friends-home'
  | 'worship'

/**
 * Rive state-machine inputs. The <Scene> placeholder renders a branded
 * stand-in today; when the Rive character rig is authored, these map 1:1
 * to its state machine so no lesson data has to change.
 */
export type CharacterState =
  | 'idle'
  | 'talking'
  | 'listening'
  | 'walking'
  | 'greeting'
  | 'smiling'
  | 'apologizing'
  | 'giving'
  | 'receiving'
  | 'eating'
  | 'pointing'
  | 'confused'
  | 'embarrassed'
  | 'thanking'
  | 'asking'

export type CharacterId = 'manni' | 'kaya' | 'host' | 'elder' | 'friend' | 'server'

export interface Source {
  label: string
  url: string
}

export interface SceneSpec {
  environment: EnvironmentId
  /** initial character state when the scene mounts */
  state: CharacterState
  characters: CharacterId[]
  /** short caption overlaid on the stage (kept minimal on purpose) */
  caption?: string
}

export interface Choice {
  id: string
  label: string
  emoji?: string
  correct?: boolean
  /** the consequence — what happens right after you choose */
  reaction: string
  /** character state to play on the stage for this reaction */
  reactionState?: CharacterState
}

export interface Lesson {
  id: string
  title: string
  icon: string

  /* interactive loop: watch → choose → consequence → reason → challenge */
  scene: SceneSpec
  prompt: string
  choices: Choice[]
  reason: string
  challenge: string

  /* structured cultural metadata */
  country?: CountryCode // omitted = Global Core
  situation: string
  behavior: string
  formality: Formality
  normStrength: NormStrength
  exceptions?: string
  whenUnsure: string
  reasoning: string
  ageGroups: AgeGroup[]
  sources: Source[]
  reviewer: string
  reviewedOn: string // ISO date
  xp: number
}

export type UnitColor = 'navy' | 'teal' | 'gold'

export interface Unit {
  id: string
  courseId: string
  title: string
  subtitle?: string
  color: UnitColor
  icon: string
  lessonIds: string[]
}

export interface Course {
  id: string
  kind: 'core' | 'country' | 'travel'
  title: string
  country?: CountryCode
  icon: string
  blurb: string
  unitIds: string[]
  free: boolean
}

export interface Country {
  code: CountryCode
  name: string
  flag: string
  region: RegionId
  hello: string
  blurb: string
  courseId: string
}

export interface Region {
  id: RegionId
  name: string
  emoji: string
  countries: CountryCode[]
}
