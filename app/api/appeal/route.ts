import { NextResponse } from "next/server";
import { createJsonCompletion } from "@/lib/ai/client";
import { fallbackAppeal } from "@/lib/ai/fallbacks";
import { appealDraftSchema } from "@/lib/ai/schemas";
import { primaryScenario } from "@/data/scenarios";

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

export async function POST() {
  try {
    const json = await createJsonCompletion(
      `
Write a review request (appeal) that the citizen can change.

Use words a 12-year-old can understand. Keep sentences short. Use "complaint" instead of "grievance" and "proof" instead of "evidence" in text shown to the citizen. If an official term is needed, explain it in brackets.

Do not accuse anyone of misconduct. Do not invent law, deadlines, transaction IDs, or official rules.

Case:
${JSON.stringify(primaryScenario, null, 2)}
`,
      appealJsonSchema,
    );
    const parsed = appealDraftSchema.safeParse(json);
    return NextResponse.json(
      parsed.success ? parsed.data : fallbackAppeal(primaryScenario.grievance.id),
    );
  } catch {
    return NextResponse.json(fallbackAppeal(primaryScenario.grievance.id));
  }
}
