/** Locked product doctrine. Do not add a feed, likes, comments, place ratings, or payments. */

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
  /**
   * Access gate only. The pin is the precise lat/lng.
   * ~50 ft — tight enough for a hotel room, a hallway, an exact patch of grass.
   */
  accessRadiusMeters: 15,
  accessRadiusFeetApprox: 50,
} as const;

/** @deprecated Use RESIDUE.accessRadiusMeters. Leave detection shares the same gate. */
export const GEOFENCE_RADIUS_M = RESIDUE.accessRadiusMeters;

export const PROMPT = {
  leave: 'Want to leave an afterglow?',
  moveOn: 'Move on',
  leaveIt: 'Leave it',
} as const;

export const ACCESS_COPY = {
  radius: 'about fifty feet',
  radiusShort: '~50 ft',
  tooFar: 'This whisper stays at the pin. Stand within about fifty feet.',
  emptyNearby: 'Nothing within fifty feet. Walk to the pin, or leave a whisper when you go.',
} as const;

export const DOCTRINE_LINES = [
  'GPS is the trigger. Afterglow notices when you leave; you hear a whisper only at the same spot.',
  'About fifty feet (~15 m) — a hotel room, a hallway, an exact patch of grass. The pin is precise; the radius is only the gate.',
  'Capture only: an 8–12s voice note, a still photo (no face required), or one line.',
  'No feed. No likes on capture. No “post.”',
  'Not reviews. A whisper from who stood right there.',
  'Anonymous by default. Short-lived (days–weeks). No comments on others’ afterglows.',
  'No live “who’s here.” Never rate the place. When a landmark gathers whispers, rank them by plays — no stars.',
  'Whispers from the past. Field recorder. Haunting, small.',
  'Free forever. No Stripe. No IAP. No ads.',
] as const;
