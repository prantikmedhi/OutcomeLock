import { NextResponse } from "next/server";
import { createJsonCompletion } from "@/lib/ai/client";
import { fallbackExplanation } from "@/lib/ai/fallbacks";
import { explanationResultSchema } from "@/lib/ai/schemas";
import { evaluateOutcome } from "@/lib/outcome-engine/evaluate";
import { primaryScenario } from "@/data/scenarios";

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

export async function POST() {
  const evaluation = evaluateOutcome(primaryScenario.case);

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
    return NextResponse.json(
      parsed.success ? parsed.data : fallbackExplanation(evaluation),
    );
  } catch {
    return NextResponse.json(fallbackExplanation(evaluation));
  }
}
