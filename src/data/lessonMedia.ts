/* ============================================================
   Lesson media — real animated clips, per lesson.

   An optional layer on top of the branded <Scene> placeholder. When a
   lesson has an entry here, the Lesson screen plays these clips instead
   of the stand-in stage:

     · intro   — the situation; plays before the answer choices appear
     · correct — the payoff; plays after the learner answers correctly

   Lessons without an entry fall back to the placeholder stage, so the
   rest of the course is unchanged. Clips live under
   public/lessons/<lessonId>/ and are referenced through BASE_URL so the
   paths hold on the web, the installed PWA, and native (Capacitor)
   builds. A file that isn't uploaded yet simply falls back — drop it in
   at the path below and it activates with no code change.
   ============================================================ */

export interface LessonMedia {
  /** situation clip; plays before the choices appear, then holds on its last frame */
  intro?: string
  /** reward clip; plays after the learner picks the correct answer */
  correct?: string
}

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export const LESSON_MEDIA: Record<string, LessonMedia> = {
  // Lesson 1 — "Do you wave back?" (street greeting)
  'gc-greet': {
    intro: asset('lessons/gc-greet/intro.mp4'),
    correct: asset('lessons/gc-greet/correct.mp4'), // upload to activate the reward clip
  },
}

export const lessonMedia = (id: string): LessonMedia | undefined => LESSON_MEDIA[id]
