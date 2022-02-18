import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Container from 'typedi';

import config from '@src/config';
import { UnauthorizedException } from '@src/config/custom-error.config';
import UserService from '@src/services/user.service';

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error('No token found');
    }
    const splited = auth.split(' ');
    if (splited.length !== 2 || splited[0] !== 'Bearer') {
      throw new Error('Invalid token');
    }

    const token = splited[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    const result = decoded as { id: number };

    // attach user
    const userService = Container.get(UserService);
    const user = await userService.findOne(result.id);
    if (!user) {
      throw new Error('Authorize user fail');
    }
    req.currentUser = user;
    req.hasPermission = true;

    return next();
  } catch (err) {
    return next(new UnauthorizedException('isAuth', err?.message || 'Unauthorized'));
  }
};

export default isAuth;
