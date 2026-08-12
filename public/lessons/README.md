# Lesson clips

Real animated clips that play inside a lesson, on top of the branded
`<Scene>` placeholder. Registered in **`src/data/lessonMedia.ts`** and played
by **`src/components/LessonStage.tsx`**.

## Folder convention

```
public/lessons/<lessonId>/intro.mp4     # plays before the answer choices
public/lessons/<lessonId>/correct.mp4   # plays after a correct answer
```

`<lessonId>` is the lesson's id in `src/data/content.ts`.

## Uploaded clips → where they go

| Uploaded as (repo root) | Lesson | Move to |
|---|---|---|
| `Lesson 1 Intro 1.mp4` | Lesson 1 · "Do you wave back?" (`gc-greet`) | `public/lessons/gc-greet/intro.mp4` ✅ |
| _Lesson 1 reward clip_ | `gc-greet` | `public/lessons/gc-greet/correct.mp4` |

Drop a file at the expected path and it activates automatically — the player
falls back to the placeholder stage until it exists, so nothing breaks in the
meantime. Keep clips web-friendly (H.264 MP4) and burn the captions into the
video so they show even when it plays muted.

Lesson-number → id map for the Global Core: 1 `gc-greet` · 2 `gc-please` ·
3 `gc-thanks` · 4 `gc-introduce` · 5 `gc-sorry` · 6 `gc-listen` ·
7 `gc-interrupt` · 8 `gc-boundaries` · 9 `gc-wait-eat` · 10 `gc-chew` ·
11 `gc-phone-meal` · 12 `gc-text-tone` · 13 `gc-groupchat` · 14 `gc-videocall` ·
15 `gc-queue` · 16 `gc-seat` · 17 `gc-guest`.
