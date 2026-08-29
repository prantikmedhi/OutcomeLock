import { NextResponse } from "next/server";
import { interpretProblem } from "@/backend/api/interpret";
import { problemInputSchema } from "@/backend/ai/schemas";

export async function POST(request: Request) {
  const parsed = problemInputSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a pension payment problem using 500 characters or fewer." },
      { status: 400 },
    );
  }

  return NextResponse.json(await interpretProblem(parsed.data.problem));
}
