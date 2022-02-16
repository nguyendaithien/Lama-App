export type IUser = {
  id?: number;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  role?: string;
  userTeams?: Array<{
    role?: string;
    isOwner?: boolean;
    team?: {
      id?: number;
      name?: string;
      avatar?: string;
      description?: string;
      isActive?: boolean;
      createdAt?: string;
      updatedAt?: string;
      deletedAt?: any;
    };
  }>;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: any;
};

export type IUserBodyRequest = {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type IUserBodyRequestCreate = {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type IUpdateStatusUser = {
  id?: number;
  isActive?: boolean;
};

export type IParamGetUsers = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: number | null;
  status?: number | null;
};
