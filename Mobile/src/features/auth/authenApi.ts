import { API_ENDPOINT } from '@env';
import { axiosRequest, cleanObject } from '@src/utils/requestServerUtil';
import { ILoginBody, IChangePasswordBody } from '@src/models/auth';
import { IUpdateUserBody } from '@src/models/user';

class AuthenApi {
  authenApiEndpoint: string;
  userApiEndpoint: string;

  constructor() {
    this.authenApiEndpoint = `${API_ENDPOINT}/auth`;
    this.userApiEndpoint = `${API_ENDPOINT}/users/me`;
  }

  login(data: ILoginBody) {
    const validKeys = ['email', 'password'];
    return axiosRequest(
      this.authenApiEndpoint + '/login',
      null,
      'POST',
      '',
      cleanObject(validKeys, data)
    );
  }

  changePassword(token: string, data: IChangePasswordBody) {
    const validKeys = ['oldPassword', 'newPassword'];
    return axiosRequest(
      this.authenApiEndpoint + '/password',
      null,
      'PUT',
      token,
      cleanObject(validKeys, data)
    );
  }

  //member API
  getInformation(token: string) {
    return axiosRequest(this.userApiEndpoint, null, 'GET', token);
  }

  updateUserInfo(token: string, data: IUpdateUserBody) {
    const validKeys = ['fullName', 'phone', 'gender', 'avatar', 'dateOfBirth'];
    return axiosRequest(
      this.userApiEndpoint + '/update',
      null,
      'PUT',
      token,
      cleanObject(validKeys, data)
    );
  }
}

export default new AuthenApi();
