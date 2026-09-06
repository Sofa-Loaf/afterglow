import { RESIDUE } from './doctrine';
import { distanceMeters } from './geo';
import type { Afterglow, Coord } from './types';

/** Playback and nearby list: same pin, ~50 ft gate. */
export function isWithinAccessRadius(
  here: Coord,
  pin: Coord,
  radiusM: number = RESIDUE.accessRadiusMeters,
): boolean {
  return distanceMeters(here, pin) <= radiusM;
}

/**
 * Playback gate. Prefer a live fix vs the pin. If GPS jitters, staying at the
 * nearby-list origin still counts as the same spot.
 */
export function canHearResidue(here: Coord, pin: Coord, listOrigin: Coord | null = null): boolean {
  if (isWithinAccessRadius(here, pin)) return true;
  return listOrigin !== null && isWithinAccessRadius(here, listOrigin);
}

/** Nearby list — only residue you can stand inside the gate for. */
export function residueInReach(
  items: Afterglow[],
  here: Coord,
  radiusM: number = RESIDUE.accessRadiusMeters,
): Afterglow[] {
  return items.filter((item) => isWithinAccessRadius(here, item.coord, radiusM));
}

/**
 * Later, when a landmark pin cluster has volume: show top afterglows by play count.
 * Rank the residue, never the place. No star ratings.
 */
export function rankByPlays(items: Afterglow[]): Afterglow[] {
  return [...items].sort((a, b) => {
    const playDelta = (b.plays ?? 0) - (a.plays ?? 0);
    if (playDelta !== 0) return playDelta;
    return b.createdAt - a.createdAt;
  });
}

export function withPlays(item: Afterglow): Afterglow {
  return { ...item, plays: Number.isFinite(item.plays) ? item.plays : 0 };
}
