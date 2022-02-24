import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@src/configs/redux/store';
import { getToken } from '@src/utils/tokenUtil';
import ProjectApi from './projectAPI';
import MESSAGES from '@src/configs/constant/messages';
import {
  IProject,
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
import projectAPI from './projectAPI';

export interface IProjectSlice {
  projects: Array<IProject>;
  project: IProject;

  //status for create new Project
  isFetchingCreateNewProject: boolean;
  fetchCreateNewProjectMsg: any;

  //status for get Projects
  isFetchingGetProjects: boolean;
  fetchGetProjectsMsg: any;

  //status for get infor of Project by id
  isFetchingGetProject: boolean;
  fetchGetProjectMsg: any;

  //status for update Project
  isFetchingUpdateProject: boolean;
  fetchUpdateProjectMsg: any;

  //status for delete Project
  isFetchingDeleteProject: boolean;
  fetchDeleteProjectMsg: any;

  //status change status
  isFetchingChangeProjectStatus: boolean;
  fetchChangeProjectStatusMsg: any;

  //status add user
  isFetchingAddUserToProject: boolean;
  fetchAddUserToProjectMsg: any;

  //status update user
  isFetchingUpdateUserInProject: boolean;
  fetchUpdateUserFromProject: any;

  //remove user from Project
  isFetchingRemoveUserFromProject: boolean;
  fetchRemoveUserFromProjectMsg: any;

  //add cost
  isFetchingAddCostToProject: boolean;
  fetchAddCostToProjectMsg: any;

  //update cost in project
  isFetchingUpdateCostInProject: boolean;
  fetchUpdateCostInProjectMsg: any;

  //remove cost in project
  isFetchingRemoveCostInProject: boolean;
  fetchRemoveCostInProjectMsg: any;
}

const initialState: IProjectSlice = {
  projects: [],
  project: {},

  //status for create new Project
  isFetchingCreateNewProject: false,
  fetchCreateNewProjectMsg: null,

  //status for get Projects
  isFetchingGetProjects: false,
  fetchGetProjectsMsg: null,

  //status for get infor of Project by id
  isFetchingGetProject: false,
  fetchGetProjectMsg: null,

  //status for update Project
  isFetchingUpdateProject: false,
  fetchUpdateProjectMsg: null,

  //status for delete Project
  isFetchingDeleteProject: false,
  fetchDeleteProjectMsg: null,

  //status change status
  isFetchingChangeProjectStatus: false,
  fetchChangeProjectStatusMsg: null,

  //status add user
  isFetchingAddUserToProject: false,
  fetchAddUserToProjectMsg: null,

  //status update user
  isFetchingUpdateUserInProject: false,
  fetchUpdateUserFromProject: null,

  //remove user from Project
  isFetchingRemoveUserFromProject: false,
  fetchRemoveUserFromProjectMsg: null,

  //add cost
  isFetchingAddCostToProject: false,
  fetchAddCostToProjectMsg: null,

  //update cost in project
  isFetchingUpdateCostInProject: false,
  fetchUpdateCostInProjectMsg: null,

  //remove cost in project
  isFetchingRemoveCostInProject: false,
  fetchRemoveCostInProjectMsg: null
};

export const fetchCreateNewProject = createAsyncThunk(
  'project/fetchCreateNewProject',
  async (payload: IProjectCreate, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await projectAPI.createProject(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchGetProjects = createAsyncThunk(
  'project/fetchGetProjects',
  async (param: IProjectGetAllWithParam, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await projectAPI.getProjects(token, param);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchGetProjectDetail = createAsyncThunk(
  'project/fetchGetProjectDetail',
  async (payload: number, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await projectAPI.getProjectDetailById(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchUpdateProject = createAsyncThunk(
  'project/fetchUpdateProject',
  async (payload: IProjectUpdateInfor, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await projectAPI.updateProjectInfor(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchDeleteProject = createAsyncThunk(
  'project/fetchDeleteProject',
  async (payload: number, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await projectAPI.deleteProject(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchChangeProjectStatus = createAsyncThunk(
  'project/fetchChangeProjectStatus',
  async (payload: IProjectChangeStatus, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await projectAPI.changeStatusProject(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchAddUserToProject = createAsyncThunk(
  'project/fetchAddUserToProject',
  async (payload: IProjectAddUser, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await projectAPI.addUserToProject(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchUpdateUserFromProject = createAsyncThunk(
  'project/fetchUpdateUserFromProject',
  async (payload: IProjectUpdateUser, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await projectAPI.updateUserInProject(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchRemoveUserFromProject = createAsyncThunk(
  'project/fetchRemoveUserFromProject',
  async (payload: IProjectDeleteUser, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await projectAPI.removeUserFromProject(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchAddCostToProject = createAsyncThunk(
  'project/fetchAddCostToProject',
  async (payload: IProjectAddCost, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await projectAPI.addCostToProject(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchUpdateCostFromProject = createAsyncThunk(
  'project/fetchUpdateCostFromProject',
  async (payload: IProjectUpdateCost, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await projectAPI.updateCostInProject(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchRemoveCostFromProject = createAsyncThunk(
  'project/fetchRemoveCostFromProject',
  async (payload: IProjectDeleteCost, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await projectAPI.removeCostFromProject(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // handle create new Project
      .addCase(fetchCreateNewProject.rejected, (state, action) => {
        state.project = {};
        state.isFetchingCreateNewProject = false;
        state.fetchCreateNewProjectMsg = action.payload || action.error.message;
      })
      .addCase(fetchCreateNewProject.pending, (state, action) => {
        state.isFetchingCreateNewProject = true;
        state.fetchCreateNewProjectMsg = null;
      })
      .addCase(fetchCreateNewProject.fulfilled, (state, action) => {
        state.project = action.payload;
        state.isFetchingCreateNewProject = false;
        state.fetchCreateNewProjectMsg = MESSAGES.CREATE_SUCCESS;
      })

      //handle get Projects
      .addCase(fetchGetProjects.rejected, (state, action) => {
        state.projects = [];
        state.isFetchingGetProjects = false;
        state.fetchGetProjectsMsg = action.payload || action.error.message;
      })
      .addCase(fetchGetProjects.pending, (state, action) => {
        state.isFetchingGetProjects = true;
        state.fetchGetProjectsMsg = null;
      })
      .addCase(fetchGetProjects.fulfilled, (state, action) => {
        state.projects = action.payload.items;
        state.isFetchingGetProjects = false;
        state.fetchGetProjectsMsg = null;
      })

      //handle fet get Project by id
      .addCase(fetchGetProjectDetail.rejected, (state, action) => {
        state.project = {};
        state.isFetchingGetProject = false;
        state.fetchGetProjectMsg = action.payload || action.error.message;
      })
      .addCase(fetchGetProjectDetail.pending, (state, action) => {
        state.isFetchingGetProject = true;
        state.fetchGetProjectMsg = null;
      })
      .addCase(fetchGetProjectDetail.fulfilled, (state, action) => {
        state.project = action.payload;
        state.isFetchingGetProject = false;
        state.fetchGetProjectMsg = null;
      })

      //handle update Project
      .addCase(fetchUpdateProject.rejected, (state, action) => {
        state.project = {};
        state.isFetchingUpdateProject = false;
        state.fetchUpdateProjectMsg = action.payload || action.error.message;
      })
      .addCase(fetchUpdateProject.pending, (state, action) => {
        state.isFetchingUpdateProject = true;
        state.fetchUpdateProjectMsg = null;
      })
      .addCase(fetchUpdateProject.fulfilled, (state, action) => {
        state.project = action.payload;
        state.isFetchingUpdateProject = false;
        state.fetchUpdateProjectMsg = MESSAGES.UPDATE_SUCCESS;
      })

      //handle delete Project
      .addCase(fetchDeleteProject.rejected, (state, action) => {
        state.isFetchingDeleteProject = false;
        state.fetchDeleteProjectMsg = action.payload || action.error.message;
      })
      .addCase(fetchDeleteProject.pending, (state, action) => {
        state.isFetchingDeleteProject = true;
        state.fetchDeleteProjectMsg = null;
      })
      .addCase(fetchDeleteProject.fulfilled, (state, action) => {
        state.isFetchingDeleteProject = false;
        state.fetchDeleteProjectMsg = MESSAGES.DELETE_SUCCESS;
      })

      //handle change status
      .addCase(fetchChangeProjectStatus.rejected, (state, action) => {
        state.project = {};
        state.isFetchingChangeProjectStatus = false;
        state.fetchChangeProjectStatusMsg = action.payload || action.error.message;
      })
      .addCase(fetchChangeProjectStatus.pending, (state, action) => {
        state.isFetchingChangeProjectStatus = true;
        state.fetchChangeProjectStatusMsg = null;
      })
      .addCase(fetchChangeProjectStatus.fulfilled, (state, action) => {
        state.project = action.payload;
        state.isFetchingChangeProjectStatus = false;
        state.fetchChangeProjectStatusMsg = MESSAGES.UPDATE_SUCCESS;
      })

      //handle add user
      .addCase(fetchAddUserToProject.rejected, (state, action) => {
        state.project = {};
        state.isFetchingAddUserToProject = false;
        state.fetchAddUserToProjectMsg = action.payload || action.error.message;
      })
      .addCase(fetchAddUserToProject.pending, (state, action) => {
        state.isFetchingAddUserToProject = true;
        state.fetchAddUserToProjectMsg = null;
      })
      .addCase(fetchAddUserToProject.fulfilled, (state, action) => {
        state.project = action.payload;
        state.isFetchingAddUserToProject = false;
        state.fetchAddUserToProjectMsg = MESSAGES.ADD_SUCCESS;
      })

      //handle update user in Project
      .addCase(fetchUpdateUserFromProject.rejected, (state, action) => {
        state.project = {};
        state.isFetchingUpdateUserInProject = false;
        state.fetchUpdateUserFromProject = action.payload || action.error.message;
      })
      .addCase(fetchUpdateUserFromProject.pending, (state, action) => {
        state.isFetchingUpdateUserInProject = true;
        state.fetchUpdateUserFromProject = null;
      })
      .addCase(fetchUpdateUserFromProject.fulfilled, (state, action) => {
        state.project = action.payload;
        state.isFetchingUpdateUserInProject = false;
        state.fetchUpdateUserFromProject = MESSAGES.ADD_SUCCESS;
      })

      //handle remove user in Project
      .addCase(fetchRemoveUserFromProject.rejected, (state, action) => {
        state.project = {};
        state.isFetchingRemoveUserFromProject = false;
        state.fetchRemoveUserFromProjectMsg = action.payload || action.error.message;
      })
      .addCase(fetchRemoveUserFromProject.pending, (state, action) => {
        state.isFetchingRemoveUserFromProject = true;
        state.fetchRemoveUserFromProjectMsg = null;
      })
      .addCase(fetchRemoveUserFromProject.fulfilled, (state, action) => {
        state.project = action.payload;
        state.isFetchingRemoveUserFromProject = false;
        state.fetchRemoveUserFromProjectMsg = MESSAGES.DELETE_SUCCESS;
      })

      //handle add cost
      .addCase(fetchAddCostToProject.rejected, (state, action) => {
        state.project = {};
        state.isFetchingAddCostToProject = false;
        state.fetchAddCostToProjectMsg = action.payload || action.error.message;
      })
      .addCase(fetchAddCostToProject.pending, (state, action) => {
        state.isFetchingAddCostToProject = true;
        state.fetchAddCostToProjectMsg = null;
      })
      .addCase(fetchAddCostToProject.fulfilled, (state, action) => {
        state.project = action.payload;
        state.isFetchingAddCostToProject = false;
        state.fetchAddCostToProjectMsg = MESSAGES.ADD_SUCCESS;
      })

      //handle update Cost in Project
      .addCase(fetchUpdateCostFromProject.rejected, (state, action) => {
        state.project = {};
        state.isFetchingUpdateCostInProject = false;
        state.fetchUpdateCostInProjectMsg = action.payload || action.error.message;
      })
      .addCase(fetchUpdateCostFromProject.pending, (state, action) => {
        state.isFetchingUpdateCostInProject = true;
        state.fetchUpdateCostInProjectMsg = null;
      })
      .addCase(fetchUpdateCostFromProject.fulfilled, (state, action) => {
        state.project = action.payload;
        state.isFetchingUpdateCostInProject = false;
        state.fetchUpdateCostInProjectMsg = MESSAGES.ADD_SUCCESS;
      })

      //handle remove Cost in Project
      .addCase(fetchRemoveCostFromProject.rejected, (state, action) => {
        state.project = {};
        state.isFetchingRemoveCostInProject = false;
        state.fetchRemoveCostInProjectMsg = action.payload || action.error.message;
      })
      .addCase(fetchRemoveCostFromProject.pending, (state, action) => {
        state.isFetchingRemoveCostInProject = true;
        state.fetchRemoveCostInProjectMsg = null;
      })
      .addCase(fetchRemoveCostFromProject.fulfilled, (state, action) => {
        state.project = action.payload;
        state.isFetchingRemoveCostInProject = false;
        state.fetchRemoveCostInProjectMsg = MESSAGES.DELETE_SUCCESS;
      });
  }
});

export const selectProjects = (state: RootState) => state.team.teams;

export const selectTeamDetail = (state: RootState) => state.team.team;

export const selectCreateNewUserMsg = (state: RootState) => state.team.fetchCreateNewTeamMsg;

export default projectSlice.reducer;
