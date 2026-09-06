import type { Coord } from './types';

const EARTH_M = 6371000;

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function distanceMeters(a: Coord, b: Coord): number {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLng = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function isOutsideGeofence(dwell: Coord, current: Coord, radiusM: number): boolean {
  return distanceMeters(dwell, current) > radiusM;
}

export function offsetMeters(origin: Coord, northM: number, eastM: number): Coord {
  const dLat = northM / EARTH_M;
  const dLng = eastM / (EARTH_M * Math.cos(toRadians(origin.latitude)));
  return {
    latitude: origin.latitude + (dLat * 180) / Math.PI,
    longitude: origin.longitude + (dLng * 180) / Math.PI,
  };
}

export function formatDistance(meters: number): string {
  if (!Number.isFinite(meters)) return 'right here';
  if (meters < 20) return 'right here';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}
