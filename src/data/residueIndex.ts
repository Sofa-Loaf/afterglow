import type { Afterglow, Coord } from '../types';

let shown: Afterglow[] = [];
let shownOrigin: Coord | null = null;

export function rememberShown(items: Afterglow[], origin?: Coord): void {
  shown = items;
  if (origin) shownOrigin = origin;
}

export function rememberOne(item: Afterglow): void {
  shown = [item, ...shown.filter((existing) => existing.id !== item.id)];
}

export function findShown(id: string | undefined): Afterglow | null {
  if (!id) return null;
  return shown.find((item) => item.id === id) ?? null;
}

/** Pin used for the nearby list. Not a stand-in for a missing live GPS fix. */
export function shownAt(): Coord | null {
  return shownOrigin;
}

/**
 * Nearby-list origin, else the caller fallback. Playback must not pass this
 * in place of a live fix: a denied GPS reading would become this point and
 * the gate distance would collapse to 0.
 */
export function gateOrigin(live: Coord | null, fallback: Coord): Coord {
  return live ?? shownOrigin ?? fallback;
}

export function routeId(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}
