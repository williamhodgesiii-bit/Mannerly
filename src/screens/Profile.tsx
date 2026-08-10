import { Link, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import { levelFor, useProgress } from '@/state/store'
import { useEntitlements, useHeldPermissions } from '@/state/entitlements'
import { useAccount } from '@/state/account'
import { useProfiles } from '@/state/profiles'
import { activePlan, travelPackPermission } from '@/lib/entitlements'
import { totalLessonCount } from '@/data/content'
import { COUNTRIES, countryList } from '@/data/countries'
import { LANGUAGES, LANGUAGE_MAP } from '@/data/languages'
import { GOAL_MAP } from '@/data/goals'
import { avatarEmoji } from '@/data/avatars'
import type { CountryCode, LanguageCode } from '@/types'
import { haptic } from '@/lib/haptics'

const AGE_LABEL: Record<string, string> = { kids: 'Kids · 5–7', tweens: 'Tweens · 8–12', teens: 'Teens · 13–17', adults: 'Adults · 18+' }

export default function Profile() {
  const navigate = useNavigate()
  const { xp, streak, completed, ageGroup, language, goals, avatarId, accountType, stampedCountries, reset, setLanguage } = useProgress()
  const held = useHeldPermissions()
  const homeRegion = useEntitlements((s) => s.homeRegion)
  const setHomeRegion = useEntitlements((s) => s.setHomeRegion)
  const grant = useEntitlements((s) => s.grant)
  const revoke = useEntitlements((s) => s.revoke)
  const account = useAccount((s) => s.account)
  const signOut = useAccount((s) => s.signOut)

  const children = useProfiles((s) => s.children)
  const activeChildId = useProfiles((s) => s.activeChildId)
  const classroom = useProfiles((s) => s.classroom)
  const joinedClassCode = useProfiles((s) => s.joinedClassCode)
  const switchToChild = useProfiles((s) => s.switchToChild)
  const switchToPrimary = useProfiles((s) => s.switchToPrimary)

  const activeChild = children.find((c) => c.id === activeChildId)
  const displayName = activeChild?.name ?? account?.displayName ?? 'Guest'
  const isPrimary = activeChildId == null

  const doneCount = Object.keys(completed).length
  const lvl = levelFor(xp)
  const stamps = stampedCountries().length
  const plan = activePlan(held)
  const isPlus = held.has('MANNERLY_PLUS')
  const ownedPacks = countryList().filter((c) => held.has(travelPackPermission(c.code)))

  const stats = [
    { n: `🔥 ${streak}`, l: 'Streak' },
    { n: `⚡ ${xp}`, l: 'Total XP' },
    { n: `${doneCount}/${totalLessonCount}`, l: 'Lessons' },
    { n: `📔 ${stamps}`, l: 'Stamps' },
  ]

  const startPlus = () => { haptic('success'); grant('MANNERLY_PLUS', 'web') }
  const cancelPlus = () => {
    if (confirm('Cancel Manners+? Country packs will lock again (except your home region).')) {
      haptic('tap'); revoke('MANNERLY_PLUS')
    }
  }
  const changeHome = (code: CountryCode) => { haptic('tap'); setHomeRegion(code) }
  const doSignOut = () => { haptic('tap'); signOut() }

  const showRoster = accountType === 'family' || children.length > 0

  return (
    <div className="screen has-tabbar">
      <Header title="Me" />
      <div className="screen--padded" style={{ paddingTop: 14 }}>
        {/* identity */}
        <div className="center" style={{ gap: 6, marginBottom: 12 }}>
          <div className="profile-avatar">{avatarEmoji(avatarId)}</div>
          <h1 className="title" style={{ fontSize: 22 }}>{displayName}</h1>
          {isPrimary && account?.email && <div className="kicker">{account.email}</div>}
          {activeChild && <div className="kicker">Learner profile</div>}
          <div className="pill-row" style={{ justifyContent: 'center' }}>
            <span className="chip chip--teal">{lvl.current.icon} {lvl.current.name}</span>
            <span className="chip">{plan.icon} {plan.label}</span>
          </div>
          {isPrimary && !account && (
            <button className="btn btn--sm" style={{ marginTop: 8 }} onClick={() => { haptic('tap'); navigate('/account') }}>
              Sign in / Create account
            </button>
          )}
        </div>

        {/* household switcher — "Who's learning?" */}
        {showRoster && (
          <div className="card" style={{ padding: 14, marginBottom: 16 }}>
            <div className="section-title" style={{ margin: '0 0 10px' }}>Who’s learning?</div>
            <div className="roster">
              <button className={`roster-item ${isPrimary ? 'roster-item--on' : ''}`} onClick={() => { haptic('select'); switchToPrimary() }}>
                <span className="roster-ava">{isPrimary ? avatarEmoji(avatarId) : '👤'}</span>
                <span className="roster-name">You</span>
              </button>
              {children.map((c) => (
                <button key={c.id} className={`roster-item ${activeChildId === c.id ? 'roster-item--on' : ''}`}
                  onClick={() => { haptic('select'); switchToChild(c.id) }}>
                  <span className="roster-ava">{avatarEmoji(c.avatarId)}</span>
                  <span className="roster-name">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* teacher class code */}
        {accountType === 'teacher' && classroom && (
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div className="spread">
              <div>
                <div style={{ fontWeight: 900, fontSize: 16 }}>{classroom.name}</div>
                <div className="tile-sub">{AGE_LABEL[classroom.gradeAge]}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="kicker">Join code</div>
                <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: '0.05em', color: 'var(--navy-600)' }}>{classroom.joinCode}</div>
              </div>
            </div>
          </div>
        )}

        {/* student joined class */}
        {accountType === 'student' && joinedClassCode && (
          <div className="card" style={{ padding: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 26 }}>🎒</span>
            <div className="grow"><div style={{ fontWeight: 800 }}>In a class</div><div className="tile-sub">Code {joinedClassCode}</div></div>
          </div>
        )}

        {/* level bar */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="spread" style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 800 }}>{lvl.current.name}</span>
            <span className="kicker">{lvl.next ? `${lvl.pct}% to ${lvl.next.name}` : 'Max level'}</span>
          </div>
          <div className="track"><div className="fill" style={{ width: `${lvl.pct}%` }} /></div>
        </div>

        {/* stats grid */}
        <div className="passport-grid" style={{ marginBottom: 16 }}>
          {stats.map((s) => (
            <div key={s.l} className="card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 20 }}>{s.n}</div>
              <div className="kicker" style={{ marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* goals */}
        {goals.length > 0 && (
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div className="section-title" style={{ margin: '0 0 10px' }}>Learning goals</div>
            <div className="pill-row">
              {goals.map((g) => (
                <span key={g} className="chip chip--muted">{GOAL_MAP[g]?.emoji} {GOAL_MAP[g]?.label}</span>
              ))}
            </div>
          </div>
        )}

        {/* Manners+ — reflects the real entitlement state */}
        {isPlus ? (
          <div className="card" style={{ padding: 18, marginBottom: 16, background: 'linear-gradient(135deg, var(--teal-500), var(--navy-600))', color: '#fff', border: 'none' }}>
            <div className="spread">
              <div>
                <div style={{ fontWeight: 900, fontSize: 18 }}>Manners+ is active ⭐</div>
                <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9, marginTop: 2 }}>Every country & travel mode unlocked.</div>
              </div>
            </div>
            <button className="btn" style={{ marginTop: 14, background: 'rgba(255,255,255,0.16)', color: '#fff' }} onClick={cancelPlus}>
              Manage subscription
            </button>
          </div>
        ) : (
          <div className="card" style={{ padding: 18, marginBottom: 16, background: 'linear-gradient(135deg, var(--navy-500), var(--navy-600))', color: '#fff', border: 'none' }}>
            <div className="spread">
              <div>
                <div style={{ fontWeight: 900, fontSize: 18 }}>Manners+ ⭐</div>
                <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9, marginTop: 2 }}>Every country, travel mode & more.</div>
              </div>
              <span style={{ fontWeight: 900 }}>$6.99<span style={{ fontSize: 12, opacity: 0.8 }}>/mo</span></span>
            </div>
            <button className="btn btn--gold" style={{ marginTop: 14 }} onClick={startPlus}>Try 7 days free</button>
          </div>
        )}

        {/* settings */}
        <div className="section-title">Settings</div>
        <div className="stack" style={{ gap: 12 }}>
          {/* account — only for the primary profile */}
          {isPrimary && (
            <div className="tile" style={{ cursor: 'default' }}>
              <span className="tile-flag" style={{ fontSize: 22 }}>{account ? '👤' : '🔐'}</span>
              <div className="grow">
                <div className="tile-name">Account</div>
                <div className="tile-sub">{account ? (account.email ?? account.displayName) : 'Not signed in'}</div>
              </div>
              {account
                ? <button className="chip" onClick={doSignOut}>Sign out</button>
                : <button className="chip" onClick={() => { haptic('tap'); navigate('/account') }}>Sign in</button>}
            </div>
          )}

          {/* age group */}
          <div className="tile" style={{ cursor: 'default' }}>
            <span className="tile-flag" style={{ fontSize: 22 }}>🎂</span>
            <div className="grow"><div className="tile-name">Age group</div><div className="tile-sub">{ageGroup ? AGE_LABEL[ageGroup] : 'Not set'}</div></div>
            <button className="chip" onClick={() => { haptic('tap'); navigate('/onboarding') }}>Change</button>
          </div>

          {/* language */}
          <div className="tile" style={{ cursor: 'default' }}>
            <span className="tile-flag" style={{ fontSize: 22 }}>🗣️</span>
            <div className="grow">
              <div className="tile-name">Language</div>
              <div className="tile-sub">{LANGUAGE_MAP[language]?.native ?? 'English'}</div>
            </div>
            <select className="chip" aria-label="Language" value={language}
              onChange={(e) => { haptic('tap'); setLanguage(e.target.value as LanguageCode) }}
              style={{ fontWeight: 700, border: 'none', background: 'var(--navy-100)', cursor: 'pointer' }}>
              {LANGUAGES.map((l) => (<option key={l.code} value={l.code}>{l.native}</option>))}
            </select>
          </div>

          {/* home region */}
          <div className="tile" style={{ cursor: 'default' }}>
            <span className="tile-flag" style={{ fontSize: 22 }}>{COUNTRIES[homeRegion]?.flag ?? '🏠'}</span>
            <div className="grow">
              <div className="tile-name">Home region</div>
              <div className="tile-sub">Free pack for where you live</div>
            </div>
            <select className="chip" aria-label="Home region" value={homeRegion}
              onChange={(e) => changeHome(e.target.value as CountryCode)}
              style={{ fontWeight: 700, border: 'none', background: 'var(--navy-100)', cursor: 'pointer' }}>
              {countryList().map((c) => (<option key={c.code} value={c.code}>{c.flag} {c.name}</option>))}
            </select>
          </div>

          {/* owned travel packs */}
          {ownedPacks.length > 0 && (
            <div className="tile" style={{ cursor: 'default' }}>
              <span className="tile-flag" style={{ fontSize: 22 }}>🎟️</span>
              <div className="grow">
                <div className="tile-name">Travel Packs</div>
                <div className="tile-sub">{ownedPacks.map((c) => c.name).join(' · ')}</div>
              </div>
            </div>
          )}

          <button className="tile" onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) { haptic('error'); reset(); navigate('/onboarding', { replace: true }) } }}>
            <span className="tile-flag" style={{ fontSize: 22 }}>♻️</span>
            <div className="grow"><div className="tile-name" style={{ color: 'var(--coral-600)' }}>Reset progress</div><div className="tile-sub">Start over, keep your account</div></div>
          </button>

          {/* store-required account deletion */}
          {isPrimary && (
            <button className="tile" onClick={() => { haptic('tap'); navigate('/account/delete') }}>
              <span className="tile-flag" style={{ fontSize: 22 }}>🗑️</span>
              <div className="grow"><div className="tile-name" style={{ color: 'var(--coral-600)' }}>Delete account</div><div className="tile-sub">Erase your data</div></div>
              <span className="tile-go">›</span>
            </button>
          )}
        </div>

        {/* legal / support */}
        <nav className="legal-links">
          <Link to="/help" className="src-link">Help</Link>
          <Link to="/privacy" className="src-link">Privacy</Link>
          <Link to="/terms" className="src-link">Terms</Link>
        </nav>
        <p className="kicker" style={{ textAlign: 'center', marginTop: 12 }}>
          Mannerly · confidence in every culture
        </p>
      </div>
    </div>
  )
}
