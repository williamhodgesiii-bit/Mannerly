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
import Help from '@/screens/legal/Help'
import Privacy from '@/screens/legal/Privacy'
import Terms from '@/screens/legal/Terms'
import DeleteAccount from '@/screens/legal/DeleteAccount'
import { useProgress } from '@/state/store'
import { useEntitlements } from '@/state/entitlements'
import { useAccount } from '@/state/account'

/** Public pages reachable without completing onboarding (store/legal requirement). */
const PUBLIC_PREFIXES = ['/help', '/privacy', '/terms', '/account']

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

  // Push the live snapshot to the sync backend whenever progress or
  // entitlements change, so the signed-in account stays in sync.
  useEffect(() => {
    const save = () => useAccount.getState().persistActive()
    const unsubA = useProgress.subscribe(save)
    const unsubB = useEntitlements.subscribe(save)
    return () => {
      unsubA()
      unsubB()
    }
  }, [])

  const path = location.pathname
  const isPublic = PUBLIC_PREFIXES.some((p) => path.startsWith(p))
  const hideTab = path.startsWith('/lesson') || path.startsWith('/onboarding') || path.startsWith('/account') || !onboarded

  // gate the app behind onboarding, but let public (legal / account) pages through
  if (!onboarded && !path.startsWith('/onboarding') && !isPublic) {
    return (
      <div className="app-frame">
        <Onboarding />
      </div>
    )
  }

  return (
    <div className="app-frame">
      <div className="viewport">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={path}>
            <Route path="/onboarding" element={<Page><Onboarding /></Page>} />
            <Route path="/" element={<Page><Home /></Page>} />
            <Route path="/explore" element={<Page><Explore /></Page>} />
            <Route path="/course/:courseId" element={<Page><CourseDetail /></Page>} />
            <Route path="/lesson/:lessonId" element={<Page><Lesson /></Page>} />
            <Route path="/passport" element={<Page><Passport /></Page>} />
            <Route path="/me" element={<Page><Profile /></Page>} />
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
    </div>
  )
}
