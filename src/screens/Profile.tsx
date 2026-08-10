import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Mascot from '@/components/Mascot'
import { levelFor, useProgress } from '@/state/store'
import { useEntitlements, useHeldPermissions } from '@/state/entitlements'
import { activePlan, travelPackPermission } from '@/lib/entitlements'
import { totalLessonCount } from '@/data/content'
import { COUNTRIES, countryList } from '@/data/countries'
import type { CountryCode } from '@/types'
import { haptic } from '@/lib/haptics'

const AGE_LABEL: Record<string, string> = { kids: 'Kids · 5–7', tweens: 'Tweens · 8–12', teens: 'Teens · 13–17', adults: 'Adults · 18+' }

export default function Profile() {
  const navigate = useNavigate()
  const { xp, streak, completed, ageGroup, stampedCountries, reset } = useProgress()
  const held = useHeldPermissions()
  const homeRegion = useEntitlements((s) => s.homeRegion)
  const setHomeRegion = useEntitlements((s) => s.setHomeRegion)
  const grant = useEntitlements((s) => s.grant)
  const revoke = useEntitlements((s) => s.revoke)
  const clearEntitlements = useEntitlements((s) => s.clearEntitlements)

  const doneCount = Object.keys(completed).length
  const lvl = levelFor(xp)
  const stamps = stampedCountries().length
  const plan = activePlan(held)
  const isPlus = held.has('MANNERLY_PLUS')

  // Owned one-time Travel Packs, for a small "what you own" summary.
  const ownedPacks = countryList().filter((c) => held.has(travelPackPermission(c.code)))

  const stats = [
    { n: `🔥 ${streak}`, l: 'Streak' },
    { n: `⚡ ${xp}`, l: 'Total XP' },
    { n: `${doneCount}/${totalLessonCount}`, l: 'Lessons' },
    { n: `📔 ${stamps}`, l: 'Stamps' },
  ]

  // Simulated web checkout: a successful transaction writes into the same
  // central entitlement ledger the mobile stores would write to.
  const startPlus = () => {
    haptic('success')
    grant('MANNERLY_PLUS', 'web')
  }
  const cancelPlus = () => {
    if (confirm('Cancel Manners+? Country packs will lock again (except your home region).')) {
      haptic('tap')
      revoke('MANNERLY_PLUS')
    }
  }

  const changeHome = (code: CountryCode) => {
    haptic('tap')
    setHomeRegion(code)
  }

  // Store requirement (Apple + Google): let people delete their account and
  // associated data from inside the app. Wipes progress + entitlements + storage.
  const doDeleteAccount = () => {
    if (!confirm('Delete your Mannerly account? This erases your progress, entitlements and preferences on this device. This cannot be undone.')) return
    haptic('error')
    reset()
    clearEntitlements()
    try {
      localStorage.removeItem('mannerly-progress-v1')
      localStorage.removeItem('mannerly-entitlements-v1')
    } catch {
      /* storage may be unavailable; state reset already applied */
    }
    navigate('/onboarding', { replace: true })
  }

  return (
    <div className="screen has-tabbar">
      <Header title="Me" />
      <div className="screen--padded" style={{ paddingTop: 14 }}>
        {/* identity */}
        <div className="center" style={{ gap: 6, marginBottom: 12 }}>
          <div style={{ background: 'var(--navy-100)', borderRadius: '50%', width: 108, height: 108, display: 'grid', placeItems: 'center' }}>
            <Mascot color="navy" size={92} pose="idle" bob={false} />
          </div>
          <h1 className="title" style={{ fontSize: 22 }}>Learner</h1>
          <div className="pill-row" style={{ justifyContent: 'center' }}>
            <span className="chip chip--teal">{lvl.current.icon} {lvl.current.name}</span>
            <span className="chip">{plan.icon} {plan.label}</span>
          </div>
        </div>

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

        {/* Manners+ — reflects the real entitlement state */}
        {isPlus ? (
          <div className="card" style={{ padding: 18, marginBottom: 16, background: 'linear-gradient(135deg, var(--teal-500, #52B7A4), var(--navy-600))', color: '#fff', border: 'none' }}>
            <div className="spread">
              <div>
                <div style={{ fontWeight: 900, fontSize: 18 }}>Manners+ is active ⭐</div>
                <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9, marginTop: 2 }}>
                  Every country & travel mode unlocked.
                </div>
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
                <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9, marginTop: 2 }}>
                  Every country, travel mode & more.
                </div>
              </div>
              <span style={{ fontWeight: 900 }}>$6.99<span style={{ fontSize: 12, opacity: 0.8 }}>/mo</span></span>
            </div>
            <button className="btn btn--gold" style={{ marginTop: 14 }} onClick={startPlus}>
              Try 7 days free
            </button>
          </div>
        )}

        {/* settings */}
        <div className="section-title">Settings</div>
        <div className="stack" style={{ gap: 12 }}>
          {/* age group */}
          <div className="tile" style={{ cursor: 'default' }}>
            <span className="tile-flag" style={{ fontSize: 22 }}>🎂</span>
            <div className="grow"><div className="tile-name">Age group</div><div className="tile-sub">{ageGroup ? AGE_LABEL[ageGroup] : 'Not set'}</div></div>
            <button className="chip" onClick={() => { haptic('tap'); navigate('/onboarding') }}>Change</button>
          </div>

          {/* home region — unlocks that country pack on the free tier */}
          <div className="tile" style={{ cursor: 'default' }}>
            <span className="tile-flag" style={{ fontSize: 22 }}>{COUNTRIES[homeRegion]?.flag ?? '🏠'}</span>
            <div className="grow">
              <div className="tile-name">Home region</div>
              <div className="tile-sub">Free pack for where you live</div>
            </div>
            <select
              className="chip"
              aria-label="Home region"
              value={homeRegion}
              onChange={(e) => changeHome(e.target.value as CountryCode)}
              style={{ fontWeight: 700, border: 'none', background: 'var(--navy-100)', cursor: 'pointer' }}
            >
              {countryList().map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>

          {/* owned travel packs, if any */}
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
          <button className="tile" onClick={doDeleteAccount}>
            <span className="tile-flag" style={{ fontSize: 22 }}>🗑️</span>
            <div className="grow"><div className="tile-name" style={{ color: 'var(--coral-600)' }}>Delete account</div><div className="tile-sub">Erase your data from this device</div></div>
          </button>
        </div>

        <p className="kicker" style={{ textAlign: 'center', marginTop: 22 }}>
          Mannerly · confidence in every culture
        </p>
      </div>
    </div>
  )
}
