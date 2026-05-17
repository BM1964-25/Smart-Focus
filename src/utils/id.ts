import { nanoid } from 'nanoid';

export const createId = (prefix: string): string => `${prefix}_${nanoid(12)}`;
export const nowIso = (): string => new Date().toISOString();
