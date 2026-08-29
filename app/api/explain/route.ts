import { NextResponse } from "next/server";
import { explainOutcome } from "@/backend/api/explain";

export async function POST() {
  return NextResponse.json(await explainOutcome());
}
