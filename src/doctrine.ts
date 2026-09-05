/** Locked product doctrine. Do not add a feed, likes, comments, ranking, or payments. */

export const PRODUCT = {
  name: 'Afterglow',
  freeForever: true,
  payments: 'none' as const,
} as const;

export const CAPTURE = {
  voiceMinSeconds: 8,
  voiceMaxSeconds: 12,
  lineMaxChars: 80,
} as const;

export const RESIDUE = {
  defaultTtlDays: 14,
  minTtlDays: 3,
  maxTtlDays: 28,
  geofenceRadiusMeters: 80,
} as const;

export const PROMPT = {
  leave: 'Want to leave an afterglow?',
  moveOn: 'Move on',
  leaveIt: 'Leave it',
} as const;

export const DOCTRINE_LINES = [
  'After you leave a place, Afterglow asks quietly: “Want to leave an afterglow?”',
  'Capture only: an 8–12s voice note, a still photo (no face required), or one line.',
  'No feed. No likes on capture. No “post.”',
  'Later, someone at that same spot can hear or see recent residue. Not reviews. Not ratings. Not Yelp.',
  'Anonymous by default. Short-lived (days–weeks). No comments on others’ afterglows.',
  'No live “who’s here.” No place ranking.',
  'Field-recorder aesthetic.',
  'Free forever. No Stripe. No IAP. No ads.',
] as const;
