import dotenv from 'dotenv';
import app from './app.js';
import { reportStorage } from './services/firestore.js';

dotenv.config();

const port = Number(process.env.PORT) || 3001;

if (process.env.VERCEL !== '1') {
  const server = app.listen(port, () => {
    console.log(`[CivicBridge Server] running on http://localhost:${port}`);
    console.log(`[CivicBridge Server] Environment: ${process.env.NODE_ENV === 'production' ? 'production' : 'development'}`);
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
