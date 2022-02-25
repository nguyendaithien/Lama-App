import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';

import middlewares from '@src/api/middlewares';
import { userValidators } from '@src/api/middlewares/validators';
import { UserRole } from '@src/entities/user.entity';
import UserService from '@src/services/user.service';
import {
  ChangeUserStatusDto,
  CreateUserDto,
  GetAllUsersParamsDto,
  UpdateUserDto,
} from '@src/dto/user.dto';

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  route.get('/me', middlewares.isAuth, (req: Request, res: Response) => {
    return res.status(200).json(req.currentUser);
  });

  route.post(
    '/',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    userValidators.createUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userService = Container.get(UserService);
        const result = await userService.createUser(req.body as CreateUserDto);
        return res.status(201).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.get(
    '/',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    async (req: Request, res: Response, next: NextFunction) => {
      let { page, limit, search, sort, status } = req.query as GetAllUsersParamsDto;
      (page = +page || 1),
        (limit = +limit || 100),
        (search = search || ''),
        (sort = +sort || 2),
        (status = +status || null);

      try {
        const userService = Container.get(UserService);
        const result = await userService.findAllUsers({ page, limit, search, sort, status });
        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.get(
    '/:userId',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId } = req.params;
        const userService = Container.get(UserService);
        const result = await userService.findOne(userId);
        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.put(
    '/:userId',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    userValidators.updateUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId } = req.params;
        const userService = Container.get(UserService);
        const result = await userService.updateUser(userId, req.body as UpdateUserDto);
        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.put(
    '/status/:userId',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    userValidators.changeUserStatus,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId } = req.params;
        const userService = Container.get(UserService);
        const result = await userService.changeUserStatus(userId, req.body as ChangeUserStatusDto);
        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );
};
