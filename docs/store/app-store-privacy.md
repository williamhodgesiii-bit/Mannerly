# Apple — App Privacy answers

Draft answers for the App Privacy section in App Store Connect. Keep in sync with
the code and the Privacy Policy. Confirm each integrated SDK's practices before you
submit — Apple requires you to disclose third-party SDK data practices too.

## Summary

- **Data used to track you:** None. Mannerly does not track (no linking to
  third-party data for advertising, no ad SDKs, no ad identifiers).
- **Data linked to you:** account, learning, and support data below.
- **Data not linked to you:** diagnostics may be reported without identity where feasible.

## Contact info

- **Email address** — App Functionality, Account Management. Linked. Not used for tracking.
- **Name** (display name only; optional) — App Functionality. Linked.

## User content

- **Customer support** (support messages, content-accuracy reports) — Customer Support. Linked.
- **Other user content** (learning progress, entitlements) — App Functionality. Linked.

## Identifiers

- **User ID** (Mannerly account id; Google/Apple subject id when used) — App Functionality, Account Management. Linked.
- No **Device ID** used for tracking or advertising.

## Purchases

- **Purchase history** (which plan/packs, storefront source, purchase reference) — App Functionality. Linked. Full card numbers are not collected; payment is handled by Apple / the web processor.

## Usage data

- **Product interaction** (lessons completed, XP, streaks) — App Functionality. Linked. Not used for third-party advertising or tracking.

## Diagnostics

- **Crash data / Performance data** — App Functionality (reliability). Report without identity where feasible.

## Not collected

Precise or coarse **Location**, **Contacts**, **Photos or Videos**, **Audio**,
**Health & Fitness**, **Browsing history**, **Search history**, **Sensitive info**,
**Advertising data**.

## Kids

If Mannerly ships in (or in addition to) the Kids Category, or otherwise directs
part of the experience to children:

- No third-party analytics or advertising in child-directed experiences, per Apple's kids rules.
- No transmission of personally identifiable information or device identifiers about children to third parties for tracking.
- Parental gates for account creation, purchases, and outbound links in child contexts.
- Data minimisation for child users; parent/guardian controls for review and deletion.

## Required product-page items

- Privacy Policy URL: `https://mannerly.com/privacy` (in-app `/privacy`).
- Account deletion: supported in-app (Me → Settings → Delete account) per Guideline 5.1.1(v).
