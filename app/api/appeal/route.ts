import { NextResponse } from "next/server";
import { draftAppeal } from "@/backend/api/appeal";

export async function POST() {
  return NextResponse.json(await draftAppeal());
}
