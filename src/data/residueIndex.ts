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

/** Pin used for the nearby list. Playback uses live GPS when it exists, else this. */
export function shownAt(): Coord | null {
  return shownOrigin;
}

export function gateOrigin(live: Coord | null, fallback: Coord): Coord {
  return live ?? shownOrigin ?? fallback;
}

export function routeId(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}
