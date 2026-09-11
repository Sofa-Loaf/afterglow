# Google Play submit pack (Android first)

This is a **one-session upload checklist**. Afterglow has not been submitted. John does **not** need Play Console until the AAB is ready. iOS / App Store work is later and does not block this MVP.

Afterglow is **free forever**. No Stripe. No IAP. No paid unlocks.

## Package identity (locked)

| Field | Value |
| --- | --- |
| Application id | `me.to28.afterglow` |
| Locked in | `app.json` → `expo.android.package` and `expo.extra.androidPackage` |
| EAS reminder | `eas.json` build profiles set `AFTERGLOW_ANDROID_PACKAGE=me.to28.afterglow` (the binary id still comes from `app.json`) |
| Expo slug | `afterglow` |
| Default store name | Afterglow |
| Version | `0.1.0` (`app.json` / `package.json`) — bump before a second upload |
| Privacy policy URL | **https://28to3.me/apps/afterglow.html#privacy** |
| Fallback policy | [docs/PRIVACY.md](PRIVACY.md), [docs/privacy.html](privacy.html), or https://28to3.me/privacy |
| Landing change | Companion PR on Sofa-Loaf/28to3 adds the `#privacy` section — merge it so the Play URL resolves after Pages rebuilds |
| Feature graphic | `assets/brand/afterglow-play-feature.png` (source) → `assets/store/feature-graphic-1024x500.png` (1024×500 upload) |
| Hi-res icon | `assets/brand/afterglow-app-icon.png` (glowing A; also Expo `icon` + adaptive foreground) |
| Wordmark / splash | `assets/brand/afterglow-wordmark.png` (glow is in the art; splash is this file on `#000000`) |
| Brand sources (locked) | `assets/brand/afterglow-wordmark.png`, `afterglow-app-icon.png`, `afterglow-play-feature.png` |
| Do not wait on | afterglow.com, Apple Developer, Stripe, more brand art |

Create the Play app with package **`me.to28.afterglow`**. It must match `app.json`. Do not create `com.sofaloaf.afterglow`.

## What John does in one Console session

Do the account work first, then upload. Nothing below requires waiting on iOS.

1. Google account John controls.
2. Enroll in **Google Play Console** — **$25 one-time** (personal developer account is enough).
3. **Create app**: name `Afterglow`, default language English (US), **app**, **free**.
4. Set the package name / Play App ID to **`me.to28.afterglow`** when the Console asks (must match the AAB).
5. Paste **privacy policy**: https://28to3.me/apps/afterglow.html#privacy
6. Fill **Store listing** (copy below), **Graphics** (icon + feature graphic + screenshots), **Categorization**, **Contact details**.
7. Complete **Content rating** (notes below).
8. Complete **Data safety** (draft below).
9. Declare **permissions** using the rationale below if Play asks.
10. Upload the production **AAB** to the **internal testing** track first (draft). Promote later.

A free **Expo** account is needed **before** that session if the AAB is not already downloaded:

```bash
npx eas-cli@latest login
npx eas-cli@latest init
```

`eas init` writes an EAS project id into `app.json`. Do not invent one in git before that command.

Not needed for this Play path: Apple Developer Program, Stripe, ads SDK, Maps API key, background-location declaration.

---

## Listing copy (paste into Play Console)

**App name:** Afterglow

**Short description (80 characters max)**

```
Whispers left where you stood. Free. Not reviews. No feed.
```

Character count: 59.

**Full description**

```
Afterglow is a field recorder for places. GPS is the trigger: after you leave, it asks one quiet question — want to leave an afterglow?

You can leave an 8–12 second voice note, a still photo (a face is not required), or one line. Then you move on. There is no feed, no likes on capture, and no “post.”

Later, someone standing at that same pin — about fifty feet, a hotel room or an exact patch of grass — can hear or see the whisper. The pin is precise. The radius is only the gate. Afterglow is not reviews, ratings, or Yelp.

When a landmark gathers many afterglows, they will be ranked by plays. The residue is ranked. The place is never rated. There are no stars.

Afterglows are anonymous by default and short-lived. There are no comments on other people’s afterglows, and no live “who’s here.”

Afterglow is free. There are no purchases and no ads.

Whispers left where you stood.
```

**Category:** Lifestyle (not a social network).

**Tags (optional):** field recorder, location, whispers, places, anonymous

**Contact:** hello@28to3.me · https://28to3.me/apps/afterglow.html

**Marketing URL:** https://28to3.me/apps/afterglow.html

---

## Graphics checklist

Use the **locked brand files**. Do not invent a second logo.

| Asset | Required? | Spec | File |
| --- | --- | --- | --- |
| App icon | Yes | 512×512 PNG, 32-bit | `assets/brand/afterglow-app-icon.png` (1024 — Play accepts 512+) |
| Feature graphic | Yes | **1024×500** PNG | Upload `assets/store/feature-graphic-1024x500.png` (cropped from `assets/brand/afterglow-play-feature.png`) |
| Phone screenshots | Yes, **at least 2** | JPEG/PNG, 16:9 or 9:16, between 320px and 3840px on each side | Capture on a phone or emulator (see shot list) |
| 7" tablet screenshots | Only if you declare 7" tablet support | Same rules; typically 1024×600 or 1200×1920 class | Capture on a 7" AVD if you keep tablet distribution |
| 10" tablet | Optional | Same | Skip unless you want large-tablet listing art |
| Promo video | No | YouTube URL | Skip for v0 |

**Phone shot list (capture these four, then pick the best two+):**

1. Nearby whispers list — home (no stack header; in-screen glowing wordmark), charcoal near-black, cream type, amber kicker.
2. Leave prompt — “Want to leave an afterglow?” (header untitled; back chevron only).
3. Capture — voice / still / one line chooser. Header title **Leave it**. Primary tape control is **Record**.
4. Residue detail or Privacy — “No comments. No likes. No stars.” Header title **Residue** or **Privacy**.

**How to capture**

```bash
npx expo start --android
```

Use a Pixel-class emulator or a phone. Crop to portrait 1080×1920 or 1080×2340. No status-bar secrets. Do not screenshot the Expo QR / Metro screen.

**7" tablet:** Afterglow is portrait and usable on tablets. If Play’s default device catalog includes 7" tablets (it usually does), add **two** 7" shots of the same screens so the listing is not rejected for missing tablet graphics. If you later restrict the catalog to phones only, tablet shots are not required.

---

## Content rating notes (IARC questionnaire)

Answer for **this binary**, not a future social network.

| Question theme | Answer to give |
| --- | --- |
| Violence / blood / weapons | No |
| Sexual content / nudity | No (users may take a still; a face is not required; no sexual purpose) |
| Language | Users can type one line — treat as user-generated text, not app-authored profanity |
| Controlled substances | No |
| Gambling / purchases | No. Free. No IAP. |
| User interaction | Users leave a short whisper at a pin. **No** chat, comments, likes, or feed. **No** “who’s here.” |
| Location sharing | App uses **precise location** for leave-detect and the 15 m gate. It does **not** share a live location with other users in v0 (on-device). |
| Unrestricted internet | No (v0 does not upload residue) |
| Age | Expect **Everyone** / PEGI 3 or similar if the form stays honest. If Play treats any UGC + location as higher, accept that rating — do not hide UGC. |

Digital storefronts sometimes ask whether users can communicate. Be precise: a whisper can later be heard **at the same pin**. That is not a messenger.

---

## Data safety draft (paste / tick in Console)

**Does your app collect or share user data?** Yes — collected **for app functionality only**. **Not sold. Not shared** in v0.

**Account:** No account. Users cannot create one.

**Data collected**

| Type | Collected | Shared | Sold | Required | Purpose | Ephemeral / on-device |
| --- | --- | --- | --- | --- | --- | --- |
| Location — **precise** | Yes | No | No | Yes, for nearby + leave | App functionality | Yes (device). Pin stored with a local afterglow |
| Location — approximate | Yes (Android may grant both) | No | No | Same | App functionality | Yes |
| Microphone audio | Yes, if they record | No | No | Optional | App functionality | Yes |
| Photos | Yes, if they leave a still | No | No | Optional | App functionality | Yes |
| Personal info / financial / health | No | — | — | — | — | — |
| App activity / ads IDs / diagnostics | No | — | — | — | — | — |

**Encryption in transit:** v0 does not upload. When a later build does, update this form and use HTTPS.

**Users can request deletion:** Uninstalling the app removes the local store. Afterglows also expire (default 14 days).

**Independent security review:** No.

When a later build uploads residue to a server, **update this form before shipping that binary**. Do not pre-declare collection v0 does not do.

---

## Permissions rationale (Play “sensitive permissions”)

| Permission | Why Afterglow needs it | In the binary? |
| --- | --- | --- |
| `ACCESS_FINE_LOCATION` | Precise pin + ~15 m / 50 ft listen gate + leave trigger | Yes, foreground |
| `ACCESS_COARSE_LOCATION` | Android location dialog companion | Yes, foreground |
| `ACCESS_BACKGROUND_LOCATION` | Not used | **Blocked** in `app.json` |
| `RECORD_AUDIO` | Optional 8–12s voice note after the user starts recording | Yes |
| `CAMERA` | Optional still. Face not required | Yes |
| Photos / media read | Optional still the user already took (`expo-image-picker`) | Plugin may add the photos permission |

System strings (already in `app.json`):

- Location: “Afterglow uses GPS to notice when you leave, and to let you hear a whisper only at the same spot — about fifty feet. It does not show who is here.”
- Mic: “Afterglow records an 8–12 second voice note only after you start recording.”
- Camera: “Afterglow takes a still photo you choose to leave. A face is not required.”
- Photos: “Afterglow can use a still you already took. A face is not required.”

---

## Production AAB — exact EAS steps

Package `me.to28.afterglow` is read from `app.json`. The production profile in `eas.json` builds an **Android App Bundle** (`buildType: app-bundle`).

From the repo root, with Node 20+:

```bash
# 1. Once per machine
npx eas-cli@latest login
npx eas-cli@latest init

# 2. Production AAB (this is the Play upload file)
eas build -p android --profile production
```

Equivalent if `eas` is not on PATH:

```bash
npx eas-cli@latest build -p android --profile production
```

Wait for the Expo build page to finish. Download the `.aab`. In Play Console → **Testing → Internal testing** (or Production later) → **Create release** → upload that AAB.

**Preview APK** (sideload / friends, not Play):

```bash
eas build -p android --profile preview
```

**Local native project** (optional; needs Android SDK). Generated `android/` is gitignored.

```bash
npx expo prebuild --platform android
```

Confirm the package before upload:

```bash
npx expo config --type public | grep -E 'package|version'
```

You should see `"package": "me.to28.afterglow"`.

iOS `bundleIdentifier` is aligned to `me.to28.afterglow` so a later App Store path is not blocked. Do not wait on Apple to ship Android.

---

## Product doctrine (do not drift in the listing)

- GPS trigger on leave.
- Listen only within ~15 m / 50 ft of the precise pin.
- Optional 8–12s voice, still, or one line.
- No feed, likes, or comments.
- Plays ranking stub is OK. Never rate the place.
- Free. No Stripe.
