import { API_ENDPOINT } from '@env';
import { IUserBodyRequest, ITeamUpdateStatusUser, IParamGetUsers } from '@src/models/user';
import { axiosRequest, cleanObject } from '@src/utils/requestServerUtil';

class UserAPI {
  userAPIEndpoint: string;

  constructor() {
    this.userAPIEndpoint = `${API_ENDPOINT}/users/`;
  }

  getAdminInfor(token: string) {
    return axiosRequest(this.userAPIEndpoint + 'me', null, 'GET', token);
  }

  getUsers(token: string, param: IParamGetUsers | null) {
    return axiosRequest(this.userAPIEndpoint, param, 'GET', token);
  }

  getUserDetailByID(token: string, id: number) {
    return axiosRequest(this.userAPIEndpoint + `${id}`, null, 'GET', token);
  }

  createUser(token: string, data: IUserBodyRequest) {
    const validKeys = ['firstName', 'lastName', 'email', 'phone'];
    return axiosRequest(this.userAPIEndpoint, null, 'POST', token, cleanObject(validKeys, data));
  }

  updateUser(token: string, data: IUserBodyRequest) {
    const validKeys = ['firstName', 'lastName', 'email', 'phone'];
    return axiosRequest(
      this.userAPIEndpoint + `${data!.id}`,
      null,
      'PUT',
      token,
      cleanObject(validKeys, data)
    );
  }
  changeStatusUser(token: string, data: ITeamUpdateStatusUser) {
    const validKeys = ['isActive'];
    return axiosRequest(
      this.userAPIEndpoint + '/status/' + `${data!.id}`,
      null,
      'PUT',
      token,
      cleanObject(validKeys, data)
    );
  }
}

export default new UserAPI();
