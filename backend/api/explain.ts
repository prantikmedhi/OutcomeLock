import { createJsonCompletion } from "@/backend/ai/client";
import { fallbackExplanation } from "@/backend/ai/fallbacks";
import { explanationResultSchema } from "@/backend/ai/schemas";
import type { ExplanationResult } from "@/backend/contracts/api";
import { primaryScenario } from "@/backend/data/scenarios";
import { evaluateOutcome } from "@/backend/outcome-engine/evaluate";

const explanationJsonSchema = {
  name: "explanation_result",
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "summary",
      "requestedOutcome",
      "governmentAction",
      "missingEvidence",
      "recommendedAction",
    ],
    properties: {
      summary: { type: "string" },
      requestedOutcome: { type: "string" },
      governmentAction: { type: "string" },
      missingEvidence: {
        type: "array",
        items: { type: "string" },
      },
      recommendedAction: { type: "string" },
    },
  },
};

export async function explainOutcome(): Promise<ExplanationResult> {
  const evaluation = evaluateOutcome(primaryScenario.case);
  const authoritativeResult = fallbackExplanation(evaluation);

  try {
    const json = await createJsonCompletion(
      `
Explain OutcomeLock's result to the citizen.

Use words a 12-year-old can understand. Keep sentences short. Use "complaint" instead of "grievance" and "proof" instead of "evidence" in text shown to the citizen. If an official term is needed, explain it in brackets.

Do not change the status. Explain these facts without blaming anyone.

Facts:
${JSON.stringify(evaluation, null, 2)}
`,
      explanationJsonSchema,
    );
    const parsed = explanationResultSchema.safeParse(json);
    return parsed.success
      ? { ...authoritativeResult, summary: parsed.data.summary }
      : authoritativeResult;
  } catch {
    return authoritativeResult;
  }
}
