export type ITeamBodyRequest = {
  teamID?: number;
  name?: string;
  description?: string;
  avatar?: string;
};

export type ITeamCreateRequest = {
  name?: string;
  description: string;
  avatar?: null | string;
};

export type ITeamHaveUsers = {
  role?: string;
  isOwner?: boolean;
  user?: {
    id?: number;
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

export type ITeam = {
  id?: number;
  name?: string;
  description?: string;
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  userTeams?: Array<ITeamHaveUsers>;
};

export type ITeamUpdateStatus = {
  teamID?: number;
  isActive?: boolean;
};

export type ITeamWithUser = {
  teamID?: number;
  userId?: number;
  role?: string;
  isOwner?: boolean;
};

export type ITeamDeleteUser = {
  teamID?: number;
  userId?: number;
};

export type ITeamParamGetTeams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: number | null;
  status?: number | null;
};
