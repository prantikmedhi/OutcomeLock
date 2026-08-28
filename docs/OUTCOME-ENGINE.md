# Outcome Engine

## Purpose

The outcome engine is the heart of OutcomeLock.

It determines whether the citizen's requested outcome has actually happened.

The engine must be deterministic, testable, and independent from OpenAI.

## Inputs

The engine should receive structured data:

```ts
type OutcomeCase = {
  requestedOutcome: RequestedOutcome;
  governmentActions: GovernmentAction[];
  evidence: Evidence[];
};
```

## Statuses

```ts
type OutcomeStatus =
  | "RESOLVED"
  | "NOT_RESOLVED"
  | "ACTION_REQUIRED"
  | "INSUFFICIENT_EVIDENCE";
```

## Outcome Types

For the MVP, support:

```ts
type RequestedOutcomeType = "PENSION_PAYMENT_RECEIVED";
```

## Evidence Types

For the MVP, support:

```ts
type EvidenceType =
  | "PENSION_CREDIT"
  | "FORWARDING_NOTICE"
  | "BANK_VERIFICATION_REQUEST"
  | "GENERIC_PROCESSING_NOTICE";
```

## Action Types

```ts
type GovernmentActionType =
  | "FORWARDED"
  | "PAYMENT_PROCESSED"
  | "BANK_VERIFICATION_REQUIRED"
  | "GENERIC_PROCESSED";
```

## Evaluation Rules

### Resolved

If the requested outcome is `PENSION_PAYMENT_RECEIVED` and evidence contains `PENSION_CREDIT`, return:

```text
RESOLVED
```

### Not Resolved

If the response only shows administrative movement such as `FORWARDED` and no `PENSION_CREDIT` evidence exists, return:

```text
NOT_RESOLVED
```

Reason:

> Forwarding the grievance does not prove pension payment.

### Action Required

If the response asks the citizen for a necessary action such as bank verification, return:

```text
ACTION_REQUIRED
```

Reason:

> The case cannot proceed until the citizen completes the requested step.

### Insufficient Evidence

If the response is vague, such as "processed", but no required evidence exists, return:

```text
INSUFFICIENT_EVIDENCE
```

Reason:

> The response does not include enough evidence to verify payment.

## Output

The engine should return:

```ts
type OutcomeEvaluation = {
  status: OutcomeStatus;
  reasonCode: string;
  requestedOutcome: string;
  governmentActionSummary: string;
  requiredEvidence: EvidenceType[];
  missingEvidence: EvidenceType[];
  recommendedAction: "APPEAL_CLOSURE" | "COMPLETE_REQUIRED_ACTION" | "WAIT_FOR_EVIDENCE" | "NO_ACTION";
};
```

## Tests

Required tests:

- forwarded only -> `NOT_RESOLVED`
- payment credit present -> `RESOLVED`
- bank verification required -> `ACTION_REQUIRED`
- vague processed response without payment evidence -> `INSUFFICIENT_EVIDENCE`

Do not mock OpenAI for these tests. The engine must run without AI.
