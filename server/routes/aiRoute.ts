import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { aiRequestSchema } from '../schemas/aiSchemas.js';
import { AiService } from '../services/aiService.js';
import { parseOrThrow } from '../services/validationService.js';

export const aiRoute = Router();

aiRoute.use(
  rateLimit({
    windowMs: 60_000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false
  })
);

aiRoute.post('/', async (request, response, next) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      response.status(503).json({ error: 'ANTHROPIC_API_KEY ist serverseitig nicht gesetzt.' });
      return;
    }
    const payload = parseOrThrow(aiRequestSchema, request.body);
    const service = new AiService(process.env.ANTHROPIC_API_KEY);
    response.json(await service.createSuggestion(payload));
  } catch (error) {
    next(error);
  }
});
