import type { Afterglow } from '../types';

let shown: Afterglow[] = [];

export function rememberShown(items: Afterglow[]): void {
  shown = items;
}

export function rememberOne(item: Afterglow): void {
  shown = [item, ...shown.filter((existing) => existing.id !== item.id)];
}

export function findShown(id: string | undefined): Afterglow | null {
  if (!id) return null;
  return shown.find((item) => item.id === id) ?? null;
}

export function routeId(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}
