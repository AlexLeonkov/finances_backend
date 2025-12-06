import { Express } from 'express';
import operationRouter from '../modules/operation/operation.router';
import teamRouter from '../modules/team/team.router';

export function registerRoutes(app: Express): void {
  // Register module routes
  app.use('/api/operations', operationRouter);
  app.use('/api/teams', teamRouter);
}

