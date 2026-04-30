export type GenerateRequest = {
  input_text: string;
  scenario: string;
  tone: string;
  length: string;
};

export type RefineRequest = {
  original_input: string;
  current_output: string;
  action_type: string;
};

export type GenerateResponse = {
  output_text: string;
  usage: {
    allowed: boolean;
    used: number;
    limit: number;
    remaining: number;
  };
  metadata: {
    provider: string;
    model: string;
    latency_ms: number;
    input_tokens?: number | null;
    output_tokens?: number | null;
    cost_estimate?: number | null;
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function generateReport(
  payload: GenerateRequest,
  anonymousId: string,
): Promise<GenerateResponse> {
  return postJson("/api/generate", payload, anonymousId);
}

export async function refineReport(
  payload: RefineRequest,
  anonymousId: string,
): Promise<GenerateResponse> {
  return postJson("/api/refine", payload, anonymousId);
}

async function postJson<TPayload, TResponse>(
  path: string,
  payload: TPayload,
  anonymousId: string,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Anonymous-Id": anonymousId,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail ?? "Request failed");
  }

  return data as TResponse;
}
