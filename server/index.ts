import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { aiRoute } from './routes/aiRoute.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const port = Number(process.env.AI_PROXY_PORT ?? 8787);
const allowedOrigin = process.env.CLIENT_ORIGIN ?? 'http://127.0.0.1:5173';

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === allowedOrigin || origin === 'http://localhost:5173') {
        callback(null, true);
        return;
      }
      callback(new Error('CORS origin nicht erlaubt'));
    }
  })
);
app.use(express.json({ limit: '250kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, aiConfigured: Boolean(process.env.ANTHROPIC_API_KEY) });
});
app.use('/api/ai', aiRoute);
app.use(errorHandler);

app.listen(port, '127.0.0.1', () => {
  console.log(`AI proxy listening on http://127.0.0.1:${port}`);
});
