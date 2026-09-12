import type { Request, Response } from 'express';

const appPromise = import('../server/dist/app.js').then((module) => module.default);

export default async function handler(req: Request, res: Response) {
  const app = await appPromise;
  return app(req, res);
}
