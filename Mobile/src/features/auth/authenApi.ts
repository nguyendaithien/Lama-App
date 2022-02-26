import { API_ENDPOINT } from '@env';
import { axiosRequest, cleanObject } from '@src/utils/requestServerUtil';
import { ILoginBody, IChangePasswordBody, IAuthRegister } from '@src/models/auth';

class AuthenApi {
  authenApiEndpoint: string;

  constructor() {
    this.authenApiEndpoint = `${API_ENDPOINT}/auth`;
  }

  login(data: ILoginBody) {
    const validKeys = ['email', 'password'];
    console.log(this.authenApiEndpoint + '/login');
    return axiosRequest(
      this.authenApiEndpoint + '/login',
      null,
      'POST',
      '',
      cleanObject(validKeys, data)
    );
  }
  register(data: IAuthRegister) {
    return axiosRequest(this.authenApiEndpoint + '/register', null, 'POST', '', data);
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
}

export default new AuthenApi();
