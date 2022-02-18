import { ProjectStatus } from '@src/entities/project.entity';
import { PaginationParamsDto } from './pagination.dto';

export interface CreateProjectDto {
  name: string;
  description?: string;
  income?: number;
  avatar?: string;
  startTime?: string;
  endTime?: string;
}

export interface UpdateProjectDto {
  name: string;
  description?: string;
  income?: number;
  avatar?: string;
  startTime?: string;
  endTime?: string;
}

export interface ChangeProjectStatusDto {
  status: ProjectStatus;
}

export interface GetAllProjectsParamDto extends PaginationParamsDto {
  search?: string;
  sort?: number;
  status?: number;
}

export const GetProjectsSortParam = {
  1: ['project.createdAt', 'ASC'],
  2: ['project.createdAt', 'DESC'],
  3: ['project.name', 'ASC'],
  4: ['project.name', 'DESC'],
  5: ['project.income', 'ASC'],
  6: ['project.income', 'DESC'],
};

export interface AddUserToProjectDto {
  userId: number | string;
  wage: number;
  role: string;
}

export interface UpdateUserInProjectDto {
  userId: number | string;
  wage: number;
  role: string;
}

export interface DeleteUserInProjectDto {
  userId: number | string;
}

export interface AddProjectCostDto {
  title: string;
  value: number;
}

export interface UpdateProjectCostDto {
  title: string;
  value: number;
}
