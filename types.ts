export type AppLanguage = "en" | "ha" | "pcm";

export type AppRoute =
  | "home"
  | "chat"
  | "voice_assistant"
  | "voice_notes"
  | "vision"
  | "sensors"
  | "memory"
  | "tasks"
  | "agent"
  | "research"
  | "settings";

export interface NoteItem {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
  source?: "manual" | "voice" | "chat" | "vision" | "agent" | "research";
}

export interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  dueTime: string;
  priority: "low" | "normal" | "high";
  completed: boolean;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}

export interface VoiceNoteDraft {
  id: string;
  createdAt: number;
  durationSeconds: number;
  transcript: string;
  audioUrl: string;
  audioBase64: string;
  mimeType: string;
  savedToMemory: boolean;
}

export interface AIStatus {
  aiConnected: boolean;
  model: string;
  transcribeModel?: string;
  ttsModel?: string;
}

export interface UserPreferenceItem {
  id: string;
  key: string;
  value: string;
  updatedAt: number;
}

export interface ProjectItem {
  id: string;
  name: string;
  status: string;
  notes: string;
  updatedAt: number;
}

export interface ConversationRecallItem {
  id: string;
  topic: string;
  summary: string;
  savedAt: number;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  createdAt: number;
}

export type AgentToolName =
  | "research_web"
  | "create_note"
  | "create_task"
  | "save_preference"
  | "save_project"
  | "log_expense"
  | "daily_briefing"
  | "none";

export type AgentStepStatus = "pending" | "approved" | "running" | "completed" | "skipped" | "failed";

export interface AgentPlanStep {
  id: string;
  title: string;
  description: string;
  tool: AgentToolName;
  args: {
    query?: string;
    title?: string;
    body?: string;
    dueDate?: string;
    dueTime?: string;
    priority?: "low" | "normal" | "high";
    key?: string;
    value?: string;
    projectName?: string;
    projectStatus?: string;
    amount?: number;
    currency?: string;
    category?: string;
  };
  requiresConfirmation: boolean;
  safetyNote: string;
  status: AgentStepStatus;
  output?: string;
  sources?: Array<{ title: string; url: string }>;
}

export interface AgentPlan {
  id: string;
  goal: string;
  summary: string;
  createdAt: number;
  steps: AgentPlanStep[];
}

export interface ResearchReport {
  id: string;
  query: string;
  category: "general" | "news" | "tech" | "opportunities";
  summary: string;
  sources: Array<{ title: string; url: string }>;
  searchedAt: string;
}
