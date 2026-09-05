# Afterglow

Free. After you leave a place, leave a quiet residue — then move on.

Not reviews. Not a feed. Field-recorder aesthetic.

## Product doctrine (locked)

- After you leave a place, the app asks quietly: **“Want to leave an afterglow?”**
- Capture **only**: an **8–12s voice note**, a **still photo** (no face required), **or one line**.
- No feed. No likes on capture. No “post.”
- Later, someone at that same spot can hear or see recent residue. Not reviews, ratings, or Yelp.
- Anonymous default. Short-lived (days–weeks). No comments on others’ afterglows.
- No live “who’s here.” No place ranking.
- **Free forever.** No Stripe. No IAP. No ads.

This repository is **Afterglow only**. It does not include Minute Cheat Sheet or Actionscope.

## Status

Expo SDK 54 scaffold. **Android / Play first.** iOS is not blocked (same codebase) but store work waits.

v0 includes:

- Foreground location permission
- Leave-prompt screen + geofence/leave-detection **stub** (plus Simulate leaving)
- Capture: voice 8–12s, still, or one line
- Nearby residue **list** with bundled sample data
- Local / ephemeral storage stub (device only, TTL purge)
- In-app privacy + [docs/PRIVACY.md](docs/PRIVACY.md)
- Play checklist: [docs/PLAY_STORE.md](docs/PLAY_STORE.md)

This is a scaffold. It is **not** a store submission and does **not** claim Play or App Store approval.

## Run (Android first)

Needs Node 20+.

```bash
npm install
npx expo start --android
```

Expo Go on a phone is enough to walk the UI. Camera, mic, and location use the device.

```bash
npm run typecheck
npm run verify
npx expo start --web   # optional UI check; native capture is the real path
```

## Android build path

Package name: `com.sofaloaf.afterglow`.

```bash
# APK for testers (EAS; John logs into Expo first)
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest build --platform android --profile preview

# AAB for Play production track
npx eas-cli@latest build --platform android --profile production
```

Local (Android SDK on the machine):

```bash
npx expo prebuild --platform android
```

Then assemble with Android Studio / Gradle. Generated `android/` is gitignored.

## What John needs

**To test now:** Node, this repo, Expo Go on Android (or an emulator).

**To put a build on Play:**

1. Google Play Console — **$25 one-time**
2. Free Expo account (EAS)
3. Privacy policy URL **now**: https://28to3.me/apps/afterglow.html (fallback https://28to3.me/privacy). Do not wait on afterglow.com.
4. Screenshots + feature graphic + Data safety + content rating (see [docs/PLAY_STORE.md](docs/PLAY_STORE.md))

**Later, not a blocker:** Apple Developer Program (~$99/year) for iOS.

No Stripe account. Afterglow does not take payment.

## Privacy

Heavy on-device. v0 storage is local and expires. Background location is **off** so Play does not need a background-location declaration. Details: [docs/PRIVACY.md](docs/PRIVACY.md) and the in-app Privacy screen.
