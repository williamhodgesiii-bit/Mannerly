import LegalShell from './LegalShell'

export default function Terms() {
  return (
    <LegalShell
      title="Terms of Service"
      updated="[effective date]"
      intro={
        <>
          <div className="notice">
            Pre-launch draft. Complete the bracketed items and have counsel review it for your
            jurisdiction (governing law, arbitration, consumer-law carve-outs) before publishing.
          </div>
          <p>
            These Terms are an agreement between you and [Mannerly legal entity] ("Mannerly",
            "we", "us") governing your use of the Mannerly apps and website. By creating an
            account or using Mannerly, you accept these Terms and our{' '}
            <a href="#/privacy">Privacy Policy</a>.
          </p>
        </>
      }
    >
      <h2>1. Eligibility and children</h2>
      <p>
        If you are under the age of majority where you live, you may use Mannerly only with the
        involvement of a parent, guardian, or authorised school, who accepts these Terms on your
        behalf and is responsible for your use. Accounts for children under the age of digital
        consent must be created and managed by a parent, guardian, or school.
      </p>

      <h2>2. Your account</h2>
      <p>
        Keep your login details secure and give accurate information. You are responsible for
        activity under your account. Tell us promptly at <b>support@mannerly.com</b> if you
        suspect unauthorised use. Parents and teachers are responsible for the learner profiles
        they create and manage.
      </p>

      <h2>3. Subscriptions, purchases, and billing</h2>
      <ul>
        <li><b>Plans.</b> Mannerly+ (monthly or annual) and Mannerly Family (annual) are auto-renewing subscriptions. Travel Packs are one-time purchases.</li>
        <li><b>Billing.</b> Purchases made in the iOS or Android apps are billed by Apple or Google under their terms; web purchases are billed by our web payment provider. A subscription renews automatically unless cancelled at least 24 hours before the period ends.</li>
        <li><b>Cancellation.</b> Manage or cancel a store subscription in your Apple or Google account settings; manage a web subscription in your Mannerly account. Cancelling stops future renewals; access continues until the paid period ends.</li>
        <li><b>Refunds.</b> Refunds follow the policy of the store or processor that took the payment, plus any non-waivable rights under your local consumer law.</li>
        <li><b>Price changes.</b> We may change prices; changes apply to future renewals after notice, as each store requires.</li>
      </ul>

      <h2>4. What you get</h2>
      <p>
        Your access is defined by your entitlements (free tier, Mannerly+, Family, a school
        licence, or Travel Packs), not by any single store. Free content remains free. We may add,
        change, or retire lessons and features, and we update cultural content as customs and
        sources change.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>break the law or infringe others' rights;</li>
        <li>share, resell, or circumvent access to paid content;</li>
        <li>reverse-engineer, disrupt, or overload the service;</li>
        <li>upload harmful, abusive, or unlawful content; or</li>
        <li>use Mannerly to harass or endanger anyone, especially children.</li>
      </ul>

      <h2>6. Cultural content</h2>
      <p>
        Mannerly teaches judgement, not rigid rules. Etiquette varies by person, place, and
        situation, and our lessons describe what is commonly expected, why, and what to do when
        unsure. Content is educational and provided in good faith; it is not professional,
        legal, religious, or safety advice. If you find a lesson inaccurate, use the in-app{' '}
        <b>Report</b> action so our content team can review it.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        Mannerly, its logos, lessons, characters, and software are owned by us or our licensors
        and are protected by law. We grant you a personal, non-exclusive, non-transferable
        licence to use Mannerly for its intended purpose. You keep the rights to content you
        submit and grant us a limited licence to use it to operate and improve the service.
      </p>

      <h2>8. Disclaimers</h2>
      <p>
        Mannerly is provided "as is" and "as available." To the extent permitted by law, we
        disclaim implied warranties of merchantability, fitness for a particular purpose, and
        non-infringement. Some jurisdictions do not allow certain disclaimers, so parts of this
        section may not apply to you.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the extent permitted by law, Mannerly is not liable for indirect, incidental, special,
        or consequential damages, and our total liability for any claim is limited to the amount
        you paid us in the 12 months before the claim. Nothing here limits liability that cannot
        be limited by law, including your non-waivable consumer rights.
      </p>

      <h2>10. Termination</h2>
      <p>
        You may stop using Mannerly and delete your account at any time. We may suspend or end
        access if you materially breach these Terms or to protect users or the service. On
        termination, the rights granted to you end; sections meant to survive (ownership,
        disclaimers, liability, disputes) continue.
      </p>

      <h2>11. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of <b>[governing jurisdiction]</b>, without regard
        to conflict-of-laws rules. <b>[Insert dispute-resolution terms — venue, and any
        arbitration and class-action-waiver clause — reviewed for enforceability and consumer-law
        limits in each market, including any carve-outs required for EU/UK consumers.]</b>
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update these Terms. We will post the new version and, for material changes, give
        notice in the app or by email. Continuing to use Mannerly after changes take effect means
        you accept them.
      </p>

      <h2>13. Contact</h2>
      <p>Questions about these Terms: <b>support@mannerly.com</b>.</p>
    </LegalShell>
  )
}
