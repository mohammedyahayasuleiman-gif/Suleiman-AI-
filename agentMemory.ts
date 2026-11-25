import type {
  AgentPlan,
  ConversationRecallItem,
  ExpenseItem,
  NoteItem,
  ProjectItem,
  TaskItem,
  UserPreferenceItem,
} from "../types.ts";

const PREFS_KEY = "ay_suleiman_preferences_v1";
const PROJECTS_KEY = "ay_suleiman_projects_v1";
const RECALL_KEY = "ay_suleiman_convo_recall_v1";
const EXPENSES_KEY = "ay_suleiman_expenses_v1";
const PLANS_KEY = "ay_suleiman_agent_plans_v1";

function safeReadArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function safeWriteArray<T>(key: string, items: T[]): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

export function loadPreferences(): UserPreferenceItem[] {
  return safeReadArray<UserPreferenceItem>(PREFS_KEY);
}

export function savePreferences(items: UserPreferenceItem[]): boolean {
  return safeWriteArray(PREFS_KEY, items);
}

export function loadProjects(): ProjectItem[] {
  return safeReadArray<ProjectItem>(PROJECTS_KEY);
}

export function saveProjects(items: ProjectItem[]): boolean {
  return safeWriteArray(PROJECTS_KEY, items);
}

export function loadRecalls(): ConversationRecallItem[] {
  return safeReadArray<ConversationRecallItem>(RECALL_KEY);
}

export function saveRecalls(items: ConversationRecallItem[]): boolean {
  return safeWriteArray(RECALL_KEY, items);
}

export function loadExpenses(): ExpenseItem[] {
  return safeReadArray<ExpenseItem>(EXPENSES_KEY);
}

export function saveExpenses(items: ExpenseItem[]): boolean {
  return safeWriteArray(EXPENSES_KEY, items);
}

export function loadAgentPlans(): AgentPlan[] {
  return safeReadArray<AgentPlan>(PLANS_KEY);
}

export function saveAgentPlans(items: AgentPlan[]): boolean {
  return safeWriteArray(PLANS_KEY, items.slice(0, 15));
}

export function clearExtendedMemory(): void {
  try {
    localStorage.removeItem(PREFS_KEY);
    localStorage.removeItem(PROJECTS_KEY);
    localStorage.removeItem(RECALL_KEY);
    localStorage.removeItem(EXPENSES_KEY);
    localStorage.removeItem(PLANS_KEY);
  } catch {
    // ignore
  }
}

export function buildAgentContextSummary(params: {
  preferences: UserPreferenceItem[];
  projects: ProjectItem[];
  recalls: ConversationRecallItem[];
  notes: NoteItem[];
  tasks: TaskItem[];
  expenses: ExpenseItem[];
}): string {
  const parts: string[] = [];

  if (params.preferences.length > 0) {
    parts.push(
      "User Preferences:\n" +
        params.preferences
          .slice(0, 10)
          .map((p) => `- ${p.key}: ${p.value}`)
          .join("\n")
    );
  }

  if (params.projects.length > 0) {
    parts.push(
      "Ongoing Projects:\n" +
        params.projects
          .slice(0, 10)
          .map((pr) => `- ${pr.name} [${pr.status}]: ${pr.notes}`)
          .join("\n")
    );
  }

  const activeTasks = params.tasks.filter((tk) => !tk.completed);
  if (activeTasks.length > 0) {
    parts.push(
      "Active Tasks:\n" +
        activeTasks
          .slice(0, 12)
          .map(
            (tk) =>
              `- ${tk.title}${tk.dueDate ? ` (due ${tk.dueDate}${tk.dueTime ? ` ${tk.dueTime}` : ""})` : ""} [${tk.priority}]`
          )
          .join("\n")
    );
  }

  if (params.notes.length > 0) {
    parts.push(
      "Recent Personal Notes:\n" +
        params.notes
          .slice(0, 8)
          .map((n) => `- ${n.title || "Untitled"}: ${n.body.slice(0, 140)}`)
          .join("\n")
    );
  }

  if (params.recalls.length > 0) {
    parts.push(
      "Conversation Recall:\n" +
        params.recalls
          .slice(0, 5)
          .map((r) => `- ${r.topic}: ${r.summary}`)
          .join("\n")
    );
  }

  if (params.expenses.length > 0) {
    parts.push(
      "Recent Expenses:\n" +
        params.expenses
          .slice(0, 10)
          .map((e) => `- ${e.date}: ${e.title} (${e.currency} ${e.amount}) [${e.category}]`)
          .join("\n")
    );
  }

  return parts.join("\n\n");
}
