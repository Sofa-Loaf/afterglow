import AsyncStorage from '@react-native-async-storage/async-storage';

import { withPlays } from '../access';
import { isExpired } from '../ttl';
import type { Afterglow } from '../types';

const KEY = 'afterglow.local.v0';

async function readAll(): Promise<Afterglow[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Afterglow[];
    return Array.isArray(parsed) ? parsed.map(withPlays) : [];
  } catch {
    return [];
  }
}

async function writeAll(items: Afterglow[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function purgeExpired(now: number = Date.now()): Promise<Afterglow[]> {
  const kept = (await readAll()).filter((item) => !isExpired(item.expiresAt, now));
  await writeAll(kept);
  return kept;
}

export async function listLocalAfterglows(): Promise<Afterglow[]> {
  return purgeExpired();
}

export async function saveAfterglow(item: Afterglow): Promise<void> {
  const current = await purgeExpired();
  await writeAll([withPlays(item), ...current.filter((existing) => existing.id !== item.id)]);
}

export async function getAfterglow(id: string): Promise<Afterglow | null> {
  const items = await purgeExpired();
  return items.find((item) => item.id === id) ?? null;
}

/** v0 stub: local device only. No account, no sync, no identity. */
export const storageNote =
  'Afterglows on this device are stored locally and expire in days–weeks. v0 does not upload them.';
