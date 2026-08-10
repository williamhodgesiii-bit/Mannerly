<div align="center">
  <img src="public/brand/wordmark-stacked.png" alt="Mannerly" width="220" />
  <h3>Duolingo for manners, etiquette & cultural fluency.</h3>
  <p><em>Short, interactive lessons that teach confidence in every culture.</em></p>
</div>

---

Mannerly turns everyday social skills — greetings, listening, table manners,
digital etiquette, and country-specific customs — into a playful, Duolingo-style
learning path. One codebase ships to **the web, the Apple App Store, and Google
Play**.

## ✨ What's inside

- **A winding learning path** (Global Manners Core) with unit bands, a live
  “START” node, streaks, XP, and levels (Beginner → Comfortable → Confident → Ambassador).
- **The interactive lesson loop** from the product plan:
  *watch a situation → choose → see the consequence → learn the reason →
  retry → get a real-world challenge → reward.*
- **8 country packs** — Japan, South Korea, UAE, India, Mexico, Brazil, USA, UK —
  each lesson researched and **sourced**, with the full cultural schema
  (what’s expected · why · what to do when unsure · exceptions · formality ·
  norm strength · reviewer · review date).
- **Manners Passport** with a stamp for every country you learn.
- **Age-adaptive** onboarding (Kids · Tweens · Teens · Adults).
- **Freemium** structure (free Global Core + first lesson of each pack; Manners+ upsell).
- **Installable PWA**, offline-ready, Capacitor-ready for native stores.

## 🎨 Brand

Pulled straight from the logo:

| Token | Hex | Use |
|------|------|-----|
| Navy | `#082F71` | Primary, text, actions |
| Teal | `#52B7A4` | Secondary, success, progress |
| Gold | `#FEB20B` | Reward, streaks, accents |

Rounded, symmetrical, minimal-word UI with spring transitions and tactile
“pressable” buttons — designed to feel like an app, not a website.

## 🚀 Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build → dist/
npm run preview    # serve the production build
```

## 📱 Ship to the App Store & Google Play (Capacitor)

The web build is wrapped natively with [Capacitor](https://capacitorjs.com/).
Native shells are generated locally (they need Xcode / Android Studio):

```bash
npm run build
npm run cap:ios       # adds + opens the iOS project in Xcode
npm run cap:android   # adds + opens the Android project in Android Studio
```

Config lives in `capacitor.config.ts` (`appId: com.mannerly.app`). The `ios/`
and `android/` folders are generated and git-ignored.

> The plan’s longer-term target is a React Native (Expo) app sharing this
> TypeScript content layer; the Capacitor wrapper gets Mannerly into both stores
> today from the exact code you can already see running.

## 🧠 Content model (structured data)

All lessons are typed data in `src/data/` — no code changes needed to add
content. Each `Lesson` (see `src/types.ts`) carries both the **interactive loop**
(scene, prompt, choices, reason, challenge) and the **cultural record**
(country, situation, behavior, formality, norm strength, exceptions,
`whenUnsure`, reasoning, age groups, **sources**, reviewer, review date).

To add a lesson: append a `Lesson` to the right array in
`src/data/content.ts` and list its id in a `Unit`. To add a country: add it to
`src/data/countries.ts` and give it a course + unit. This mirrors the plan’s
future lesson-authoring CMS.

## 🎬 Animation architecture (honest placeholders)

Per the production plan, the heavy character/scene animation belongs in **Rive**
(interactive state machines), **Lottie** (badges, confetti, checkmarks), and
offline AI video for cinematic scenes. Those assets are **not fabricated here.**

Instead:

- `src/components/Scene.tsx` is the **animation slot**. Its props
  (`environment`, `state`, `characters`) already mirror a Rive state machine
  1-to-1, so the real rig drops in later with **zero lesson-data changes**.
  Until then it renders a tasteful, reactive branded stage.
- `Mascot.tsx`, page transitions, confetti, progress fills, and the pressable
  buttons are real, lightweight motion (Framer Motion / CSS) — the parts that
  can be done well now without faking the character system.

## 🗂️ Structure

```
src/
  data/         # countries, regions, courses, units, lessons (typed content)
  state/        # zustand progress store (xp, streak, completion, passport)
  components/   # Scene (Rive slot), Mascot, TabBar, Header, Confetti
  screens/      # Onboarding, Home path, Lesson loop, Explore, CourseDetail, Passport, Profile
  theme/        # component styles
  types.ts      # the content schema
```

**Tech:** React + TypeScript · Vite · Framer Motion · Zustand · vite-plugin-pwa · Capacitor.

## 📚 Research & accuracy

Country lessons were researched from public etiquette references (e.g. JRPass &
Go!Go!Nihon for Japan, the SBS Cultural Atlas for India, Debrett’s / Emily Post
for UK & US, and others cited in-app under each lesson’s **Sources**). The app
deliberately teaches judgment — *what’s expected, why, and what to do when
unsure* — rather than presenting any custom as universal.

---

<div align="center"><sub>Mannerly · confidence in every culture</sub></div>
