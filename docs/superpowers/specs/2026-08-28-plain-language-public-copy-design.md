# Plain-language public copy design

## Goal

Make every citizen-facing sentence easy for a 12-year-old to understand. A person should know what happened, what is missing, and what to do next without knowing government or legal words.

## Scope

Update the full public journey, including headings, status messages, warnings, buttons, timeline events, AI fallback text, AI writing instructions, and page metadata.

Do not rename internal outcome codes, evidence types, action types, API fields, or test assertions for engine behavior. Do not change the meaning of the outcome rules.

## Language rules

- Prefer common words: use "complaint" instead of "grievance" and "proof" instead of "evidence" on public screens.
- Use an official term in brackets only when it helps the citizen act, such as "Ask for another review (appeal)."
- Use short sentences with one idea each.
- Tell the citizen what happened before explaining a rule.
- Make warning text direct but calm. Do not blame a department or official.
- Never rely on red or green alone. Every state must have a clear text label.
- Keep the department's original reply unchanged and label it as the original reply.
- Explain prototype and sample-data notices in familiar words.

## Public status labels

- `NOT_RESOLVED` displays as "Not fixed yet."
- `RESOLVED` displays as "Fixed."
- `ACTION_REQUIRED` displays as "You need to do one thing."
- `INSUFFICIENT_EVIDENCE` displays as "We need more proof."

The machine-readable codes remain unchanged inside the deterministic outcome engine.

## Warning pattern

Warning and red-status areas follow this order:

1. What you asked for.
2. What the department did.
3. What is still missing.
4. What you can do next.

The primary pension verdict should say that the complaint was sent to another office, but there is no proof that the pension reached the account. The next action should be "Ask for another review (appeal)."

## AI-generated copy

AI prompts must ask for words a 12-year-old can understand, short sentences, and no unexplained government or legal terms. Safe fallback text must already follow the same rules so the journey stays clear when AI is unavailable.

AI must not change the deterministic status or invent facts, payments, rules, or deadlines.

## Verification

- Update the end-to-end test to use the new public button and status names.
- Keep all deterministic outcome-engine tests unchanged.
- Run lint, typecheck, unit tests, the end-to-end journey, and a production build.
- Check that the public UI no longer exposes raw outcome codes or unexplained terms such as "deterministic status," "administrative status," or "outcome verification."
