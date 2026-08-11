import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
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
import { useProgress } from '@/state/store'
import { useEntitlements } from '@/state/entitlements'
import { useProfiles } from '@/state/profiles'
import { COUNTRIES, countryList } from '@/data/countries'
import { LANGUAGES } from '@/data/languages'
import { GOALS, suggestedGoals } from '@/data/goals'
import { AVATARS, DEFAULT_AVATAR } from '@/data/avatars'
import { starterFor } from '@/data/scenarios'
import { HOME_UNIT_ORDER, UNIT_MAP } from '@/data/content'
import { haptic } from '@/lib/haptics'
import Mascot from '@/components/Mascot'
import Icon, { type IconName } from '@/components/Icon'
import Avatar from '@/components/Avatar'

/* ---------- static option data ---------- */

const USAGE: { id: AccountType; title: string; sub: string; icon: IconName }[] = [
  { id: 'individual', title: 'For myself', sub: 'One learner', icon: 'person' },
  { id: 'family', title: 'For my family', sub: 'A parent & kids', icon: 'people' },
  { id: 'teacher', title: 'I’m a teacher', sub: 'Set up a class', icon: 'teacher' },
  { id: 'student', title: 'I’m a student', sub: 'Join with a code', icon: 'student' },
]

const AGES: { id: AgeGroup; name: string; range: string; icon: IconName }[] = [
  { id: 'kids', name: 'Kids', range: '5–7', icon: 'sprout' },
  { id: 'tweens', name: 'Tweens', range: '8–12', icon: 'leaf' },
  { id: 'teens', name: 'Teens', range: '13–17', icon: 'spark' },
  { id: 'adults', name: 'Adults', range: '18+', icon: 'briefcase' },
]

const NOTIFY: { id: NotifyPref; label: string; icon: IconName }[] = [
  { id: 'daily', label: 'Daily', icon: 'sun' },
  { id: 'weekly', label: 'A few times a week', icon: 'calendar' },
  { id: 'off', label: 'Not now', icon: 'bell-off' },
]

const A11Y_OPTS: { key: keyof A11yPrefs; label: string; icon: IconName }[] = [
  { key: 'largeText', label: 'Larger text', icon: 'text-size' },
  { key: 'reduceMotion', label: 'Reduce motion', icon: 'waves' },
  { key: 'highContrast', label: 'Higher contrast', icon: 'contrast' },
]

type Step =
  | 'age' | 'region' | 'passport' | 'language' | 'goals' | 'scenario'
  | 'notify' | 'a11y' | 'account' | 'ready'
  | 'kids' | 'class' | 'code' | 'joincode' | 'avatar'

const FLOWS: Record<AccountType, Step[]> = {
  individual: ['age', 'region', 'passport', 'language', 'goals', 'scenario', 'notify', 'a11y', 'account', 'ready'],
  family: ['region', 'language', 'kids', 'passport', 'account', 'ready'],
  teacher: ['class', 'code', 'ready'],
  student: ['joincode', 'avatar', 'ready'],
}

const FIRST_LESSON = UNIT_MAP[HOME_UNIT_ORDER[0]]?.lessonIds[0] ?? 'gc-greet'

const anim = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
}

export default function Onboarding() {
  const navigate = useNavigate()
  const completeOnboarding = useProgress((s) => s.completeOnboarding)
  const setHomeRegion = useEntitlements((s) => s.setHomeRegion)
  const addChild = useProfiles((s) => s.addChild)
  const switchToChild = useProfiles((s) => s.switchToChild)
  const createClassroom = useProfiles((s) => s.createClassroom)
  const joinClassAction = useProfiles((s) => s.joinClass)

  const [phase, setPhase] = useState<'welcome' | 'usage' | 'flow'>('welcome')
  const [type, setType] = useState<AccountType | null>(null)
  const [flow, setFlow] = useState<Step[]>([])
  const [i, setI] = useState(0)
  const step = flow[i]

  // collected profile
  const [age, setAge] = useState<AgeGroup | null>(null)
  const [home, setHome] = useState<CountryCode>('US')
  const [lang, setLang] = useState<LanguageCode>('en')
  const [goals, setGoals] = useState<GoalId[]>([])
  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR)
  const [notify, setNotify] = useState<NotifyPref>('daily')
  const [a11y, setA11y] = useState<A11yPrefs>(DEFAULT_A11Y)

  // interactive scenario
  const [pick, setPick] = useState<string | null>(null)

  // family
  const [kids, setKids] = useState<{ name: string; ageGroup: AgeGroup; avatarId: string }[]>([])
  const [kidName, setKidName] = useState('')
  const [kidAge, setKidAge] = useState<AgeGroup>('kids')
  const [kidAvatar, setKidAvatar] = useState<string>('star')

  // teacher
  const [className, setClassName] = useState('')
  const [classAge, setClassAge] = useState<AgeGroup>('tweens')
  const [joinCode, setJoinCode] = useState('')

  // student
  const [codeInput, setCodeInput] = useState('')

  const pct = flow.length > 1 ? Math.round((i / (flow.length - 1)) * 100) : 0

  /* ---------- navigation ---------- */
  const go = (n: number) => { haptic('tap'); setI(n) }
  const next = () => { if (i < flow.length - 1) go(i + 1) }
  const back = () => {
    haptic('tap')
    if (i > 0) setI(i - 1)
    else { setPhase('usage'); setType(null) }
  }
  const chooseUsage = (t: AccountType) => {
    haptic('select'); setType(t); setFlow(FLOWS[t]); setI(0); setPhase('flow')
  }

  const toggleGoal = (g: GoalId) => {
    haptic('select')
    setGoals((cur) => (cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]))
  }
  const toggleA11y = (k: keyof A11yPrefs) => {
    haptic('select'); setA11y((cur) => ({ ...cur, [k]: !cur[k] }))
  }

  /* ---------- commit + launch ---------- */
  const commitIndividual = () => {
    setHomeRegion(home)
    completeOnboarding({ accountType: 'individual', ageGroup: age ?? 'adults', language: lang, goals, avatarId: avatar, notify, a11y })
  }
  const commitFamily = (activateFirstChild: boolean) => {
    setHomeRegion(home)
    completeOnboarding({ accountType: 'family', ageGroup: 'adults', language: lang, goals: [], avatarId: 'bear', notify, a11y })
    const created = kids.map((k) => addChild(k))
    if (activateFirstChild && created[0]) switchToChild(created[0].id)
  }
  const commitTeacher = () => {
    completeOnboarding({ accountType: 'teacher', ageGroup: 'adults', language: lang, goals: [], avatarId: 'owl', notify: 'off', a11y })
  }
  const commitStudent = () => {
    completeOnboarding({ accountType: 'student', ageGroup: 'teens', language: 'en', goals: [], avatarId: avatar, notify: 'off', a11y })
    joinClassAction(codeInput)
  }

  // Account handoff (individual + family): commit first so the new account
  // inherits the profile, then head to the auth screen (a public route).
  const toAuth = () => {
    haptic('tap')
    if (type === 'family') commitFamily(false)
    else commitIndividual()
    navigate('/account', { replace: true })
  }

  // Final launch from the "ready" beat — onboarded flips here, then we go.
  const launch = () => {
    haptic('success')
    if (type === 'individual') { commitIndividual(); navigate(`/lesson/${FIRST_LESSON}`, { replace: true }) }
    else if (type === 'family') { commitFamily(true); navigate('/', { replace: true }) }
    else if (type === 'teacher') { commitTeacher(); navigate('/', { replace: true }) }
    else { commitStudent(); navigate(`/lesson/${FIRST_LESSON}`, { replace: true }) }
  }

  const addKid = () => {
    if (!kidName.trim()) return
    haptic('success')
    setKids((cur) => [...cur, { name: kidName.trim(), ageGroup: kidAge, avatarId: kidAvatar }])
    setKidName(''); setKidAge('kids')
    setKidAvatar(AVATARS[(kids.length + 1) % AVATARS.length].id)
  }

  const makeClass = () => {
    const c = createClassroom({ name: className, gradeAge: classAge, language: lang, homeRegion: home })
    setJoinCode(c.joinCode)
    next()
  }

  const codeValid = /^MANNER-\d{4}$/i.test(codeInput.trim())

  /* ---------- shared chrome ---------- */
  const Rail = () => (
    <div className="ob-top">
      <button className="ob-back" onClick={back} aria-label="Back">←</button>
      <div className="ob-rail">
        <Mascot color="navy" size={26} pose="wave" bob={false} />
        <div className="ob-rail__bar"><div className="ob-rail__fill" style={{ width: `${pct}%` }} /></div>
        <Mascot color="teal" size={26} pose="idle" bob={false} flip />
      </div>
    </div>
  )

  return (
    <div className="screen">
      <div className="ob-scroll">
      <AnimatePresence mode="wait">
        {/* ---------------- welcome ---------------- */}
        {phase === 'welcome' && (
          <motion.div key="welcome" {...anim} className="ob-step" style={{ justifyContent: 'center', gap: 22 }}>
            <div className="center" style={{ gap: 2 }}>
              <div className="row" style={{ gap: 0 }}>
                <Mascot color="navy" pose="wave" size={112} />
                <Mascot color="teal" pose="idle" size={112} flip />
              </div>
              <img src="/brand/wordmark-stacked.png" alt="Mannerly" style={{ width: 196, marginTop: -6 }} />
            </div>
            <div className="center" style={{ gap: 8, textAlign: 'center' }}>
              <h1 className="title" style={{ fontSize: 24 }}>Good manners, made fun.</h1>
              <p className="subtitle" style={{ maxWidth: 300 }}>
                Bite-size lessons in kindness, etiquette & world cultures.
              </p>
            </div>
            <button className="btn" onClick={() => { haptic('tap'); setPhase('usage') }}>Get started</button>
          </motion.div>
        )}

        {/* ---------------- usage / paths ---------------- */}
        {phase === 'usage' && (
          <motion.div key="usage" {...anim} className="ob-step">
            <div style={{ marginTop: 6 }}>
              <h1 className="title">How will you use Mannerly?</h1>
              <p className="subtitle">Pick one — you can change it later.</p>
            </div>
            <div className="age-grid grow" style={{ alignContent: 'center' }}>
              {USAGE.map((u) => (
                <button key={u.id} className="age-card" onClick={() => chooseUsage(u.id)}>
                  <span className="age-emoji"><Icon name={u.icon} size={28} color="var(--navy-600)" /></span>
                  <span className="age-name">{u.title}</span>
                  <span className="age-range">{u.sub}</span>
                </button>
              ))}
            </div>
            <button className="btn btn--ghost" onClick={() => { haptic('tap'); setPhase('welcome') }}>← Back</button>
          </motion.div>
        )}

        {/* ---------------- flow steps ---------------- */}
        {phase === 'flow' && (
          <motion.div key={step} {...anim} className="ob-step">
            <Rail />

            {step === 'age' && (
              <>
                <div><h1 className="title">Who’s learning?</h1><p className="subtitle">Lessons adapt to each age.</p></div>
                <div className="age-grid grow" style={{ alignContent: 'center' }}>
                  {AGES.map((a) => (
                    <button key={a.id} className={`age-card ${age === a.id ? 'age-card--on' : ''}`}
                      onClick={() => { haptic('select'); setAge(a.id); setGoals(suggestedGoals(a.id).slice(0, 2)) }}>
                      <span className="age-emoji"><Icon name={a.icon} size={28} color="var(--navy-600)" /></span>
                      <span className="age-name">{a.name}</span>
                      <span className="age-range">Ages {a.range}</span>
                    </button>
                  ))}
                </div>
                <button className="btn btn--teal" disabled={!age} onClick={next}>Continue →</button>
              </>
            )}

            {step === 'region' && (
              <>
                <div>
                  <h1 className="title">Where do you call home?</h1>
                  <p className="subtitle">Your free account includes Global Manners + one Home Region.</p>
                </div>
                <div className="age-grid grow hide-scroll" style={{ alignContent: 'start', overflowY: 'auto' }}>
                  {countryList().map((c) => (
                    <button key={c.code} className={`age-card ${home === c.code ? 'age-card--on' : ''}`}
                      onClick={() => { haptic('select'); setHome(c.code) }}>
                      <span className="age-emoji">{c.flag}</span>
                      <span className="age-name">{c.name}</span>
                      <span className="age-range">{c.hello}</span>
                    </button>
                  ))}
                </div>
                <button className="btn btn--teal" onClick={next}>Continue →</button>
              </>
            )}

            {step === 'passport' && (
              <PassportBeat home={home} family={type === 'family'} onNext={next} />
            )}

            {step === 'language' && (
              <>
                <div><h1 className="title">What language should Mannerly speak?</h1><p className="subtitle">Separate from your region — pick what feels like home.</p></div>
                <div className="grow hide-scroll" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {LANGUAGES.map((l) => (
                    <button key={l.code} className={`lang-row ${lang === l.code ? 'lang-row--on' : ''}`}
                      onClick={() => { haptic('select'); setLang(l.code) }}>
                      <div className="grow">
                        <div className="lang-native" dir={l.rtl ? 'rtl' : 'ltr'}>{l.native}</div>
                        <div className="lang-name">{l.name}</div>
                      </div>
                      <span className="lang-hi" dir={l.rtl ? 'rtl' : 'ltr'}>{l.sample}</span>
                    </button>
                  ))}
                </div>
                <button className="btn btn--teal" onClick={next}>Continue →</button>
              </>
            )}

            {step === 'goals' && (
              <>
                <div><h1 className="title">What would you like to get better at?</h1><p className="subtitle">Choose a few. This shapes your lessons.</p></div>
                <div className="goal-grid grow hide-scroll" style={{ overflowY: 'auto', alignContent: 'start' }}>
                  {GOALS.map((g) => (
                    <button key={g.id} className={`goal-opt ${goals.includes(g.id) ? 'goal-opt--on' : ''}`}
                      onClick={() => toggleGoal(g.id)}>
                      <span className="goal-emoji"><Icon name={g.icon} size={20} color="var(--teal-600)" /></span>
                      <span className="goal-label">{g.label}</span>
                    </button>
                  ))}
                </div>
                <button className="btn btn--teal" disabled={goals.length === 0} onClick={next}>
                  {goals.length ? `Continue with ${goals.length} →` : 'Pick at least one'}
                </button>
              </>
            )}

            {step === 'scenario' && (
              <ScenarioStep age={age} pick={pick} setPick={setPick} onNext={() => { setPick(null); next() }} />
            )}

            {step === 'notify' && (
              <>
                <div><h1 className="title">Want a Daily Manner?</h1><p className="subtitle">One quick situation each day — that’s it.</p></div>
                <div className="grow center" style={{ justifyContent: 'center' }}><Mascot color="gold" pose="offer" size={112} /></div>
                <div className="options">
                  {NOTIFY.map((n) => (
                    <button key={n.id} className={`option ${notify === n.id ? 'option--correct' : ''}`}
                      onClick={() => { haptic('select'); setNotify(n.id) }}>
                      <span className="opt-emoji"><Icon name={n.icon} size={22} /></span>{n.label}
                    </button>
                  ))}
                </div>
                <button className="btn btn--teal" style={{ marginTop: 12 }} onClick={next}>Continue →</button>
              </>
            )}

            {step === 'a11y' && (
              <>
                <div><h1 className="title">Make Mannerly comfortable for you</h1><p className="subtitle">Optional — change these anytime in Settings.</p></div>
                <div className="options grow" style={{ justifyContent: 'center' }}>
                  {A11Y_OPTS.map((o) => (
                    <button key={o.key} className={`option ${a11y[o.key] ? 'option--correct' : ''}`}
                      onClick={() => toggleA11y(o.key)}>
                      <span className="opt-emoji"><Icon name={o.icon} size={22} /></span>
                      <span className="grow">{o.label}</span>
                      <span style={{ fontWeight: 900 }}>{a11y[o.key] ? 'On' : 'Off'}</span>
                    </button>
                  ))}
                </div>
                <button className="btn btn--teal" onClick={next}>Continue →</button>
              </>
            )}

            {step === 'account' && (
              <>
                <div>
                  <h1 className="title">Save your progress</h1>
                  <p className="subtitle">
                    One account keeps your streak, packs & passport on every device — phone, tablet and the web.
                  </p>
                </div>
                <div className="grow center" style={{ justifyContent: 'center' }}>
                  <Mascot color="gold" pose="cheer" size={124} />
                </div>
                <div className="stack" style={{ gap: 10 }}>
                  <button className="btn" onClick={toAuth}>Create free account</button>
                  <button className="btn btn--ghost" onClick={toAuth}>I already have one</button>
                  <button className="btn btn--ghost" onClick={next}>Maybe later</button>
                </div>
              </>
            )}

            {step === 'kids' && (
              <>
                <div><h1 className="title">Who’s learning with you?</h1><p className="subtitle">Add a profile for each child. No email needed for them.</p></div>
                <div className="grow hide-scroll" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {kids.map((k, idx) => (
                    <div key={idx} className="kid-row">
                      <Avatar id={k.avatarId} size={44} />
                      <div className="grow"><div className="kid-name">{k.name}</div><div className="tile-sub">{AGES.find((a) => a.id === k.ageGroup)?.name}</div></div>
                      <button className="chip chip--muted" onClick={() => { haptic('tap'); setKids(kids.filter((_, x) => x !== idx)) }}>Remove</button>
                    </div>
                  ))}

                  <div className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="field">
                      <span className="label">Child’s name or nickname</span>
                      <input className="input" value={kidName} maxLength={24}
                        onChange={(e) => setKidName(e.target.value)} placeholder="e.g. Emma" />
                    </div>
                    <div className="pill-row">
                      {AGES.map((a) => (
                        <button key={a.id} className={`chip ${kidAge === a.id ? '' : 'chip--muted'}`}
                          onClick={() => { haptic('select'); setKidAge(a.id) }}>{a.name}</button>
                      ))}
                    </div>
                    <div className="avatar-grid">
                      {AVATARS.slice(0, 8).map((av) => (
                        <button key={av.id} className={`avatar-opt ${kidAvatar === av.id ? 'avatar-opt--on' : ''}`}
                          onClick={() => { haptic('select'); setKidAvatar(av.id) }}><Avatar id={av.id} size={38} /></button>
                      ))}
                    </div>
                    <button className="btn btn--ghost btn--sm" style={{ width: '100%' }} disabled={!kidName.trim()} onClick={addKid}>
                      + Add {kidName.trim() || 'child'}
                    </button>
                  </div>
                </div>
                <button className="btn btn--teal" disabled={kids.length === 0} onClick={next}>
                  {kids.length ? `Continue with ${kids.length} →` : 'Add a child to continue'}
                </button>
              </>
            )}

            {step === 'class' && (
              <>
                <div><h1 className="title">Let’s set up your classroom</h1><p className="subtitle">Just the basics — students join with a code.</p></div>
                <div className="grow hide-scroll" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="field">
                    <span className="label">Class name</span>
                    <input className="input" value={className} maxLength={40}
                      onChange={(e) => setClassName(e.target.value)} placeholder="e.g. Mrs. Carter — Grade 3" />
                  </div>
                  <div className="field">
                    <span className="label">Grade / age range</span>
                    <div className="pill-row">
                      {AGES.map((a) => (
                        <button key={a.id} className={`chip ${classAge === a.id ? '' : 'chip--muted'}`}
                          onClick={() => { haptic('select'); setClassAge(a.id) }}>{a.name} · {a.range}</button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <span className="label">Classroom language</span>
                    <div className="pill-row">
                      {LANGUAGES.slice(0, 4).map((l) => (
                        <button key={l.code} className={`chip ${lang === l.code ? '' : 'chip--muted'}`}
                          onClick={() => { haptic('select'); setLang(l.code) }}>{l.native}</button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <span className="label">Region</span>
                    <select className="input" value={home} onChange={(e) => setHome(e.target.value as CountryCode)}>
                      {countryList().map((c) => (<option key={c.code} value={c.code}>{c.flag} {c.name}</option>))}
                    </select>
                  </div>
                </div>
                <button className="btn btn--teal" disabled={!className.trim()} onClick={makeClass}>Create class →</button>
              </>
            )}

            {step === 'code' && (
              <>
                <div><h1 className="title">Your class is ready</h1><p className="subtitle">Students enter this code to join {className.trim() || 'your class'}.</p></div>
                <div className="grow center" style={{ justifyContent: 'center', gap: 18 }}>
                  <motion.div className="joincode" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 16 }}>
                    {joinCode}
                  </motion.div>
                  <p className="subtitle" style={{ textAlign: 'center', maxWidth: 280 }}>
                    Share it on the board or in a message. You can make more classes anytime.
                  </p>
                </div>
                <button className="btn btn--teal" onClick={next}>Go to my class →</button>
              </>
            )}

            {step === 'joincode' && (
              <>
                <div><h1 className="title">Joining a class?</h1><p className="subtitle">Enter the code your teacher gave you.</p></div>
                <div className="grow center" style={{ justifyContent: 'center', gap: 14 }}>
                  <Mascot color="teal" pose="wave" size={104} />
                  <input className="input joincode-input" value={codeInput} autoCapitalize="characters"
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())} placeholder="MANNER-1234" />
                  {codeValid && (
                    <motion.div className="chip chip--teal" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      ✓ Looks good
                    </motion.div>
                  )}
                </div>
                <button className="btn btn--teal" disabled={!codeValid} onClick={next}>Continue →</button>
              </>
            )}

            {step === 'avatar' && (
              <>
                <div><h1 className="title">Pick your avatar</h1><p className="subtitle">This is you in Mannerly. No photos, ever.</p></div>
                <div className="avatar-grid grow" style={{ alignContent: 'center' }}>
                  {AVATARS.map((av) => (
                    <button key={av.id} className={`avatar-opt avatar-opt--lg ${avatar === av.id ? 'avatar-opt--on' : ''}`}
                      onClick={() => { haptic('select'); setAvatar(av.id) }}><Avatar id={av.id} size={46} /></button>
                  ))}
                </div>
                <button className="btn btn--teal" onClick={next}>Continue →</button>
              </>
            )}

            {step === 'ready' && (
              <ReadyBeat type={type} onLaunch={launch} avatar={avatar} kids={kids} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}

/* ============================================================
   Sub-beats
   ============================================================ */

function PassportBeat({ home, family, onNext }: { home: CountryCode; family: boolean; onNext: () => void }) {
  const country = COUNTRIES[home]
  const stamps = [
    { flag: '🌍', name: 'Global Core' },
    { flag: country?.flag ?? '🏠', name: country?.name ?? 'Home Region' },
  ]
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h1 className="title">{family ? 'Your Family Passport' : 'Your Manners Passport'}</h1>
        <p className="subtitle">Global Manners + your home region — included free.</p>
      </div>
      <div className="grow center" style={{ justifyContent: 'center' }}>
        <div className="passport-beat">
          {stamps.map((s, idx) => (
            <motion.div key={s.name} className="stamp stamp--got"
              initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.15 + idx * 0.35, type: 'spring', stiffness: 240, damping: 14 }}>
              <motion.span className="stamp__seal"
                initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 8 }}
                transition={{ delay: 0.45 + idx * 0.35, type: 'spring', stiffness: 260, damping: 12 }}>✓</motion.span>
              <span className="stamp-flag">{s.flag}</span>
              <span className="stamp-name">{s.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <button className="btn btn--teal" onClick={onNext}>Nice →</button>
    </>
  )
}

function ScenarioStep({
  age, pick, setPick, onNext,
}: {
  age: AgeGroup | null
  pick: string | null
  setPick: (id: string) => void
  onNext: () => void
}) {
  const scenario = starterFor(age)
  const chosen = scenario.choices.find((c) => c.id === pick)
  return (
    <>
      <div><span className="eyebrow">Try this</span><h1 className="title" style={{ marginTop: 6 }}>{scenario.prompt}</h1></div>
      <div className="options grow" style={{ justifyContent: 'center' }}>
        {scenario.choices.map((c) => {
          const cls = pick == null ? '' : c.id === pick ? (c.correct ? 'option--correct' : 'option--wrong') : c.correct ? 'option--correct' : 'option--dim'
          return (
            <button key={c.id} className={`option ${cls}`} disabled={pick != null}
              onClick={() => { haptic(c.correct ? 'success' : 'error'); setPick(c.id) }}>
              <span className="opt-emoji">{c.emoji}</span>{c.label}
            </button>
          )
        })}
      </div>
      {chosen && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="card" style={{ padding: 14, marginBottom: 12 }}>
          <div style={{ fontWeight: 800, marginBottom: 2 }}>{chosen.correct ? 'Nice.' : 'Good to know.'}</div>
          <div className="subtitle" style={{ color: 'var(--ink)', fontWeight: 600 }}>{chosen.reaction}</div>
          <div className="kicker" style={{ marginTop: 8 }}>Mannerly builds lessons like this around your age, goals & region.</div>
        </motion.div>
      )}
      <button className="btn btn--teal" disabled={pick == null} onClick={onNext}>Continue →</button>
    </>
  )
}

function ReadyBeat({
  type, onLaunch, avatar, kids,
}: {
  type: AccountType | null
  onLaunch: () => void
  avatar: string
  kids: { name: string; ageGroup: AgeGroup; avatarId: string }[]
}) {
  const cta =
    type === 'individual' ? 'Start my first lesson'
      : type === 'family' ? 'Start learning'
        : type === 'teacher' ? 'Open my class'
          : 'Start learning'
  const faceId = type === 'family' && kids[0] ? kids[0].avatarId : avatar
  return (
    <>
      <div className="grow center" style={{ justifyContent: 'center', gap: 18 }}>
        <motion.div className="ready-badge"
          initial={{ scale: 0.5, rotate: -20, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 12 }}>
          <Avatar id={faceId} size={112} />
          <motion.span className="ready-check"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 12 }}>
            <Icon name="check" size={24} color="#fff" strokeWidth={2.6} />
          </motion.span>
        </motion.div>
        <div style={{ textAlign: 'center' }}>
          <h1 className="title">You’re ready.</h1>
          <p className="subtitle" style={{ maxWidth: 300 }}>
            {type === 'teacher'
              ? 'Your class is set up with a starter lesson ready to assign.'
              : 'Mannerly knows where to begin. Let’s go.'}
          </p>
        </div>
      </div>
      <button className="btn" onClick={onLaunch}>{cta}</button>
    </>
  )
}
