# Afterglow privacy (v0)

**Play Console URL (use this):** https://28to3.me/apps/afterglow.html#privacy

In-repo source for that section. Fallback if the landing hash is late: this file on GitHub  
https://github.com/Sofa-Loaf/afterglow/blob/main/docs/PRIVACY.md  
or the rendered raw page  
https://raw.githubusercontent.com/Sofa-Loaf/afterglow/main/docs/PRIVACY.md

Afterglow is **free**. There is no Stripe, no IAP, and no account.

## Who we are

Afterglow is sold by **28to3.me** (Sofa Loaf). Contact: hello@28to3.me  
Android application id: `me.to28.afterglow`.

## What we collect — feature only, not sold

This v0 scaffold stores data **on the device**. It does not upload residue, does not create an account, and does not sell data.

| Data | When | Why | Sold? | Shared? |
| --- | --- | --- | --- | --- |
| Precise location (GPS) | After you allow foreground location | Notice when you leave; gate listening to ~15 m / 50 ft of the pin | No | No (stays on device in v0) |
| Approximate location | Same permission dialog (Android may grant both) | Same leave + gate feature | No | No |
| Microphone audio | Only after you start an 8–12s voice note | Leave a voice afterglow | No | No |
| Photos / camera still | Only when you take or pick a still | Leave a still afterglow. A face is not required | No | No |
| One line of text | Only if you type it | Leave a one-line afterglow | No | No |
| Local `plays` count | When residue is opened on this device (stub) | Later rank residue at a landmark — never rate the place | No | No |

We do **not** collect email, name, phone number, contacts, or payment info.

## Permissions rationale

- **Precise location** — GPS is the trigger. Afterglow notices when you leave a place, and only lets you hear or see a whisper if you stand within about fifty feet of that precise pin. Not a live people map. **Background location is off.**
- **Microphone** — optional 8–12 second voice note, started by you.
- **Camera / photos** — optional still you choose. A face is not required.

If you deny a permission, that capture path stays closed. Location denial hides nearby residue behind the sample-coordinate fallback and blocks a real leave-detect.

## What we do not do

- No account, email, or phone number
- No feed, likes, comments, or star ratings
- No reviews of the place
- No live “who’s here”
- No background location in v0
- No sale of data
- No ads, analytics, or crash SDK in this repository
- No payments

## Retention

Afterglows are short-lived (days–weeks; default 14 days) and purged locally when expired. Uninstalling the app removes the on-device store.

## Children

Afterglow is not directed at children under 13. Do not leave a whisper that identifies a child.

## Contact

John Snow / 28to3.me — hello@28to3.me  
Use the Play Console listing contact email. Do not block publishing on an afterglow.com domain.

When a later build uploads residue to a server, this policy will be updated **before** that binary ships.
