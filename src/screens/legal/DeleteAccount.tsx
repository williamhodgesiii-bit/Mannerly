import { useNavigate } from 'react-router-dom'
import LegalShell from './LegalShell'
import { useAccount } from '@/state/account'
import { useProgress } from '@/state/store'
import { useEntitlements } from '@/state/entitlements'
import { useProfiles } from '@/state/profiles'
import { haptic } from '@/lib/haptics'

export default function DeleteAccount() {
  const navigate = useNavigate()
  const account = useAccount((s) => s.account)
  const deleteAccount = useAccount((s) => s.deleteAccount)
  const resetProgress = useProgress((s) => s.reset)
  const clearEntitlements = useEntitlements((s) => s.clearEntitlements)
  const resetProfiles = useProfiles((s) => s.resetProfiles)

  const wipeLocal = () => {
    try {
      localStorage.removeItem('mannerly-progress-v1')
      localStorage.removeItem('mannerly-entitlements-v1')
    } catch {
      /* storage may be unavailable */
    }
  }

  const doDelete = () => {
    const msg = account
      ? `Delete the account ${account.email ?? account.displayName}? This erases your progress, entitlements, learner profiles and preferences. This cannot be undone.`
      : 'Erase your progress, entitlements, learner profiles and preferences on this device? This cannot be undone.'
    if (!confirm(msg)) return
    haptic('error')
    resetProfiles() // household children / class data + their snapshots
    if (account) {
      deleteAccount()
    } else {
      resetProgress()
      clearEntitlements()
    }
    wipeLocal()
    navigate('/', { replace: true })
  }

  return (
    <LegalShell
      title="Delete account"
      intro={
        <p>
          You can delete your Mannerly account and its data at any time — from this page or in
          the app under <b>Me → Settings → Delete account</b>. This is also the web resource for
          requesting deletion, as required by the app stores.
        </p>
      }
    >
      <h2>What gets deleted</h2>
      <ul>
        <li>Your account and sign-in details</li>
        <li>Learning progress — XP, streaks, completed lessons, and passport stamps</li>
        <li>Entitlement records tied to your account (see the note on store purchases below)</li>
        <li>Profile preferences — age band, home region, language, and accessibility settings</li>
      </ul>

      <h2>Timeline</h2>
      <p>
        Deletion is immediate on this device. Where a Mannerly backend account exists, associated
        data is erased or irreversibly anonymised within <b>[30] days</b>, except records we must
        keep for legal, tax, or fraud-prevention reasons.
      </p>

      <h2>Child profiles</h2>
      <p>
        A parent or guardian deletes a child profile from the Family area. Removing one learner
        profile does not delete the whole household account, so other profiles are unaffected.
      </p>

      <h2>School data</h2>
      <p>
        For classroom accounts, the school or district controls student records. Teachers and
        administrators can request deletion of student data through the school dashboard or by
        emailing <b>privacy@mannerly.com</b>.
      </p>

      <h2>Store purchases</h2>
      <p>
        Deleting your account removes Mannerly's record of your access. Subscriptions billed by
        Apple or Google must also be cancelled in those accounts to stop future charges — deleting
        your Mannerly account does not cancel a store subscription.
      </p>

      <h2>Request deletion another way</h2>
      <p>
        If you cannot sign in, email <b>privacy@mannerly.com</b> from the address on your account
        and we will verify and process your request. For a child's data, a parent, guardian, or
        school may make the request.
      </p>

      <div className="danger-zone">
        <button className="btn btn--coral" onClick={doDelete}>
          {account ? 'Delete my account' : 'Erase my data on this device'}
        </button>
        <button className="btn btn--ghost" onClick={() => navigate(-1)} style={{ marginTop: 10 }}>
          Cancel
        </button>
      </div>
    </LegalShell>
  )
}
