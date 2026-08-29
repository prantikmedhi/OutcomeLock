import type {
  AppealDraft,
  ExplanationResult,
  IntentResult,
} from "@/backend/contracts/api";

export type { AppealDraft, ExplanationResult, IntentResult };

export async function postBackend(path: string, body?: unknown) {
  const response = await fetch(`/api/${path}`, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  return response.json() as Promise<unknown>;
}
