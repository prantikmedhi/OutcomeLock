# Plain-Language Public Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the full citizen journey understandable to a 12-year-old while preserving the original department reply and all deterministic engine behavior.

**Architecture:** Keep machine-readable outcome codes and data types unchanged. Rewrite only citizen-facing copy, AI writing instructions, fallback text, metadata, and the end-to-end selectors that depend on public labels.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Vitest, Playwright

---

### Task 1: Lock the new citizen journey into the end-to-end test

**Files:**
- Modify: `tests/e2e/demo.spec.ts:3-17`

- [ ] **Step 1: Replace the public-copy selectors with the approved simple labels**

```ts
test("primary demo journey reaches fixed state", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /try an example case/i }).click();
  await page.getByRole("button", { name: /check my complaint/i }).click();
  await page.getByRole("button", { name: /yes, this is right/i }).click();
  await page.getByRole("button", { name: /check if my problem was fixed/i }).click();
  await expect(page.getByRole("heading", { name: /not fixed yet/i })).toBeVisible();
  await page.getByRole("button", { name: /ask for another review/i }).click();
  await page.getByRole("button", { name: /send my request/i }).click();
  await page.getByRole("button", { name: /see what happens next/i }).click();
  await page.getByRole("button", { name: /check the result/i }).click();
  await expect(page.getByRole("heading", { name: /^fixed$/i })).toBeVisible();
});
```

- [ ] **Step 2: Run the end-to-end test and verify that the old UI fails the new selectors**

Run: `npm run test:e2e -- tests/e2e/demo.spec.ts`

Expected: FAIL because buttons such as "Check my complaint" and the heading "Not fixed yet" do not exist yet.

### Task 2: Rewrite the public interface in plain language

**Files:**
- Modify: `app/page.tsx:30-375`
- Modify: `app/layout.tsx:4-7`
- Modify: `data/scenarios.ts:28-152`
- Test: `tests/e2e/demo.spec.ts`

- [ ] **Step 1: Replace fallback public text in `app/page.tsx`**

Use these exact values while keeping the source department reply unchanged:

```ts
const fallbackExplanation: ExplanationResult = {
  summary:
    "Your complaint was sent to another office, but there is no proof that your pension reached your account.",
  requestedOutcome: "Your pension reaches your bank account.",
  governmentAction: "The department sent your complaint to another office.",
  missingEvidence: ["Proof that the pension reached your account."],
  recommendedAction: "Ask for another review (appeal).",
};

const fallbackAppeal: AppealDraft = {
  subject: `Please review closed complaint ${primaryScenario.grievance.id}`,
  body:
    "Please review this closed complaint. I asked for my pension to be paid into my bank account. The reply says my complaint was sent to another office, but it does not show that the pension was paid. Please check the complaint again and share proof when the payment is made.",
};
```

- [ ] **Step 2: Rewrite every journey screen with the approved labels**

Apply these public-copy changes without changing component structure or state transitions:

```text
Independent hackathon prototype · Synthetic data · Not a government product
-> Demo only · Uses made-up information · Not run by the government

Citizen-side outcome verification
-> Checks if your problem was fixed

OutcomeLock checks whether a grievance response proves the citizen got the requested outcome, not just whether the file moved.
-> OutcomeLock checks if you got what you asked for. A reply or a closed complaint does not always mean the problem was fixed.

Synthetic grievance
-> Example complaint

Missing / Pension credit evidence
-> Still needed / Proof that the pension reached the account

Describe the problem
-> Tell us what happened

Use plain language. For the demo, the pension scenario is already loaded.
-> Write the problem in your own words. We added a pension example for this demo.

Citizen problem
-> What is the problem?

Check my grievance
-> Check my complaint

Confirm the outcome
-> Is this what you need?

OutcomeLock evaluates whether this specific citizen outcome happened.
-> We will check if this is what actually happened.

You need
-> What you need

Yes, that's what I need
-> Yes, this is right

Synthetic grievance response
-> Department reply (sample)

The case is closed administratively, but OutcomeLock checks the actual requested outcome.
-> The department marked this complaint as closed. We will check if your pension reached your account.

Grievance ID / Submitted / Department / Administrative status
-> Complaint number / Date sent / Office / Status shown

Department response
-> Original department reply

Check if this is actually resolved
-> Check if my problem was fixed

Outcome verdict / Not resolved
-> What we found / Not fixed yet

They confirmed
-> What the department did

Still missing
-> What is still needed

What you can do now
-> What to do next

Deterministic status: NOT_RESOLVED
-> Our check: Not fixed yet

Appeal the closure
-> Ask for another review (appeal)

Review the appeal
-> Check your review request

This draft is editable and based only on the known synthetic case facts.
-> You can change this message. It only uses the sample facts shown here.

Appeal text / Submit appeal
-> Your message / Send my request

Simulated submission / Appeal submitted
-> Demo action / Review request sent

This is a simulated action for the hackathon demo. No real government system was contacted.
-> This is only a demo. Nothing was sent to a real government office.

Track my case
-> See what happens next

Case tracking / The outcome is now verifiable
-> What happened next / We can now check the result

A synthetic pension credit appears after the simulated review.
-> The demo now adds a sample pension payment.

Grievance submitted
-> Complaint sent

Complaint forwarded and marked closed
-> Complaint sent to another office and marked closed

OutcomeLock found missing payment evidence
-> OutcomeLock found no proof of payment

Appeal submitted
-> Review request sent

Synthetic review started
-> Sample review started

Pension credit added
-> Pension payment added

New evidence / Confirm outcome
-> New proof / Check the result

Final outcome / Resolved
-> Final result / Fixed

The required evidence is now present: the synthetic pension credit confirms the requested outcome.
-> The sample payment shows that the pension reached the account.

Confirmed evidence
-> Proof found
```

Keep loading labels short and familiar:

```text
Evaluating... -> Checking...
Drafting... -> Writing...
```

- [ ] **Step 3: Simplify metadata and scenario labels without changing the original reply**

Set `app/layout.tsx` metadata to:

```ts
export const metadata: Metadata = {
  title: "OutcomeLock",
  description: "Check if a public-service complaint was really fixed.",
};
```

In `data/scenarios.ts`, simplify labels that can reach the UI or AI:

```text
Pension not credited -> Pension not paid
Pension credited to my bank account -> Pension paid into my bank account
Complaint forwarded to another office -> Complaint sent to another office
Forwarding notice -> Notice that the complaint was sent to another office
Pension credit -> Pension payment
Pension credit confirmed -> Pension payment confirmed
Bank verification needed -> Bank details need to be checked
Pending citizen action -> Waiting for you
Bank verification required -> Bank details need to be checked
Bank verification request -> Request to check bank details
Vague processed response -> Reply does not show what happened
Request marked processed -> Request marked as processed
Generic processing notice -> Notice that says the request was processed
```

Do not edit these source-response strings because the interface must show the department's original words:

```text
The grievance has been forwarded to the concerned office for necessary action.
Please complete bank account verification before payment can be released.
Your request has been processed.
```

- [ ] **Step 4: Run the end-to-end test and verify the new public journey**

Run: `npm run test:e2e -- tests/e2e/demo.spec.ts`

Expected: PASS with the journey ending at the heading "Fixed".

### Task 3: Make AI and fallback writing follow the same language rules

**Files:**
- Modify: `lib/ai/fallbacks.ts:4-35`
- Modify: `lib/ai/client.ts:88-90`
- Modify: `app/api/interpret/route.ts:43-52`
- Modify: `app/api/explain/route.ts:36-45`
- Modify: `app/api/appeal/route.ts:20-30`
- Modify: `tests/ai-schemas.test.ts:1-47`

- [ ] **Step 1: Add fallback-copy tests**

Add these imports and test block to `tests/ai-schemas.test.ts`:

```ts
import { primaryScenario } from "@/data/scenarios";
import { fallbackAppeal, fallbackExplanation } from "@/lib/ai/fallbacks";
import { evaluateOutcome } from "@/lib/outcome-engine/evaluate";

describe("plain-language AI fallbacks", () => {
  it("explains a missing payment with familiar words", () => {
    const explanation = fallbackExplanation(evaluateOutcome(primaryScenario.case));

    expect(explanation.summary).toBe(
      "We cannot see proof that your pension reached your account.",
    );
    expect(explanation.missingEvidence).toEqual([
      "Proof that the pension reached your account.",
    ]);
    expect(explanation.recommendedAction).toBe(
      "Ask for another review (appeal).",
    );
  });

  it("uses a simple review request when AI is unavailable", () => {
    const appeal = fallbackAppeal(primaryScenario.grievance.id);

    expect(appeal.subject).toBe(
      `Please review closed complaint ${primaryScenario.grievance.id}`,
    );
    expect(appeal.body).toContain("Please check the complaint again");
  });
});
```

- [ ] **Step 2: Run the fallback tests and verify they fail on old copy**

Run: `npm test -- tests/ai-schemas.test.ts`

Expected: FAIL because the fallback still uses words such as "requested outcome," "evidence," and "grievance closure."

- [ ] **Step 3: Rewrite fallback output with exact plain-language copy**

Update `lib/ai/fallbacks.ts`:

```ts
export const fallbackIntent: IntentResult = {
  problemType: "PENSION_PAYMENT_MISSING",
  desiredOutcome: {
    type: "PENSION_PAYMENT_RECEIVED",
    description: "Pension paid into my bank account",
  },
};

export function fallbackExplanation(
  evaluation: OutcomeEvaluation,
): ExplanationResult {
  return {
    summary: "We cannot see proof that your pension reached your account.",
    requestedOutcome: evaluation.requestedOutcome,
    governmentAction: evaluation.governmentActionSummary,
    missingEvidence: ["Proof that the pension reached your account."],
    recommendedAction:
      evaluation.recommendedAction === "APPEAL_CLOSURE"
        ? "Ask for another review (appeal)."
        : "Follow the next step shown for your complaint.",
  };
}

export function fallbackAppeal(caseId: string): AppealDraft {
  return {
    subject: `Please review closed complaint ${caseId}`,
    body:
      "Please review this closed complaint. I asked for my pension to be paid into my bank account. The reply says my complaint was sent to another office, but it does not show that the pension was paid. Please check the complaint again and share proof when the payment is made.",
  };
}
```

- [ ] **Step 4: Add the plain-language rule to every AI instruction**

Extend the shared instruction in `lib/ai/client.ts`:

```ts
instructions:
  "Return only valid JSON matching the provided schema. Use words a 12-year-old can understand and short sentences. Use complaint instead of grievance and proof instead of evidence in public text. Explain any official term in brackets. Do not invent government facts, evidence, payments, or official rules.",
```

Add this instruction to each route prompt before the task-specific facts:

```text
Use words a 12-year-old can understand. Keep sentences short. Use "complaint" instead of "grievance" and "proof" instead of "evidence" in text shown to the citizen. If an official term is needed, explain it in brackets.
```

For `app/api/appeal/route.ts`, retain the existing safety instruction against accusations and invented facts.

- [ ] **Step 5: Run unit tests**

Run: `npm test`

Expected: PASS for outcome-engine tests, AI schema tests, and the new fallback-copy tests.

### Task 4: Verify readability and production safety

**Files:**
- Verify: `app/page.tsx`
- Verify: `lib/ai/fallbacks.ts`
- Verify: `app/api/*.ts`
- Verify: `tests/**/*.ts`

- [ ] **Step 1: Search public code for unexplained technical words and raw status codes**

Run:

```bash
rg -n "Citizen-side outcome verification|Synthetic grievance|Administrative status|Deterministic status|NOT_RESOLVED|INSUFFICIENT_EVIDENCE|Appeal the closure|Check my grievance" app lib/ai tests/e2e
```

Expected: no matches in public UI copy. Internal engine tests and types may still contain status codes.

- [ ] **Step 2: Run static checks in parallel**

Run: `npm run lint`

Expected: PASS with no ESLint errors.

Run: `npm run typecheck`

Expected: PASS with no TypeScript errors.

Run: `npm test`

Expected: PASS for all Vitest tests.

- [ ] **Step 3: Run the complete browser journey**

Run: `npm run test:e2e`

Expected: PASS with all Playwright tests completing the complaint, review request, timeline, and fixed result journey.

- [ ] **Step 4: Build the production app**

Run: `npm run build`

Expected: PASS with a successful Next.js production build.

- [ ] **Step 5: Review the final diff**

Run: `git diff -- app/page.tsx app/layout.tsx data/scenarios.ts lib/ai app/api tests docs/superpowers`

Expected: only plain-language copy, AI writing instructions, related tests, and the approved design and plan documents have changed. No internal outcome state or evaluation rule has changed.
