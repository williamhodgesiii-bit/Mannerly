<div align="center">
  <img src="public/brand/wordmark-stacked.png" alt="Mannerly" width="200" />
  <h1>Global Core — Character & Animation Bible</h1>
  <p><em>The recurring cast, the master image-generation prompts, and Seedance 2.5 video + voice prompts for every lesson in the free Global Manners Core.</em></p>
</div>

---

## 0 · How to use this document

This is the single source of truth for producing the animated intro clips and reward clips for the **Global Manners Core** (17 free lessons). The pipeline the plan calls for is:

> **Design a locked character sheet → generate a still "hero frame" for each scene → feed that frame into Seedance 2.5 (image-to-video) for a subtle 5–10 s clip → overlay the question/UI separately → attach a localizable voice track.**

Read the sections in order the first time. After that, jump straight to a lesson in **§7** — each lesson block is self-contained except for two global blocks you paste into every generation:

- **`[STYLE]`** — the look, render, palette, camera, and safe-zones (§3.2)
- **`[NEG]`** — the negative prompt (§3.3)

Every video prompt below ends with `+ [STYLE] + [NEG]`, meaning: append those two blocks verbatim. This keeps 40+ clips visually identical without repeating 300 words each time.

> **Design pivot recorded:** the cast are **real, human, animated characters** (elevated stylized 3D, adult-appropriate). They are **not** derived from the logo's abstract two-figure mark. The logo stays the logo; these are the people who live inside the app.

---

## 1 · The Cast — "The Mannerly Five"

Five recurring humans carry the entire app. They read as a warm, modern, mixed friend-group in a sunlit city — believable enough for adults, friendly enough for kids. Each **owns one signature color** (pulled from or harmonized with the brand palette) so a viewer knows who's who in a fraction of a second — the core requirement for AI-video consistency.

| # | Name | Color | Hex | Pronouns | Age read | Archetype (what they do in a lesson) |
|---|------|-------|-----|----------|----------|--------------------------------------|
| 1 | **Manni** | Navy / Deep Blue | `#082F71` | he/him | ~25 | **The Learner** — our POV. He faces the social choice. |
| 2 | **Kaya** | Teal / Mint | `#52B7A4` | she/her | ~26 | **The Connector** — the warm best friend who models the right move. |
| 3 | **Remy** | Violet / Plum | `#7B61C9` | they/them | ~24 | **The Spark** — the funny, expressive heart; barista/server energy. |
| 4 | **Nia** | Coral / Persimmon | `#FF6F5B` | she/her | ~30 | **The Host** — calm, kind, reassuring; the one who welcomes & steadies. |
| 5 | **Baba Sol** | Gold / Sunflower | `#FEB20B` | he/him | ~68 | **The Sage** — wise elder, the "why it matters" mentor **and the voice of the narrator**. |

**Spread check** — colors: full harmonious spectrum (navy · teal · violet · coral · gold). Genders: two men (one young, one elder), two women, one non-binary. Ages: young-adult core + an elder, both able to "flex" younger for Kids-age art variants. Look: globally diverse, specified below without leaning on stereotype.

### 1.1 · Bios & look anchors

The **bold** items are the *consistency anchors* — the specific, unchanging details you keep identical in every single frame so Seedance never "forgets" who a character is.

**MANNI — the Learner (Navy `#082F71`)**
Warm, curious, earnest, a little eager; the everyman the user projects onto. Warm medium-brown skin, **short black textured curls / low fade**, expressive dark-brown eyes, easy dimpled smile. Wardrobe: **navy zip-up hoodie over a white tee**, dark jeans, white sneakers, and a **tiny gold enamel "check" pin on the chest** (his one metallic accent). Body language: open, leaning-in, hopeful.

**KAYA — the Connector (Teal `#52B7A4`)**
Bright, socially fluent, encouraging, quick to laugh. Warm tan-brown skin, **dark wavy hair in a high bun with a few loose front strands**, expressive brows, **gold hoop earrings**. Wardrobe: **teal cropped denim jacket over a mint crew tee**, high-waist jeans. Body language: relaxed, gestures while she talks, radiates "you've got this."

**REMY — the Spark (Violet `#7B61C9`)**
Playful, expressive, great comic timing; the emotional weather-vane of a scene. Light skin with **freckles across the nose**, **ginger-blond textured undercut**, **round translucent glasses**. Wardrobe: **oversized plum/violet cardigan over a white tee**, rolled cuffs, canvas high-tops, a couple of thin **gold rings**. Body language: big, springy, elastic reactions.

**NIA — the Host (Coral `#FF6F5B`)**
Calm, grounded, genuinely kind — the person who makes a room feel safe. Warm deep-brown skin, **voluminous natural curls** (optionally a **coral headwrap** in home/host scenes), gentle steady smile, **small gold stud earrings**. Wardrobe: **soft coral wrap top / coral blazer** over cream, tailored trousers. Body language: still, welcoming, unhurried; an open palm "come in."

**BABA SOL — the Sage & Narrator (Gold `#FEB20B`)**
Warm, twinkly, wise, unhurried — the grandfather everyone wishes they had, and the **narrating voice of Mannerly**. Deep-brown skin with **kind laugh-lines**, **close-cropped silver-white hair and a neat white beard**, **round tortoise-shell glasses**. Wardrobe: **mustard-gold knit cardigan/vest** over a soft blue shirt, a **small gold "check" lapel pin** echoing Manni's. Body language: gentle nods, hands that gesture like he's telling a fireside story.

### 1.2 · Voice profiles (for TTS / casting)

Deliver every line as a **separate audio stem** — never bake voice into the video (localization swaps the audio, not the clip). Suggested engine: **ElevenLabs Multilingual v2** (or equivalent) with a fixed voice per character across all 7 languages (`en, es, pt, ja, ko, hi, ar`).

| Character | Voice character | Timbre / pace | Direction words |
|-----------|-----------------|---------------|-----------------|
| **Manni** | Warm mid-tenor, ~25 | Medium, curious, slight upward lilt on questions | "open, hopeful, thinking out loud" |
| **Kaya** | Bright warm alto | Medium-quick, smiley | "encouraging, playful, ‘you've got this'" |
| **Remy** | Androgynous, light & elastic | Quick, comedic timing | "expressive, funny, big reactions" |
| **Nia** | Low warm alto | Slow, steady, soothing | "calm, kind, reassuring" |
| **Baba Sol** | Warm gravelly elder baritone | Slow, unhurried, twinkly | "wise, fireside, gentle smile in the voice" — **also the Narrator** |

> **Narrator = Baba Sol.** Using the on-screen elder as the storytelling voice ties the whole app together. Keep a neutral warm alt-narrator available for markets/tests where an elder-male VO is not preferred.

---

## 2 · Casting map (code ↔ cast)

The content data (`src/data/content.ts`) already tags each scene with role IDs from `CharacterId = 'manni' | 'kaya' | 'host' | 'elder' | 'friend' | 'server'`. Map them to the cast like this — **no data changes needed**:

| Data role ID | Default cast member | Notes |
|--------------|--------------------|-------|
| `manni` | **Manni** | always the POV learner |
| `kaya` | **Kaya** | the connector / co-lead |
| `friend` | **Remy** | the buddy in the scene |
| `host` | **Nia** | welcomer / meeting lead |
| `server` | **Remy** | café/shop staff (barista energy) |
| `elder` | **Baba Sol** | anyone older & respected |

Per-scene overrides (e.g. "the new person you meet") are called out inside each lesson block.

---

## 3 · Global style — the blocks you paste into every generation

### 3.1 · The look, in one line
> **Elevated stylized 3D animation** — a warm blend of premium Pixar-grade young-adult character design, Apple's soft matte 3D, and Headspace's calm modernism. Appealing to adults, friendly to kids. **Not** chibi, **not** childish, **not** photoreal.

### 3.2 · `[STYLE]` — paste verbatim
```
[STYLE]
Elevated stylized 3D animation, premium animated-feature quality. Natural,
appealing adult proportions (~6.5 heads tall), gently stylized faces with
expressive but not cartoonish eyes, soft subsurface-scattering skin with subtle
texture, clean matte fabrics with realistic soft folds. Cinematic soft three-point
lighting, gentle rim light, warm sunlit optimistic color grade, shallow depth of
field. Rounded, tidy, modern environment design that echoes a friendly app UI.
Brand palette: navy #082F71, teal #52B7A4, gold #FEB20B, coral #FF6F5B,
violet #7B61C9, warm cream #FFF6E9, ink #0C204A.
Camera: locked-off / near-static, eye-level, 35mm look, no whip pans, no fast moves.
Framing: keep all characters and key action in the TOP TWO-THIRDS of the frame;
leave the BOTTOM THIRD clean and uncluttered for on-screen question + answer UI.
Aspect ratio 9:16 vertical, action-safe margins, no on-screen text of any kind.
```

### 3.3 · `[NEG]` — paste verbatim (negative prompt)
```
[NEG]
no text, no captions, no subtitles, no watermark, no logo, no UI, no buttons,
no photorealism, no uncanny realism, no chibi, no baby proportions,
no extra fingers, no extra limbs, no distorted hands, no warped faces,
no identity drift, no character morphing, no flicker, no jitter,
no fast camera, no whip pan, no motion blur smear, no jump cuts,
no gore, no brands, no cluttered background, no busy lower third.
```

### 3.4 · Environment backgrounds (match the in-app stage)
Each lesson's world should color-match the app's `Scene.tsx` environment gradients so the video and the surrounding UI feel like one surface. Use these as the **background palette** in the seed image and clip.

| Environment | Gradient (top → bottom) | Floor | Global Core lessons that use it |
|-------------|-------------------------|-------|--------------------------------|
| `home` | `#FFF6E9 → #FFE9C7` | `#E7C99A` | please · boundaries · chew · text-tone · groupchat |
| `street` | `#EEF3F7 → #DCE6EE` | `#C3D2DC` | greet · sorry |
| `store` | `#E9F6EF → #D2EEE0` | `#B2E0CB` | thanks · queue |
| `party` | `#FFEFF6 → #FFDCEC` | `#F3C2DA` | introduce |
| `classroom` | `#EAF2FF → #D5E6FF` | `#B9D2F5` | listen · interrupt |
| `restaurant` | `#FFF1DE → #FFDFAE` | `#EFC98E` | wait-eat · phone-meal |
| `office` | `#EDF0F5 → #DBE1EC` | `#C4CCDA` | videocall |
| `train` | `#E7F0FF → #CFE0FA` | `#AFC7E8` | seat |
| `friends-home` | `#FFF3EC → #FFE0CE` | `#F0C7AE` | guest |

### 3.5 · The two recurring motion "beats"
- **`[HOLD]`** — every **intro** clip must **settle into a near-frozen final second** on the decision moment (character looks toward camera / into the choice, gentle idle breathing only). This is the frame the answer buttons overlay onto.
  ```
  [HOLD] End on a calm, near-frozen beat: subject settled, only soft idle
  breathing and a slow blink; camera locked; lower third clear. Hold ~1s.
  ```
- **`[REWARD]`** — every **correct** clip ends on a shared micro-celebration that the app's confetti/XP overlay lands on.
  ```
  [REWARD] End beat: warm shared smile toward each other or camera, a small
  approving nod; a soft golden #FEB20B sparkle/checkmark glints in; gentle,
  tasteful, adult — not childish. Hold ~1s for XP + confetti overlay.
  ```

---

## 4 · Master IMAGE-generation prompts (deep)

These build the locked references. Generate once, at high resolution, and **reuse them as the character/style reference** for every scene keyframe (Midjourney character reference, Flux/Nano-Banana/Seedream img2img, or your image model's "reference" input). Consistency of these sheets = consistency of the whole app.

### 4.1 · The ensemble model sheet (make this first)
```
Character model sheet, five-character ensemble for "Mannerly," a warm modern
manners & etiquette learning app. ELEVATED STYLIZED 3D ANIMATION STYLE — a blend
of premium Pixar-grade young-adult character design, Apple's soft matte 3D, and
Headspace calm modernism. Appealing to adults, friendly to kids; NOT chibi, NOT
childish, NOT photoreal. Natural appealing proportions (~6.5 heads tall),
expressive-but-grounded eyes, soft subsurface-scattering skin, clean matte fabrics
with realistic soft folds. Neutral warm-cream studio backdrop (#FFF6E9), soft
three-point studio lighting, gentle rim light, shallow depth of field. Full-body
line-up, consistent scale, each character shown front + 3/4 view in a friendly
neutral pose.

Five distinct characters, left to right:
1) MANNI — man, ~25, he/him, warm medium-brown skin, short black textured curls /
   low fade, dimpled smile, NAVY #082F71 zip-up hoodie over white tee, dark jeans,
   white sneakers, tiny gold check pin on chest. Open, hopeful posture.
2) KAYA — woman, ~26, she/her, warm tan-brown skin, dark wavy hair in a high bun
   with loose front strands, gold hoop earrings, TEAL #52B7A4 cropped denim jacket
   over mint tee, high-waist jeans. Relaxed, mid-gesture.
3) REMY — non-binary, ~24, they/them, light skin with nose freckles, ginger-blond
   textured undercut, round translucent glasses, oversized VIOLET #7B61C9 cardigan
   over white tee, canvas high-tops, thin gold rings. Springy, playful.
4) NIA — woman, ~30, she/her, warm deep-brown skin, voluminous natural curls,
   small gold studs, soft CORAL #FF6F5B wrap top / blazer over cream, tailored
   trousers. Calm, welcoming, open palm.
5) BABA SOL — man, ~68, he/him, deep-brown skin with kind laugh-lines, close-cropped
   silver-white hair and neat white beard, round tortoise glasses, mustard-GOLD
   #FEB20B knit cardigan over soft blue shirt, small gold check lapel pin. Warm,
   twinkly, gentle nod.

One cohesive family: identical render style, identical lighting, identical scale.
High detail, clean turnaround/model reference sheet, tiny name labels only.
--ar 16:9  (no other on-screen text, no watermark, no logo)
```
> Append **`[NEG]`** (§3.3) to this too.

### 4.2 · Single-character sheets (one per cast member)
Reuse the matching paragraph above as its own prompt, framed as: *"Character turnaround for **[NAME]** … front view, 3/4 view, back view, plus 6 facial expressions (neutral, smiling, surprised, curious, embarrassed, warm-proud). Same style, lighting, and wardrobe as the Mannerly ensemble sheet."* + `[STYLE]` + `[NEG]`. Lock a **seed** and save it; that seed rides along into every scene keyframe for that character.

### 4.3 · Per-scene "hero frame" template (the still Seedance animates)
Fill the brackets from a lesson block in §7, then generate using the relevant character sheets as reference:
```
Still hero keyframe, Mannerly Global Core lesson. [ENVIRONMENT from §3.4 with its
gradient + floor colors]. Characters present: [CAST + their signature colors,
using the locked reference sheets]. Staging: [WHO IS DOING WHAT — the social
moment]. Expressions: [PER CHARACTER]. Time/mood: warm, sunlit, optimistic.
Composition: characters in the TOP TWO-THIRDS, clean uncluttered BOTTOM THIRD for
UI, eye-level 35mm, shallow depth of field, 9:16 vertical.
+ [STYLE] + [NEG]
```

---

## 5 · Voice & narration spec

- **Never bake VO into the video.** Deliver each line as a separate stem so all 7 languages reuse one clip. The app overlays the question as UI text; audio is a parallel track.
- **Two audio layers per lesson:** (1) a short **Narrator (Baba Sol)** hook, and (2) optional **character lines** (kept ultra-short, often just a warm non-verbal — a laugh, "mm!", a gasp — which needs no localization).
- **Loudness:** master stems to ~ **-16 LUFS** (mobile), true-peak ≤ -1.5 dB. Leave 300 ms of head/tail room.
- **Localization tag** on each line below: **`[UNIVERSAL]`** = non-verbal or wordless, ships as-is; **`[LOCALIZE]`** = must be re-recorded/TTS per language.
- **Ambient bed:** each environment gets a soft, low room-tone loop (café murmur, train hum, party warmth) at ~ -30 LUFS — one bed per environment, reused across lessons.

**File/stem naming**
```
core_<lessonId>_intro.mp4          # 5–10s intro clip (silent video)
core_<lessonId>_correct.mp4        # 2–4s correct-answer reward clip (silent video)
core_<lessonId>_vo_narr_<lang>.mp3 # narrator line
core_<lessonId>_vo_<char>_<lang>.mp3
core_<env>_ambient.mp3             # shared room tone
```

---

## 6 · Production pipeline & consistency rules

1. **Build the references** (§4.1–4.2). Lock seeds. This is the whole ballgame for consistency.
2. **Generate the hero frame** per clip (§4.3) using those references. Get the still *exactly* right before animating — Seedance preserves what's in the frame; it can't fix a wrong one.
3. **Animate in Seedance 2.5** (image-to-video), 5–10 s, using the lesson's **INTRO** or **CORRECT** motion prompt. Keep camera locked; request subtle motion only.
4. **Overlay** the question + answer buttons in-app on the intro's held final second; overlay confetti/XP on the correct clip's reward beat.
5. **Attach voice** stems + ambient bed.

**Consistency checklist (every clip):** same character sheets · same seed family · locked camera · lower third kept clear · signature colors intact · no baked text · identity stable start-to-finish (no morphing).

**Model notes:** Seedance 2.5 is primary. Good stand-ins where useful — **Kling 2.x** (strong character motion), **Runway Gen-4** (reference consistency), **Luma / Hailuo (MiniMax)** (fast iterations), **Veo 3** (has native audio, handy for quick previz — but still ship voice as separate stems for localization).

---

## 7 · The 17 Global Core lessons

Legend per block: **Beat** (the social moment) · **Env / Cast** · **🎬 INTRO** (plays before the answer; ends on `[HOLD]`) · **✅ CORRECT** (plays after the right choice; ends on `[REWARD]`) · **🔊 VOICE**. Every video prompt assumes `+ [STYLE] + [NEG]` appended.

> The wording of Narrator/character lines is drawn from the real lesson data (`prompt`, correct `choice`, `reason`, `whenUnsure`, `challenge`) so the audio matches the app exactly.

---

### UNIT 1 — Polite Basics 🤝

#### 1. Do you wave back? — `gc-greet`
- **Beat:** On a sunny street, Kaya spots Manni and waves hello; does he wave back?
- **Env / Cast:** `street` (`#EEF3F7→#DCE6EE`) · **Manni** + **Kaya**
- **🎬 INTRO (7s)**
```
Sunny city sidewalk, warm morning light. KAYA (teal) walks into frame from the
right, recognizes MANNI (navy) in the foreground, breaks into a bright smile and
raises her hand in a friendly wave. MANNI turns toward her, a flicker of "oh!"
recognition on his face. Subtle motion: her wave, his turn, light breeze in hair,
a few soft ambient dots drifting. Camera locked, eye-level.
[HOLD] Manni settled facing Kaya's wave, mid-decision, soft idle breathing.
```
- **✅ CORRECT (3s)**
```
MANNI smiles warmly and raises his hand to wave back; KAYA lights up, delighted,
a small happy bounce. Two friends sharing an easy hello.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"Someone says hi. Saying hi back makes people feel welcome."* · Kaya `[UNIVERSAL]`: bright *"Hey!"* (wave) · Manni `[UNIVERSAL]`: warm *"Hey!"*

#### 2. What's the magic word? — `gc-please`
- **Beat:** In a bright kitchen, Manni wants the juice on the counter near Kaya.
- **Env / Cast:** `home` (`#FFF6E9→#FFE9C7`) · **Manni** + **Kaya**
- **🎬 INTRO (6s)**
```
Cozy sunlit kitchen. A jug of orange juice sits on the counter beside KAYA (teal).
MANNI (navy) glances at the juice, then at Kaya, considering how to ask. Subtle
motion: he gestures lightly toward the juice, an easy expectant look; steam curls
from a mug; soft light. Camera locked.
[HOLD] Manni mid-ask, looking to Kaya, gentle breathing.
```
- **✅ CORRECT (3s)**
```
MANNI asks politely with an open hand; KAYA smiles and slides the juice over to
him. Warm, effortless exchange.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"‘Please' turns an order into a request."* · Manni `[LOCALIZE]`: *"Can I have some, please?"* · Kaya `[LOCALIZE]`: *"Sure — here you go."*

#### 3. Do you owe a thanks? — `gc-thanks`
- **Beat:** At a shop entrance, Remy holds the door open for Manni.
- **Env / Cast:** `store` (`#E9F6EF→#D2EEE0`) · **Manni** + **Remy** *(server = Remy)*
- **🎬 INTRO (6s)**
```
Friendly shop doorway, greenish-mint light. REMY (violet, apron) pushes the glass
door open and holds it, glancing back with a helpful smile as MANNI (navy)
approaches carrying a small bag. Subtle motion: the door swings and holds, Remy's
welcoming look, Manni stepping up. Camera locked.
[HOLD] Manni at the threshold, Remy holding the door, decision beat.
```
- **✅ CORRECT (3s)**
```
MANNI meets Remy's eyes and says thanks with a grateful nod; REMY beams, warmed by
being noticed. A small kind moment landing.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"‘Thank you' shows you noticed their help."* · Manni `[LOCALIZE]`: *"Thank you!"* · Remy `[UNIVERSAL]`: pleased *"mm-hm!"*

#### 4. How do you break the ice? — `gc-introduce`
- **Beat:** At a lively little party, Manni stands near someone new — **Nia** *(the new person)*.
- **Env / Cast:** `party` (`#FFEFF6→#FFDCEC`) · **Manni** + **Nia** *(friend-slot → new acquaintance)*
- **🎬 INTRO (7s)**
```
Warm house-party glow, soft pink light, gentle bokeh of guests behind. MANNI (navy)
stands a touch awkwardly beside NIA (coral), a person he hasn't met; a small
open space of "should I say something?" between them. Subtle motion: Manni takes a
breath and half-turns toward her, Nia notices and offers a soft encouraging look;
warm party lights twinkle. Camera locked.
[HOLD] Manni turning to introduce himself, mid-decision.
```
- **✅ CORRECT (3s)**
```
MANNI offers a friendly hand and says his name; NIA smiles and shakes it, saying
hers back. Two strangers becoming acquaintances.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"Say your name so people can meet you."* · Manni `[LOCALIZE]`: *"Hi, I'm Sam."* · Nia `[LOCALIZE]`: warm *"Nice to meet you."*

#### 5. What makes a real sorry? — `gc-sorry`
- **Beat:** Hurrying on the street, Manni bumps into Kaya.
- **Env / Cast:** `street` (`#EEF3F7→#DCE6EE`) · **Manni** + **Kaya**
- **🎬 INTRO (6s)**
```
Busy-but-calm sidewalk. MANNI (navy), glancing at his phone, lightly bumps
shoulders with KAYA (teal) coming the other way; she steadies herself, a small
"oh!" A beat of "what now?" on Manni's face. Subtle motion: the gentle collision,
both regaining balance, eye contact. Camera locked. (Keep it soft, not slapstick.)
[HOLD] Manni facing Kaya right after the bump, deciding how to react.
```
- **✅ CORRECT (3s)**
```
MANNI raises an apologetic hand, genuine concern on his face, checking she's okay;
KAYA relaxes into a forgiving smile. Tension dissolves.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"The best sorry owns it — and checks they're okay."* · Manni `[LOCALIZE]`: *"Sorry! Are you okay?"* · Kaya `[LOCALIZE]`: *"All good."*

---

### UNIT 2 — Talk & Listen 👂

#### 6. Are you really listening? — `gc-listen`
- **Beat:** In a bright study/classroom nook, Remy is telling Manni something that matters.
- **Env / Cast:** `classroom` (`#EAF2FF→#D5E6FF`) · **Manni** + **Remy**
- **🎬 INTRO (7s)**
```
Soft blue-lit study corner. REMY (violet) is mid-story, hands animated, clearly
sharing something they care about. MANNI (navy) sits across, a phone resting
face-up nearby tempting his attention. Subtle motion: Remy talking and gesturing,
Manni's eyes flicking once toward the phone then back up. Camera locked.
[HOLD] Manni at the choice — phone, or attention on Remy.
```
- **✅ CORRECT (3s)**
```
MANNI leaves the phone, turns fully to REMY, meets their eyes and nods; REMY feels
heard and opens up, brighter. Real connection.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"Look at people when they talk to you — real listening makes them feel understood."* · Remy `[UNIVERSAL]`: engaged storytelling murmur · Manni `[UNIVERSAL]`: soft affirming *"mm."*

#### 7. When can you jump in? — `gc-interrupt`
- **Beat:** Kaya and Remy are deep in conversation; Manni has an idea burning to get out.
- **Env / Cast:** `classroom` (`#EAF2FF→#D5E6FF`) · **Manni** + **Kaya** *(+ Remy as third speaker)*
- **🎬 INTRO (7s)**
```
Bright group-work table. KAYA (teal) and REMY (violet) are mid-exchange, one
speaking. MANNI (navy) beside them lights up with an idea, leans in slightly,
mouth opening — then hesitates, a "wait for the pause?" flicker. Subtle motion:
the two talking, Manni's eager lean and self-check. Camera locked.
[HOLD] Manni poised to speak, deciding whether to wait.
```
- **✅ CORRECT (3s)**
```
MANNI waits, and at a natural pause offers his idea with a light raised hand;
KAYA and REMY turn, nodding — it lands well. Smooth turn-taking.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"Wait for a pause. Taking turns lets everyone be heard."* · Manni `[LOCALIZE]`: *"Oh — can I add something?"*

#### 8. What if they say no? — `gc-boundaries`
- **Beat:** At home, Remy quietly says they need space right now.
- **Env / Cast:** `home` (`#FFF6E9→#FFE9C7`) · **Manni** + **Remy**
- **🎬 INTRO (7s)**
```
Warm living room, soft amber light. REMY (violet) sits a little withdrawn on the
sofa, offering a gentle "not now" gesture — palm softly up, tired smile. MANNI
(navy) stands nearby, caring, unsure whether to push or step back. Subtle motion:
Remy's small "I need a moment," Manni reading it. Tender, quiet. Camera locked.
[HOLD] Manni deciding how to respond to Remy's boundary.
```
- **✅ CORRECT (3s)**
```
MANNI softens, nods warmly, and gives an easy "I'm here later" with a step back to
give room; REMY relaxes, grateful and safe. Trust, kept.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"When someone needs space, give it. Respecting ‘no' builds trust."* · Manni `[LOCALIZE]`: gentle *"Okay — I'm here later."* · Remy `[UNIVERSAL]`: soft grateful exhale.

---

### UNIT 3 — At the Table 🍽️

#### 9. When can you dig in? — `gc-wait-eat`
- **Beat:** At a restaurant, Manni's plate arrives first while Kaya and host Nia are still waiting.
- **Env / Cast:** `restaurant` (`#FFF1DE→#FFDFAE`) · **Manni** + **Kaya** + **Nia** *(host)*
- **🎬 INTRO (7s)**
```
Warm restaurant booth, honeyed light. A plate is set in front of MANNI (navy)
first; KAYA (teal) and NIA (coral, host) still have empty settings. Manni's fork
hovers, tempted, eyes flicking to the others. Subtle motion: steam off the plate,
his hovering hand, a glance around the table. Camera locked.
[HOLD] Manni's fork hovering — eat now, or wait?
```
- **✅ CORRECT (3s)**
```
MANNI sets the fork down and waits with an easy smile until the others are served;
KAYA and NIA arrive, and all three lift forks together. Shared start.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"Wait until everyone has their food. Starting together feels friendly."* · Nia `[LOCALIZE]`: warm *"Go ahead, everyone — together."*

#### 10. Are you a noisy eater? — `gc-chew`
- **Beat:** Family-style dinner at home; Manni is hungry, Kaya beside him.
- **Env / Cast:** `home` (`#FFF6E9→#FFE9C7`) · **Manni** + **Kaya**
- **🎬 INTRO (6s)**
```
Cozy dinner table at home, warm lamp light, plates of food. MANNI (navy), clearly
hungry, lifts a big forkful; KAYA (teal) beside him eats calmly. A beat of "how do
I eat this?" Subtle motion: Manni's loaded fork, a glance at Kaya's tidy manner.
Camera locked. (Keep tasteful — no grotesque chewing.)
[HOLD] Manni about to take the bite, choosing how.
```
- **✅ CORRECT (3s)**
```
MANNI takes a smaller bite, mouth closed, relaxed and pleasant; KAYA gives an
approving little nod. Easy to sit beside.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"Chew with your mouth closed — quiet eating is easy to be around."* (character lines optional; keep near-silent)

#### 11. Phone at the table? — `gc-phone-meal`
- **Beat:** Dinner out with Remy; Manni's phone buzzes on the table.
- **Env / Cast:** `restaurant` (`#FFF1DE→#FFDFAE`) · **Manni** + **Remy**
- **🎬 INTRO (7s)**
```
Intimate restaurant two-top, warm light. MANNI (navy) and REMY (violet) mid-meal.
Manni's phone buzzes face-up on the table, screen glowing; his eyes drop to it as
Remy is talking. Subtle motion: the buzz/glow, Manni's glance, Remy's flicker of
"still with me?" Camera locked.
[HOLD] Manni's hand near the phone — check it, or stay present?
```
- **✅ CORRECT (3s)**
```
MANNI calmly flips the phone face-down and returns his full attention to REMY, who
brightens, re-engaged. Fully present.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"Keep the phone away while you eat together — even face-up, it makes people feel less heard."* · Manni `[UNIVERSAL]`: light *"sorry — go on!"*

---

### UNIT 4 — Screens & Chats 💬

#### 12. Does 'k' sound cold? — `gc-text-tone`
- **Beat:** Alone at home, Manni is about to fire back a curt one-letter reply.
- **Env / Cast:** `home` (`#FFF6E9→#FFE9C7`) · **Manni** *(solo)*
- **🎬 INTRO (6s)**
```
Manni alone on a comfy couch at home, warm light, phone in hand, a chat open. A
floating, stylized speech-bubble UI element hovers near him showing a blunt "k"
he's about to send (keep it as an abstract bubble shape, NO real legible text).
MANNI (navy) pauses, a flicker of "will this sound cold?" Subtle motion: thumb
hovering over send, thoughtful look, the bubble pulsing softly. Camera locked.
[HOLD] Manni's thumb over "send," reconsidering the tone.
```
- **✅ CORRECT (3s)**
```
MANNI smiles, relaxes, and taps out something warmer instead; the floating bubble
turns a friendly teal and a small warm spark lifts off it. Kinder, clearer.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"Short texts can sound cold. A little warmth makes it clear."* · Manni `[UNIVERSAL]`: thoughtful *"hmm…"* then a small satisfied *"there."*

#### 13. Blowing up the chat? — `gc-groupchat`
- **Beat:** A group chat with 47 unread pings; Manni is about to reply.
- **Env / Cast:** `home` (`#FFF6E9→#FFE9C7`) · **Manni** + **Remy** *(chat friend, small inset/aside)*
- **🎬 INTRO (7s)**
```
Manni at a kitchen table at home, phone buzzing insistently — a swarm of small
abstract notification dots/bubbles hovering around it (NO legible text). MANNI
(navy) looks slightly overwhelmed, thumbs poised to fire off a burst of replies.
Optional: REMY (violet) as a small glowing avatar bubble reacting. Subtle motion:
the buzzing dot-swarm, Manni's poised thumbs, a "how should I send this?" beat.
Camera locked.
[HOLD] Manni deciding — nine quick texts, or one clear message.
```
- **✅ CORRECT (3s)**
```
The swarm of little bubbles gathers and merges into ONE calm, tidy bubble as MANNI
sends a single clear message; the buzzing settles, he exhales, pleased. Signal over
noise.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"Keep it to one clear message — every text pings the whole group."* (character lines optional)

#### 14. Mic on or off? — `gc-videocall`
- **Beat:** A six-person video call; Nia is leading, Manni isn't speaking.
- **Env / Cast:** `office` (`#EDF0F5→#DBE1EC`) · **Manni** + **Nia** *(host/call lead)*
- **🎬 INTRO (7s)**
```
Manni at a tidy home-office desk, cool neutral light, on a video call — a soft
grid of small participant tiles glows on his monitor (abstract avatar tiles, NO
legible text/UI chrome), with NIA (coral) as the speaking tile. MANNI (navy) is
listening, not talking; his mic control glows nearby. Subtle motion: Nia speaking
in her tile, Manni nodding along, a faint hint of background noise near him.
Camera locked.
[HOLD] Manni's hand near the mic control, deciding to mute or not.
```
- **✅ CORRECT (3s)**
```
MANNI taps mute; a small calm indicator settles; he keeps listening attentively as
NIA continues clearly. Clean audio for everyone.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"Mute when you're not talking — one open mic can drown out everyone."* · Nia `[UNIVERSAL]`: steady presenter murmur under narration.

---

### UNIT 5 — Out in the World 🌍

#### 15. Can you skip the line? — `gc-queue`
- **Beat:** A queue at a counter; Manni is in a hurry, Kaya waits ahead.
- **Env / Cast:** `store` (`#E9F6EF→#D2EEE0`) · **Manni** + **Kaya**
- **🎬 INTRO (7s)**
```
Tidy shop counter, mint-green light, a small orderly line of people; KAYA (teal)
waits partway up it. MANNI (navy) arrives with hurried energy, eyeing the front,
a "should I just cut in?" tension. Subtle motion: the line inching forward, Manni's
impatient shift of weight, a glance at the gap near the front. Camera locked.
[HOLD] Manni deciding — cut ahead, or join the back.
```
- **✅ CORRECT (3s)**
```
MANNI relaxes and walks to the back of the line, settling in patiently; a nearby
person gives a small approving glance and KAYA smiles back at him. Fair's fair.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"Line up at the back and wait your turn — a line is the fairest way to share."* · Manni `[UNIVERSAL]`: settling exhale.

#### 16. Give up your seat? — `gc-seat`
- **Beat:** A packed train; Manni is seated as elder Baba Sol boards, standing.
- **Env / Cast:** `train` (`#E7F0FF→#CFE0FA`) · **Manni** + **Baba Sol** *(elder)*
- **🎬 INTRO (7s)**
```
Crowded but calm train car, cool blue daylight through windows. MANNI (navy) sits
in the last free seat. BABA SOL (gold, elder, tortoise glasses, cardigan) steps
aboard and stands, steadying himself on a rail as the car sways. Subtle motion:
the gentle sway, Baba Sol reaching for balance, Manni noticing him. Camera locked.
[HOLD] Manni seeing Baba Sol standing — offer the seat, or not.
```
- **✅ CORRECT (3s)**
```
MANNI rises and offers his seat with an open hand; BABA SOL accepts with a warm,
crinkly-eyed "thank you" and a small grateful nod. Quiet everyday kindness.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"Offer your seat to someone who needs it more."* · Baba Sol `[LOCALIZE]`: warm *"Oh — thank you, young man."* · Manni `[LOCALIZE]`: *"Please, take it."*

#### 17. How to be a good guest? — `gc-guest`
- **Beat:** Manni arrives at Nia's home as her guest.
- **Env / Cast:** `friends-home` (`#FFF3EC→#FFE0CE`) · **Manni** + **Nia** *(host)*
- **🎬 INTRO (7s)**
```
Warm, inviting front room of a friend's home, soft peach light, a couch and a
coffee table. NIA (coral, host) opens the door and welcomes MANNI (navy) in with
an open-armed "come in!" Manni steps over the threshold, a small "how do I be a
good guest?" beat — hands a little unsure. Subtle motion: the door opening, Nia's
welcome, Manni entering. Camera locked.
[HOLD] Manni just inside, deciding how to greet his host.
```
- **✅ CORRECT (3s)**
```
MANNI smiles and thanks NIA warmly for having him, a small appreciative gesture;
NIA beams, delighted to host him. A guest who gets it.
[REWARD]
```
- **🔊 VOICE** — Narrator `[LOCALIZE]`: *"Thank the host and follow their house rules."* · Manni `[LOCALIZE]`: *"Thanks for having me!"* · Nia `[LOCALIZE]`: warm *"So glad you're here — come in."*

---

## 8 · At-a-glance production grid

| # | Lesson | ID | Env | Cast | Intro s | Correct s | Narrator localize? |
|---|--------|----|-----|------|:------:|:--------:|:-----:|
| 1 | Do you wave back? | `gc-greet` | street | Manni · Kaya | 7 | 3 | ✅ |
| 2 | What's the magic word? | `gc-please` | home | Manni · Kaya | 6 | 3 | ✅ |
| 3 | Do you owe a thanks? | `gc-thanks` | store | Manni · Remy | 6 | 3 | ✅ |
| 4 | How do you break the ice? | `gc-introduce` | party | Manni · Nia | 7 | 3 | ✅ |
| 5 | What makes a real sorry? | `gc-sorry` | street | Manni · Kaya | 6 | 3 | ✅ |
| 6 | Are you really listening? | `gc-listen` | classroom | Manni · Remy | 7 | 3 | ✅ |
| 7 | When can you jump in? | `gc-interrupt` | classroom | Manni · Kaya · Remy | 7 | 3 | ✅ |
| 8 | What if they say no? | `gc-boundaries` | home | Manni · Remy | 7 | 3 | ✅ |
| 9 | When can you dig in? | `gc-wait-eat` | restaurant | Manni · Kaya · Nia | 7 | 3 | ✅ |
| 10 | Are you a noisy eater? | `gc-chew` | home | Manni · Kaya | 6 | 3 | ✅ |
| 11 | Phone at the table? | `gc-phone-meal` | restaurant | Manni · Remy | 7 | 3 | ✅ |
| 12 | Does 'k' sound cold? | `gc-text-tone` | home | Manni (solo) | 6 | 3 | ✅ |
| 13 | Blowing up the chat? | `gc-groupchat` | home | Manni · Remy | 7 | 3 | ✅ |
| 14 | Mic on or off? | `gc-videocall` | office | Manni · Nia | 7 | 3 | ✅ |
| 15 | Can you skip the line? | `gc-queue` | store | Manni · Kaya | 7 | 3 | ✅ |
| 16 | Give up your seat? | `gc-seat` | train | Manni · Baba Sol | 7 | 3 | ✅ |
| 17 | How to be a good guest? | `gc-guest` | friends-home | Manni · Nia | 7 | 3 | ✅ |

---

## 9 · Optional add-ons (when you're ready)

- **Gentle "try again" reactions** — the app never penalizes a wrong pick (it invites a retry). Each lesson's wrong choices already carry a `reactionState` (`confused`, `embarrassed`, `idle`) in the data. A tasteful 2 s "soft oops → let's try again" clip per lesson can reuse the same hero frame; keep it kind, never mocking (adult-appropriate). Prompt pattern: *"[character] gives a small, gentle ‘oops' / awkward beat, then a warm reset toward camera; soft, non-punishing. + [STYLE] + [NEG]."*
- **Age-flex art variants** — for the Kids (5–7) band, render the same cast a touch rounder/softer and slow the motion; keep colors, wardrobe, and identity anchors identical so it's clearly the same five people.
- **Passport / reward stingers** — short shared cast celebration clips for streaks, level-ups (Beginner → Comfortable → Confident → Ambassador), and country stamps, using `[REWARD]` energy at full-screen.

---

<div align="center"><sub>Mannerly · Global Core Animation Bible · cast: Manni · Kaya · Remy · Nia · Baba Sol</sub></div>
