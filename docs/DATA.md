# Data

## Principle

All data in OutcomeLock must be synthetic.

Do not use real:

- citizen names tied to real people
- Aadhaar numbers
- PAN numbers
- bank account numbers
- OTPs
- payment credentials
- official documents
- government API records
- sensitive personal information

## Primary Synthetic Case

Citizen:

- Name: `Asha Verma`
- Location: `Indore, Madhya Pradesh`
- Benefit: `Old age pension`

Grievance:

- ID: `GRV-48291`
- Submitted: `12 August 2026`
- Department: `Pension Services Department`
- Citizen request: `My pension has not been credited since May.`
- Administrative status: `Closed`
- Response: `The grievance has been forwarded to the concerned office for necessary action.`

Desired outcome:

- Type: `PENSION_PAYMENT_RECEIVED`
- Description: `Pension credited to my bank account`

Required evidence:

- `PENSION_CREDIT`

Available evidence at first:

- government response exists
- forwarding action exists
- pension credit absent

Expected status:

- `NOT_RESOLVED`

Synthetic resolution:

- Evidence: `PENSION_CREDIT`
- Amount: `INR 8,450`
- Date: `19 August 2026`
- Expected final status: `RESOLVED`

## Required Demo Scenarios

### Scenario 1: Not Resolved

- Requested outcome: `PENSION_PAYMENT_RECEIVED`
- Government action: `FORWARDED`
- Payment evidence: absent
- Expected: `NOT_RESOLVED`

### Scenario 2: Resolved

- Requested outcome: `PENSION_PAYMENT_RECEIVED`
- Government action: `PAYMENT_PROCESSED`
- Payment evidence: `PENSION_CREDIT`
- Expected: `RESOLVED`

### Scenario 3: Action Required

- Requested outcome: `PENSION_PAYMENT_RECEIVED`
- Government action: `BANK_VERIFICATION_REQUIRED`
- Payment evidence: absent
- Expected: `ACTION_REQUIRED`

### Scenario 4: Insufficient Evidence

- Requested outcome: `PENSION_PAYMENT_RECEIVED`
- Government response: `Your request has been processed.`
- Payment evidence: absent
- Expected: `INSUFFICIENT_EVIDENCE`

## Timeline Events

Primary demo timeline:

1. Grievance submitted.
2. Department response received.
3. Case marked closed.
4. OutcomeLock evaluation found missing payment evidence.
5. Appeal submitted.
6. Review started.
7. Pension credit added.
8. Outcome confirmed.

## Persistence

SQLite with Drizzle is preferred. If deployment friction is high, use seeded JSON or in-memory fixtures for the hackathon demo.
