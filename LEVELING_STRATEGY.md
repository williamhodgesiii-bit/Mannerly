# Mannerly — Leveling-Up Strategy (Make It Addictive)

> Companion to `To Do for Bill` (store/launch) and `To Do for Bill 2` (onboarding).
> Those cover **getting Mannerly shipped**. This covers **making people come back** —
> the game, the stakes, the daily hook — **without touching the backend, content model,
> or entitlement architecture that already works.**

---

## The honest read

The build is further along than it feels. The architecture is genuinely good:

- Fully typed content (`src/types.ts`) — lessons are data, not code.
- A real entitlements ledger (`src/state/entitlements.ts`) gating free / Manners+ / Family / School / Travel Packs.
- Supabase auth + household/classroom profiles + a sync **seam** (`src/lib/sync.ts`) ready to go cross-device.
- A clean 5-store Zustand layer and a tasteful motion system.

What makes it *feel* like an initial build is the **engagement loop**, not the plumbing.

**Today's loop:** open app → tap the START node → play one lesson (choose → reason → challenge)
→ confetti + fixed XP → streak ticks up → close app. Nothing is at risk, nothing is a surprise,
and there is no specific reason to open it *tomorrow* rather than next week.

Every mechanic below plugs into the **existing stores and the `ProgressSnapshot` sync seam** —
extend, don't rebuild.

### What already exists (keep it)

| Mechanic | Where | Status |
|---|---|---|
| XP (10–15/lesson, half on repeat) | `store.ts › completeLesson` | ✅ keep |
| Day streak | `store.ts › completeLesson` | ✅ keep — but add stakes |
| Charge/energy (5 bolts, 30-min regen) | `store.ts › regen/spendCharge` | ✅ great pattern to reuse |
| Levels (Beginner→Ambassador) | `store.ts › LEVELS/levelFor` | ✅ keep — add reward moments |
| Passport stamps | `Passport.tsx` | ✅ keep |
| Achievements (8, hardcoded) | `Passport.tsx` | ⚠️ make them data + reward them |
| Lesson reward overlay | `Lesson.tsx` | ⚠️ the moment to make BIG |

### The gaps that kill retention

1. **Streaks can't be lost-and-saved.** No freeze, no repair, no milestone celebration → no loss aversion, which is the #1 retention lever in this category.
2. **No daily goal.** No reason today is different from any other day.
3. **`notify` is a dead enum.** It's stored in onboarding and never fires a single notification. This is the single biggest lever sitting unused.
4. **Zero reward variability.** XP is fixed and predictable → no dopamine spike.
5. **No spaced review / mastery.** A lesson is "done" forever after one pass. Your own Summary calls for spaced review and mastery levels; neither is built.
6. **No social.** No leagues, no leaderboard, no friend/family competition.
7. **The signature hook is untracked.** Each lesson ends with a real-world *challenge* — the thing Mannerly can do that Duolingo *can't* — and it's shown once, then forgotten. Never confirmed, never rewarded.
8. **Content is ~30% of MVP.** 42 lessons (17 Global Core + ~3 per country). Summary targets ~140. Mechanics need fuel.

---

## Design principles (so we don't cargo-cult Duolingo)

- **Stakes without anxiety.** This is a manners app used by kids. *Reward mastery; don't punish mistakes.* No hearts-that-lock-you-out. Wrong answers stay free to retry — we add upside for doing well (perfect runs, streaks, speed), not downside for getting it wrong.
- **Reward real life, not tapping.** Mannerly's unique moat is the **real-world Mission**. Lean into it as a first-class, trackable, rewarded mechanic. Nobody else in the category can do this.
- **Preserve the architecture.** Everything new lives in the existing Zustand stores, serializes through `ProgressSnapshot` (with `?? default` fallbacks exactly like the current `hydrate`), gates through the entitlements layer, and keeps content as typed data. **No schema rewrite, no store rewrite.**
- **Every "up" is data-driven.** Achievements, quests, cosmetics, and mastery become typed content in `src/data/` so Bill can add them without a code change — same philosophy as lessons.

---

## The roadmap, in priority tiers

Ordered by **retention ROI ÷ effort**. Tier 0 is the machine that makes people return.
Effort: **S** ≈ ½–1 day · **M** ≈ 2–4 days · **L** ≈ 1–2 weeks.

### ⭐ Tier 0 — The Daily Engine (the return machine)

*The point of this tier: give the user a reason to open the app **tomorrow**.*

- [ ] **Daily Goal + progress ring.** Pick a target (e.g. 20 XP / "1 lesson") in onboarding or Profile. Show a fillable ring in the `Header` next to streak, and a "2 XP to your goal!" nudge on `Home`. Fire a celebration the moment it's hit. **Why:** converts an open-ended app into a daily commitment. **Where:** `store.ts` (add `dailyGoal`, `xpTodayByDay`), `Header.tsx`, `Home.tsx`. **Effort: M**
- [ ] **Streak stakes — Freeze, Repair, Milestones.**
  - *Streak Freeze*: an item that auto-saves a missed day. Earn one every N days; hold max 2. Reuse the charge/regen pattern — this is the same "time-gated economy" you already wrote.
  - *Streak Repair*: "Oops, you lost your 12-day streak — get it back?" (watch/earn/Manners+). Loss-aversion is the strongest pull in the category.
  - *Milestones*: full-screen moment at 3 / 7 / 14 / 30 / 100 days with a shareable card.
  **Where:** `store.ts` (streak logic already lives in `completeLesson`), new `StreakSheet` in `Sheets.tsx`. **Effort: M**
- [ ] **Real push notifications** (turn the dead `notify` pref on). Add `@capacitor/local-notifications`: a daily "Daily Manner" at the user's chosen time, and a **streak-save** warning in the evening if today's goal isn't met. **Why:** this is *the* retention lever and it's currently 0% built. **Where:** new `src/lib/notify.ts`, schedule from `App.tsx` on the `notify`/goal state. **Effort: M** (web = best-effort; the payoff is native via Capacitor).

> Tier 0 alone typically moves D1/D7 retention more than everything below it combined. Do this first.

### ⭐ Tier 1 — Reward Psychology (make each lesson *pop*)

*The point: make finishing a lesson feel like a slot-machine pull, not a form submit.*

- [ ] **Variable rewards.** Randomize the reward tail: base XP + occasional 2× "Manner Bonus," a surprise gem drop, or a "perfect streak" bonus. **Where:** `store.ts › completeLesson` return value; render in `Lesson.tsx` reward overlay. **Effort: S**
- [ ] **Gems currency + a store.** A spendable currency (distinct from XP, which should stay a pure progress score). Earn from lessons/quests/streaks; spend on Streak Freezes, charge refills, and cosmetics. Gives XP a *sink* and a reason to grind. **Where:** `store.ts` (`gems`), extend `ProgressSnapshot`, a `StoreSheet`. **Effort: M**
- [ ] **Level-Up & Achievement moments.** Right now crossing Beginner→Comfortable is silent. Add a full-screen level-up celebration and an "Achievement unlocked" toast, reusing `Confetti` + the reward overlay. **Where:** detect level change in `Lesson.tsx` after `completeLesson`. **Effort: S**
- [ ] **Combos / perfect-run feedback inside a lesson.** "First try! +5" micro-rewards during the loop — upside for mastery, no downside for retries (on-brand). **Where:** `Lesson.tsx`. **Effort: S**
- [ ] **Loot chests at unit completion.** Finishing a unit opens a chest (gems + a cosmetic). **Where:** `Home.tsx` unit-band completion. **Effort: S–M**

### ⭐ Tier 2 — Depth & Mastery (make it *last*)

*The point: 42 one-and-done lessons run dry fast. Turn each lesson into a well.*

- [ ] **Spaced review / "strengthen."** Completed lessons decay to a "cracked" state over time and surface in a **Review** queue for bonus XP. Directly fulfills the Summary's "spaced review / review sessions for missed scenarios." **Where:** `store.ts` (track per-lesson `lastReviewed`/`strength`), new Review entry point on `Home`. **Effort: M**
- [ ] **Mastery levels per lesson (crown-style).** A lesson can be leveled 1→3 (or Bronze→Gold), not just done/undone. Multiplies content value with zero new lessons. **Where:** `completed: Record<string, true>` → `Record<string, {level,strength,lastReviewed}>` (migrate in `hydrate` with a fallback). **Effort: M**
- [ ] **Unit checkpoints / "Manner Boss."** A mixed-review challenge to *unlock* the next unit — a spike of difficulty and reward that makes the path feel earned. **Where:** `content.ts` (checkpoint as a Unit type), `Home.tsx`. **Effort: M**

### Tier 3 — Social & Stakes (competition)

*The point: other people are the most addictive mechanic there is.*

- [ ] **Leagues / weekly leaderboard.** Bucket users into weekly XP leagues (Duolingo's biggest recent retention win). Start with **Family** and **Classroom** leaderboards — you *already have* those rosters in `useProfiles`, so this ships without new social infra. **Where:** `profiles.ts`, new `Leagues` screen. **Effort: M** (local rosters) / **L** (global, needs backend).
- [ ] **Family & Friend Quests.** Shared weekly goals ("as a family, do 20 lessons"). Summary explicitly calls for family challenges. **Where:** `profiles.ts`, quest data in `src/data/`. **Effort: M**
- [ ] **Shareable cards.** Streak milestones, passport completion, league wins → an image to share. Free acquisition loop. **Effort: S–M**

### Tier 4 — Identity & Collection (long-term goals)

*The point: give XP/gems something to *become* — a reason to keep earning after Level 4.*

- [ ] **Unlockable avatars, themes & titles.** Avatars are *picked* today, never *earned*. Make most of them unlockables (XP/gems/achievements). Add title flairs ("Japan Ambassador"). The theme scaffolding already exists (per-country `theme`). **Where:** `avatars.ts` gains unlock conditions; `store.ts` tracks unlocked set. **Effort: M**
- [ ] **Mascot customization.** Let users dress/color Manni & Kaya with earned items — a low-effort collection sink (the mascot rig is already parameterized in `Mascot.tsx`). **Effort: M**
- [ ] **🎯 Real-World Missions (the signature mechanic).** Elevate each lesson's `challenge` into a trackable Mission: "Mark it done" → bonus XP + a Mission streak, with an optional parent/teacher confirm. This is the thing Mannerly can do that *no competitor can* — reward actual behavior, not tapping. Make it a hero feature, not a footnote. **Where:** `store.ts` (`missionsDone`), a Missions tab or Home card, ties into Family/Classroom. **Effort: M**

### Tier 5 — Content Scale (the fuel)

*Mechanics are the engine; content is the gas. Even perfect mechanics stall at 42 lessons.*

- [ ] **Grow Global Core toward ~60 lessons** across the categories already named in the Summary (conflict, sportsmanship, hygiene, accessibility, neighbors, gaming, workplace…). **Effort: L** (authoring, not engineering).
- [ ] **Deepen country packs from ~3 → ~10 lessons** each (Summary's MVP shape). **Effort: L**
- [ ] **Author-time is already trivial** — append a `Lesson` to `content.ts` and list its id in a `Unit`. The bottleneck is sourced writing, not code. Consider the lightweight authoring path from the Summary next.

---

## Architectural guardrails (how we "preserve the backend/organization")

Do all of the above **inside the existing seams**:

1. **State** → extend the current Zustand stores. New fields: `dailyGoal`, `xpByDay`, `gems`, `freezes`, `unlocked[]`, `missionsDone`, and `completed` upgraded from `Record<string,true>` to a per-lesson mastery record.
2. **Sync** → add those fields to `ProgressSnapshot` in `src/lib/sync.ts` and hydrate them with `?? default` — exactly the backward-compatible pattern `store.ts › hydrate` already uses. Old snapshots keep loading. **No migration scripts.**
3. **Entitlements** → gate premium cosmetics, extra freezes, and global leagues through the existing permission ledger. Manners+ becomes *more* attractive (unlimited charge **＋** exclusive cosmetics **＋** streak protection) → better conversion, same code path.
4. **Content-as-data** → achievements, quests, cosmetics, and checkpoints become typed arrays in `src/data/` (like lessons), so Bill adds them without a deploy.
5. **The Supabase seam** → when leagues/cross-device land, it's one `pull`/`push` implementation in `sync.ts`. Nothing above forces it early; everything above works locally first.

**Net:** zero rewrites. The backend, entitlements, auth, profiles, and content model are untouched — we're bolting a game engine onto rails that already exist.

---

## Sprint 1 — the highest-ROI two weeks

If we do nothing else first, do these four. They are the return machine + the moat, and they're all Tier 0/1 effort:

1. **Real push notifications** — turn the dead `notify` pref into daily + streak-save reminders. *(biggest lever, currently 0% built)*
2. **Streak Freeze + milestones** — add loss-aversion and celebration to the streak. *(reuses the charge/regen pattern you already wrote)*
3. **Daily Goal ring** — make *today* matter. *(Header + Home)*
4. **Real-World Mission tracking** — make the `challenge` a rewarded, confirmable action. *(the differentiator — ship it as a hero, not a footnote)*

Every one of these lands in `store.ts` + one screen + the `ProgressSnapshot`, and every one is fully backward-compatible with existing saves and the entitlement layer.

---

<div align="center"><sub>Mannerly · from a solid build to a daily habit</sub></div>
