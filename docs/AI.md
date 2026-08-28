# AI

## Role

AI improves language understanding and communication. It is not the source of truth for outcome status.

Use OpenAI only where language adds value:

- understand citizen wording
- simplify bureaucratic responses
- explain deterministic findings
- draft an appeal

## Hard Rule

Never ask the model to decide whether a case is resolved and then store that answer as authoritative state.

The deterministic outcome engine decides:

- `RESOLVED`
- `NOT_RESOLVED`
- `ACTION_REQUIRED`
- `INSUFFICIENT_EVIDENCE`

## Server-Side Only

All OpenAI calls must run server-side.

Never expose:

```text
OPENAI_API_KEY
```

Keep model configuration centralized through:

```text
OPENAI_MODEL
```

## Structured Outputs

Prefer structured output and validate with Zod.

Intent extraction shape:

```ts
type IntentResult = {
  problemType: "PENSION_PAYMENT_MISSING" | "UNKNOWN";
  desiredOutcome: {
    type: "PENSION_PAYMENT_RECEIVED" | "UNKNOWN";
    description: string;
  };
};
```

Explanation shape:

```ts
type ExplanationResult = {
  summary: string;
  requestedOutcome: string;
  governmentAction: string;
  missingEvidence: string[];
  recommendedAction: string;
};
```

Appeal shape:

```ts
type AppealDraft = {
  subject: string;
  body: string;
};
```

## Fallbacks

If OpenAI is unavailable, malformed, or slow:

- preserve deterministic outcome state
- use fallback copy
- allow the citizen to continue
- do not fabricate model output

Fallback explanation:

> Based on the available case information, we could not verify that the requested outcome was completed.

## Safety Rules

The model must not:

- invent government rules
- invent deadlines
- invent evidence
- invent payments
- invent transaction records
- invent legal claims
- accuse officials or departments of misconduct
- claim government affiliation

Tone should be neutral:

> We could not verify that the requested outcome was achieved.

Avoid:

> The department falsely closed your complaint.
