import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import TabBar from '@/components/TabBar'
import Onboarding from '@/screens/Onboarding'
import Home from '@/screens/Home'
import Explore from '@/screens/Explore'
import CourseDetail from '@/screens/CourseDetail'
import Lesson from '@/screens/Lesson'
import Passport from '@/screens/Passport'
import Profile from '@/screens/Profile'
import { useProgress } from '@/state/store'

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

  const path = location.pathname
  const hideTab = path.startsWith('/lesson') || path.startsWith('/onboarding')

  // gate the app behind onboarding
  if (!onboarded && !path.startsWith('/onboarding')) {
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
      {!hideTab && <TabBar />}
    </div>
  )
}
