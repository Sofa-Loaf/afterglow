import * as Location from 'expo-location';

import type { Coord, PermissionState } from '../types';

export async function getForegroundPermission(): Promise<PermissionState> {
  const current = await Location.getForegroundPermissionsAsync();
  if (current.granted) return 'granted';
  if (current.status === Location.PermissionStatus.DENIED) return 'denied';
  return 'unknown';
}

export async function requestForegroundPermission(): Promise<PermissionState> {
  const result = await Location.requestForegroundPermissionsAsync();
  return result.granted ? 'granted' : 'denied';
}

export async function getCurrentCoord(): Promise<Coord | null> {
  try {
    const fix = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      latitude: fix.coords.latitude,
      longitude: fix.coords.longitude,
    };
  } catch {
    return null;
  }
}

/** Background location is intentionally off for Play v0. */
export const backgroundLocationEnabled = false;
