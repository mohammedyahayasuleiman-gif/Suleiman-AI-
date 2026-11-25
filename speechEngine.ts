import type { AppLanguage } from "../types.ts";

const WAKE_WORD_KEY = "ay_suleiman_wake_word_v1";
const VOICE_SETTINGS_KEY = "ay_suleiman_voice_settings_v1";
export const DEFAULT_WAKE_WORD = "Hey Suleiman";

export interface VoiceActivationSettings {
  wakeWord: string;
  continuousDefault: boolean;
  spokenReplies: boolean;
}

interface BrowserSpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface BrowserSpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: BrowserSpeechRecognitionAlternative;
}

interface BrowserSpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: BrowserSpeechRecognitionResult;
  };
}

interface BrowserSpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface BrowserSpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((ev: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((ev: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type BrowserSpeechRecognitionCtor = new () => BrowserSpeechRecognitionInstance;

function getSpeechRecognitionCtor(): BrowserSpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: BrowserSpeechRecognitionCtor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function isBrowserSpeechRecognitionSupported(): boolean {
  return Boolean(getSpeechRecognitionCtor());
}

export function getSpeechLocale(language: AppLanguage): string {
  if (language === "ha") return "ha-NG";
  if (language === "pcm") return "en-NG";
  return "en-NG";
}

export function loadWakeWord(): string {
  try {
    const saved = localStorage.getItem(WAKE_WORD_KEY)?.trim();
    return saved || DEFAULT_WAKE_WORD;
  } catch {
    return DEFAULT_WAKE_WORD;
  }
}

export function saveWakeWord(wakeWord: string): string {
  const cleaned = wakeWord.trim().slice(0, 40) || DEFAULT_WAKE_WORD;
  try {
    localStorage.setItem(WAKE_WORD_KEY, cleaned);
  } catch {
    // ignore storage errors
  }
  return cleaned;
}

export function loadVoiceSettings(): VoiceActivationSettings {
  const wakeWord = loadWakeWord();
  try {
    const raw = localStorage.getItem(VOICE_SETTINGS_KEY);
    if (!raw) {
      return { wakeWord, continuousDefault: false, spokenReplies: true };
    }
    const parsed = JSON.parse(raw) as Partial<VoiceActivationSettings>;
    return {
      wakeWord,
      continuousDefault: Boolean(parsed.continuousDefault),
      spokenReplies:
        typeof parsed.spokenReplies === "boolean" ? parsed.spokenReplies : true,
    };
  } catch {
    return { wakeWord, continuousDefault: false, spokenReplies: true };
  }
}

export function saveVoiceSettings(
  next: Partial<VoiceActivationSettings>
): VoiceActivationSettings {
  const current = loadVoiceSettings();
  const wakeWord =
    typeof next.wakeWord === "string"
      ? saveWakeWord(next.wakeWord)
      : current.wakeWord;
  const merged: VoiceActivationSettings = {
    wakeWord,
    continuousDefault:
      typeof next.continuousDefault === "boolean"
        ? next.continuousDefault
        : current.continuousDefault,
    spokenReplies:
      typeof next.spokenReplies === "boolean"
        ? next.spokenReplies
        : current.spokenReplies,
  };
  try {
    localStorage.setItem(VOICE_SETTINGS_KEY, JSON.stringify(merged));
  } catch {
    // ignore storage errors
  }
  return merged;
}

export function isEmergencyStopPhrase(transcript: string): boolean {
  const normalized = transcript
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return (
    normalized === "suleiman stop" ||
    normalized === "stop suleiman" ||
    normalized === "hey suleiman stop" ||
    normalized === "a y suleiman stop" ||
    normalized === "emergency stop"
  );
}

export function matchWakeWord(
  transcript: string,
  wakeWord: string = DEFAULT_WAKE_WORD
): { matched: boolean; trailingCommand: string } {
  const raw = transcript.trim();
  if (!raw) return { matched: false, trailingCommand: "" };

  const normalized = raw
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const target = wakeWord
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const candidates =
    target === "hey suleiman"
      ? [
          "hey suleiman",
          "hi suleiman",
          "hello suleiman",
          "okay suleiman",
          "ok suleiman",
          "a suleiman",
          "hey solomon",
          "hey sulaiman",
          "hey suleman",
          "suleiman",
        ]
      : [target];

  for (const phrase of candidates) {
    const idx = normalized.indexOf(phrase);
    if (idx !== -1) {
      const after = normalized.slice(idx + phrase.length).trim();
      return { matched: true, trailingCommand: after };
    }
  }

  return { matched: false, trailingCommand: "" };
}

export interface SpeechListenSession {
  stop: () => void;
  cancel: () => void;
  promise: Promise<string>;
}

export class SpeechEngineError extends Error {
  code: "unsupported" | "permission-denied" | "no-mic" | "network" | "no-speech" | "aborted";

  constructor(
    code: "unsupported" | "permission-denied" | "no-mic" | "network" | "no-speech" | "aborted",
    message: string
  ) {
    super(message);
    this.code = code;
  }
}

export function startBrowserSpeechOnce(
  language: AppLanguage,
  onInterim?: (text: string) => void
): SpeechListenSession {
  const Ctor = getSpeechRecognitionCtor();
  if (!Ctor) {
    return {
      stop: () => {},
      cancel: () => {},
      promise: Promise.reject(
        new SpeechEngineError(
          "unsupported",
          "Browser speech recognition is not supported."
        )
      ),
    };
  }

  const recognition = new Ctor();
  recognition.lang = getSpeechLocale(language);
  recognition.continuous = false;
  recognition.interimResults = Boolean(onInterim);
  recognition.maxAlternatives = 1;

  let settled = false;
  let cancelled = false;
  let finalTranscript = "";
  let latestInterim = "";

  const promise = new Promise<string>((resolve, reject) => {
    recognition.onresult = (event) => {
      let combined = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = res?.[0]?.transcript || "";
        if (res.isFinal) {
          combined += (combined ? " " : "") + text;
        } else {
          interim += (interim ? " " : "") + text;
        }
      }
      if (combined.trim()) {
        finalTranscript = `${finalTranscript} ${combined}`.trim();
      }
      if (interim.trim()) {
        latestInterim = interim.trim();
        onInterim?.(latestInterim);
      }
    };

    recognition.onerror = (event) => {
      if (settled) return;
      settled = true;
      const err = event.error;
      if (err === "not-allowed" || err === "service-not-allowed") {
        reject(
          new SpeechEngineError(
            "permission-denied",
            "Microphone permission was denied. Allow microphone access in your browser settings and try again."
          )
        );
      } else if (err === "audio-capture") {
        reject(
          new SpeechEngineError(
            "no-mic",
            "No microphone was found on this device."
          )
        );
      } else if (err === "network") {
        reject(
          new SpeechEngineError(
            "network",
            "Speech recognition network error."
          )
        );
      } else if (err === "no-speech") {
        reject(
          new SpeechEngineError(
            "no-speech",
            "No speech detected. Please speak clearly and try again."
          )
        );
      } else if (err === "aborted") {
        reject(new SpeechEngineError("aborted", "Listening stopped."));
      } else {
        reject(
          new SpeechEngineError(
            "network",
            event.message || `Speech recognition error (${err}).`
          )
        );
      }
    };

    recognition.onend = () => {
      if (settled) return;
      settled = true;
      if (cancelled) {
        reject(new SpeechEngineError("aborted", "Listening cancelled."));
        return;
      }
      const result = (finalTranscript || latestInterim).trim();
      if (!result) {
        reject(
          new SpeechEngineError(
            "no-speech",
            "No speech detected. Please speak clearly and try again."
          )
        );
      } else {
        resolve(result);
      }
    };

    try {
      recognition.start();
    } catch (err) {
      settled = true;
      reject(
        new SpeechEngineError(
          "unsupported",
          err instanceof Error ? err.message : "Could not start speech recognizer."
        )
      );
    }
  });

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch {
        // ignore stop errors
      }
    },
    cancel: () => {
      cancelled = true;
      try {
        recognition.abort();
      } catch {
        // ignore abort errors
      }
    },
    promise,
  };
}

export interface WakeWordController {
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

export function startWakeWordListener(options: {
  language: AppLanguage;
  wakeWord: string;
  onDetected: (trailingCommand: string) => void;
  onEmergencyStop?: () => void;
  onError: (message: string) => void;
}): WakeWordController {
  const Ctor = getSpeechRecognitionCtor();
  if (!Ctor) {
    options.onError(
      "Hands-free wake word requires browser SpeechRecognition support. Use Tap to speak instead."
    );
    return { stop: () => {}, pause: () => {}, resume: () => {} };
  }

  let stopped = false;
  let paused = false;
  let recognition: BrowserSpeechRecognitionInstance | null = null;
  let restartTimer: number | null = null;

  const clearTimer = () => {
    if (restartTimer !== null) {
      window.clearTimeout(restartTimer);
      restartTimer = null;
    }
  };

  const launch = () => {
    if (stopped || paused) return;
    const rec = new Ctor();
    recognition = rec;
    rec.lang = getSpeechLocale(options.language);
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
      if (stopped || paused) return;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i]?.[0]?.transcript || "";
        if (isEmergencyStopPhrase(transcript)) {
          stopped = true;
          clearTimer();
          try {
            rec.abort();
          } catch {
            // ignore
          }
          options.onEmergencyStop?.();
          return;
        }
        const hit = matchWakeWord(transcript, options.wakeWord);
        if (hit.matched) {
          paused = true;
          try {
            rec.abort();
          } catch {
            // ignore
          }
          options.onDetected(hit.trailingCommand);
          return;
        }
      }
    };

    rec.onerror = (event) => {
      if (stopped || paused) return;
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        stopped = true;
        options.onError(
          "Microphone permission was denied for wake-word detection."
        );
      } else if (event.error === "audio-capture") {
        stopped = true;
        options.onError("No microphone was found for wake-word detection.");
      }
    };

    rec.onend = () => {
      recognition = null;
      if (stopped || paused) return;
      clearTimer();
      restartTimer = window.setTimeout(() => {
        launch();
      }, 350);
    };

    try {
      rec.start();
    } catch {
      clearTimer();
      restartTimer = window.setTimeout(() => {
        launch();
      }, 800);
    }
  };

  launch();

  return {
    stop: () => {
      stopped = true;
      clearTimer();
      try {
        recognition?.abort();
      } catch {
        // ignore
      }
      recognition = null;
    },
    pause: () => {
      paused = true;
      clearTimer();
      try {
        recognition?.abort();
      } catch {
        // ignore
      }
      recognition = null;
    },
    resume: () => {
      if (stopped) return;
      paused = false;
      clearTimer();
      restartTimer = window.setTimeout(() => {
        launch();
      }, 250);
    },
  };
}
