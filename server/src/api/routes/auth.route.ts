import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';

import middlewares from '@src/api/middlewares';
import AuthService from '@src/services/auth.service';
import { LoginDto, RegisterDto } from '@src/dto/user.dto';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post(
    '/register',
    middlewares.validators.authValidators.signUp,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authServiceInstance = Container.get(AuthService);
        const result = await authServiceInstance.register(req.body as RegisterDto);
        return res.status(201).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.post(
    '/login',
    middlewares.validators.authValidators.signIn,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authServiceInstance = Container.get(AuthService);
        const result = await authServiceInstance.login(req.body as LoginDto);
        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );
};
