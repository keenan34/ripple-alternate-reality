# RIPPLE

RIPPLE is an alternate sports-history platform evolving from the original static branching-story prototype.

## Current phase

Phases 1 through 4 and the Phase 4.5 gameplay rework are complete, plus a playtest-feedback round. The application includes editorial discovery, locally resumable playthroughs, deterministic result URLs, downloadable posters, and Engine v2 world-state simulation. Creator Studio adds guided story setup, a visual decision graph, state and consequence inspectors, autosave and recovery, full play preview, actionable validation, and immutable publishing with versioning and remix attribution. Campaigns are six-turn strategic simulations with objectives, resources, relationships, investigations, influence commitments, deterministic risk, counteroffers, delayed consequences, and data-driven endings. The feedback round added an always-visible objective tracker with live targets, a success-forecast breakdown for influence spending, championship banners with a celebration moment, per-decision campaign-pulse progress, an end-of-run legacy score with letter grades, and mystery-player acquisition reveals. Three campaigns are playable: The Loyalty Window (Durant stays in Oklahoma City), The Second Pick (Detroit skips Darko in 2003), and The Rose That Grew from Concrete (Derrick Rose avoids the 2012 ACL tear). Remaining playtest ideas live in `checklists/feedback-backlog.txt`. The original browser prototype is preserved in `legacy/`; the production app lives in `src/`.

Creator Studio is implemented but hidden from the public launch. Its current browser-only ownership and storage model remains in the codebase for continued development; account-backed ownership, shared publishing, and community discovery remain Phase 5 work.

## Local development

Requirements: Node.js 22 or newer and npm 10 or newer.

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```powershell
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

`npm run validate:stories` runs only the story migration and graph-contract tests.

## Project structure

- `src/app/` - Next.js application routes and global design tokens
- `src/components/` - publication, archive, play, result, and Creator Studio interfaces
- `src/content/` - migrated and validated seed content
- `src/lib/play/` - deterministic local play-session state
- `src/lib/play/world.ts` - conditions, effects, seeded events, templates, and world-state evaluation
- `src/lib/stories/` - versioned narrative schema and validation
- `src/lib/creator/` - local drafts, ownership, workflow, validation, and versioning
- `src/lib/campaign/` - strategic campaign contract, deterministic state, risk, negotiation, scoring, and endings
- `src/content/campaigns.ts` - the playable campaign registry
- `src/content/durant-campaign.ts` - The Loyalty Window (Durant stays in Oklahoma City)
- `src/content/pistons-campaign.ts` - The Second Pick (Detroit skips Darko in 2003)
- `src/content/rose-campaign.ts` - The Rose That Grew from Concrete (Derrick Rose stays healthy in 2012)
- `supabase/migrations/` - Postgres schema migrations
- `checklists/` - scope and exit criteria for each build phase
- `legacy/` - preserved original static prototype
- `artifacts/phase-02/` - responsive visual-verification captures
- `artifacts/phase-03/` - Engine v2 consequence and ending captures
- `artifacts/phase-04/` - responsive Creator Studio setup, graph, and publishing captures
- `artifacts/phase-04-5/` - responsive campaign briefing, counteroffer, report, and ending captures

## Database

Phase 1 supplies the initial Postgres migration without requiring a live Supabase project. When a project is connected, copy `.env.example` to `.env.local`, provide the project credentials, and apply `supabase/migrations/202607130001_phase_1_foundation.sql` through the Supabase CLI or SQL editor.

All application tables have row-level security enabled. Access policies are intentionally deferred until the authenticated workflows are implemented and tested in Phase 5; do not expose these tables through a public client before those policies exist.

## Content rule

Published playthroughs are pinned to immutable `story_versions` records. Editing a published story creates a new version so existing shared timelines never change underneath their players.
