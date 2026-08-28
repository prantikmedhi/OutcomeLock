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

## Preferred Structure

```text
app/
  page.tsx
  intake/
  outcome/
  grievance/
  appeal/
  timeline/
components/
lib/
  ai/
  outcome-engine/
  db/
  validation/
data/
tests/
docs/
```

Adjust only if the implementation has a clear reason.

## Layers

### UI

React components render the journey, collect input, and display status. Components must not contain core outcome rules.

### Outcome Engine

`lib/outcome-engine/` owns deterministic evaluation.

It should accept structured case data and return:

- status
- reason code
- required evidence
- missing evidence
- recommended action

### AI Layer

`lib/ai/` owns server-side OpenAI calls:

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
