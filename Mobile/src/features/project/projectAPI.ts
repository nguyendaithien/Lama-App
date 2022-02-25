import { API_ENDPOINT } from '@env';
import {
  IProjectAddCost,
  IProjectAddUser,
  IProjectChangeStatus,
  IProjectCreate,
  IProjectDeleteCost,
  IProjectDeleteUser,
  IProjectGetAllWithParam,
  IProjectUpdateCost,
  IProjectUpdateInfor,
  IProjectUpdateUser
} from '@src/models/project';
import { axiosRequest, cleanObject } from '@src/utils/requestServerUtil';
import { ImagePropTypes } from 'react-native';

class ProjectApi {
  projectApiEndpoint: string;
  constructor() {
    this.projectApiEndpoint = `${API_ENDPOINT}/projects/`;
  }

  createProject(token: string, data: IProjectCreate) {
    return axiosRequest(this.projectApiEndpoint, null, 'POST', token, data);
  }

  getProjects(token: string, param: IProjectGetAllWithParam) {
    return axiosRequest(this.projectApiEndpoint, param, 'GET', token);
  }

  getProjectDetailById(token: string, id: number) {
    return axiosRequest(this.projectApiEndpoint + `${id}`, null, 'GET', token);
  }

  updateProjectInfor(token: string, data: IProjectUpdateInfor) {
    const validKeys = ['name', 'description', 'avatar', 'income', 'startTime', 'endTime'];
    return axiosRequest(
      this.projectApiEndpoint + `${data.projectId}`,
      null,
      'PUT',
      token,
      cleanObject(validKeys, data)
    );
  }

  deleteProject(token: string, id: number) {
    return axiosRequest(this.projectApiEndpoint + `${id}`, null, 'DELETE', token);
  }

  changeStatusProject(token: string, data: IProjectChangeStatus) {
    const validKeys = ['status'];
    return axiosRequest(
      this.projectApiEndpoint + `${data.projectId}` + '/status',
      null,
      'PUT',
      token,
      cleanObject(validKeys, data)
    );
  }

  addUserToProject(token: string, data: IProjectAddUser) {
    const validKeys = ['userId', 'role', 'wage'];
    return axiosRequest(
      this.projectApiEndpoint + `${data.projectId}` + '/users',
      null,
      'POST',
      token,
      cleanObject(validKeys, data)
    );
  }

  updateUserInProject(token: string, data: IProjectUpdateUser) {
    const validKeys = ['userId', 'role', 'wage'];
    return axiosRequest(
      this.projectApiEndpoint + `${data.projectId}` + '/users',
      null,
      'PUT',
      token,
      cleanObject(validKeys, data)
    );
  }

  removeUserFromProject(token: string, data: IProjectDeleteUser) {
    const validKeys = ['userId'];
    return axiosRequest(
      this.projectApiEndpoint + `${data.projectId}` + '/users',
      null,
      'DELETE',
      token,
      cleanObject(validKeys, data)
    );
  }

  addCostToProject(token: string, data: IProjectAddCost) {
    const validKeys = ['title', 'value'];
    return axiosRequest(
      this.projectApiEndpoint + `${data.projectId}` + '/costs',
      null,
      'POST',
      token,
      cleanObject(validKeys, data)
    );
  }

  updateCostInProject(token: string, data: IProjectUpdateCost) {
    const validKeys = ['title', 'value'];
    return axiosRequest(
      this.projectApiEndpoint + `${data.projectId}` + '/costs/' + `${data.projectCostId}`,
      null,
      'PUT',
      token,
      cleanObject(validKeys, data)
    );
  }

  removeCostFromProject(token: string, data: IProjectDeleteCost) {
    return axiosRequest(
      this.projectApiEndpoint + `${data.projectId}` + '/costs/' + `${data.projectCostId}`,
      null,
      'DELETE',
      token
    );
  }
}

export default new ProjectApi();
