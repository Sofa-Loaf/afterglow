import { RESIDUE } from './doctrine';

export const DAY_MS = 24 * 60 * 60 * 1000;

export function ttlMs(days: number = RESIDUE.defaultTtlDays): number {
  const clamped = Math.min(RESIDUE.maxTtlDays, Math.max(RESIDUE.minTtlDays, days));
  return clamped * DAY_MS;
}

export function expiresAt(createdAt: number, days?: number): number {
  return createdAt + ttlMs(days);
}

export function isExpired(expiresAtMs: number, now: number = Date.now()): boolean {
  return now >= expiresAtMs;
}

export function ageLabel(createdAt: number, now: number = Date.now()): string {
  const age = Math.max(0, now - createdAt);
  const hours = Math.floor(age / (60 * 60 * 1000));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day' : `${days} days`;
}
