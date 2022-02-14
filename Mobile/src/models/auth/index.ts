export type ILoginBody = {
  email: string;
  password: string;
  remember?: 1 | 0;
};

export type IChangePasswordBody = {
  oldPassword: string;
  newPassword: string;
};
