import { offsetMeters } from '../geo';
import { expiresAt } from '../ttl';
import type { Afterglow, Coord } from '../types';

/** Neutral park-like fallback when location is unavailable. */
export const FALLBACK_ORIGIN: Coord = {
  latitude: 40.7359,
  longitude: -73.9911,
};

const HOUR = 60 * 60 * 1000;

const FIXTURES: Array<{
  id: string;
  kind: Afterglow['kind'];
  hoursAgo: number;
  northM: number;
  eastM: number;
  placeHint: string;
  line?: string;
}> = [
  {
    id: 'sample-bench',
    kind: 'line',
    hoursAgo: 5,
    northM: 28,
    eastM: -12,
    placeHint: 'the bench',
    line: 'The light on the brick was enough.',
  },
  {
    id: 'sample-steps',
    kind: 'voice',
    hoursAgo: 18,
    northM: -40,
    eastM: 22,
    placeHint: 'the steps',
  },
  {
    id: 'sample-corner',
    kind: 'still',
    hoursAgo: 36,
    northM: 15,
    eastM: 45,
    placeHint: 'the corner',
  },
  {
    id: 'sample-door',
    kind: 'line',
    hoursAgo: 52,
    northM: -22,
    eastM: -38,
    placeHint: 'the doorway',
    line: 'Rain on the awning. Then quiet.',
  },
];

export function sampleAfterglowsNear(origin: Coord, now: number = Date.now()): Afterglow[] {
  return FIXTURES.map((fixture) => {
    const createdAt = now - fixture.hoursAgo * HOUR;
    return {
      id: fixture.id,
      kind: fixture.kind,
      createdAt,
      expiresAt: expiresAt(createdAt),
      coord: offsetMeters(origin, fixture.northM, fixture.eastM),
      line: fixture.line,
      origin: 'sample' as const,
      placeHint: fixture.placeHint,
    };
  });
}
