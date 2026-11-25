import type { AppLanguage, NoteItem, TaskItem } from "../types.ts";

const NOTES_KEY = "ay_suleiman_notes_v1";
const TASKS_KEY = "ay_suleiman_tasks_v1";
const LANG_KEY = "ay_suleiman_language_v1";

export function loadLanguage(): AppLanguage {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "ha" || saved === "pcm") {
      return saved;
    }
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("ha")) return "ha";
    if (browserLang.startsWith("pcm")) return "pcm";
  } catch {
    // ignore storage read errors
  }
  return "en";
}

export function saveLanguage(lang: AppLanguage): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // ignore storage write errors
  }
}

export function loadNotes(): NoteItem[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: NoteItem[]): boolean {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return true;
  } catch {
    return false;
  }
}

export function loadTasks(): TaskItem[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: TaskItem[]): boolean {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}

export function clearAllLocalData(): void {
  try {
    localStorage.removeItem(NOTES_KEY);
    localStorage.removeItem(TASKS_KEY);
  } catch {
    // ignore
  }
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const commaIdx = result.indexOf(",");
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = () => reject(new Error("Failed to read media blob."));
    reader.readAsDataURL(blob);
  });
}

export function formatShortDate(ts: number): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}
