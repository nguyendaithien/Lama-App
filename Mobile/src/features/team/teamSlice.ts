import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@src/configs/redux/store';
import { getToken } from '@src/utils/tokenUtil';
import teamAPI from './teamAPI';
import MESSAGES from '@src/configs/constant/messages';
import {
  ITeamParamGetTeams,
  ITeam,
  ITeamBodyRequest,
  ITeamCreateRequest,
  ITeamUpdateStatus,
  ITeamWithUser,
  ITeamDeleteUser
} from '@src/models/team';

export interface ITeamSlice {
  teams: Array<ITeam>;
  team: ITeam;

  //status for create new team
  isFetchingCreateNewTeam: boolean;
  fetchCreateNewTeamMsg: any;

  //status for get teams
  isFetchingGetTeams: boolean;
  fetchGetTeamsMsg: any;

  //status for get infor of team by id
  isFetchingGetTeam: boolean;
  fetchGetTeamMsg: any;

  //status for update team
  isFetchingUpdateTeam: boolean;
  fetchUpdateTeamMsg: any;

  //status for delete team
  isFetchingDeleteTeam: boolean;
  fetchDeleteTeamMsg: any;

  //status change status
  isFetchingChangeTeamStatus: boolean;
  fetchChangeTeamStatusMsg: any;

  //status add user
  isFetchingAddUserToTeam: boolean;
  fetchAddUserToTeamMsg: any;

  //status update user
  isFetchingUpdateUserInTeam: boolean;
  fetchUpdateUserFromteam: any;

  //remove user from team
  isFetchingRemoveUserFromTeam: boolean;
  fetchRemoveUserFromTeamMsg: any;
}

const initialState: ITeamSlice = {
  teams: [],
  team: {},

  //status for create new team
  isFetchingCreateNewTeam: false,
  fetchCreateNewTeamMsg: null,

  //status for get teams
  isFetchingGetTeams: false,
  fetchGetTeamsMsg: null,

  //status for get infor of team by id
  isFetchingGetTeam: false,
  fetchGetTeamMsg: null,

  //status for update team
  isFetchingUpdateTeam: false,
  fetchUpdateTeamMsg: null,

  //status for delete team
  isFetchingDeleteTeam: false,
  fetchDeleteTeamMsg: null,

  //status change status
  isFetchingChangeTeamStatus: false,
  fetchChangeTeamStatusMsg: null,
  //status add user
  isFetchingAddUserToTeam: false,
  fetchAddUserToTeamMsg: null,

  //status update user
  isFetchingUpdateUserInTeam: false,
  fetchUpdateUserFromteam: null,

  //remove user from team
  isFetchingRemoveUserFromTeam: false,
  fetchRemoveUserFromTeamMsg: null
};

export const fetchCreateNewTeam = createAsyncThunk(
  'team/fetchCreateNewTeam',
  async (payload: ITeamCreateRequest, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await teamAPI.createNewTeam(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchGetTeams = createAsyncThunk(
  'team/fetchGetTeams',
  async (param: ITeamParamGetTeams, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await teamAPI.getTeams(token, param);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchGetTeam = createAsyncThunk(
  'team/fetchGetTeam',
  async (payload: number, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await teamAPI.getTeamDetailByID(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchUpdateTeam = createAsyncThunk(
  'team/fetchUpdateTeam',
  async (payload: ITeamBodyRequest, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await teamAPI.updateTeamInfor(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchDeleteTeam = createAsyncThunk(
  'team/fetchDeleteTeam',
  async (payload: number, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await teamAPI.deleteTeam(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchChangeTeamStatus = createAsyncThunk(
  'team/fetchChangeTeamStatus',
  async (payload: ITeamUpdateStatus, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await teamAPI.changeStatus(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchAddUserToTeam = createAsyncThunk(
  'team/fetchAddUserToTeam',
  async (payload: ITeamWithUser, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await teamAPI.addUserToTeam(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchUpdateUserFromTeam = createAsyncThunk(
  'team/fetchUpdateUserFromteam',
  async (payload: ITeamWithUser, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await teamAPI.updateUserInTeam(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchRemoveUserFromTeam = createAsyncThunk(
  'team/fetchRemoveUserFromTeam',
  async (payload: ITeamDeleteUser, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await teamAPI.removeUserFromTeam(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const userSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    // setMessageNull
  },
  extraReducers: builder => {
    builder
      // handle create new team
      .addCase(fetchCreateNewTeam.rejected, (state, action) => {
        state.team = {};
        state.isFetchingCreateNewTeam = false;
        state.fetchCreateNewTeamMsg = action.payload || action.error.message;
      })
      .addCase(fetchCreateNewTeam.pending, (state, action) => {
        state.isFetchingCreateNewTeam = true;
        state.fetchCreateNewTeamMsg = null;
      })
      .addCase(fetchCreateNewTeam.fulfilled, (state, action) => {
        state.team = action.payload;
        state.isFetchingCreateNewTeam = false;
        state.fetchCreateNewTeamMsg = MESSAGES.CREATE_SUCCESS;
      })

      //handle get teams
      .addCase(fetchGetTeams.rejected, (state, action) => {
        state.teams = [];
        state.isFetchingGetTeams = false;
        state.fetchGetTeamsMsg = action.payload || action.error.message;
      })
      .addCase(fetchGetTeams.pending, (state, action) => {
        state.isFetchingGetTeams = true;
        state.fetchGetTeamsMsg = null;
      })
      .addCase(fetchGetTeams.fulfilled, (state, action) => {
        state.teams = action.payload.items;
        state.isFetchingGetTeams = false;
        state.fetchGetTeamsMsg = null;
      })

      //handle fet get team by id
      .addCase(fetchGetTeam.rejected, (state, action) => {
        state.team = {};
        state.isFetchingGetTeam = false;
        state.fetchGetTeamMsg = action.payload || action.error.message;
      })
      .addCase(fetchGetTeam.pending, (state, action) => {
        state.isFetchingGetTeam = true;
        state.fetchGetTeamMsg = null;
      })
      .addCase(fetchGetTeam.fulfilled, (state, action) => {
        state.team = action.payload;
        state.isFetchingGetTeam = false;
        state.fetchGetTeamMsg = null;
      })

      //handle update team
      .addCase(fetchUpdateTeam.rejected, (state, action) => {
        state.team = {};
        state.isFetchingUpdateTeam = false;
        state.fetchUpdateTeamMsg = action.payload || action.error.message;
      })
      .addCase(fetchUpdateTeam.pending, (state, action) => {
        state.isFetchingUpdateTeam = true;
        state.fetchUpdateTeamMsg = null;
      })
      .addCase(fetchUpdateTeam.fulfilled, (state, action) => {
        state.team = action.payload;
        state.isFetchingUpdateTeam = false;
        state.fetchUpdateTeamMsg = MESSAGES.UPDATE_SUCCESS;
      })

      //handle delete team
      .addCase(fetchDeleteTeam.rejected, (state, action) => {
        state.isFetchingDeleteTeam = false;
        state.fetchDeleteTeamMsg = action.payload || action.error.message;
      })
      .addCase(fetchDeleteTeam.pending, (state, action) => {
        state.isFetchingDeleteTeam = true;
        state.fetchDeleteTeamMsg = null;
      })
      .addCase(fetchDeleteTeam.fulfilled, (state, action) => {
        state.isFetchingDeleteTeam = false;
        state.fetchDeleteTeamMsg = MESSAGES.DELETE_SUCCESS;
      })

      //handle change status
      .addCase(fetchChangeTeamStatus.rejected, (state, action) => {
        state.team = {};
        state.isFetchingUpdateTeam = false;
        state.fetchUpdateTeamMsg = action.payload || action.error.message;
      })
      .addCase(fetchChangeTeamStatus.pending, (state, action) => {
        state.isFetchingUpdateTeam = true;
        state.fetchUpdateTeamMsg = null;
      })
      .addCase(fetchChangeTeamStatus.fulfilled, (state, action) => {
        state.team = action.payload;
        state.isFetchingUpdateTeam = false;
        state.fetchUpdateTeamMsg = MESSAGES.UPDATE_SUCCESS;
      })

      //handle change status
      .addCase(fetchAddUserToTeam.rejected, (state, action) => {
        state.team = {};
        state.isFetchingUpdateTeam = false;
        state.fetchUpdateTeamMsg = action.payload || action.error.message;
      })
      .addCase(fetchAddUserToTeam.pending, (state, action) => {
        state.isFetchingUpdateTeam = true;
        state.fetchUpdateTeamMsg = null;
      })
      .addCase(fetchAddUserToTeam.fulfilled, (state, action) => {
        state.team = action.payload;
        state.isFetchingUpdateTeam = false;
        state.fetchUpdateTeamMsg = MESSAGES.ADD_SUCCESS;
      })

      //handle update user in team
      .addCase(fetchUpdateUserFromTeam.rejected, (state, action) => {
        state.team = {};
        state.isFetchingUpdateTeam = false;
        state.fetchUpdateTeamMsg = action.payload || action.error.message;
      })
      .addCase(fetchUpdateUserFromTeam.pending, (state, action) => {
        state.isFetchingUpdateTeam = true;
        state.fetchUpdateTeamMsg = null;
      })
      .addCase(fetchUpdateUserFromTeam.fulfilled, (state, action) => {
        state.team = action.payload;
        state.isFetchingUpdateTeam = false;
        state.fetchUpdateTeamMsg = MESSAGES.ADD_SUCCESS;
      })

      //handle update user in team
      .addCase(fetchRemoveUserFromTeam.rejected, (state, action) => {
        state.team = {};
        state.isFetchingUpdateTeam = false;
        state.fetchUpdateTeamMsg = action.payload || action.error.message;
      })
      .addCase(fetchRemoveUserFromTeam.pending, (state, action) => {
        state.isFetchingUpdateTeam = true;
        state.fetchUpdateTeamMsg = null;
      })
      .addCase(fetchRemoveUserFromTeam.fulfilled, (state, action) => {
        state.team = action.payload;
        state.isFetchingUpdateTeam = false;
        state.fetchUpdateTeamMsg = MESSAGES.DELETE_SUCCESS;
      });
  }
});

export const selectTeams = (state: RootState) => state.team.teams;

export const selectTeamDetail = (state: RootState) => state.team.team;

export const selectCreateNewUserMsg = (state: RootState) => state.team.fetchCreateNewTeamMsg;

export default userSlice.reducer;
