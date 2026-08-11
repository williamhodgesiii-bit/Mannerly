import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { type ReactNode, useEffect } from 'react'
import TabBar from '@/components/TabBar'
import Onboarding from '@/screens/Onboarding'
import Home from '@/screens/Home'
import Explore from '@/screens/Explore'
import CourseDetail from '@/screens/CourseDetail'
import Lesson from '@/screens/Lesson'
import Passport from '@/screens/Passport'
import Profile from '@/screens/Profile'
import Auth from '@/screens/Auth'
import Sheets from '@/components/Sheets'
import Help from '@/screens/legal/Help'
import Privacy from '@/screens/legal/Privacy'
import Terms from '@/screens/legal/Terms'
import DeleteAccount from '@/screens/legal/DeleteAccount'
import { useProgress } from '@/state/store'
import { useEntitlements } from '@/state/entitlements'
import { useAccount } from '@/state/account'
import { useProfiles } from '@/state/profiles'

function Page({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  const onboarded = useProgress((s) => s.onboarded)
  const a11y = useProgress((s) => s.a11y)
  const authReady = useAccount((s) => s.authReady)

  // Restore an existing account session (Supabase) before first paint.
  useEffect(() => { void useAccount.getState().initAuth() }, [])

  // Push the live snapshot to the sync backend whenever progress or
  // entitlements change, so the active learner (account holder or the
  // child currently learning) stays in sync.
  useEffect(() => {
    const save = () => useProfiles.getState().persistLive()
    const unsubA = useProgress.subscribe(save)
    const unsubB = useEntitlements.subscribe(save)
    // Signing in/out swaps the whole account snapshot — drop any active
    // child so we land on the account holder's own profile.
    let lastId = useAccount.getState().account?.id ?? 'guest'
    const unsubC = useAccount.subscribe((s) => {
      const id = s.account?.id ?? 'guest'
      if (id !== lastId) {
        lastId = id
        useProfiles.setState({ activeChildId: null })
      }
    })
    return () => {
      unsubA()
      unsubB()
      unsubC()
    }
  }, [])

  // Reflect accessibility choices on the document root for CSS to key off.
  useEffect(() => {
    const el = document.documentElement
    el.toggleAttribute('data-large-text', a11y.largeText)
    el.toggleAttribute('data-reduce-motion', a11y.reduceMotion)
    el.toggleAttribute('data-contrast', a11y.highContrast)
  }, [a11y])

  const path = location.pathname
  const hideTab = path.startsWith('/lesson') || path.startsWith('/onboarding') || path.startsWith('/account') || !onboarded

  // Avoid a flash of onboarding while the session is still being restored.
  if (!authReady) {
    return <div className="app-frame" aria-busy="true" />
  }

  // Gate protected routes behind onboarding; public (legal / account) and the
  // onboarding page itself always render. Onboarding lives inside the same
  // shell as every other screen, so the frame height stays uniform.
  const gate = (el: ReactNode) => (onboarded ? el : <Navigate to="/onboarding" replace />)

  return (
    <div className="app-frame">
      <div className="viewport">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={path}>
            <Route path="/onboarding" element={<Page><Onboarding /></Page>} />
            <Route path="/" element={<Page>{gate(<Home />)}</Page>} />
            <Route path="/explore" element={<Page>{gate(<Explore />)}</Page>} />
            <Route path="/course/:courseId" element={<Page>{gate(<CourseDetail />)}</Page>} />
            <Route path="/lesson/:lessonId" element={<Page>{gate(<Lesson />)}</Page>} />
            <Route path="/passport" element={<Page>{gate(<Passport />)}</Page>} />
            <Route path="/me" element={<Page>{gate(<Profile />)}</Page>} />
            <Route path="/account" element={<Page><Auth /></Page>} />
            <Route path="/account/delete" element={<Page><DeleteAccount /></Page>} />
            <Route path="/help" element={<Page><Help /></Page>} />
            <Route path="/privacy" element={<Page><Privacy /></Page>} />
            <Route path="/terms" element={<Page><Terms /></Page>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
      {!hideTab && <TabBar />}
      {onboarded && <Sheets />}
    </div>
  )
}
