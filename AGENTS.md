# OutcomeLock - Agent Instructions

## Mission

Build OutcomeLock as an independent hackathon prototype for the Build What Moves India hackathon.

OutcomeLock helps citizens answer one question:

> Did I actually get what I asked for?

The product must evaluate whether a grievance was actually resolved, not whether it was merely replied to, forwarded, closed, or disposed.

The main demo scenario is a citizen whose pension has not been credited for three months.

## Read Before Coding

Before substantial code changes, read:

- `README.md`
- `docs/PRODUCT.md`
- `docs/UX.md`
- `docs/DESIGN.md`
- `docs/ARCHITECTURE.md`
- `docs/AI.md`
- `docs/DATA.md`
- `docs/OUTCOME-ENGINE.md`
- `docs/DEMO.md`
- `docs/BUILD-PLAN.md`

If a task conflicts with these docs, stop and identify the conflict before implementing.

## Priority Order

Make decisions in this order:

1. Hackathon rules and safety
2. Product thesis
3. Complete citizen journey
4. Correct deterministic outcome evaluation
5. Usability and clarity
6. AI usefulness
7. Visual polish
8. Technical sophistication

Do not sacrifice the main citizen journey for architectural sophistication.

## Required Stack

Use this stack unless there is a strong technical reason not to:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui as component primitives
- Lucide icons
- OpenAI SDK
- Zod
- SQLite
- Drizzle ORM
- Vitest
- Playwright
- Vercel for deployment

Keep the app in a single Next.js repository.

Repository ownership:

- `frontend/` owns browser UI, styles, presentation fixtures, effects, and Playwright tests.
- `backend/` owns API logic, AI calls, deterministic outcome rules, server data, provider scripts, and unit tests.
- `app/` contains only thin Next.js page, layout, asset, and route adapters.
- Keep one root package, one development server, one build, and one Vercel deployment.
- Frontend runtime code must not import backend runtime modules. Type-only imports from `backend/contracts/` are allowed.

Do not introduce:

- Python or FastAPI
- microservices
- Redis, Kafka, or queues
- Docker unless genuinely required
- Kubernetes
- LangChain
- vector databases
- RAG
- authentication systems
- real government integrations
- unnecessary third-party infrastructure

## Safety Boundaries

Use only synthetic data. Do not use real citizen data, real government identifiers, real Aadhaar/PAN/bank data, real OTPs, real payments, or real government APIs.

Never scrape, test, reverse-engineer, or interfere with live government systems.

Do not imply that OutcomeLock is owned, approved, endorsed, or operated by the government.

Use a visible disclosure:

> Independent hackathon prototype · Synthetic data · Not a government product

## Core Journey

The complete demo journey must work end-to-end:

1. Citizen describes a problem: "My pension has not been credited for three months."
2. System interprets the requested outcome.
3. Citizen confirms: "Pension credited to my bank account."
4. Synthetic grievance is shown.
5. Citizen checks whether it is actually resolved.
6. Outcome engine returns `NOT_RESOLVED`.
7. System explains why in plain language.
8. System recommends appealing the closure.
9. Appeal is generated and editable.
10. Submission is simulated.
11. Timeline shows case tracking.
12. Synthetic pension credit appears.
13. Outcome becomes `RESOLVED`.

The demo must be reproducible and should take about two minutes.

## Outcome Engine Rule

The deterministic outcome engine is the core product.

The language model must never decide the authoritative outcome state.

The engine compares:

- requested outcome
- required evidence
- available evidence
- government response/action

Supported states:

- `RESOLVED`
- `NOT_RESOLVED`
- `ACTION_REQUIRED`
- `INSUFFICIENT_EVIDENCE`

The engine must be independently testable without OpenAI.

## AI Responsibilities

OpenAI may be used for:

- natural-language intent extraction
- bureaucratic language simplification
- citizen-friendly explanation writing
- appeal drafting

OpenAI must not:

- invent government rules
- invent evidence
- invent payments
- invent transaction records
- invent grievance statuses
- decide the authoritative outcome state
- override deterministic rules
- claim government affiliation
- accuse any officer or department of misconduct without evidence

All OpenAI calls must be server-side. Never expose `OPENAI_API_KEY` to the client.

Use structured outputs and validate them with Zod. If AI fails, use safe fallback copy and preserve the deterministic state.

## UX Principles

The product should feel like a modern citizen tool, not a government portal, enterprise dashboard, generic SaaS admin panel, or chatbot wrapper.

Prioritize:

- one obvious next action
- plain language
- mobile-first design
- progressive disclosure
- trust
- explainability
- calm visual hierarchy

Avoid excessive cards, dense forms, jargon, dashboard clutter, chatbot bubbles, fake loading states, and dead-end buttons.

The verdict screen is the hero moment and deserves the most polish.

## Testing Requirements

At minimum, cover:

- forwarded response with no payment evidence -> `NOT_RESOLVED`
- payment processed with pension credit evidence -> `RESOLVED`
- bank verification required -> `ACTION_REQUIRED`
- vague processed response with missing payment evidence -> `INSUFFICIENT_EVIDENCE`
- valid AI structured output
- malformed AI output
- AI API failure fallback
- the critical user journey with Playwright

After meaningful changes, run the relevant checks:

- lint
- typecheck
- unit tests
- production build

Before submission, manually verify mobile and desktop layouts.

## Definition Of Done

OutcomeLock is ready only when:

- the product thesis is obvious
- the pension scenario works end-to-end
- the requested outcome is explicit
- the verdict is clear
- the appeal flow works
- timeline and synthetic resolution work
- deterministic outcome rules pass tests
- AI uses validated structured output
- AI cannot override outcome state
- the demo works without OpenAI
- TypeScript, lint, tests, and build pass
- disclosures are visible
- every demo interaction works

Final principle: OutcomeLock is not a better government chatbot. It is a citizen-side outcome verification layer.
