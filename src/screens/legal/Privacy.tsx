import LegalShell from './LegalShell'

export default function Privacy() {
  return (
    <LegalShell
      title="Privacy Policy"
      updated="[effective date]"
      intro={
        <>
          <div className="notice">
            Pre-launch draft. Complete the bracketed items and have counsel review it
            against your final data practices before you publish or submit to any store.
          </div>
          <p>
            This policy explains what Mannerly collects, why, and the choices you have.
            Mannerly is an educational product used by children, teens, adults, families,
            and schools, so we minimise data and never sell it. Mannerly is operated by
            [Mannerly legal entity], [address], contact <b>privacy@mannerly.com</b>.
          </p>
        </>
      }
    >
      <h2>1. Data we collect</h2>
      <ul>
        <li><b>Account</b> — email, display name, and (for password accounts) a securely hashed password. Sign-in with Google or Apple returns a basic identifier and email; we do not receive your Google or Apple password.</li>
        <li><b>Learner profile</b> — the age band you choose, home region, and language preference. These tailor lessons; they are not used to identify you.</li>
        <li><b>Progress</b> — lessons completed, XP, streaks, mastery, and passport stamps.</li>
        <li><b>Entitlements</b> — which plan or packs you own and the storefront that granted them (Apple, Google, web, promo, or a school licence). We store a purchase reference to reconcile access, not your card number.</li>
        <li><b>Household / classroom links</b> — for family and school use, the relationships between a parent or teacher and the learner profiles they manage.</li>
        <li><b>Technical</b> — device type, app version, and diagnostic events (crashes, failed purchases) needed to keep the service working.</li>
        <li><b>Support</b> — messages you send us and content-accuracy reports you submit.</li>
      </ul>

      <h2>2. What we do not do</h2>
      <ul>
        <li>We do not sell or rent personal data.</li>
        <li>We do not use third-party advertising SDKs or show behavioural ads.</li>
        <li>We do not collect precise location, contacts, photos, microphone, or biometrics.</li>
        <li>We do not build advertising profiles of children.</li>
      </ul>

      <h2>3. How we use data</h2>
      <p>
        To provide the service (accounts, progress sync, entitlements), to keep it safe and
        reliable, to answer support requests, to review reported cultural content, and to
        meet legal obligations. We use the minimum data needed for each purpose.
      </p>

      <h2>4. Legal bases (EEA / UK)</h2>
      <p>
        Where the GDPR or UK GDPR applies, we rely on: <b>contract</b> (running your account
        and delivering purchased content), <b>legitimate interests</b> (security, preventing
        abuse, product reliability), <b>consent</b> (optional features and, where required,
        children's processing), and <b>legal obligation</b>. You may withdraw consent at any
        time. We also follow the UK Age Appropriate Design Code (Children's Code), applying
        high-privacy defaults for users who may be children.
      </p>

      <h2>5. Children's privacy</h2>
      <p>
        Mannerly is designed to be safe for children. Where a user is under the age of digital
        consent (13 in the US under COPPA; 13–16 in the EEA depending on the member state),
        an account must be created and managed by a parent, guardian, or authorised school.
      </p>
      <ul>
        <li>We collect only what a lesson needs and never require a child to provide more.</li>
        <li>We do not condition a child's participation on disclosing unnecessary information.</li>
        <li>Parents and schools can review, export, or delete a child's data and can revoke consent, which ends further collection.</li>
        <li>We do not send behavioural advertising or personalised marketing to children.</li>
      </ul>
      <p>
        To exercise parental rights, use the in-app controls or email <b>privacy@mannerly.com</b>.
        Under COPPA we will verify that a request comes from the child's parent or guardian.
      </p>

      <h2>6. Schools (FERPA)</h2>
      <p>
        When a school or district uses Mannerly, the school directs the processing of student
        data and may consent on parents' behalf for educational use, consistent with FERPA and
        applicable state student-privacy laws. We act as a service provider / school official:
        student data is used only to provide the service to the school, is not sold, and is not
        used for advertising. Schools can request access, correction, export, or deletion of
        student records.
      </p>

      <h2>7. Sharing</h2>
      <p>We share personal data only with:</p>
      <ul>
        <li><b>Payment processors and app stores</b> (Apple, Google, and our web payment provider) to take payment and validate purchases. They handle card data under their own terms; we do not store full card numbers.</li>
        <li><b>Infrastructure sub-processors</b> (hosting, database, crash reporting) under contracts that limit them to processing on our instructions.</li>
        <li><b>Authorities</b> where required by law, or to protect users' safety and our rights.</li>
      </ul>
      <p>A current list of sub-processors is available at <b>[sub-processor list URL]</b>.</p>

      <h2>8. Retention</h2>
      <p>
        We keep account and learning data while your account is active. When you delete your
        account we erase or irreversibly anonymise personal data within <b>[30] days</b>, except
        records we must keep for legal, tax, or fraud-prevention reasons, which we retain only as
        long as required.
      </p>

      <h2>9. Security</h2>
      <p>
        We protect data with encryption in transit, access controls, and least-privilege
        practices, and maintain backups and documented recovery procedures. No system is
        perfectly secure, but we design for the stricter standards that apply to children's data.
      </p>

      <h2>10. International transfers</h2>
      <p>
        If we transfer data outside your region we use appropriate safeguards, such as the EU
        Standard Contractual Clauses and the UK Addendum, and apply supplementary measures where
        needed.
      </p>

      <h2>11. Your rights</h2>
      <p>
        Depending on where you live, you can access, correct, delete, port, or restrict your
        data, object to certain processing, and withdraw consent. California residents (CCPA /
        CPRA) may request access, deletion, and correction, and may opt out of "sale" or
        "sharing" — we do neither, and we do not sell or share the personal information of
        anyone we know to be under 16. We will not discriminate against you for exercising your
        rights. To make a request, use the in-app tools or email <b>privacy@mannerly.com</b>;
        you may also appeal a decision at the same address.
      </p>

      <h2>12. Deleting your account and data</h2>
      <p>
        You can delete your account and its data in the app (Settings → Delete account) or at{' '}
        <b>mannerly.com/account/delete</b>. See the in-app Delete account page for what is erased
        and the timeline.
      </p>

      <h2>13. Changes</h2>
      <p>
        We will update this policy as the product and the law change. We will post the new
        version here and, for material changes, notify you in the app or by email.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions or complaints: <b>privacy@mannerly.com</b>. EEA/UK users may also contact our
        representative or Data Protection Officer at <b>[DPO / representative contact]</b> and
        have the right to lodge a complaint with their local supervisory authority.
      </p>
    </LegalShell>
  )
}
