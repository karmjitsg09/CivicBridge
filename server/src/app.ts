import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze.js';
import reportsRouter from './routes/reports.js';
import { reportStorage } from './services/firestore.js';

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

app.disable('x-powered-by');

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'microphone=(self), geolocation=(self)');
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const customOrigin = process.env.CORS_ORIGIN || process.env.CLIENT_ORIGIN;
      if (customOrigin) {
        const allowed = customOrigin.split(',').map((value) => value.trim());
        if (allowed.includes(origin)) return callback(null, true);
      }

      if (origin.endsWith('.vercel.app')) return callback(null, true);

      if (!isProduction) {
        const devOrigins = [
          'http://localhost:5173',
          'http://127.0.0.1:5173',
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:8080',
        ];
        if (devOrigins.includes(origin)) return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id'],
    credentials: false,
    maxAge: 86400,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const healthHandler = (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'civicbridge-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: isProduction ? 'production' : 'development',
    storageMode: reportStorage.getStorageType(),
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);
app.use('/api/analyze', analyzeRouter);
app.use('/analyze', analyzeRouter);
app.use('/api/reports', reportsRouter);
app.use('/reports', reportsRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[CivicBridge Server Error]: Internal exception occurred');
  res.status(500).json({
    error: 'An unexpected server error occurred. Please try again later.',
  });
});

export default app;
