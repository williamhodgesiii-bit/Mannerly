import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Mascot from '@/components/Mascot'
import { useAccount } from '@/state/account'
import { useProfiles } from '@/state/profiles'
import { isSupabaseConfigured } from '@/lib/supabase'
import { haptic } from '@/lib/haptics'

type Mode = 'signin' | 'create'

export default function Auth() {
  const navigate = useNavigate()
  const signUpPassword = useAccount((s) => s.signUpPassword)
  const signInPassword = useAccount((s) => s.signInPassword)
  const signInWithProvider = useAccount((s) => s.signInWithProvider)
  const resetPassword = useAccount((s) => s.resetPassword)

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  const done = () => { haptic('success'); navigate('/', { replace: true }) }

  // Seed a dev/sample account's household or classroom after it signs in.
  const applySeed = (seed?: import('@/state/account').DevSeed) => {
    if (!seed) return
    const p = useProfiles.getState()
    p.resetProfiles()
    seed.children?.forEach((c) => p.addChild(c))
    if (seed.classroom) p.createClassroom(seed.classroom)
    if (seed.joinedClass) p.joinClass(seed.joinedClass)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    setError(''); setNote(''); setBusy(true)
    const res =
      mode === 'create'
        ? await signUpPassword(email, username, password)
        : await signInPassword(email, password)
    setBusy(false)
    if (res.ok) { applySeed(res.seed); done() }
    else { haptic('error'); setError(res.error) }
  }

  const oauth = async (provider: 'google' | 'apple') => {
    if (busy) return
    setError(''); setNote(''); setBusy(true)
    const res = await signInWithProvider(provider)
    setBusy(false)
    if (res.ok) done()
    else { haptic('error'); setError(res.error) }
  }

  const forgot = async () => {
    if (!email.trim()) { setError('Enter your email first, then tap reset.'); return }
    setError(''); setBusy(true)
    const res = await resetPassword(email)
    setBusy(false)
    if (res.ok) setNote(isSupabaseConfigured ? 'Check your email for a reset link.' : 'Password reset isn’t available in offline mode.')
    else setError(res.error)
  }

  return (
    <div className="screen">
      <Header back stats={false} title="Account" />
      <div className="screen--padded" style={{ paddingTop: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="center" style={{ gap: 8, marginBottom: 16 }}>
            <Mascot color="navy" pose="wave" size={84} />
            <h1 className="title" style={{ fontSize: 22, textAlign: 'center' }}>
              {mode === 'create' ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="subtitle" style={{ textAlign: 'center', maxWidth: 320 }}>
              One account keeps your progress, streak and packs on every device.
            </p>
          </div>

          {/* provider sign-in */}
          <div className="stack" style={{ gap: 10, marginBottom: 14 }}>
            <button type="button" className="oauth" onClick={() => oauth('google')} disabled={busy}>
              <span className="oauth__mark" aria-hidden>G</span>
              Continue with Google
            </button>
            <button type="button" className="oauth oauth--apple" onClick={() => oauth('apple')} disabled={busy}>
              <span className="oauth__mark" aria-hidden></span>
              Continue with Apple
            </button>
          </div>

          <div className="or"><span>or</span></div>

          {/* segmented control */}
          <div className="seg" role="tablist" aria-label="Sign in or create account">
            <button
              role="tab"
              aria-selected={mode === 'signin'}
              className={`seg__btn ${mode === 'signin' ? 'seg__btn--on' : ''}`}
              onClick={() => { haptic('select'); setMode('signin'); setError(''); setNote('') }}
            >
              Sign in
            </button>
            <button
              role="tab"
              aria-selected={mode === 'create'}
              className={`seg__btn ${mode === 'create' ? 'seg__btn--on' : ''}`}
              onClick={() => { haptic('select'); setMode('create'); setError(''); setNote('') }}
            >
              Create account
            </button>
          </div>

          <form onSubmit={submit} className="stack" style={{ gap: 12, marginTop: 14 }}>
            <label className="field">
              <span className="label">Email</span>
              <input
                className="input"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            {mode === 'create' && (
              <label className="field">
                <span className="label">Display name</span>
                <input
                  className="input"
                  type="text"
                  autoComplete="nickname"
                  placeholder="What should we call you?"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
            )}

            <label className="field">
              <span className="label">Password</span>
              <input
                className="input"
                type="password"
                autoComplete={mode === 'create' ? 'new-password' : 'current-password'}
                placeholder={mode === 'create' ? 'At least 8 characters' : 'Your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error && <p className="form-error" role="alert">{error}</p>}
            {note && <p className="form-note" role="status">{note}</p>}

            <button className="btn" type="submit" style={{ marginTop: 2 }} disabled={busy}>
              {busy ? 'One moment…' : mode === 'create' ? 'Create account' : 'Sign in'}
            </button>
          </form>

          {mode === 'signin' && (
            <p className="kicker" style={{ textAlign: 'center', marginTop: 12 }}>
              <button type="button" className="src-link" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }} onClick={forgot} disabled={busy}>
                Forgot your password?
              </button>
            </p>
          )}

          <p className="kicker" style={{ textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
            By continuing you agree to our{' '}
            <Link to="/terms" className="src-link">Terms</Link> and{' '}
            <Link to="/privacy" className="src-link">Privacy Policy</Link>.
          </p>
          <p className="kicker" style={{ textAlign: 'center', marginTop: 10 }}>
            <button
              type="button"
              className="src-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
              onClick={() => navigate('/', { replace: true })}
            >
              Continue as guest
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
