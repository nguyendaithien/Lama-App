export type ILoginBody = {
  email: string;
  password: string;
  remember?: true | false;
};

export type IChangePasswordBody = {
  oldPassword: string;
  newPassword: string;
};

export type IAuthRegister = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
};
