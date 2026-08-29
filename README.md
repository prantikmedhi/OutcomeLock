# OutcomeLock

OutcomeLock is an independent hackathon prototype that helps citizens understand whether a government grievance was actually resolved.

Most grievance systems can mark a case as forwarded, replied, disposed, or closed. OutcomeLock asks a simpler citizen-side question:

> Did I actually get what I asked for?

The prototype focuses on one strong journey: a citizen whose pension has not been credited for three months. OutcomeLock identifies the requested outcome, compares the government response against required evidence, explains the result, helps draft an appeal, and shows a simulated resolution.

## Prototype Disclosure

Independent hackathon prototype · Synthetic data · Not a government product

This project must not use real citizen data, real government identifiers, real government APIs, or real payment/bank information.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui primitives
- Lucide icons
- OpenAI SDK
- Zod
- SQLite
- Drizzle ORM
- Vitest
- Playwright
- Vercel

## Repository Layout

OutcomeLock remains one full-stack Next.js application:

- `frontend/` contains browser UI, styles, presentation data, effects, and end-to-end tests.
- `backend/` contains API logic, AI integration, outcome rules, server data, scripts, and unit tests.
- `app/` contains thin adapters required by Next.js App Router.

Run development, tests, and builds from repository root:

```bash
npm run dev
npm run typecheck
npm test
npm run test:e2e
npm run build
```

## Product Shape

Core flow:

1. Citizen describes the problem.
2. OutcomeLock proposes the desired outcome.
3. Citizen confirms the outcome.
4. Synthetic grievance response is shown.
5. Deterministic outcome engine evaluates the case.
6. Citizen sees a clear verdict.
7. Appeal is generated and editable.
8. Appeal submission is simulated.
9. Timeline shows progress.
10. Synthetic resolution confirms the outcome.

## Documentation

- `AGENTS.md` - master instructions for Codex
- `docs/PRODUCT.md` - product thesis and scope
- `docs/UX.md` - screens, flows, and copy
- `docs/DESIGN.md` - visual direction and UI rules
- `docs/ARCHITECTURE.md` - technical architecture
- `docs/AI.md` - AI responsibilities and boundaries
- `docs/DATA.md` - synthetic scenarios and records
- `docs/OUTCOME-ENGINE.md` - deterministic state machine
- `docs/DEMO.md` - two-minute judge demo
- `docs/BUILD-PLAN.md` - implementation phases
