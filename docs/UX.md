# UX

## Experience Goal

The user should immediately understand what OutcomeLock does and what to do next.

Each screen should have one dominant action.

## Primary Screens

### 1. Home

Purpose: explain the product in one breath and start the demo.

Primary CTA:

> Try an example case

Secondary option:

> Try your own example

Required disclosure:

> Independent hackathon prototype · Synthetic data · Not a government product

### 2. Intake

Ask the citizen to describe the issue in plain language.

Default demo input:

> My pension has not been credited for three months.

Primary CTA:

> Check my grievance

### 3. Confirm Outcome

Show the interpreted desired outcome:

> Pension credited to my bank account.

Ask the citizen to confirm that this is what they need.

Primary CTA:

> Yes, that's what I need

### 4. Grievance

Show synthetic grievance details:

- Grievance ID: `GRV-48291`
- Submitted: `12 August 2026`
- Department: `Pension Services Department`
- Status: `Closed`
- Response: `The grievance has been forwarded to the concerned office for necessary action.`

Primary CTA:

> Check if this is actually resolved

### 5. Verdict

This is the hero moment.

For the primary demo, show:

> NOT RESOLVED

Then show:

You asked for:

> Pension credited to your account.

They confirmed:

> Your complaint was forwarded to another office.

Still missing:

> Evidence that the pension was credited.

Primary CTA:

> Appeal the closure

### 6. Appeal

Show an editable appeal draft generated from known case facts.

The appeal should be firm, plain, and neutral. It must not accuse the department of misconduct.

Primary CTA:

> Submit appeal

### 7. Submitted

Confirm the simulated appeal submission.

Primary CTA:

> Track my case

### 8. Timeline

Show:

- grievance closed after forwarding
- OutcomeLock found missing payment evidence
- appeal submitted
- synthetic review started
- pension credit added
- outcome confirmed

Primary CTA:

> Confirm outcome

### 9. Resolved

Show:

> RESOLVED

Evidence:

> Pension credit: INR 8,450 on 19 August 2026

## UX Rules

- Use plain language.
- Avoid government jargon unless explaining it.
- Never show only color to communicate status.
- Keep touch targets comfortable.
- Support keyboard navigation and visible focus states.
- Keep mobile layouts first-class at 375px and 390px.
- Avoid dead-end buttons.
- Every visible demo interaction must work.
