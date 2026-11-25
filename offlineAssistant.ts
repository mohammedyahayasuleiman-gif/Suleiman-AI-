import type { AppLanguage, NoteItem, TaskItem } from "../types.ts";
import { parseSpokenCommand, type ParsedAppAction } from "./commandParser.ts";
import {
  formatSensorVoiceResponse,
  type SavedLocation,
  type SensorLocationSnapshot,
} from "./sensorLocationEngine.ts";

export interface OfflineResolution {
  reply: string;
  action?: ParsedAppAction;
  pendingDial?: {
    number: string;
    display: string;
  };
  pendingSms?: {
    number: string;
    display: string;
    body: string;
  };
  pendingShare?: {
    text: string;
  };
  pendingExternalLink?: {
    appName: string;
    url: string;
  };
}

const CONTACT_ALIAS_KEY = "ay_suleiman_contact_aliases_v1";

export function loadWebContactAliases(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CONTACT_ALIAS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function saveWebContactAlias(alias: string, phoneNumber: string): void {
  const key = alias.trim().toLowerCase().replace(/^my\s+/, "");
  const cleanNum = phoneNumber.replace(/[^\d+]/g, "");
  if (!key || cleanNum.length < 5) return;
  try {
    const current = loadWebContactAliases();
    current[key] = cleanNum;
    localStorage.setItem(CONTACT_ALIAS_KEY, JSON.stringify(current));
  } catch {
    // ignore storage errors
  }
}

export function resolveOfflineQuery(
  rawText: string,
  context: {
    language: AppLanguage;
    notes: NoteItem[];
    tasks: TaskItem[];
    sensorSnapshot?: SensorLocationSnapshot;
    savedLocations?: SavedLocation[];
  }
): OfflineResolution | null {
  const cleaned = rawText.trim();
  if (!cleaned) return null;

  // 1. In-app command parser takes priority (emergency stop, voice control, navigation, notes, tasks, sensors)
  const parsedCommand = parseSpokenCommand(cleaned, context.language);
  if (parsedCommand) {
    if (parsedCommand.type === "sensor_query" && context.sensorSnapshot) {
      const liveReply = formatSensorVoiceResponse(
        parsedCommand.queryType,
        context.sensorSnapshot,
        context.savedLocations || [],
        context.language
      );
      return {
        reply: liveReply,
        action: {
          ...parsedCommand,
          spokenConfirmation: liveReply,
        },
      };
    }
    if (parsedCommand.type === "external_app_action") {
      if (parsedCommand.actionKind === "sms") {
        const aliases = loadWebContactAliases();
        const rawTarget = parsedCommand.smsTarget || "";
        const normTarget = rawTarget.toLowerCase().replace(/^my\s+/, "");
        const directDigits = rawTarget.replace(/[^\d+]/g, "");
        const number =
          directDigits.length >= 6 && /\d/.test(rawTarget)
            ? directDigits
            : aliases[normTarget] || "";
        return {
          reply: parsedCommand.spokenConfirmation,
          pendingSms: {
            number,
            display: rawTarget,
            body: parsedCommand.smsBody || "",
          },
        };
      }
      if (parsedCommand.actionKind === "share" && parsedCommand.shareText) {
        return {
          reply: parsedCommand.spokenConfirmation,
          pendingShare: { text: parsedCommand.shareText },
        };
      }
      if (parsedCommand.actionKind === "open_app" && parsedCommand.targetUrl) {
        return {
          reply: parsedCommand.spokenConfirmation,
          pendingExternalLink: {
            appName: parsedCommand.appName,
            url: parsedCommand.targetUrl,
          },
        };
      }
      return {
        reply: parsedCommand.spokenConfirmation,
      };
    }
    return {
      reply: parsedCommand.spokenConfirmation,
      action: parsedCommand,
    };
  }

  const lower = cleaned
    .toLowerCase()
    .replace(/^(?:hey|ok|okay|hi)\s+(?:a\s*y\s+suleiman(?:\s+ai)?|suleiman)\s*[,:]?\s*/i, "")
    .replace(/[?.!,]+$/g, "")
    .replace(/\s+/g, " ");

  // 2. Confirmed Phone Dialing (number OR saved alias like "call my wife")
  const dialNumMatch = lower.match(
    /^(?:please\s+)?(?:call|dial|phone|ring)\s+([+\d][\d\s()-]{5,18}\d)$/i
  );
  if (dialNumMatch && dialNumMatch[1]) {
    const rawNum = dialNumMatch[1].trim();
    const digitsOnly = rawNum.replace(/[^\d+]/g, "");
    if (digitsOnly.length >= 6) {
      const reply =
        context.language === "ha"
          ? `Shin kana son in kira ${rawNum}? Ka tabbatar da kiran a allon.`
          : context.language === "pcm"
          ? `You wan call ${rawNum}? Confirm am for screen first.`
          : `Ready to call ${rawNum}. Please confirm before dialing.`;
      return {
        reply,
        pendingDial: {
          number: digitsOnly,
          display: rawNum,
        },
      };
    }
  }

  const dialAliasMatch = lower.match(/^(?:please\s+)?(?:call|dial|phone|ring)\s+(.+)$/i);
  if (dialAliasMatch && dialAliasMatch[1]) {
    const target = dialAliasMatch[1].trim();
    const norm = target.toLowerCase().replace(/^my\s+/, "");
    const aliases = loadWebContactAliases();
    const found = aliases[norm] || aliases[target.toLowerCase()];
    if (found) {
      return {
        reply: `Ready to call ${target} (${found}). Please confirm on screen.`,
        pendingDial: {
          number: found,
          display: `${target} (${found})`,
        },
      };
    }
    return {
      reply: `Ready to set up call to ${target}. Enter or confirm the phone number on screen.`,
      pendingDial: {
        number: "",
        display: target,
      },
    };
  }

  // 3. Current time / date queries (zero network)
  if (
    /^(?:what\s+time(?:\s+is\s+it)?|what(?:'s| is)\s+(?:the\s+)?time|current\s+time|tell\s+me\s+the\s+time|karfe\s+nawa|ƙarfe\s+nawa|wetin\s+(?:be\s+)?time)/i.test(
      lower
    )
  ) {
    const nowTime = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());
    const reply =
      context.language === "ha"
        ? `Ƙarfe ${nowTime} ne yanzu.`
        : context.language === "pcm"
        ? `Time na ${nowTime} now.`
        : `The time is ${nowTime}.`;
    return { reply };
  }

  if (
    /^(?:what(?:'s| is)\s+(?:today'?s\s+)?date|what\s+day\s+is\s+(?:it|today)|today'?s\s+date|wace\s+rana\s+ce\s+yau|wetin\s+be\s+today\s+date)/i.test(
      lower
    )
  ) {
    const todayFormatted = new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
    const reply =
      context.language === "ha"
        ? `Yau ita ce ${todayFormatted}.`
        : context.language === "pcm"
        ? `Today na ${todayFormatted}.`
        : `Today is ${todayFormatted}.`;
    return { reply };
  }

  // 4. Read pending tasks aloud locally
  if (
    /^(?:read|list|tell\s+me|how\s+many)\s+(?:are\s+)?(?:my\s+)?(?:pending\s+|active\s+)?tasks?/i.test(
      lower
    )
  ) {
    const pending = context.tasks.filter((t) => !t.completed);
    if (pending.length === 0) {
      return {
        reply:
          context.language === "ha"
            ? "Ba ka da ayyukan da ke jira a halin yanzu."
            : context.language === "pcm"
            ? "You no get any pending task right now."
            : "You have no pending tasks right now.",
      };
    }
    const topTitles = pending
      .slice(0, 3)
      .map((t) => t.title)
      .join(", ");
    const reply =
      context.language === "ha"
        ? `Kana da ayyuka ${pending.length} masu jira: ${topTitles}.`
        : context.language === "pcm"
        ? `You get ${pending.length} tasks wey remain: ${topTitles}.`
        : `You have ${pending.length} pending ${
            pending.length === 1 ? "task" : "tasks"
          }: ${topTitles}.`;
    return { reply };
  }

  // 5. Read recent notes aloud locally
  if (
    /^(?:read|list|tell\s+me|how\s+many)\s+(?:are\s+)?(?:my\s+)?(?:saved\s+|recent\s+)?notes?/i.test(
      lower
    )
  ) {
    if (context.notes.length === 0) {
      return {
        reply:
          context.language === "ha"
            ? "Ba ka da bayanai da aka ajiye tukuna."
            : context.language === "pcm"
            ? "You never save any note yet."
            : "You have no saved notes yet.",
      };
    }
    const topTitles = context.notes
      .slice(0, 3)
      .map((n) => n.title || "Untitled note")
      .join(", ");
    const reply =
      context.language === "ha"
        ? `Kana da bayanai ${context.notes.length} da aka ajiye, kamar: ${topTitles}.`
        : context.language === "pcm"
        ? `You get ${context.notes.length} saved notes: ${topTitles}.`
        : `You have ${context.notes.length} saved ${
            context.notes.length === 1 ? "note" : "notes"
          }, including: ${topTitles}.`;
    return { reply };
  }

  return null;
}

export function buildOfflineFallbackReply(language: AppLanguage): string {
  if (language === "ha") {
    return "Babu haɗin intanet a yanzu. Ina iya duba lokaci, karanta ayyukanka da bayanai, ko buɗe shafuka ba tare da intanet ba.";
  }
  if (language === "pcm") {
    return "Network no dey right now. I still fit tell you time, read your tasks and notes, or open screens offline.";
  }
  return "You appear to be offline right now. I can still check the time or date, read your saved tasks and notes, add new items, and navigate between screens without internet.";
}
