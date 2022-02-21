import { API_ENDPOINT } from '@env';
import {
  ITeamParamGetTeams,
  ITeamCreateRequest,
  ITeamBodyRequest,
  ITeamUpdateStatus,
  ITeamWithUser,
  ITeamDeleteUser
} from '@src/models/team';
import { axiosRequest, cleanObject } from '@src/utils/requestServerUtil';

class TeamAPI {
  teamAPIEndpoint: string;
  constructor() {
    this.teamAPIEndpoint = `${API_ENDPOINT}/teams/`;
  }

  createNewTeam(token: string, data: ITeamCreateRequest) {
    return axiosRequest(this.teamAPIEndpoint, null, 'POST', token, data);
  }

  getTeams(token: string, param: ITeamParamGetTeams) {
    return axiosRequest(this.teamAPIEndpoint, param, 'GET', token);
  }

  getTeamDetailByID(token: string, id: number) {
    return axiosRequest(this.teamAPIEndpoint + `${id}`, null, 'GET', token);
  }

  updateTeamInfor(token: string, data: ITeamBodyRequest) {
    const validKeys = ['name', 'description', 'avater'];
    return axiosRequest(
      this.teamAPIEndpoint + `${data.teamID}`,
      null,
      'PUT',
      token,
      cleanObject(validKeys, data)
    );
  }

  deleteTeam(token: string, id: number) {
    return axiosRequest(this.teamAPIEndpoint + `${id}`, null, 'DELETE', token);
  }

  changeStatus(token: string, data: ITeamUpdateStatus) {
    const validKeys = ['isActive'];
    return axiosRequest(
      this.teamAPIEndpoint + `${data.teamID}` + '/status',
      null,
      'PUT',
      token,
      cleanObject(validKeys, data)
    );
  }

  addUserToTeam(token: string, data: ITeamWithUser) {
    const validKeys = ['userId', 'role', 'isOwner'];
    return axiosRequest(
      this.teamAPIEndpoint + `${data.teamID}` + '/users',
      null,
      'POST',
      token,
      cleanObject(validKeys, data)
    );
  }

  updateUserInTeam(token: string, data: ITeamWithUser) {
    const validKeys = ['userId', 'role', 'isOwner'];
    return axiosRequest(
      this.teamAPIEndpoint + `${data.teamID}` + '/users',
      null,
      'PUT',
      token,
      cleanObject(validKeys, data)
    );
  }
  removeUserFromTeam(token: string, data: ITeamDeleteUser) {
    const validKeys = ['userId'];
    return axiosRequest(
      this.teamAPIEndpoint + `${data.teamID}` + '/users',
      null,
      'DELETE',
      token,
      cleanObject(validKeys, data)
    );
  }
}

export default new TeamAPI();
