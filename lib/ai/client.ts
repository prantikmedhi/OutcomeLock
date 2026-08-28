import OpenAI, { AzureOpenAI } from "openai";

type AiClientConfig = {
  client: OpenAI | AzureOpenAI;
  model: string;
};

export type JsonSchema = {
  name: string;
  schema: {
    [key: string]: unknown;
  };
};

const reasoningEfforts = [
  "none",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
] as const;

type ReasoningEffort = (typeof reasoningEfforts)[number];

function getReasoningEffort(): ReasoningEffort {
  const effort = process.env.OPENAI_REASONING_EFFORT;

  if (reasoningEfforts.includes(effort as ReasoningEffort)) {
    return effort as ReasoningEffort;
  }

  return "medium";
}

export function getAiClient(): AiClientConfig | null {
  const provider = process.env.OPENAI_PROVIDER ?? "openai";

  if (provider === "azure") {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion =
      process.env.OPENAI_API_VERSION ??
      process.env.AZURE_OPENAI_API_VERSION ??
      "2025-04-01-preview";

    if (!endpoint || !apiKey || !deployment) {
      return null;
    }

    return {
      client: new AzureOpenAI({
        endpoint,
        apiKey,
        apiVersion,
        deployment,
      }),
      model: deployment,
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  return {
    client: new OpenAI({ apiKey }),
    model: process.env.OPENAI_MODEL ?? "gpt-5.6-sol",
  };
}

export async function createJsonCompletion(
  prompt: string,
  output: JsonSchema,
): Promise<unknown | null> {
  const config = getAiClient();

  if (!config) {
    return null;
  }

  const response = await config.client.responses.create({
    model: config.model,
    instructions:
      "Return only valid JSON matching the provided schema. Use words a 12-year-old can understand and short sentences. Use complaint instead of grievance and proof instead of evidence in public text. Explain any official term in brackets. Do not invent government facts, evidence, payments, or official rules.",
    input: prompt,
    max_output_tokens: 800,
    store: false,
    reasoning: {
      effort: getReasoningEffort(),
    },
    text: {
      verbosity: "low",
      format: {
        type: "json_schema",
        name: output.name,
        schema: output.schema,
        strict: true,
      },
    },
  });

  const content = extractOutputText(response);

  if (!content) {
    return null;
  }

  return JSON.parse(content);
}

function extractOutputText(response: unknown): string | undefined {
  const direct = response as { output_text?: string };

  if (direct.output_text) {
    return direct.output_text;
  }

  const nested = response as {
    output?: Array<{
      content?: Array<{
        type?: string;
        text?: string;
      }>;
    }>;
  };

  return nested.output
    ?.flatMap((item) => item.content ?? [])
    .find((content) => content.type === "output_text" && content.text)?.text;
}
