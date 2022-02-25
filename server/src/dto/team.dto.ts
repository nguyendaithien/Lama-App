import { PaginationParamsDto } from './pagination.dto';

export interface CreateTeamDto {
  name: string;
  avatar?: string;
  description?: string;
}

export interface UpdateTeamDto {
  name: string;
  avatar?: string;
  description?: string;
}

export interface ChangeTeamStatusDto {
  isActive: boolean;
}

export interface GetAllTeamsParamsDto extends PaginationParamsDto {
  search?: string;
  sort?: number;
  status?: number;
}

export const GetTeamsSortParams = {
  1: ['team.createdAt', 'ASC'],
  2: ['team.createdAt', 'DESC'],
  3: ['team.name', 'ASC'],
  4: ['team.name', 'DESC'],
};

export interface AddUserToTeamDto {
  userId: number | string;
  role: string;
  isOwner: boolean;
}

export interface UpdateUserInTeamDto {
  userId: number | string;
  role: string;
  isOwner: boolean;
}

export interface DeleteUserInTeamDto {
  userId: number | string;
}
