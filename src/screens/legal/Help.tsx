import { Link } from 'react-router-dom'
import LegalShell from './LegalShell'

interface QA {
  q: string
  a: React.ReactNode
}

const SECTIONS: { title: string; items: QA[] }[] = [
  {
    title: 'Account',
    items: [
      { q: 'Create an account', a: 'Open Me → Sign in / Create account, or tap Create your account during setup. You can use an email and password, or continue with Google or Apple. One account keeps your progress on every device.' },
      { q: 'Forgot your password', a: 'On the sign-in screen choose Reset password and follow the email link. Google and Apple sign-ins are managed in those accounts, not in Mannerly.' },
      { q: 'Change your home region', a: 'Me → Settings → Home region. Your home region is included free; changing it swaps which country pack is unlocked at no cost.' },
      { q: 'Change your language', a: 'Me → Settings → Language (as interface languages are released). Cultural lessons always name the specific country and situation they describe.' },
    ],
  },
  {
    title: 'Families',
    items: [
      { q: 'Add a child profile', a: 'A parent or guardian creates and manages child profiles from the Family area. Children under the age of digital consent must be added by an adult.' },
      { q: 'See your child’s progress', a: 'Open the Family dashboard to view each learner’s streak, completed lessons, and mastery. Family learning focuses on shared practice, not surveillance.' },
      { q: 'Delete one child profile', a: 'Removing a single learner profile does not delete the whole household account. Parents control each profile’s data separately.' },
    ],
  },
  {
    title: 'Classrooms',
    items: [
      { q: 'Teacher accounts', a: 'Teachers create classes, assign lessons, and view completion from the web dashboard. Students can then learn on any device.' },
      { q: 'Join with a class code', a: 'Students enter the class code from their teacher. For linked child accounts, a parent approves the connection first.' },
    ],
  },
  {
    title: 'Subscriptions & packs',
    items: [
      { q: 'Plans', a: 'Mannerly+ (monthly or annual) and Mannerly Family (annual) unlock every country and travel content. Travel Packs are one-time unlocks for a single country. Basic manners stay free forever.' },
      { q: 'Restore purchases', a: 'Sign in with the same account you bought with. On iOS or Android, use Restore purchases so store receipts re-sync to your entitlements.' },
      { q: 'Cancel', a: 'Manage store subscriptions in your Apple or Google settings; manage a web subscription in your Mannerly account. Access continues until the paid period ends.' },
    ],
  },
  {
    title: 'Accessibility & privacy',
    items: [
      { q: 'Accessibility', a: 'Lessons support narration and reduced-reading modes for younger learners. Set accommodations in Settings; teachers can set classroom accommodations too.' },
      { q: 'Privacy & your data', a: <>Read the <Link to="/privacy" className="src-link">Privacy Policy</Link>. You can access, correct, export, or delete your data at any time.</> },
      { q: 'Delete your account', a: <>Me → Settings → Delete account, or visit the <Link to="/account/delete" className="src-link">Delete account</Link> page. This erases your progress, entitlements, and preferences.</> },
    ],
  },
  {
    title: 'Cultural accuracy',
    items: [
      { q: 'Report inaccurate etiquette', a: 'Every cultural lesson has a Report action. Reports go to our content-review queue, not general support, so a reviewer can check the sources and correct it.' },
    ],
  },
]

export default function Help() {
  return (
    <LegalShell
      title="Help & Support"
      intro={<p>Find answers below, or email <b>support@mannerly.com</b>. For content accuracy, use the Report action inside any lesson.</p>}
    >
      {SECTIONS.map((s) => (
        <section key={s.title}>
          <h2>{s.title}</h2>
          {s.items.map((it) => (
            <div key={it.q} className="qa">
              <h3>{it.q}</h3>
              <p>{it.a}</p>
            </div>
          ))}
        </section>
      ))}
    </LegalShell>
  )
}
