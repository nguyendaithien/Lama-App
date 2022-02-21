export type ILoginBody = {
  email: string;
  password: string;
  remember?: true | false;
};

export type IChangePasswordBody = {
  oldPassword: string;
  newPassword: string;
};
