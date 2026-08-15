# BIBHA Institute

**Bangladesh Institute for Brain Health and Analytics**

The stakeholder-facing platform prototype for a proposed Bangladesh-centered global research network connecting students, researchers, clinicians, faculty, and diaspora mentors through focused four-month computational projects.

## Version 2.1 launch scope

- A public mission and partnership website
- Separate value propositions for trainees, PIs, mentors, hospitals, and supporters
- An interactive project journey from matching through application, selection, milestones, contribution review, and closeout
- Contribution-aware reputation with a protected pathway for newcomers
- The BIBHA Research Continuity Library and versioned Continuation Packs
- Proof-gated development from a no-PHI network pilot toward future cohort and clinical-research capability
- Persistent founding-network registration and structured stakeholder feedback
- A private, sign-in-gated Founder Desk for reviewing registrations and feedback
- Follow-up statuses, private notes, search, filtering, and CSV export
- Versioned privacy notice, consent record, source tracking, and submission rate limiting
- Transactional email integration for applicant confirmations and owner alerts when email credentials are configured

## Safety boundary

This is a stakeholder prototype and no-PHI pilot. It must not be used to collect clinical data, research-participant data, CVs, identity documents, payment details, or research datasets. Proposed partners remain proposed until confirmed in writing.

## Local development

Requirements: Node.js 22.13 or later and pnpm.

```bash
pnpm install
pnpm run dev
```

Create the production build:

```bash
pnpm run build
```

Create the static GitHub Pages build:

```bash
pnpm run build:pages
```

The public website at `https://bibha.medics-global.com` is deployed automatically through GitHub Pages from `main`, making this repository the source of truth for the public site. Its forms submit to the separately hosted BIBHA service so registrations, feedback, and notification credentials remain private rather than being stored in GitHub.

## Main surfaces

- `app/page.tsx` — public website, platform walkthrough, interest form, and feedback form
- `app/globals.css` — complete responsive visual system
- `app/api/interest/route.ts` — founding-network registration endpoint
- `app/api/feedback/route.ts` — stakeholder feedback endpoint
- `db/schema.ts` — minimal structured persistence schema
- `app/founder` — private Founder Desk, restricted to the site owner
- `app/privacy` — public Version 2.1 privacy notice
- `github-pages` — static GitHub Pages entry points that reuse the public website
- `.github/workflows/pages.yml` — automatic GitHub Pages publication

## Email delivery

Registration and feedback records are saved even when email delivery is unavailable. To activate email, configure these hosted runtime values:

- `FOUNDER_EMAIL` — address that receives new-registration and feedback alerts
- `RESEND_API_KEY` — secret API key for the transactional email provider
- `FROM_EMAIL` — verified sender, for example `BIBHA Institute <sender@your-domain.org>`

Never commit these values to GitHub.

## Ownership and status

Concept and prototype led by Khalid Saifullah. BIBHA Institute stands for the Bangladesh Institute for Brain Health and Analytics. This repository is an early product prototype for stakeholder feedback, governance design, partner discovery, and controlled no-PHI pilot planning.

Copyright © 2026 Khalid Saifullah. All rights reserved.
