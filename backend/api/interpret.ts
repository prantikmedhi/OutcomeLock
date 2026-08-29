import { createJsonCompletion } from "@/backend/ai/client";
import { fallbackIntent } from "@/backend/ai/fallbacks";
import { intentResultSchema } from "@/backend/ai/schemas";
import type { IntentResult } from "@/backend/contracts/api";

const intentJsonSchema = {
  name: "intent_result",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["problemType", "desiredOutcome"],
    properties: {
      problemType: {
        type: "string",
        enum: ["PENSION_PAYMENT_MISSING", "UNKNOWN"],
      },
      desiredOutcome: {
        type: "object",
        additionalProperties: false,
        required: ["type", "description"],
        properties: {
          type: {
            type: "string",
            enum: ["PENSION_PAYMENT_RECEIVED", "UNKNOWN"],
          },
          description: { type: "string" },
        },
      },
    },
  },
};

export async function interpretProblem(problem?: string): Promise<IntentResult> {
  if (!problem) return fallbackIntent;

  try {
    const json = await createJsonCompletion(
      `
Understand what the citizen wants OutcomeLock to check.

Use words a 12-year-old can understand. Keep sentences short. Use "complaint" instead of "grievance" and "proof" instead of "evidence" in text shown to the citizen. If an official term is needed, explain it in brackets.

Citizen problem:
${problem}

Describe what the citizen needs in one short sentence.
`,
      intentJsonSchema,
    );
    const parsed = intentResultSchema.safeParse(json);
    return parsed.success ? parsed.data : fallbackIntent;
  } catch {
    return fallbackIntent;
  }
}
