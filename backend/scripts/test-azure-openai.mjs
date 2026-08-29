const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const apiVersion = process.env.OPENAI_API_VERSION ?? "2025-04-01-preview";

if (!endpoint || !apiKey || !deployment) {
  console.error(
    "Missing AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, or AZURE_OPENAI_DEPLOYMENT.",
  );
  process.exit(1);
}

const url = `${endpoint.replace(/\/$/, "")}/openai/responses?api-version=${apiVersion}`;

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "api-key": apiKey,
  },
  body: JSON.stringify({
    model: deployment,
    input: "Reply exactly with this JSON: {\"ok\":true}",
    max_output_tokens: 128,
    store: false,
    reasoning: {
      effort: process.env.OPENAI_REASONING_EFFORT ?? "medium",
      summary: "auto",
    },
    text: {
      format: {
        type: "json_schema",
        name: "azure_smoke_test",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["ok"],
          properties: {
            ok: { type: "boolean" },
          },
        },
      },
    },
  }),
});

const text = await response.text();

console.log(`status=${response.status}`);

if (!response.ok) {
  console.error(text);
  process.exit(1);
}

const parsed = JSON.parse(text);
const outputText =
  parsed.output_text ??
  parsed.output
    ?.flatMap((item) => item.content ?? [])
    .find((content) => content.type === "output_text")?.text;

console.log(`id=${parsed.id ?? "unknown"}`);
console.log(`model=${parsed.model ?? deployment}`);
console.log(`reasoning_effort=${parsed.reasoning?.effort ?? "unknown"}`);
console.log(`reasoning_mode=${parsed.reasoning?.mode ?? "unknown"}`);
console.log(`output_text=${outputText ?? "missing"}`);
