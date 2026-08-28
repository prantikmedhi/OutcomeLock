# Design

## Direction

OutcomeLock should feel like a premium citizen tool: clear, calm, trustworthy, and modern.

It should not look like:

- a government portal
- a generic AI dashboard
- an enterprise admin panel
- a chatbot interface
- a marketing landing page

## Visual Hierarchy

The verdict is the most important moment in the product.

The verdict screen should make the status clear at a glance, then explain the reasoning in short structured sections:

- You asked for
- They confirmed
- Still missing
- What you can do now

## Layout

Use mobile-first layouts.

Target widths:

- 375px
- 390px
- 768px
- 1440px

Use generous spacing but avoid decorative card clutter. Cards are acceptable for repeated case details, evidence blocks, and timeline events. Do not turn every section into a card.

## Components

Use shadcn/ui as primitives, not as the whole design.

Use Lucide icons where icons improve recognition:

- search/check for evaluation
- file/edit for appeal
- clock for timeline
- shield/info for disclosure
- check circle for resolved
- alert for unresolved

Buttons should be clear commands. Each screen should have one dominant primary button.

## Color

Use a restrained palette with strong contrast.

Status colors may support meaning, but text must always name the status:

- `NOT RESOLVED`
- `RESOLVED`
- `ACTION REQUIRED`
- `INSUFFICIENT EVIDENCE`

Do not rely on red/green alone.

Avoid visual styles that imply official government branding.

## Typography

Use readable, plain typography.

Hero-scale type is reserved for the product entry point and the verdict. Compact panels should use smaller headings.

Do not use negative letter spacing. Do not scale font size directly with viewport width.

## Motion

Motion should be subtle and functional. Respect reduced motion preferences.

Do not use fake loading or theatrical progress indicators for deterministic steps.

## Accessibility

Use semantic HTML. Every input needs a label. Every status needs readable text. Focus states must be visible.

Important information must not be communicated by color alone.
