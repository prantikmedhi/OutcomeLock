import { createJsonCompletion } from "@/backend/ai/client";
import { fallbackAppeal } from "@/backend/ai/fallbacks";
import { appealDraftSchema } from "@/backend/ai/schemas";
import type { AppealDraft } from "@/backend/contracts/api";
import { primaryScenario } from "@/backend/data/scenarios";

const appealCase = {
  citizen: primaryScenario.citizen,
  grievance: primaryScenario.grievance,
  requestedOutcome: primaryScenario.case.requestedOutcome,
  governmentActions: primaryScenario.case.governmentActions,
  evidence: primaryScenario.case.evidence,
};

const appealJsonSchema = {
  name: "appeal_draft",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["subject", "body"],
    properties: {
      subject: { type: "string" },
      body: { type: "string" },
    },
  },
};

export async function draftAppeal(): Promise<AppealDraft> {
  try {
    const json = await createJsonCompletion(
      `
Write a review request (appeal) that the citizen can change.

Use words a 12-year-old can understand. Keep sentences short. Use "complaint" instead of "grievance" and "proof" instead of "evidence" in text shown to the citizen. If an official term is needed, explain it in brackets.

Do not accuse anyone of misconduct. Do not invent law, deadlines, transaction IDs, official rules, payments, or proof.
Only use the current complaint record below. Do not assume the requested outcome happened.

Current complaint record:
${JSON.stringify(appealCase, null, 2)}
`,
      appealJsonSchema,
    );
    const parsed = appealDraftSchema.safeParse(json);
    return parsed.success
      ? parsed.data
      : fallbackAppeal(primaryScenario.grievance.id);
  } catch {
    return fallbackAppeal(primaryScenario.grievance.id);
  }
}
