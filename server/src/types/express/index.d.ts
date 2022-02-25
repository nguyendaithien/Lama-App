import { User as UserEntity } from '@src/entities/user.entity';

declare global {
  namespace Express {
    export interface Request {
      currentUser: Omit<UserEntity, 'password' | 'salt'>;
      hasPermission: boolean;
    }
  }
}
