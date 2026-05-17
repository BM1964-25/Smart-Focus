import { z } from 'zod';

export const parseOrThrow = <T>(schema: z.ZodSchema<T>, value: unknown): T => {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    throw new Error(message);
  }
  return parsed.data;
};

export const parseJsonObject = (text: string): unknown => {
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(cleaned) as unknown;
};
