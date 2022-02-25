import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Container from 'typedi';
import { Repository } from 'typeorm';
import _ from 'lodash';

import config from '@src/config';
import { GenericException, UnauthorizedException } from '@src/config/custom-error.config';
import { User } from '@src/entities/user.entity';

const isOptionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;
    let tokenResult: { id: number };
    if (!auth) {
      throw new UnauthorizedException('isOptionalAuth', 'No token found');
    }
    const splited = auth.split(' ');
    if (splited.length !== 2) {
      throw new UnauthorizedException('isOptionalAuth', 'Invalid token');
    }
    if (splited[0] === 'Token' || splited[0] === 'Bearer') {
      const token = splited[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      tokenResult = decoded as { id: number };

      // attach user
      const userRepository = Container.get('userRepository') as Repository<User>;

      const user = await userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: tokenResult.id })
        .getOne();

      if (!!user) {
        req.currentUser = _.omit(user, ['password', 'salt']);
        req.hasPermission = true;
      }

      return next();
    } else {
      throw new UnauthorizedException('isOptionalAuth', 'Invalid token');
    }
  } catch (err) {
    if (err instanceof UnauthorizedException) {
      next();
    } else {
      throw new GenericException('isOptionalAuth');
    }
  }
};

export default isOptionalAuth;
