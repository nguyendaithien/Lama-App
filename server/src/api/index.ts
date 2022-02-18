import { Router } from 'express';

import authRoute from './routes/auth.route';
import userRoute from './routes/user.route';
import teamRoute from './routes/team.route';
import projectRoute from './routes/project.route';

import setupSwagger from './setup-swagger';

export default () => {
  const app = Router();

  setupSwagger(app);

  authRoute(app);
  userRoute(app);
  teamRoute(app);
  projectRoute(app);

  return app;
};
