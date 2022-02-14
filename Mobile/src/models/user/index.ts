export type IUser = {
  id?: number;
  fullName?: string;
  dateOfBirth?: string;
  avatar?: string | null;
  gender?: number | null;
  phone?: string;
  email?: string | null;
  role?: string;
  lastLogin?: string;
};

export type IUpdateUserBody = {
  fullName?: string;
  phone?: number;
  avatar?: string;
  gender?: number;
  dateOfBirth?: string;
};
