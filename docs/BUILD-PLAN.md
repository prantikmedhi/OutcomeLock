# Build Plan

## Phase 1: Project Setup

- Create the Next.js TypeScript app.
- Add Tailwind CSS.
- Add shadcn/ui primitives.
- Add Lucide icons.
- Add Zod.
- Add Vitest and Playwright.
- Add OpenAI SDK.
- Add SQLite and Drizzle if time allows.

## Phase 2: Synthetic Data

- Create the primary pension scenario.
- Add the four required deterministic scenarios.
- Add timeline fixture data.
- Add simulated appeal and resolution data.

## Phase 3: Outcome Engine

- Define outcome, evidence, action, and evaluation types.
- Implement deterministic evaluation.
- Add required unit tests.
- Ensure no AI dependency exists in this layer.

## Phase 4: Citizen Journey

- Build home screen.
- Build intake screen.
- Build outcome confirmation.
- Build grievance response view.
- Build verdict screen.
- Build appeal screen.
- Build timeline.
- Build final resolved screen.

## Phase 5: AI Layer

- Add server-side OpenAI client.
- Add intent extraction.
- Add explanation generation.
- Add appeal drafting.
- Validate all structured outputs with Zod.
- Add safe fallbacks for API failure and malformed output.

## Phase 6: Polish

- Make verdict screen visually strong.
- Tighten copy.
- Improve mobile layouts.
- Add focus states and accessibility labels.
- Ensure one primary CTA per screen.
- Add visible prototype disclosure.

## Phase 7: Tests

- Unit test outcome engine.
- Unit test AI schema validation and fallbacks.
- Playwright test the full demo path.
- Test mobile and desktop viewports.

## Phase 8: Build And Deploy

- Run lint.
- Run typecheck.
- Run tests.
- Run production build.
- Prepare Vercel deployment.
- Verify public URL.

## Implementation Order

Do not start by building every screen at once.

Recommended order:

1. Inspect current repo.
2. Set up app foundation.
3. Add synthetic scenarios.
4. Build outcome engine.
5. Test outcome engine.
6. Build core journey with seeded data.
7. Add AI as enhancement.
8. Add appeal and timeline.
9. Polish UI.
10. Verify full demo.
