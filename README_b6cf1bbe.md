# A Y Suleiman AI

Private, single-owner personal AI assistant for Android (Kotlin, Jetpack Compose, Material 3).
This is the **foundation prototype**. It is not published or deployed anywhere.

## Build and run
1. Install Android Studio (Ladybug or newer) with JDK 17 and the Android SDK 35.
2. Open this folder (`AYSuleimanAI`) in Android Studio and let Gradle sync.
3. Run on a device or emulator (Android 8.0 / API 26 or newer).

Command line: `./gradlew assembleDebug` (needs `ANDROID_HOME` set).

## What works now
- Home dashboard: branding, welcome, animated glowing orb, 7 shortcuts.
- Navigation: bottom bar (Home, AI Chat, Voice Notes, Vision, Memory) plus Settings & Privacy, Tasks and Voice Assistant screens.
- AI Chat: working interface with a clear "AI not connected" banner. Messages stay in memory only and are never sent anywhere.
- Personal Memory: create, edit and delete text notes. Saved to a private JSON file in app storage, so they survive restarts.
- Voice, camera/vision, sensors and tasks: clearly labelled "Coming soon" screens. Nothing is functional.
- Languages: English, Hausa and Nigerian Pidgin string files. **Hausa and Pidgin are drafts and need review by native speakers.**

## Security and privacy
- No API keys or passwords in the source. A secure setup step is needed before Gemini is connected.
- No permissions requested (the manifest has no `uses-permission`).
- Android cloud backup is disabled (`allowBackup=false`).
- Notes are stored unencrypted in the app's private storage. Move to encrypted storage before holding sensitive data.

## Project layout
- `data/` note model and JSON file storage
- `ui/theme/` colours, typography, background
- `ui/components/` orb, status chips, feature cards, coming-soon screen
- `ui/navigation/` routes and app shell
- `ui/screens/` home, chat, notes, settings, coming-soon screens

## Verification status
Written without an Android SDK available, so it has **not** been compiled or run yet. Expect to fix small build errors on first sync.
