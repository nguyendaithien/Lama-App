import { User } from '@src/entities/user.entity';
import { PaginationParamsDto } from './pagination.dto';

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
  remember?: boolean;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export type UserBasicDto = Omit<User, 'password' | 'salt'>;

export interface GetAllUsersParamsDto extends PaginationParamsDto {
  search?: string;
  sort?: number;
  status?: number;
}

export const GetUserSortParams = {
  1: ['user.createdAt', 'ASC'],
  2: ['user.createdAt', 'DESC'],
  3: ['user.firstName', 'ASC'],
  4: ['user.firstName', 'DESC'],
};

export interface ChangeUserStatusDto {
  isActive: boolean;
}

export interface UpdateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
}
