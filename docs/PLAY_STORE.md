# Google Play listing checklist (Android first)

This is a **requirements checklist**, not a store-approval claim. Afterglow has not been submitted. iOS / App Store work is later and does not block this MVP.

Afterglow is **free forever**. No Stripe. No IAP. No paid unlocks.

## Package identity

| Field | Value |
| --- | --- |
| Application id | `com.sofaloaf.afterglow` |
| Expo slug | `afterglow` |
| Default store name | Afterglow |
| Privacy policy URL (use now) | https://28to3.me/apps/afterglow.html |
| Fallback policy URL | https://28to3.me/privacy |
| Do not wait on | afterglow.com or any unowned domain |

`eas.json` production profile builds an **AAB** for Play. Preview builds an **APK** for sideload / internal testers.

## What John needs before a Play upload

1. A Google account John controls.
2. **Google Play Console** enrollment — **$25 one-time** (personal developer account is enough for v0).
3. A free **Expo** account, then `npx eas-cli@latest login` and `npx eas-cli@latest init` in this repo (creates the EAS project id; do not invent one in git).
4. A public HTTPS **privacy policy** URL. Use `https://28to3.me/apps/afterglow.html` (or `https://28to3.me/privacy` until that page exists). Do not block the listing on buying afterglow.com.
5. Play Console **app created** with package name `com.sofaloaf.afterglow` (must match `app.json`).
6. **Data safety** form filled to match v0: no account, no sale of data, location / mic / camera used only when the person captures or stands at a pin to hear nearby residue.
7. **Content rating** questionnaire completed.
8. Phone **screenshots** (at least 2) and a **feature graphic** (1024×500).
9. A production **AAB** from `eas build --platform android --profile production` (or a local Gradle bundle after `npx expo prebuild --platform android`).

Not needed for this Play path: Apple Developer Program, Stripe, ads SDK, Maps API key, background-location declaration.

## Listing copy (draft — edit in Play Console)

**Short description (max 80)**

> Whispers from who stood right here. Free. Not reviews. No feed.

**Full description**

> Afterglow is a field recorder for places. GPS is the trigger: after you leave, it asks one quiet question — want to leave an afterglow?
>
> You can leave an 8–12 second voice note, a still photo (a face is not required), or one line. Then you move on. There is no feed, no likes on capture, and no “post.”
>
> Later, someone standing at that same pin — about fifty feet, a hotel room or an exact patch of grass — can hear or see the whisper. The pin is precise. The radius is only the gate. Afterglow is not reviews, ratings, or Yelp.
>
> When a landmark gathers many afterglows, they will be ranked by plays. The residue is ranked. The place is never rated. There are no stars.
>
> Afterglows are anonymous by default and short-lived. There are no comments on other people’s afterglows, and no live “who’s here.”
>
> Afterglow is free. There are no purchases and no ads.

**Category:** Lifestyle (not a social network).

## Data safety (v0, local / ephemeral)

Declare only what the binary actually does:

- Location (foreground / approximate+precise): GPS trigger to detect leaving a place, and to gate listening or seeing residue to about fifty feet (~15 m) of the pin. **Not** background. **Not** a live people map.
- Microphone: only for an 8–12s voice note the person starts.
- Camera / photos: only for a still the person chooses. Face not required.
- Collected data in v0 stays **on device** (ephemeral local store), including a local `plays` stub. No account. No tracking SDK. No payments.

When a later build uploads residue to a server, update this form before shipping that binary. Do not pre-declare collection that v0 does not do.

## Android permissions in this scaffold

Enabled: `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`, `RECORD_AUDIO`, `CAMERA`.

Blocked: `ACCESS_BACKGROUND_LOCATION` (keeps v0 off Play’s background-location policy). Leave-detection is a **foreground GPS stub** plus a Simulate leaving control. Nearby list and playback use the same **15 m / ~50 ft** access gate.

## Build commands

```bash
# Expo Go / Metro (Android device or emulator)
npx expo start --android

# Internal APK via EAS (needs Expo login)
npx eas-cli@latest build --platform android --profile preview

# Play AAB via EAS
npx eas-cli@latest build --platform android --profile production

# Local native project (needs Android SDK)
npx expo prebuild --platform android
```

iOS `bundleIdentifier` is present so a later App Store path is not blocked. Do not wait on Apple to ship Android.

## App Store (later, not a blocker)

John will eventually need an Apple Developer Program account (~$99/year), privacy nutrition labels, and iOS screenshots. None of that is required to open testing on Play.
