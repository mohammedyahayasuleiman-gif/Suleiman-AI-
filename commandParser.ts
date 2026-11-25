import type { AppLanguage, AppRoute } from "../types.ts";

export type ParsedAppAction =
  | {
      type: "navigate";
      route: AppRoute;
      label: string;
      spokenConfirmation: string;
    }
  | {
      type: "open_new_note";
      title?: string;
      body?: string;
      label: string;
      spokenConfirmation: string;
    }
  | {
      type: "create_task";
      title: string;
      label: string;
      spokenConfirmation: string;
    }
  | {
      type: "open_tasks_tab";
      tab: "tasks" | "briefing" | "expenses";
      label: string;
      spokenConfirmation: string;
    }
  | {
      type: "open_memory_tab";
      tab: "notes" | "preferences" | "projects" | "recall";
      label: string;
      spokenConfirmation: string;
    }
  | {
      type: "run_research";
      query: string;
      label: string;
      spokenConfirmation: string;
    }
  | {
      type: "set_language";
      language: AppLanguage;
      label: string;
      spokenConfirmation: string;
    }
  | {
      type: "sensor_query";
      queryType:
        | "location"
        | "proximity"
        | "near_object_identify"
        | "motion"
        | "compass"
        | "geofence_enter_home"
        | "geofence_leave_here";
      label: string;
      spokenConfirmation: string;
    }
  | {
      type: "emergency_stop";
      label: string;
      spokenConfirmation: string;
    }
  | {
      type: "voice_control";
      directive: "start_listening" | "stop_listening";
      label: string;
      spokenConfirmation: string;
    }
  | {
      type: "external_app_action";
      actionKind: "open_app" | "sms" | "share" | "android_only";
      appName: string;
      targetUrl?: string;
      smsTarget?: string;
      smsBody?: string;
      shareText?: string;
      label: string;
      spokenConfirmation: string;
    };

function normalizePhrase(input: string): string {
  let text = input
    .trim()
    .replace(/[.,!?;:]+$/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();

  const prefixes = [
    /^(?:hey|ok|hi|hello)\s+(?:a\s*y\s+suleiman(?:\s+ai)?|suleiman|assistant)\s*[,:]?\s*/i,
    /^(?:a\s*y\s+suleiman(?:\s+ai)?)\s*[,:]?\s*/i,
    /^(?:please|kindly|abeg|biko|don\s+allah)\s+/i,
    /^(?:can\s+you|could\s+you|would\s+you|will\s+you)\s+(?:please\s+)?/i,
    /^(?:i\s+want\s+to|i\s+would\s+like\s+to|i'd\s+like\s+to|help\s+me)\s+/i,
  ];

  let changed = true;
  while (changed) {
    changed = false;
    for (const prefix of prefixes) {
      const next = text.replace(prefix, "").trim();
      if (next !== text) {
        text = next;
        changed = true;
      }
    }
  }

  return text;
}

function preserveCaseSlice(rawInput: string, matchedText: string): string {
  const idx = rawInput.toLowerCase().indexOf(matchedText.toLowerCase());
  if (idx >= 0) {
    return rawInput
      .slice(idx, idx + matchedText.length)
      .trim()
      .replace(/[.!?]+$/g, "");
  }
  return matchedText.trim();
}

function deriveNoteTitle(body: string): string {
  const words = body.trim().split(/\s+/).slice(0, 5).join(" ");
  return words.length > 48 ? `${words.slice(0, 45)}...` : words || "Voice Note";
}

function routeConfirmation(
  route: AppRoute,
  language: AppLanguage
): { label: string; spokenConfirmation: string } {
  const names: Record<AppRoute, { en: string; ha: string; pcm: string }> = {
    home: { en: "Home", ha: "Gida", pcm: "Home" },
    chat: { en: "AI Chat", ha: "Tattaunawar AI", pcm: "AI Chat" },
    agent: { en: "Agent Planner", ha: "Mai Tsara Aiki", pcm: "Agent Planner" },
    research: { en: "Research & News", ha: "Bincike da Labarai", pcm: "Research and News" },
    voice_assistant: { en: "Voice Assistant", ha: "Mataimakin Murya", pcm: "Voice Assistant" },
    voice_notes: { en: "Voice Notes", ha: "Bayanan Murya", pcm: "Voice Notes" },
    vision: { en: "Camera & Vision", ha: "Kamara da Hange", pcm: "Camera and Vision" },
    sensors: { en: "Sensors & Location", ha: "Na'urori da Wuri", pcm: "Sensors and Location" },
    memory: { en: "Personal Memory", ha: "Kundin Bayani", pcm: "Personal Memory" },
    tasks: { en: "Tasks & Reminders", ha: "Ayyuka da Tunatarwa", pcm: "Tasks and Reminders" },
    settings: { en: "Settings", ha: "Saituna", pcm: "Settings" },
  };

  const label = names[route][language];
  if (language === "ha") {
    return { label, spokenConfirmation: `Ina buɗe ${label}.` };
  }
  if (language === "pcm") {
    return { label, spokenConfirmation: `I dey open ${label}.` };
  }
  return { label, spokenConfirmation: `Opening ${label}.` };
}

export function parseSpokenCommand(
  rawTranscript: string,
  language: AppLanguage = "en"
): ParsedAppAction | null {
  const raw = rawTranscript.trim();
  if (!raw) return null;

  const rawEmergencyCheck = raw
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (
    rawEmergencyCheck === "suleiman stop" ||
    rawEmergencyCheck === "stop suleiman" ||
    rawEmergencyCheck === "hey suleiman stop" ||
    rawEmergencyCheck === "a y suleiman stop" ||
    rawEmergencyCheck === "emergency stop"
  ) {
    return {
      type: "emergency_stop",
      label: "Emergency Stop",
      spokenConfirmation:
        language === "ha"
          ? "An dakatar da komai nan take."
          : language === "pcm"
          ? "Everything don stop sharp sharp."
          : "Emergency stop activated. Stopping all voice activity.",
    };
  }

  const normalized = normalizePhrase(raw);
  if (!normalized) return null;

  // 0. Voice listening start/stop directives
  if (/^(?:start\s+listening|listen\s+now|wake\s+up|fara\s+saurare)$/i.test(normalized)) {
    return {
      type: "voice_control",
      directive: "start_listening",
      label: "Start listening",
      spokenConfirmation:
        language === "ha"
          ? "Ina saurare yanzu."
          : language === "pcm"
          ? "I don start to listen."
          : "Listening started.",
    };
  }
  if (/^(?:stop\s+listening|pause\s+listening|daina\s+saurare)$/i.test(normalized)) {
    return {
      type: "voice_control",
      directive: "stop_listening",
      label: "Stop listening",
      spokenConfirmation:
        language === "ha"
          ? "Na daina saurare."
          : language === "pcm"
          ? "I don stop to listen."
          : "Listening stopped.",
    };
  }

  // 1. Language switches
  if (/(?:switch|change|set|use|speak).*?\b(?:hausa|harshen hausa)\b/i.test(normalized)) {
    return {
      type: "set_language",
      language: "ha",
      label: "Hausa",
      spokenConfirmation: "An canza harshe zuwa Hausa.",
    };
  }
  if (/(?:switch|change|set|use|speak).*?\b(?:pidgin|nigerian pidgin)\b/i.test(normalized)) {
    return {
      type: "set_language",
      language: "pcm",
      label: "Nigerian Pidgin",
      spokenConfirmation: "Language don change to Nigerian Pidgin.",
    };
  }
  if (/(?:switch|change|set|use|speak).*?\b(?:english|turanci)\b/i.test(normalized)) {
    return {
      type: "set_language",
      language: "en",
      label: "English",
      spokenConfirmation: "Switched language to English.",
    };
  }

  // 2. Add/create a note WITH inline spoken content
  const noteWithBodyMatch = normalized.match(
    /^(?:add|create|make|take|write|save)\s+(?:a\s+)?(?:new\s+)?note\s+(?:saying|that|about|titled|for|:|-)\s+(.+)$/i
  );
  if (noteWithBodyMatch && noteWithBodyMatch[1]?.trim()) {
    const body = preserveCaseSlice(raw, noteWithBodyMatch[1]);
    const title = deriveNoteTitle(body);
    return {
      type: "open_new_note",
      title,
      body,
      label: `Save note: ${title}`,
      spokenConfirmation:
        language === "ha"
          ? `An adana sabon bayani: ${title}.`
          : language === "pcm"
          ? `I don save new note: ${title}.`
          : `Saved new note: ${title}.`,
    };
  }

  // 3. Open empty New Note composer
  if (
    /^(?:(?:add|create|make|open|start|write)\s+(?:a\s+)?(?:new\s+)?note|new\s+note|open\s+note\s+composer|(?:kara|ƙara|rubuta|bu[dɗ]e)\s+(?:sabon\s+)?bayani|sabon\s+bayani)$/i.test(
      normalized
    )
  ) {
    return {
      type: "open_new_note",
      label: "New Note",
      spokenConfirmation:
        language === "ha"
          ? "Ina buɗe shafin sabon bayani."
          : language === "pcm"
          ? "I dey open new note form."
          : "Opening new note composer.",
    };
  }

  // 4. Create task / reminder WITH inline title
  const taskMatch =
    normalized.match(
      /^(?:add|create|make)\s+(?:a\s+)?(?:new\s+)?(?:task|reminder|to-?do)\s+(?:to|for|:|-)?\s*(.+)$/i
    ) || normalized.match(/^remind\s+me\s+to\s+(.+)$/i);

  if (taskMatch && taskMatch[1]?.trim()) {
    const candidate = preserveCaseSlice(raw, taskMatch[1]);
    if (candidate.length >= 2) {
      return {
        type: "create_task",
        title: candidate,
        label: `Add task: ${candidate}`,
        spokenConfirmation:
          language === "ha"
            ? `An ƙara aiki: ${candidate}.`
            : language === "pcm"
            ? `I don add task: ${candidate}.`
            : `Added task: ${candidate}.`,
      };
    }
  }

  // 5. Explicit research command
  const researchMatch = normalized.match(
    /^(?:research|search(?:\s+the)?\s+(?:web|news)\s+(?:for|about)|look\s+up)\s+(.+)$/i
  );
  if (researchMatch && researchMatch[1]?.trim()) {
    const query = preserveCaseSlice(raw, researchMatch[1]);
    return {
      type: "run_research",
      query,
      label: `Research: ${query}`,
      spokenConfirmation:
        language === "ha"
          ? `Ina binciken ${query}.`
          : language === "pcm"
          ? `I dey search for ${query}.`
          : `Searching verified sources for ${query}.`,
    };
  }

  // 5b. Sensor detection & location awareness voice commands (EN / HA / PCM)
  if (
    /^(?:where\s+am\s+i|detect\s+my\s+location|check\s+my\s+location|what(?:'s| is)\s+my\s+(?:current\s+)?location|ina\s+nake|gano\s+wuri(?:na)?|where\s+i\s+dey)$/i.test(
      normalized
    )
  ) {
    return {
      type: "sensor_query",
      queryType: "location",
      label: "Detect location",
      spokenConfirmation: "Checking your current GPS location.",
    };
  }

  if (
    /^(?:is\s+(?:something|anything)\s+near\s+(?:my\s+)?phone|check\s+(?:my\s+)?proximity(?:\s+sensor)?|proximity\s+sensor|akwai\s+abu\s+kusa|something\s+dey\s+near\s+my\s+phone)$/i.test(
      normalized
    )
  ) {
    return {
      type: "sensor_query",
      queryType: "proximity",
      label: "Proximity check",
      spokenConfirmation: "Checking your proximity and near-object sensor.",
    };
  }

  if (
    /^(?:what(?:'s| is)\s+(?:near|in\s+front\s+of)\s+(?:my\s+)?(?:phone|me)|identify\s+(?:near|nearby)\s+objects?|check\s+near\s+objects?|tell\s+me\s+what\s+is\s+near(?:\s+me)?|wetin\s+dey\s+(?:near|front\s+of)\s+(?:my\s+)?phone|me\s+ke\s+kusa\s+da\s+ni)$/i.test(
      normalized
    )
  ) {
    return {
      type: "sensor_query",
      queryType: "near_object_identify",
      label: "Identify near object",
      spokenConfirmation: "Checking what is near your phone.",
    };
  }

  if (
    /^(?:am\s+i\s+moving|check\s+(?:my\s+)?motion(?:\s+sensor)?|detect\s+movement|ina\s+motsi|i\s+dey\s+move)$/i.test(
      normalized
    )
  ) {
    return {
      type: "sensor_query",
      queryType: "motion",
      label: "Motion check",
      spokenConfirmation: "Checking motion sensors.",
    };
  }

  if (
    /^(?:which\s+direction\s+am\s+i\s+facing|what\s+direction\s+am\s+i\s+facing|check\s+(?:my\s+)?compass|compass\s+heading|wace\s+alkibla|which\s+side\s+i\s+dey\s+face)$/i.test(
      normalized
    )
  ) {
    return {
      type: "sensor_query",
      queryType: "compass",
      label: "Compass heading",
      spokenConfirmation: "Checking your compass direction.",
    };
  }

  if (
    /^(?:alert\s+me\s+when\s+i\s+(?:reach|arrive\s+at|get)\s+home|notify\s+me\s+when\s+i\s+(?:reach|get)\s+home|sanar\s+da\s+ni\s+idan\s+na\s+isa\s+gida|tell\s+me\s+when\s+i\s+reach\s+house)$/i.test(
      normalized
    )
  ) {
    return {
      type: "sensor_query",
      queryType: "geofence_enter_home",
      label: "Alert when I reach home",
      spokenConfirmation: "Checking your saved Home geofence alert.",
    };
  }

  if (
    /^(?:tell\s+me\s+when\s+i\s+leave\s+(?:this\s+location|here)|alert\s+me\s+when\s+i\s+leave\s+(?:this\s+location|here)|sanar\s+da\s+ni\s+idan\s+na\s+bar\s+nan|tell\s+me\s+when\s+i\s+comot\s+here)$/i.test(
      normalized
    )
  ) {
    return {
      type: "sensor_query",
      queryType: "geofence_leave_here",
      label: "Alert when leaving here",
      spokenConfirmation: "Setting exit alert for your current location.",
    };
  }

  // 5c. Phone/OS hardware controls, SMS composer, Share, and installed external apps
  const smsBodyMatch = normalized.match(
    /^(?:send\s+(?:an?\s+)?(?:sms|text(?:\s+message)?)|compose\s+(?:an?\s+)?(?:sms|message)\s+to|text)\s+(.+?)\s+(?:saying|that|:)\s+(.+)$/i
  );
  if (smsBodyMatch && smsBodyMatch[1]) {
    const smsTarget = preserveCaseSlice(raw, smsBodyMatch[1]);
    const smsBody = preserveCaseSlice(raw, smsBodyMatch[2] || "");
    return {
      type: "external_app_action",
      actionKind: "sms",
      appName: "Messages",
      smsTarget,
      smsBody,
      label: `Compose SMS to ${smsTarget}`,
      spokenConfirmation: `Ready to compose an SMS to ${smsTarget}. Please confirm on screen.`,
    };
  }

  const shareMatch = normalized.match(/^share\s+(.+)$/i);
  if (shareMatch && shareMatch[1]?.trim()) {
    const shareText = preserveCaseSlice(raw, shareMatch[1]);
    return {
      type: "external_app_action",
      actionKind: "share",
      appName: "Share",
      shareText,
      label: "Share text",
      spokenConfirmation: "Ready to share. Please confirm on screen.",
    };
  }

  if (
    /(?:turn\s+(?:on|off)|switch\s+(?:on|off)|kunna|kashe)\s+(?:the\s+)?(?:flashlight|torch|torchlight)|(?:increase|decrease|raise|lower|mute|unmute)\s+(?:the\s+)?(?:volume|brightness)|(?:read|check)\s+(?:my\s+)?notifications?|open\s+(?:bluetooth|wifi|wi-fi)\s+settings|navigate\s+home|go\s+home/i.test(
      normalized
    )
  ) {
    return {
      type: "external_app_action",
      actionKind: "android_only",
      appName: "Android Device Control",
      label: "Android Device Control",
      spokenConfirmation:
        "Hardware controls (flashlight, volume, brightness, notifications, Wi-Fi/Bluetooth settings, and Android home) run in the native Android companion app (android-app/) with system permission.",
    };
  }

  const externalApps: Array<{ pattern: RegExp; appName: string; targetUrl: string }> = [
    { pattern: /^(?:open|launch|start|bu[dɗ]e)\s+whatsapp$/i, appName: "WhatsApp", targetUrl: "https://web.whatsapp.com/" },
    { pattern: /^(?:open|launch|start|bu[dɗ]e)\s+youtube$/i, appName: "YouTube", targetUrl: "https://www.youtube.com/" },
    { pattern: /^(?:open|launch|start|bu[dɗ]e)\s+gmail$/i, appName: "Gmail", targetUrl: "https://mail.google.com/" },
    { pattern: /^(?:open|launch|start|bu[dɗ]e)\s+(?:google\s+)?maps$/i, appName: "Maps", targetUrl: "https://maps.google.com/" },
    { pattern: /^(?:open|launch|start|bu[dɗ]e)\s+chrome$/i, appName: "Chrome", targetUrl: "https://www.google.com/" },
  ];
  for (const app of externalApps) {
    if (app.pattern.test(normalized)) {
      return {
        type: "external_app_action",
        actionKind: "open_app",
        appName: app.appName,
        targetUrl: app.targetUrl,
        label: `Open ${app.appName}`,
        spokenConfirmation: `Ready to open ${app.appName}. Confirm on screen to launch.`,
      };
    }
  }

  // 6. Specific sub-tabs inside Tasks & Memory
  if (
    /^(?:(?:show|open|view|go\s+to|give|prepare|read|check)(?:\s+me)?\s+(?:my\s+|the\s+)?)?(?:daily\s+)?briefing$/i.test(
      normalized
    )
  ) {
    return {
      type: "open_tasks_tab",
      tab: "briefing",
      label: "Daily Briefing",
      spokenConfirmation:
        language === "ha"
          ? "Ina buɗe taƙaitaccen bayanin yau."
          : language === "pcm"
          ? "I dey open daily briefing."
          : "Opening your Daily Briefing.",
    };
  }

  if (
    /^(?:(?:show|open|view|go\s+to|track|check)(?:\s+me)?\s+(?:my\s+|the\s+)?)?(?:expenses?|expense\s+tracker|spending|budget)$/i.test(
      normalized
    )
  ) {
    return {
      type: "open_tasks_tab",
      tab: "expenses",
      label: "Expense Tracker",
      spokenConfirmation:
        language === "ha"
          ? "Ina buɗe sashen kashe kuɗi."
          : language === "pcm"
          ? "I dey open expense tracker."
          : "Opening Expense Tracker.",
    };
  }

  if (
    /^(?:(?:show|open|view|go\s+to|check)(?:\s+me)?\s+(?:my\s+|the\s+)?)?projects?$/i.test(
      normalized
    )
  ) {
    return {
      type: "open_memory_tab",
      tab: "projects",
      label: "Projects",
      spokenConfirmation:
        language === "ha"
          ? "Ina buɗe ayyukan da kuke yi."
          : language === "pcm"
          ? "I dey open your projects."
          : "Opening your Projects.",
    };
  }

  if (
    /^(?:(?:show|open|view|go\s+to|check)(?:\s+me)?\s+(?:my\s+|the\s+)?)?(?:my\s+)?preferences$/i.test(
      normalized
    )
  ) {
    return {
      type: "open_memory_tab",
      tab: "preferences",
      label: "Preferences",
      spokenConfirmation: "Opening saved Preferences.",
    };
  }

  if (
    /^(?:(?:show|open|view|go\s+to|check)(?:\s+me)?\s+(?:my\s+|the\s+)?)?(?:conversation\s+)?recall$/i.test(
      normalized
    )
  ) {
    return {
      type: "open_memory_tab",
      tab: "recall",
      label: "Conversation Recall",
      spokenConfirmation: "Opening Conversation Recall.",
    };
  }

  // 7. General screen navigation (nav verb + target, or concise standalone screen name)
  const navPrefixMatch = normalized.match(
    /^(?:(?:show|open|view|launch|check|see|visit)\s+(?:me\s+)?|(?:go|take\s+me|navigate|switch|return|back)\s+to\s+|what\s+are\s+|(?:nuna|bu[dɗ]e)\s+(?:min\s+|shafin\s+)?|koma\s+)(?:my\s+|the\s+)?(.+)$/i
  );

  const target = navPrefixMatch ? navPrefixMatch[1].trim() : normalized;
  const isStandalone = !navPrefixMatch;
  if (isStandalone && target.split(/\s+/).length > 3) {
    return null;
  }

  const routeRules: Array<{ route: AppRoute; pattern: RegExp }> = [
    {
      route: "voice_notes",
      pattern: /^(?:voice\s+notes?|audio\s+notes?|bayanan\s+murya)(?:\s+(?:screen|page|tab))?$/i,
    },
    {
      route: "voice_assistant",
      pattern: /^(?:voice\s+assistant|voice\s+mode|mataimakin\s+murya)(?:\s+(?:screen|page|tab))?$/i,
    },
    {
      route: "tasks",
      pattern: /^(?:tasks?|reminders?|to-?do(?:\s+list)?|tasks?\s+and\s+reminders?|ayyuka(?:na)?)(?:\s+(?:screen|page|tab))?$/i,
    },
    {
      route: "memory",
      pattern: /^(?:(?:personal\s+)?memory|(?:saved\s+)?notes?|kundin\s+bayani|bayanai)(?:\s+(?:screen|page|tab))?$/i,
    },
    {
      route: "agent",
      pattern: /^(?:agent(?:\s+planner)?|planner|task\s+planner|autonomous\s+planner)(?:\s+(?:screen|page|tab))?$/i,
    },
    {
      route: "research",
      pattern: /^(?:research(?:\s+and\s+news)?|news|bincike(?:\s+da\s+labarai)?)(?:\s+(?:screen|page|tab))?$/i,
    },
    {
      route: "vision",
      pattern: /^(?:vision|camera(?:\s+and\s+vision)?|scanner|kyamara)(?:\s+(?:screen|page|tab))?$/i,
    },
    {
      route: "sensors",
      pattern: /^(?:sensors?(?:\s+and\s+location)?|location(?:\s+awareness)?|geofenc(?:e|ing)|compass|gps|na'?urori)(?:\s+(?:screen|page|tab))?$/i,
    },
    {
      route: "chat",
      pattern: /^(?:(?:ai\s+|text\s+)?chat|assistant\s+chat|messages?)(?:\s+(?:screen|page|tab))?$/i,
    },
    {
      route: "settings",
      pattern: /^(?:settings?|privacy(?:\s+settings?)?|saituna)(?:\s+(?:screen|page|tab))?$/i,
    },
    {
      route: "home",
      pattern: /^(?:home|dashboard|main|start|gida)(?:\s+(?:screen|page|tab))?$/i,
    },
  ];

  for (const rule of routeRules) {
    if (rule.pattern.test(target)) {
      const { label, spokenConfirmation } = routeConfirmation(rule.route, language);
      return {
        type: "navigate",
        route: rule.route,
        label,
        spokenConfirmation,
      };
    }
  }

  return null;
}
