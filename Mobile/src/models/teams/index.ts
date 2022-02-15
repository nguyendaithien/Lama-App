export type ITeamBodyRequest = {
  name?: string;
  description?: string;
  avatar?: string;
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
  userTeams?: Array<{
    role?: string;
    isOwnder?: boolean;
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
  }>;
};

export type IUpdateStatus = {
  isActive?: boolean;
};

export type IUserWithTeam = {
  userId: number;
  role: string;
  isOwner: boolean;
};

export type IDeleteUserFromTeam = {
  userId: number;
};
