# Architecture

## Principle

Keep OutcomeLock as a single full-stack Next.js application.

The product needs:

- UI
- small backend
- deterministic business logic
- synthetic data
- optional server-side OpenAI calls
- tests

It does not need microservices or extra infrastructure.

## Repository Structure

```text
app/                 # thin Next.js page, layout, and route adapters
frontend/
  components/        # browser UI, motion, effects, and primitives
  data/              # browser-safe presentation fixtures
  lib/               # client API helpers and UI utilities
  styles/            # global styles
  tests/e2e/         # Playwright journeys
backend/
  api/               # framework-independent request handlers
  ai/                # server-only AI client, schemas, and fallbacks
  contracts/         # public API response types
  data/              # authoritative server scenarios
  outcome-engine/    # deterministic outcome rules
  scripts/           # server/provider smoke tests
  tests/unit/        # Vitest tests
docs/
```

Keep one root package, one Next.js server, one build, and one Vercel deployment. Files under `app/` must stay thin because Next.js requires its route conventions there. Frontend runtime code must not import server modules; type-only imports from `backend/contracts/` are allowed.

## Layers

### UI

React components render the journey, collect input, and display status. Components must not contain core outcome rules.

### Outcome Engine

`backend/outcome-engine/` owns deterministic evaluation.

It should accept structured case data and return:

- status
- reason code
- required evidence
- missing evidence
- recommended action

### AI Layer

`backend/ai/` owns server-side OpenAI calls:

- intent extraction
- explanation generation
- appeal drafting

AI output must be validated and must never override the outcome engine.

### Data Layer

Use synthetic seeded data. SQLite and Drizzle are preferred for persistence, but the implementation should remain easy to swap to JSON/in-memory data if deployment becomes annoying.

### Validation

Use Zod for:

- API inputs
- AI structured outputs
- scenario fixtures where useful

## Environment

Use:

```text
OPENAI_API_KEY=
OPENAI_MODEL=
DATABASE_URL=
```

Do not expose `OPENAI_API_KEY` to client-side code.

## API Boundaries

Route handlers or server actions may coordinate:

- interpreting citizen input
- evaluating a case
- generating an appeal
- simulating submission
- resolving the synthetic scenario

Do not send unnecessary data to OpenAI.

## Deployment

Deploy to Vercel.

The app must work with seeded synthetic data. The main demo must continue to work if OpenAI is unavailable.
