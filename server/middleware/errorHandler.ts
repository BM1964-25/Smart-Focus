import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  void _next;
  const message = error instanceof Error ? error.message : 'Unbekannter Serverfehler';
  response.status(message.includes('API key') ? 500 : 400).json({ error: message });
};
