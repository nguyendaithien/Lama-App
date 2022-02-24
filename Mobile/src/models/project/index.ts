export type IProjectCreate = {
  name?: string;
  description?: string;
  avatar?: string;
  income?: number;
  status?: string;
  startTime?: string;
  endTime?: string;
};

export type IProjectUpdateInfor = {
  projectId: number;
  name?: string;
  description?: string;
  avatar?: string;
  income?: number;
  startTime?: string;
  endTime?: string;
};

export enum EProjectStatus {
  CANCELED = 'Canceled',
  IN_PROGRESS = 'In progress',
  COMPLETED = 'Completed'
}

export const ProjectStatus = ['In progress', 'Canceled', 'Completed'];

export type IProjectChangeStatus = {
  projectId?: number;
  status?: string;
};

export type IProjectAddUser = {
  projectId?: number;
  userId?: number;
  role?: string;
  wage?: number;
};

export type IProjectUpdateUser = {
  projectId?: number;
  userId?: number;
  role?: string;
  wage?: number;
};

export type IProjectDeleteUser = {
  projectId?: number;
  userId?: number;
};

export type IProjectAddCost = {
  projectId?: number;
  title?: string;
  value?: number;
};

export type IProjectUpdateCost = {
  projectCostId?: number;
  projectId?: number;
  title?: string;
  value?: number;
};

export type IProjectDeleteCost = {
  projectId?: number;
  projectCostId?: number;
};

export type IProjectGetAllWithParam = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: number | null;
  status?: number | null;
};

export type IProjectUser = {
  projectId?: number;
  role?: string;
  wage?: number;
  user?: {
    id?: null;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    role?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
  };
};

export type IProjectCost = {
  projectId?: number;
  id?: number;
  title?: string;
  value?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};
export type IProject = {
  id?: number;
  name?: string;
  description?: string;
  avatar?: string;
  income?: number;
  status?: EProjectStatus;
  startTime?: string;
  endTime?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  userProjects?: Array<IProjectUser>;
  costs?: Array<IProjectCost>;
};
