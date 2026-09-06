# Afterglow privacy (v0)

Public listing URL for Play Console: **https://28to3.me/apps/afterglow.html**  
Fallback: **https://28to3.me/privacy**

This file is the in-repo source for that page. Afterglow is free. There is no Stripe and no account.

## What we collect in this scaffold

On this device only, if you choose to leave an afterglow:

- Precise coordinates of the pin (the afterglow stays at that spot)
- One of: an 8–12 second voice note, a still photo, or one line of text
- A created/expiry timestamp
- A local `plays` count (stub; used later to rank residue at a landmark, never to rate the place)

GPS is the trigger: foreground location notices when you leave, and gates listening or seeing an afterglow to about fifty feet (~15 m) of the pin. The pin is precise; the radius is only the access gate.

Sample nearby residue is bundled in the app for the v0 list. Entries outside the fifty-foot gate are hidden. It is not other people’s live data.

## What we do not do

- No account, email, or phone number
- No feed, likes, comments, or star ratings
- No reviews of the place
- No live “who’s here”
- No background location in v0
- No sale of data
- No payments, ads, or analytics SDK in this repository

## Retention

Afterglows are short-lived (days–weeks; default 14 days) and purged locally when expired.

## Contact

John Snow — use the Play Console listing contact email and the 28to3.me policy page. Do not block publishing on an afterglow.com domain.
