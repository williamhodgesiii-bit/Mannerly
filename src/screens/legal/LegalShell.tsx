import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'

interface LegalShellProps {
  title: string
  updated?: string
  intro?: ReactNode
  children: ReactNode
}

/** Shared layout for the public Help / Privacy / Terms / Deletion pages. */
export default function LegalShell({ title, updated, intro, children }: LegalShellProps) {
  return (
    <div className="screen">
      <Header back stats={false} title={title} />
      <div className="screen--padded" style={{ paddingTop: 8, paddingBottom: 40 }}>
        <article className="prose">
          <h1>{title}</h1>
          {updated && <p className="prose__meta">Last updated {updated}</p>}
          {intro}
          {children}
        </article>

        <nav className="legal-links">
          <Link to="/help" className="src-link">Help</Link>
          <Link to="/privacy" className="src-link">Privacy</Link>
          <Link to="/terms" className="src-link">Terms</Link>
          <Link to="/account/delete" className="src-link">Delete account</Link>
        </nav>
        <p className="kicker" style={{ textAlign: 'center', marginTop: 12 }}>
          Mannerly · confidence in every culture
        </p>
      </div>
    </div>
  )
}
