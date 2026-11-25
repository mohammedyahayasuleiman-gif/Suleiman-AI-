import type { AppLanguage } from "../types.ts";

export interface AppStrings {
  appName: string;
  brandName: string;
  back: string;
  openSettings: string;

  navHome: string;
  navChat: string;
  navVoiceNotes: string;
  navVision: string;
  navMemory: string;

  homeWelcome: string;
  homeSubtitle: string;
  statusAiConnected: string;
  statusAiNotConnected: string;
  statusVoiceReady: string;
  statusDeviceOnly: string;

  shortcutChat: string;
  shortcutVoiceAssistant: string;
  shortcutVoiceNotes: string;
  shortcutVision: string;
  shortcutMemory: string;
  shortcutTasks: string;
  shortcutSettings: string;

  shortcutChatSub: string;
  shortcutVoiceAssistantSub: string;
  shortcutVoiceNotesSub: string;
  shortcutVisionSub: string;
  shortcutMemorySub: string;
  shortcutTasksSub: string;
  shortcutSettingsSub: string;

  badgeLocal: string;
  badgeNotConnected: string;
  badgeConnected: string;
  badgeOnDemand: string;

  voiceAssistantDesc: string;
  voiceAssistantStart: string;
  voiceAssistantStop: string;
  voiceAssistantListening: string;
  voiceAssistantThinking: string;
  voiceAssistantSpeaking: string;
  voiceAssistantHint: string;

  voiceNotesDesc: string;
  voiceNotesRecord: string;
  voiceNotesStop: string;
  voiceNotesTranscribe: string;
  voiceNotesTranscribing: string;
  voiceNotesSaveMemory: string;
  voiceNotesSaved: string;
  voiceNotesEmpty: string;
  voiceNotesTranscriptPlaceholder: string;

  visionDesc: string;
  visionOpenCamera: string;
  visionCloseCamera: string;
  visionCapture: string;
  visionUploadImage: string;
  visionAnalyze: string;
  visionAnalyzing: string;
  visionPromptPlaceholder: string;
  visionResultHeading: string;
  visionSaveMemory: string;
  visionPermissionDenied: string;
  visionPresets: string[];

  tasksDesc: string;
  tasksTitlePlaceholder: string;
  tasksAdd: string;
  tasksFilterAll: string;
  tasksFilterActive: string;
  tasksFilterCompleted: string;
  tasksEmpty: string;
  tasksPriorityLow: string;
  tasksPriorityNormal: string;
  tasksPriorityHigh: string;
  tasksEnableReminders: string;
  tasksRemindersActive: string;

  chatBannerTitle: string;
  chatBannerBody: string;
  chatEmpty: string;
  chatInputHint: string;
  chatSend: string;
  chatClear: string;
  chatUseMemory: string;
  chatSaveReply: string;
  chatSpeakReply: string;
  chatMicStart: string;
  chatMicStop: string;
  chatNotice: string;

  memoryTitle: string;
  memorySubtitle: string;
  memorySearchPlaceholder: string;
  memoryEmptyTitle: string;
  memoryEmptyBody: string;
  memoryNewNote: string;
  memorySaveFailed: string;
  noteUntitled: string;
  noteNewHeading: string;
  noteEditHeading: string;
  noteTitleHint: string;
  noteBodyHint: string;
  noteSave: string;
  noteDelete: string;
  noteDeleteTitle: string;
  noteDeleteBody: string;
  noteCancel: string;

  settingsTitle: string;
  settingsAiSection: string;
  settingsGemini: string;
  settingsGeminiConfigured: string;
  settingsGeminiStatus: string;
  settingsAiNote: string;
  settingsLanguageSection: string;
  settingsLanguageSupported: string;
  settingsLanguageNote: string;
  settingsLanguageOpen: string;
  settingsPrivacySection: string;
  settingsPrivacyPermissions: string;
  settingsPrivacyPermissionsBody: string;
  settingsPrivacyStorage: string;
  settingsPrivacyStorageBody: string;
  settingsPrivacyChat: string;
  settingsPrivacyChatBody: string;
  settingsExportData: string;
  settingsClearData: string;
  settingsClearConfirm: string;
  settingsAboutSection: string;
  settingsVersion: string;
  settingsPrototype: string;

  recentNotesHeading: string;
  upcomingTasksHeading: string;
  viewAll: string;
  openAssistant: string;

  shortcutAgent: string;
  shortcutAgentSub: string;
  shortcutResearch: string;
  shortcutResearchSub: string;
  dailyBriefingTitle: string;
  dailyBriefingGenerate: string;
  expenseTrackerTitle: string;
  preferencesTab: string;
  projectsTab: string;
  recallTab: string;

  shortcutSensors: string;
  shortcutSensorsSub: string;
  sensorsDesc: string;
  sensorsStartLocation: string;
  sensorsStopLocation: string;
  sensorsStartSensors: string;
  sensorsStopSensors: string;
  sensorsPrivacyBanner: string;
}

export const TRANSLATIONS: Record<AppLanguage, AppStrings> = {
  en: {
    appName: "A Y Suleiman AI",
    brandName: "A Y SULEIMAN AI",
    back: "Back",
    openSettings: "Open settings",

    navHome: "Home",
    navChat: "AI Chat",
    navVoiceNotes: "Voice Notes",
    navVision: "Vision",
    navMemory: "Memory",

    homeWelcome: "Welcome back",
    homeSubtitle: "Your private personal assistant. Everything stays on this device.",
    statusAiConnected: "AI: connected",
    statusAiNotConnected: "AI: not connected",
    statusVoiceReady: "Voice & Vision: on-demand",
    statusDeviceOnly: "Memory: saved on device",

    shortcutChat: "AI Chat",
    shortcutVoiceAssistant: "Voice Assistant",
    shortcutVoiceNotes: "Voice Notes",
    shortcutVision: "Camera & Vision",
    shortcutMemory: "Personal Memory",
    shortcutTasks: "Tasks & Reminders",
    shortcutSettings: "Settings & Privacy",

    shortcutChatSub: "Multi-turn conversation with optional memory context",
    shortcutVoiceAssistantSub: "Talk to your assistant and hear spoken answers",
    shortcutVoiceNotesSub: "Record voice notes and transcribe to Personal Memory",
    shortcutVisionSub: "Inspect objects or text through your camera or images",
    shortcutMemorySub: "Private text notes saved locally in your browser",
    shortcutTasksSub: "Manage daily activities and local reminders",
    shortcutSettingsSub: "Language, permissions, export, and privacy controls",

    badgeLocal: "Saved on device",
    badgeNotConnected: "Not connected",
    badgeConnected: "Ready",
    badgeOnDemand: "User-initiated",

    voiceAssistantDesc: "Talk to your assistant and hear it answer.",
    voiceAssistantStart: "Tap to speak",
    voiceAssistantStop: "Stop & send",
    voiceAssistantListening: "Listening...",
    voiceAssistantThinking: "Thinking...",
    voiceAssistantSpeaking: "Speaking...",
    voiceAssistantHint: "Microphone permission is requested only when you tap to speak.",

    voiceNotesDesc: "Record voice notes and turn them into text.",
    voiceNotesRecord: "Record note",
    voiceNotesStop: "Stop recording",
    voiceNotesTranscribe: "Transcribe to text",
    voiceNotesTranscribing: "Transcribing...",
    voiceNotesSaveMemory: "Save to Personal Memory",
    voiceNotesSaved: "Saved to Memory",
    voiceNotesEmpty: "No voice recordings in this session yet. Tap Record note to begin.",
    voiceNotesTranscriptPlaceholder: "Transcript will appear here after transcription, or type notes manually...",

    visionDesc: "Let your assistant see through the camera or an uploaded image.",
    visionOpenCamera: "Open camera",
    visionCloseCamera: "Turn camera off",
    visionCapture: "Capture frame",
    visionUploadImage: "Upload image",
    visionAnalyze: "Analyze image",
    visionAnalyzing: "Analyzing...",
    visionPromptPlaceholder: "Ask something about this image...",
    visionResultHeading: "Observation",
    visionSaveMemory: "Save observation to Memory",
    visionPermissionDenied: "Camera access was denied or is unavailable on this device. You can upload an image instead.",
    visionPresets: [
      "What is in front of me?",
      "Read any text shown here",
      "Summarize key details",
    ],

    tasksDesc: "Manage personal activities and get reminders.",
    tasksTitlePlaceholder: "Add a task or reminder...",
    tasksAdd: "Add task",
    tasksFilterAll: "All",
    tasksFilterActive: "Active",
    tasksFilterCompleted: "Completed",
    tasksEmpty: "No tasks yet. Add your first task above.",
    tasksPriorityLow: "Low",
    tasksPriorityNormal: "Normal",
    tasksPriorityHigh: "High",
    tasksEnableReminders: "Enable browser alerts",
    tasksRemindersActive: "Alerts enabled",

    chatBannerTitle: "AI not connected",
    chatBannerBody: "Gemini is not configured yet. Messages you type are not sent anywhere and are not saved.",
    chatEmpty: "Start a private conversation. Messages stay in session memory unless you save a note.",
    chatInputHint: "Type a message",
    chatSend: "Send",
    chatClear: "Clear chat",
    chatUseMemory: "Include Personal Memory",
    chatSaveReply: "Save to Memory",
    chatSpeakReply: "Listen",
    chatMicStart: "Dictate with microphone",
    chatMicStop: "Stop recording",
    chatNotice: "No AI is connected yet, so there is no answer. Your message was not sent anywhere.",

    memoryTitle: "Personal Memory",
    memorySubtitle: "Text notes saved only on this device.",
    memorySearchPlaceholder: "Search notes...",
    memoryEmptyTitle: "No notes yet",
    memoryEmptyBody: "Tap New note to save something you want to remember.",
    memoryNewNote: "New note",
    memorySaveFailed: "Could not save notes to this device. Free some storage and try again.",
    noteUntitled: "Untitled note",
    noteNewHeading: "New note",
    noteEditHeading: "Edit note",
    noteTitleHint: "Title",
    noteBodyHint: "Write your note",
    noteSave: "Save",
    noteDelete: "Delete",
    noteDeleteTitle: "Delete this note?",
    noteDeleteBody: "This cannot be undone.",
    noteCancel: "Cancel",

    settingsTitle: "Settings & Privacy",
    settingsAiSection: "AI connection",
    settingsGemini: "Gemini",
    settingsGeminiConfigured: "Connected (server-side)",
    settingsGeminiStatus: "Not configured",
    settingsAiNote: "API keys are never stored in the source code of the app. Server-side secrets power Gemini securely.",
    settingsLanguageSection: "Language",
    settingsLanguageSupported: "English · Hausa · Nigerian Pidgin",
    settingsLanguageNote: "The Hausa and Nigerian Pidgin translations are drafts and still need review by native speakers.",
    settingsLanguageOpen: "App language",
    settingsPrivacySection: "Privacy",
    settingsPrivacyPermissions: "Permissions only when requested",
    settingsPrivacyPermissionsBody: "Microphone and camera are never accessed in the background—only when you explicitly tap record or open camera.",
    settingsPrivacyStorage: "Notes stay on this device",
    settingsPrivacyStorageBody: "Notes and tasks are stored locally on your device. Nothing is uploaded unless you share context in chat.",
    settingsPrivacyChat: "Chat is not saved",
    settingsPrivacyChatBody: "Messages are cleared when you close or refresh the app.",
    settingsExportData: "Export local data (JSON)",
    settingsClearData: "Clear all local notes & tasks",
    settingsClearConfirm: "Delete all locally saved notes and tasks from this device?",
    settingsAboutSection: "About",
    settingsVersion: "Version 1.0.0",
    settingsPrototype: "Private Personal Assistant",

    recentNotesHeading: "Recent Memory",
    upcomingTasksHeading: "Active Tasks",
    viewAll: "View all",
    openAssistant: "Open AI Chat",

    shortcutAgent: "Agent Planner",
    shortcutAgentSub: "Plan multi-step goals and approve each action before execution",
    shortcutResearch: "Research & News",
    shortcutResearchSub: "Grounded Nigerian & global news, tech, jobs, and grants",
    dailyBriefingTitle: "Daily Briefing",
    dailyBriefingGenerate: "Generate today's briefing",
    expenseTrackerTitle: "Expense Tracker",
    preferencesTab: "Preferences",
    projectsTab: "Projects",
    recallTab: "Conversations",

    shortcutSensors: "Sensors & Location",
    shortcutSensorsSub: "Proximity, GPS geofencing, motion & compass awareness",
    sensorsDesc: "Monitor proximity, GPS coordinates, geofences, motion, and compass heading.",
    sensorsStartLocation: "Activate Location",
    sensorsStopLocation: "Stop Location",
    sensorsStartSensors: "Activate Sensors",
    sensorsStopSensors: "Stop Sensors",
    sensorsPrivacyBanner: "Privacy active: GPS and hardware sensors only run while turned on by you—never silently in the background.",
  },
  ha: {
    appName: "A Y Suleiman AI",
    brandName: "A Y SULEIMAN AI",
    back: "Koma baya",
    openSettings: "Buɗe saituna",

    navHome: "Gida",
    navChat: "Tattaunawa",
    navVoiceNotes: "Murya",
    navVision: "Gani",
    navMemory: "Ƙwaƙwalwa",

    homeWelcome: "Barka da dawowa",
    homeSubtitle: "Mataimakinka na sirri. Komai yana nan a cikin wannan na'ura.",
    statusAiConnected: "AI: an haɗa shi",
    statusAiNotConnected: "AI: ba a haɗa shi ba",
    statusVoiceReady: "Murya da Gani: da izininka",
    statusDeviceOnly: "Ƙwaƙwalwa: an ajiye a na'ura",

    shortcutChat: "Tattaunawa da AI",
    shortcutVoiceAssistant: "Mataimakin Murya",
    shortcutVoiceNotes: "Bayanan Murya",
    shortcutVision: "Kyamara da Gani",
    shortcutMemory: "Ƙwaƙwalwar Kaina",
    shortcutTasks: "Ayyuka da Tunatarwa",
    shortcutSettings: "Saituna da Sirri",

    shortcutChatSub: "Tattaunawa da AI tare da zaɓin amfani da bayanai",
    shortcutVoiceAssistantSub: "Yi magana da mataimakinka kuma ka ji amsarsa",
    shortcutVoiceNotesSub: "Yi rikodin bayanan murya ka mayar da su rubutu",
    shortcutVisionSub: "Duba abubuwa ko rubutu ta kyamara ko hoto",
    shortcutMemorySub: "Rubutattun bayanai da ake ajiyewa a wannan na'ura",
    shortcutTasksSub: "Sarrafa ayyukanka na kai da samun tunatarwa",
    shortcutSettingsSub: "Harshe, izini, fitar da bayanai da sirri",

    badgeLocal: "An ajiye a na'ura",
    badgeNotConnected: "Ba a haɗa ba",
    badgeConnected: "A shirye",
    badgeOnDemand: "Da izininka",

    voiceAssistantDesc: "Yi magana da mataimakinka kuma ka ji amsarsa.",
    voiceAssistantStart: "Danna don magana",
    voiceAssistantStop: "Tsayar da aika",
    voiceAssistantListening: "Ana sauraro...",
    voiceAssistantThinking: "Ana tunani...",
    voiceAssistantSpeaking: "Ana magana...",
    voiceAssistantHint: "Ana neman izinin makirufo ne kawai idan ka danna don magana.",

    voiceNotesDesc: "Yi rikodin bayanan murya ka mayar da su rubutu.",
    voiceNotesRecord: "Yi rikodi",
    voiceNotesStop: "Tsayar da rikodi",
    voiceNotesTranscribe: "Mayar zuwa rubutu",
    voiceNotesTranscribing: "Ana rubutawa...",
    voiceNotesSaveMemory: "Ajiye a Ƙwaƙwalwar Kaina",
    voiceNotesSaved: "An ajiye a Ƙwaƙwalwa",
    voiceNotesEmpty: "Babu rikodin murya tukuna. Danna Yi rikodi don farawa.",
    voiceNotesTranscriptPlaceholder: "Rubutun murya zai bayyana anan...",

    visionDesc: "Bari mataimakinka ya gani ta kyamara ko hoto.",
    visionOpenCamera: "Buɗe kyamara",
    visionCloseCamera: "Rufe kyamara",
    visionCapture: "Ɗauki hoto",
    visionUploadImage: "Loda hoto",
    visionAnalyze: "Bincika hoto",
    visionAnalyzing: "Ana bincike...",
    visionPromptPlaceholder: "Yi tambaya game da wannan hoton...",
    visionResultHeading: "Abin da aka gani",
    visionSaveMemory: "Ajiye a Ƙwaƙwalwar Kaina",
    visionPermissionDenied: "Ba a samu izinin kyamara ba. Za ka iya loda hoto a maimakon haka.",
    visionPresets: [
      "Me ke gaba na?",
      "Karanta rubutun da ke nan",
      "Taƙaita muhimman abubuwa",
    ],

    tasksDesc: "Sarrafa ayyukanka na kai da samun tunatarwa.",
    tasksTitlePlaceholder: "Ƙara aiki ko tunatarwa...",
    tasksAdd: "Ƙara aiki",
    tasksFilterAll: "Duka",
    tasksFilterActive: "Masu aiki",
    tasksFilterCompleted: "An gama",
    tasksEmpty: "Babu ayyuka tukuna. Ƙara naka na farko a sama.",
    tasksPriorityLow: "Ƙasa",
    tasksPriorityNormal: "Matsakaici",
    tasksPriorityHigh: "Gaggawa",
    tasksEnableReminders: "Kunna sanarwar burauza",
    tasksRemindersActive: "Sanarwa tana kunne",

    chatBannerTitle: "Ba a haɗa AI ba",
    chatBannerBody: "Ba a saita Gemini ba tukuna. Saƙonnin da ka rubuta ba a aika su ko'ina kuma ba a ajiye su.",
    chatEmpty: "Fara tattaunawa ta sirri. Saƙonni suna nan a zama ne kawai sai dai idan ka ajiye bayani.",
    chatInputHint: "Rubuta saƙo",
    chatSend: "Aika",
    chatClear: "Share tattaunawa",
    chatUseMemory: "Haɗa da Ƙwaƙwalwar Kaina",
    chatSaveReply: "Ajiye a Ƙwaƙwalwa",
    chatSpeakReply: "Saurara",
    chatMicStart: "Yi magana da makirufo",
    chatMicStop: "Tsayar da rikodi",
    chatNotice: "Babu AI da aka haɗa tukuna, don haka babu amsa. Ba a aika saƙonka ko'ina ba.",

    memoryTitle: "Ƙwaƙwalwar Kaina",
    memorySubtitle: "Rubutattun bayanai da ake ajiyewa a wannan na'ura kawai.",
    memorySearchPlaceholder: "Nemo bayanai...",
    memoryEmptyTitle: "Babu bayanai tukuna",
    memoryEmptyBody: "Danna Sabon bayani don ajiye abin da kake son tunawa.",
    memoryNewNote: "Sabon bayani",
    memorySaveFailed: "Ba a iya ajiye bayanai a wannan na'ura ba. Ka samar da sarari ka sake gwadawa.",
    noteUntitled: "Bayani marar suna",
    noteNewHeading: "Sabon bayani",
    noteEditHeading: "Gyara bayani",
    noteTitleHint: "Take",
    noteBodyHint: "Rubuta bayaninka",
    noteSave: "Ajiye",
    noteDelete: "Share",
    noteDeleteTitle: "A share wannan bayanin?",
    noteDeleteBody: "Ba za a iya dawo da shi ba.",
    noteCancel: "Soke",

    settingsTitle: "Saituna da Sirri",
    settingsAiSection: "Haɗin AI",
    settingsGemini: "Gemini",
    settingsGeminiConfigured: "An haɗa (ta uwar garke)",
    settingsGeminiStatus: "Ba a saita ba",
    settingsAiNote: "Ba a taɓa ajiye makullan API a cikin lambar manhajar ba. Ana sarrafa su ta amintacciyar hanya.",
    settingsLanguageSection: "Harshe",
    settingsLanguageSupported: "Turanci · Hausa · Pidgin na Najeriya",
    settingsLanguageNote: "Fassarorin Hausa da Pidgin na Najeriya na gwaji ne kuma suna buƙatar duba daga masu magana da harsunan.",
    settingsLanguageOpen: "Canja harshen manhaja",
    settingsPrivacySection: "Sirri",
    settingsPrivacyPermissions: "Izini sai da amincewarka",
    settingsPrivacyPermissionsBody: "Ba a amfani da makirufo ko kyamara a ɓoye ba—sai lokacin da ka danna.",
    settingsPrivacyStorage: "Bayanai suna nan a na'ura",
    settingsPrivacyStorageBody: "Ana ajiye bayanai da ayyuka a wannan na'ura kawai.",
    settingsPrivacyChat: "Ba a ajiye tattaunawa",
    settingsPrivacyChatBody: "Ana share saƙonni idan aka rufe manhajar.",
    settingsExportData: "Fitar da bayanai (JSON)",
    settingsClearData: "Share dukan bayanai da ayyuka",
    settingsClearConfirm: "A share dukan bayanai da ayyukan da aka ajiye a wannan na'ura?",
    settingsAboutSection: "Game da manhaja",
    settingsVersion: "Sigar 1.0.0",
    settingsPrototype: "Mataimakin Sirri",

    recentNotesHeading: "Bayanai na baya-bayan nan",
    upcomingTasksHeading: "Ayyuka masu jiran gado",
    viewAll: "Duba duka",
    openAssistant: "Buɗe Tattaunawa",

    shortcutAgent: "Mai Tsara Aiki",
    shortcutAgentSub: "Tsara manyan buƙatu zuwa ƙananan matakai tare da amincewarka",
    shortcutResearch: "Bincike da Labarai",
    shortcutResearchSub: "Labaran Najeriya da duniya, fasaha, ayyuka da tallafi",
    dailyBriefingTitle: "Taƙaitaccen Yini",
    dailyBriefingGenerate: "Shirya taƙaitaccen yau",
    expenseTrackerTitle: "Kula da Kuɗi",
    preferencesTab: "Zaɓuka",
    projectsTab: "Ayyuka",
    recallTab: "Tattaunawa",

    shortcutSensors: "Na'urori da Wuri",
    shortcutSensorsSub: "Kusanci, GPS geofencing, motsi da kamfas",
    sensorsDesc: "Duba kusanci, GPS, sanarwar isa wuri, motsi da alkiblar kamfas.",
    sensorsStartLocation: "Kunna GPS",
    sensorsStopLocation: "Kashe GPS",
    sensorsStartSensors: "Kunna Na'urori",
    sensorsStopSensors: "Kashe Na'urori",
    sensorsPrivacyBanner: "Sirri na aiki: GPS da na'urorin auna suna aiki ne kawai idan ka kunna su—ba a ɓoye ba.",
  },
  pcm: {
    appName: "A Y Suleiman AI",
    brandName: "A Y SULEIMAN AI",
    back: "Go back",
    openSettings: "Open settings",

    navHome: "Home",
    navChat: "AI Chat",
    navVoiceNotes: "Voice",
    navVision: "Vision",
    navMemory: "Memory",

    homeWelcome: "Welcome back",
    homeSubtitle: "Your private assistant. Everything dey stay for dis device.",
    statusAiConnected: "AI: don connect",
    statusAiNotConnected: "AI: no connect yet",
    statusVoiceReady: "Voice & Vision: only when you tap",
    statusDeviceOnly: "Memory: dey save for device",

    shortcutChat: "AI Chat",
    shortcutVoiceAssistant: "Voice Assistant",
    shortcutVoiceNotes: "Voice Notes",
    shortcutVision: "Camera & Vision",
    shortcutMemory: "Personal Memory",
    shortcutTasks: "Tasks & Reminders",
    shortcutSettings: "Settings & Privacy",

    shortcutChatSub: "Chat with AI and choose if e go read your saved notes",
    shortcutVoiceAssistantSub: "Talk to your assistant and hear wetin e go talk back",
    shortcutVoiceNotesSub: "Record voice notes and change dem to text",
    shortcutVisionSub: "Make your assistant see with camera or picture",
    shortcutMemorySub: "Text notes wey dey save for dis device only",
    shortcutTasksSub: "Arrange your daily work and get reminders",
    shortcutSettingsSub: "Language, permissions, export and privacy controls",

    badgeLocal: "Dey save for phone",
    badgeNotConnected: "No connect yet",
    badgeConnected: "E dey ready",
    badgeOnDemand: "Only when you tap",

    voiceAssistantDesc: "Talk to your assistant and hear wetin e go talk back.",
    voiceAssistantStart: "Tap to talk",
    voiceAssistantStop: "Stop & send",
    voiceAssistantListening: "E dey listen...",
    voiceAssistantThinking: "E dey think...",
    voiceAssistantSpeaking: "E dey talk...",
    voiceAssistantHint: "App no go ask for mic permission until you tap to talk.",

    voiceNotesDesc: "Record voice notes and change dem to text.",
    voiceNotesRecord: "Record note",
    voiceNotesStop: "Stop recording",
    voiceNotesTranscribe: "Change to text",
    voiceNotesTranscribing: "E dey write am...",
    voiceNotesSaveMemory: "Save for Personal Memory",
    voiceNotesSaved: "Don save for Memory",
    voiceNotesEmpty: "No voice note yet for dis session. Tap Record note to start.",
    voiceNotesTranscriptPlaceholder: "Text go show here after e finish, or you fit type am...",

    visionDesc: "Make your assistant see with camera or picture wey you upload.",
    visionOpenCamera: "Open camera",
    visionCloseCamera: "Close camera",
    visionCapture: "Snap picture",
    visionUploadImage: "Upload picture",
    visionAnalyze: "Check picture",
    visionAnalyzing: "E dey check am...",
    visionPromptPlaceholder: "Ask question about dis picture...",
    visionResultHeading: "Wetin e see",
    visionSaveMemory: "Save am for Memory",
    visionPermissionDenied: "Camera no open or no permission. You fit upload picture instead.",
    visionPresets: [
      "Wetin dey front of me?",
      "Read any text wey dey here",
      "Tell me di main things inside",
    ],

    tasksDesc: "Arrange your daily work and get reminders.",
    tasksTitlePlaceholder: "Add work or reminder...",
    tasksAdd: "Add task",
    tasksFilterAll: "All",
    tasksFilterActive: "Dey remain",
    tasksFilterCompleted: "Don finish",
    tasksEmpty: "No task yet. Add your first task for up.",
    tasksPriorityLow: "Small",
    tasksPriorityNormal: "Normal",
    tasksPriorityHigh: "Urgent",
    tasksEnableReminders: "On browser alert",
    tasksRemindersActive: "Alert dey on",

    chatBannerTitle: "AI no connect yet",
    chatBannerBody: "Gemini never set up. Messages wey you type no go go anywhere and we no dey save dem.",
    chatEmpty: "Start private chat. Messages dey clear when you close app unless you save am.",
    chatInputHint: "Type message",
    chatSend: "Send",
    chatClear: "Clear chat",
    chatUseMemory: "Use Personal Memory",
    chatSaveReply: "Save for Memory",
    chatSpeakReply: "Hear am",
    chatMicStart: "Talk with mic",
    chatMicStop: "Stop recording",
    chatNotice: "No AI connect yet, so no answer dey. Your message no go anywhere.",

    memoryTitle: "Personal Memory",
    memorySubtitle: "Text notes wey dey save for dis device only.",
    memorySearchPlaceholder: "Search notes...",
    memoryEmptyTitle: "No note yet",
    memoryEmptyBody: "Tap New note to save wetin you wan remember.",
    memoryNewNote: "New note",
    memorySaveFailed: "We no fit save notes for dis device. Free some space and try again.",
    noteUntitled: "Note wey no get title",
    noteNewHeading: "New note",
    noteEditHeading: "Edit note",
    noteTitleHint: "Title",
    noteBodyHint: "Write your note",
    noteSave: "Save",
    noteDelete: "Delete",
    noteDeleteTitle: "Delete dis note?",
    noteDeleteBody: "You no fit bring am back.",
    noteCancel: "Cancel",

    settingsTitle: "Settings & Privacy",
    settingsAiSection: "AI connection",
    settingsGemini: "Gemini",
    settingsGeminiConfigured: "Don connect (server-side)",
    settingsGeminiStatus: "Never set up",
    settingsAiNote: "We no dey put API key inside di app code. Server dey handle Gemini safely.",
    settingsLanguageSection: "Language",
    settingsLanguageSupported: "English · Hausa · Nigerian Pidgin",
    settingsLanguageNote: "Hausa and Nigerian Pidgin translations na draft. Native speakers still need to check dem.",
    settingsLanguageOpen: "Change app language",
    settingsPrivacySection: "Privacy",
    settingsPrivacyPermissions: "Permission only when you tap",
    settingsPrivacyPermissionsBody: "Mic and camera no dey run for background—only when you tap record or open camera.",
    settingsPrivacyStorage: "Notes dey stay for dis device",
    settingsPrivacyStorageBody: "Notes and tasks dey stay for dis device only. Nothing dey upload unless you allow am for chat.",
    settingsPrivacyChat: "We no dey save chat",
    settingsPrivacyChatBody: "Messages dey clear when you close di app.",
    settingsExportData: "Download local data (JSON)",
    settingsClearData: "Clear all saved notes & tasks",
    settingsClearConfirm: "Delete all notes and tasks wey dey save for dis device?",
    settingsAboutSection: "About",
    settingsVersion: "Version 1.0.0",
    settingsPrototype: "Private Personal Assistant",

    recentNotesHeading: "Recent Memory",
    upcomingTasksHeading: "Tasks wey remain",
    viewAll: "See all",
    openAssistant: "Open AI Chat",

    shortcutAgent: "Agent Planner",
    shortcutAgentSub: "Break big work into small steps and approve am one by one",
    shortcutResearch: "Research & News",
    shortcutResearchSub: "Check Nigerian & world news, tech, jobs and grants with source",
    dailyBriefingTitle: "Daily Briefing",
    dailyBriefingGenerate: "Make today briefing",
    expenseTrackerTitle: "Expense Tracker",
    preferencesTab: "Preferences",
    projectsTab: "Projects",
    recallTab: "Conversations",

    shortcutSensors: "Sensors & Location",
    shortcutSensorsSub: "Proximity, GPS geofencing, movement and compass",
    sensorsDesc: "Check proximity, GPS coordinates, saved place alerts, movement and compass.",
    sensorsStartLocation: "On Location",
    sensorsStopLocation: "Off Location",
    sensorsStartSensors: "On Sensors",
    sensorsStopSensors: "Off Sensors",
    sensorsPrivacyBanner: "Privacy dey strong: GPS and sensors dey work only when you on am—nothing dey track secretly.",
  },
};
