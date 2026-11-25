import type { AgentPlanStep, AppLanguage } from "../types.ts";

export interface PlanApiResponse {
  status: "needs_clarification" | "plan_ready";
  clarificationQuestion?: string;
  goal: string;
  summary: string;
  steps: Array<Omit<AgentPlanStep, "status">>;
}

export interface ResearchApiResponse {
  summary: string;
  sources: Array<{ title: string; url: string }>;
  model: string;
  searchedAt: string;
}

export interface BriefingApiResponse {
  briefing: string;
  date: string;
  model: string;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Network error while contacting the assistant server.");
  }

  const rawText = await res.text();
  let parsed: Record<string, unknown> | null = null;
  if (rawText) {
    try {
      parsed = JSON.parse(rawText) as Record<string, unknown>;
    } catch {
      throw new Error("The server returned an unreadable response.");
    }
  }

  if (!res.ok) {
    const errText =
      (parsed && typeof parsed.error === "string" && parsed.error) ||
      `Request failed (HTTP ${res.status}).`;
    throw new Error(errText);
  }

  if (!parsed) {
    throw new Error("The server returned an empty response.");
  }

  return parsed as unknown as T;
}

export async function requestAgentPlan(params: {
  instruction: string;
  language: AppLanguage;
  contextSummary?: string;
}): Promise<PlanApiResponse> {
  return postJson<PlanApiResponse>("/api/agent/plan", params);
}

export async function requestDailyBriefing(params: {
  language: AppLanguage;
  contextSummary: string;
}): Promise<BriefingApiResponse> {
  return postJson<BriefingApiResponse>("/api/agent/briefing", params);
}

export async function requestGroundedResearch(params: {
  query: string;
  category: "general" | "news" | "tech" | "opportunities";
  language: AppLanguage;
}): Promise<ResearchApiResponse> {
  return postJson<ResearchApiResponse>("/api/research", params);
}
