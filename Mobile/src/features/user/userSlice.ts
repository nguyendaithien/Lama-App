import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@src/configs/redux/store';
import userAPI from './userAPI';
import { getToken } from '@src/utils/tokenUtil';
import {
  IUserBodyRequest,
  IUpdateStatusUser,
  IParamGetUsers,
  IUser,
  IUserBodyRequestCreate
} from '@src/models/user';
import MESSAGES from '@src/configs/constant/messages';

export interface IUserSlice {
  users: Array<IUser>;
  user: IUser;

  //status for get infor of Admin
  isFetchingGetAdminInfor: boolean;
  fetchGetAdminInforMsg: any;

  //status for get users
  isFetchingGetUsers: boolean;
  fetchGetUsersMsg: any;

  //status for get infor Of User by ID
  isFetchingGetUserInforByID: boolean;
  fetchGetUserInforByIDMsg: any;

  //status for create new user
  isCreatingNewUser: boolean;
  fetchCreateNewUserMsg: any;

  //status for update User
  isUpdatingUser: boolean;
  fetchUpdateUserMsg: any;

  //status for change status User
  isChangingStatusUser: boolean;
  fetchChangeStatusUserMsg: any;
}

const initialState: IUserSlice = {
  users: [],
  user: {},
  //status for get infor of Admin
  isFetchingGetAdminInfor: false,
  fetchGetAdminInforMsg: null,

  //status for get users
  isFetchingGetUsers: false,
  fetchGetUsersMsg: null,

  //status for get infor Of User by ID
  isFetchingGetUserInforByID: false,
  fetchGetUserInforByIDMsg: null,

  //status for create new user
  isCreatingNewUser: false,
  fetchCreateNewUserMsg: null,

  //status for update User
  isUpdatingUser: false,
  fetchUpdateUserMsg: null,

  //status for change status User
  isChangingStatusUser: false,
  fetchChangeStatusUserMsg: null
};

export const fetchGetAdminInfor = createAsyncThunk(
  'user/fetchGetAdminInfor',
  async (payload: any | null, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await userAPI.getAdminInfor(token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchGetUsers = createAsyncThunk(
  'user/fetchGetUsers',
  async (param: IParamGetUsers, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await userAPI.getUsers(token, param);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchGetUserInforByID = createAsyncThunk(
  'user/fetchGetUserInforByID',
  async (payload: number, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await userAPI.getUserDetailByID(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchCreateNewUser = createAsyncThunk(
  'user/fetchCreateNewUser',
  async (payload: IUserBodyRequestCreate, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await userAPI.createUser(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchUpdateUser = createAsyncThunk(
  'user/fetchUpdateUser',
  async (payload: IUserBodyRequest, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await userAPI.updateUser(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchChangeStatusUser = createAsyncThunk(
  'user/fetchChangeStatusUser',
  async (payload: IUpdateStatusUser, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await userAPI.changeStatusUser(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      //hanle fetch get admin user
      .addCase(fetchGetAdminInfor.rejected, (state, action) => {
        state.user = {};
        state.isFetchingGetAdminInfor = false;
        state.fetchGetAdminInforMsg = action.payload || action.error.message;
      })
      .addCase(fetchGetAdminInfor.pending, (state, action) => {
        state.isFetchingGetAdminInfor = true;
        state.fetchGetAdminInforMsg = null;
      })
      .addCase(fetchGetAdminInfor.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isFetchingGetAdminInfor = false;
        state.fetchGetAdminInforMsg = null;
      })

      //handle fetch get users
      .addCase(fetchGetUsers.rejected, (state, action) => {
        state.users = [];
        state.isFetchingGetUsers = false;
        state.fetchGetUsersMsg = action.payload || action.error.message;
      })
      .addCase(fetchGetUsers.pending, (state, action) => {
        state.isFetchingGetUsers = true;
        state.fetchGetUsersMsg = null;
      })
      .addCase(fetchGetUsers.fulfilled, (state, action) => {
        state.users = action.payload.items;
        state.isFetchingGetUsers = false;
        state.fetchGetUsersMsg = null;
      })

      //handle fet get user by id
      .addCase(fetchGetUserInforByID.rejected, (state, action) => {
        state.user = {};
        state.isFetchingGetUserInforByID = false;
        state.fetchGetUserInforByIDMsg = action.payload || action.error.message;
      })
      .addCase(fetchGetUserInforByID.pending, (state, action) => {
        state.isFetchingGetUserInforByID = true;
        state.fetchGetUserInforByIDMsg = null;
      })
      .addCase(fetchGetUserInforByID.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isFetchingGetUserInforByID = false;
        state.fetchGetUserInforByIDMsg = null;
      })

      //handle fet create new user
      .addCase(fetchCreateNewUser.rejected, (state, action) => {
        state.user = {};
        state.isCreatingNewUser = false;
        state.fetchCreateNewUserMsg = action.payload || action.error.message;
      })
      .addCase(fetchCreateNewUser.pending, (state, action) => {
        state.isCreatingNewUser = true;
        state.fetchCreateNewUserMsg = null;
      })
      .addCase(fetchCreateNewUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isCreatingNewUser = false;
        state.fetchCreateNewUserMsg = MESSAGES.CREATE_SUCCESS;
      })

      //handle update user
      .addCase(fetchUpdateUser.rejected, (state, action) => {
        state.user = {};
        state.isUpdatingUser = false;
        state.fetchUpdateUserMsg = action.payload || action.error.message;
      })
      .addCase(fetchUpdateUser.pending, (state, action) => {
        state.isUpdatingUser = true;
        state.fetchUpdateUserMsg = null;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isUpdatingUser = false;
        state.fetchUpdateUserMsg = null;
      })

      //handle update user
      .addCase(fetchChangeStatusUser.rejected, (state, action) => {
        state.user = {};
        state.isChangingStatusUser = false;
        state.fetchChangeStatusUserMsg = action.payload || action.error.message;
      })
      .addCase(fetchChangeStatusUser.pending, (state, action) => {
        state.isChangingStatusUser = true;
        state.fetchChangeStatusUserMsg = null;
      })
      .addCase(fetchChangeStatusUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isChangingStatusUser = false;
        state.fetchChangeStatusUserMsg = null;
      });
  }
});

export const selectUserInfor = (state: RootState) => state.user.user;

export const selectUsers = (state: RootState) => state.user.users;

export default userSlice.reducer;
