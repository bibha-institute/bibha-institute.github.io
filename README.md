# BAIRE Research Commons

The stakeholder-facing platform prototype for a proposed Bangladesh-centered global research network connecting students, researchers, clinicians, faculty, and diaspora mentors through focused four-month computational projects.

## What this release demonstrates

- A public mission and partnership website
- Separate value propositions for trainees, PIs, mentors, hospitals, and supporters
- An interactive project journey from matching through application, selection, milestones, contribution review, and closeout
- Contribution-aware reputation with a protected pathway for newcomers
- The BAIRE Research Continuity Library and versioned Continuation Packs
- Proof-gated development from a no-PHI network pilot toward future cohort and clinical-research capability
- Persistent founding-network registration and structured stakeholder feedback

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

## Main surfaces

- `app/page.tsx` — public website, platform walkthrough, interest form, and feedback form
- `app/globals.css` — complete responsive visual system
- `app/api/interest/route.ts` — founding-network registration endpoint
- `app/api/feedback/route.ts` — stakeholder feedback endpoint
- `db/schema.ts` — minimal structured persistence schema

## Ownership and status

Concept and prototype led by Khalid Saifullah. This repository is an early product prototype for stakeholder feedback, governance design, partner discovery, and controlled no-PHI pilot planning.

Copyright © 2026 Khalid Saifullah. All rights reserved.
