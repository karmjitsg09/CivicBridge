import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze.js';
import reportsRouter from './routes/reports.js';
import { reportStorage } from './services/firestore.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// 1. Security Header: Disable Express server disclosure
app.disable('x-powered-by');

// 2. Security Headers Middleware
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'microphone=(self), geolocation=(self)');
  next();
});

// 3. CORS Configuration
// Dynamic origin matching: allows same-origin, Vercel app domains, and explicit CORS_ORIGIN without ever using wildcard '*' in production.
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, or same-origin browser calls)
      if (!origin) return callback(null, true);

      const customOrigin = process.env.CORS_ORIGIN || process.env.CLIENT_ORIGIN;
      if (customOrigin) {
        const allowed = customOrigin.split(',').map((o) => o.trim());
        if (allowed.includes(origin)) return callback(null, true);
      }

      // Allow any Vercel preview or production deployment domain for this application
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

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

      // Reject unauthorized cross-origin requests
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id'],
    credentials: false, // Prevent unnecessary credential exposure
    maxAge: 86400, // 24 hour preflight cache
  })
);

// 4. Request Body Limits
// Restrict JSON payloads to 1MB (multimodal file uploads are handled independently via Multer at 10MB)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 5. Health Check Endpoint for Cloud Run, Vercel, and monitoring
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

// 6. Mount Routers (Dual-mounted to support both /api/* and direct serverless /* calls)
app.use('/api/analyze', analyzeRouter);
app.use('/analyze', analyzeRouter);
app.use('/api/reports', reportsRouter);
app.use('/reports', reportsRouter);

// 7. 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// 8. Global Centralized Error Handler (Never leaks stack traces or paths)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[CivicBridge Server Error]: Internal exception occurred');
  res.status(500).json({
    error: 'An unexpected server error occurred. Please try again later.',
  });
});

// 9. Server Initialization (Only listen when running as a standalone server, not inside Vercel serverless functions)
if (process.env.VERCEL !== '1') {
  const server = app.listen(port, () => {
    console.log(`[CivicBridge Server] running on http://localhost:${port}`);
    console.log(`[CivicBridge Server] Environment: ${isProduction ? 'production' : 'development'}`);
    console.log(`[CivicBridge Server] Storage Mode: ${reportStorage.getStorageType()}`);
  });

  const gracefulShutdown = (signal: string) => {
    console.log(`[CivicBridge Server] Received ${signal}. Closing HTTP server gracefully...`);
    server.close(() => {
      console.log('[CivicBridge Server] HTTP server closed cleanly.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

export default app;
