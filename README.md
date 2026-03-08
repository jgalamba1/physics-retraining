# Physics Curriculum Tracker

A self-study curriculum tracker for physics and proof-based mathematics, targeting condensed matter, materials physics, and quantum computing. Built with React + Vite + Capacitor.

## Features

- 9 physics phases + 6 math tiers with concurrent study pairings
- 3-state resource tracking (unread → in progress → done)
- Persistent progress via `localStorage`
- Appendix with 29 reference sections (Rigetti + Tomforde sources)
- Full-text search across all resources
- Works as a web app or Android APK

---

## Getting the APK (GitHub Actions — no Android SDK required)

1. Push this repo to GitHub
2. Go to **Actions** → the workflow runs automatically on every push to `main`
3. Once complete (~8–12 min), click the workflow run → **Artifacts** → download `physics-curriculum-debug-apk`
4. Sideload onto your Android device:
   - Enable **Settings → Security → Install unknown apps** for your file manager
   - Open the downloaded `.apk` and install

To create a tagged release:
```bash
git tag v1.0.0 && git push origin v1.0.0
```

---

## Local Development

```bash
npm install
npm run dev          # http://localhost:5173
```

## Local Android Build (requires Android Studio)

```bash
npm install
npm run build        # builds to dist/
npx cap add android  # first time only
npx cap sync android
npx cap open android # opens Android Studio; press ▶ to run
```

---

## Signing for Google Play

To sign the release APK:

```bash
# 1. Generate a keystore (one time)
keytool -genkeypair -v -keystore release.jks -alias physics-curriculum \
  -keyalg RSA -keysize 2048 -validity 10000

# 2. Add to android/app/build.gradle under android { signingConfigs { release { ... } } }
# 3. Run: cd android && ./gradlew assembleRelease
```

Store `release.jks` securely — never commit it to git.

---

## Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| Capacitor | 6 | Android wrapper |
| GitHub Actions | — | CI/APK build |
