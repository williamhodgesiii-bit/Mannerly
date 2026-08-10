# Google Play — Data safety answers

Draft answers for the Data safety form in Play Console. Disclosures must match what
the app and its SDKs actually collect or share. Because Mannerly includes children
in its target audience, it is subject to the Families policy.

## Overview answers

- **Does your app collect or share user data?** Yes (collects; see below).
- **Is all data encrypted in transit?** Yes.
- **Do you provide a way to request data deletion?** Yes — in-app (Me → Settings →
  Delete account) and web (`mannerly.com/account/delete`).
- **Has your data collection been independently reviewed?** [Answer at submission.]

## Data types collected

| Category | Type | Collected | Shared | Purpose | Optional? |
|----------|------|-----------|--------|---------|-----------|
| Personal info | Email address | Yes | No | Account management, app functionality | Required for account |
| Personal info | Name (display name) | Yes | No | App functionality | Optional |
| Personal info | User IDs | Yes | No | Account management, app functionality | Required for account |
| Financial info | Purchase history | Yes | No | App functionality (entitlements) | Required for purchases |
| App activity | App interactions (progress, XP, streaks) | Yes | No | App functionality | Required |
| App activity | Other user-generated content (support, content reports) | Yes | No | Customer support | Optional |
| App info & performance | Crash logs, diagnostics | Yes | No | App functionality (reliability) | Optional |

"Shared" = disclosed to third parties for their own use. Mannerly does **not** share
data in that sense. Payment processors and infrastructure providers act as
**processors/service providers** on Mannerly's instructions, which Google treats as
"collected," not "shared."

## Not collected

Location (precise/approximate), Contacts, Photos/Videos, Audio, Calendar, Health &
fitness, SMS/Call logs, Web browsing history, Installed apps, and **Advertising ID**.
No third-party advertising SDKs.

## Security practices

- Data is encrypted in transit.
- Users can request deletion of their account and data (in-app + web).
- [Confirm data-at-rest encryption and note it once the backend is live.]

## Families policy

- Target audience includes children ⇒ comply with the Families policy and Designed
  for Families requirements.
- For child or unknown-age users, do not transmit Android Advertising ID or other
  restricted identifiers, and do not use advertising as the business model.
- Provide the privacy policy URL and keep child data minimised and parent-controlled.
