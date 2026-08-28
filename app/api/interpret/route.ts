import { NextResponse } from "next/server";
import { fallbackIntent } from "@/lib/ai/fallbacks";
import { createJsonCompletion } from "@/lib/ai/client";
import { intentResultSchema } from "@/lib/ai/schemas";

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

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    problem?: string;
  } | null;
  const problem = body?.problem?.trim();

  if (!problem) {
    return NextResponse.json(fallbackIntent);
  }

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
    return NextResponse.json(parsed.success ? parsed.data : fallbackIntent);
  } catch {
    return NextResponse.json(fallbackIntent);
  }
}
