import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@src/configs/redux/store';
import authenApi from './authenApi';
import { ILoginBody, IChangePasswordBody } from '@src/models/auth';
import { getToken, setToken, clearToken } from '@src/utils/tokenUtil';
import { IUser, IUserBodyRequest } from '@src/models/user';
import MESSAGES from '@src/configs/constant/messages';

export interface IAuthenState {
  isAuth: boolean;
  userInfo: IUser;
  isAlreadyLogin: boolean;

  isFetchingLogin: boolean;
  fetchLoginMsg: any;

  isFetchingChangePassword: boolean;
  fetchChangePasswordMsg: any;

  isFetchingGetInfo: boolean;
  fetchGetInfoMsg: any;

  isFetchingUpdateUserInfo: boolean;
  fetchUpdateUserInfoMsg: any;

  isLoggingout: boolean;
}

const initialState: IAuthenState = {
  isAuth: false,
  userInfo: {},
  isAlreadyLogin: false,

  // state for login reducer
  isFetchingLogin: false,
  fetchLoginMsg: null,

  // state for changePassword reducer
  isFetchingChangePassword: false,
  fetchChangePasswordMsg: null,

  // state for get info reducer
  isFetchingGetInfo: false,
  fetchGetInfoMsg: null,

  // state for update user info reducer
  isFetchingUpdateUserInfo: false,
  fetchUpdateUserInfoMsg: null,

  //logout
  isLoggingout: false
};

export const fetchLogin = createAsyncThunk(
  'auth/fetchLogin',
  async (payload: ILoginBody, { rejectWithValue }) => {
    try {
      const response = await authenApi.login(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchChangePassword = createAsyncThunk(
  'auth/fetchChangePassword',
  async (payload: IChangePasswordBody, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await authenApi.changePassword(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchGetInfo = createAsyncThunk(
  'auth/fetchGetInfo',
  async (payload: any | null, { rejectWithValue }) => {
    try {
      const token = await getToken();
      // console.log(token);
      const response = await authenApi.getInformation(token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchUpdateUserInfo = createAsyncThunk(
  'auth/fetchUpdateUserInfo',
  async (payload: IUserBodyRequest, { rejectWithValue }) => {
    try {
      const token = await getToken();
      const response = await authenApi.updateUserInfo(token, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const fetchLogout = createAsyncThunk(
  'auth/fetchLogout',
  async (payload: any | null, { rejectWithValue }) => {
    try {
      const response = await clearToken();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error?.response || error);
    }
  }
);

export const authenSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      clearToken();
      state.isAuth = false;
      state.userInfo = {};
    },
    changeStateAlreadyLogin(state) {
      state.isAlreadyLogin = !state.isAlreadyLogin;
    }
  },

  extraReducers: builder => {
    builder
      // Handle fetch login
      .addCase(fetchLogin.rejected, (state, action) => {
        state.isAuth = false;
        state.userInfo = {};
        state.isFetchingLogin = false;
        state.fetchLoginMsg = action.payload || action.error.message;
      })
      .addCase(fetchLogin.pending, state => {
        state.isFetchingLogin = true;
        state.fetchLoginMsg = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        setToken(action.payload.token);
        state.isAuth = true;
        state.isFetchingLogin = false;
        state.fetchLoginMsg = null;
        state.userInfo = action.payload.user;
        state.isAlreadyLogin = true;
      })

      // Handle fetch change password
      .addCase(fetchChangePassword.rejected, (state, action) => {
        state.isFetchingChangePassword = false;
        state.fetchChangePasswordMsg = action.payload || action.error.message;
      })
      .addCase(fetchChangePassword.pending, state => {
        state.isFetchingChangePassword = true;
        state.fetchChangePasswordMsg = null;
      })
      .addCase(fetchChangePassword.fulfilled, state => {
        state.fetchChangePasswordMsg = MESSAGES.UPDATE_SUCCESS;
        state.isFetchingChangePassword = false;
      })

      // Handle fetch get info
      .addCase(fetchGetInfo.rejected, (state, action) => {
        state.userInfo = {};
        state.isFetchingGetInfo = false;
        state.fetchGetInfoMsg = action.payload || action.error.message;
      })
      .addCase(fetchGetInfo.pending, state => {
        state.isFetchingGetInfo = true;
        state.fetchGetInfoMsg = null;
      })
      .addCase(fetchGetInfo.fulfilled, (state, action) => {
        state.isFetchingGetInfo = false;
        state.fetchGetInfoMsg = null;
        state.userInfo = action.payload.userInfor;
      })

      // Handle fetch update info
      .addCase(fetchUpdateUserInfo.rejected, (state, action) => {
        state.isFetchingUpdateUserInfo = false;
        state.fetchUpdateUserInfoMsg = action.payload || action.error.message;
      })
      .addCase(fetchUpdateUserInfo.pending, state => {
        state.isFetchingUpdateUserInfo = true;
        state.fetchUpdateUserInfoMsg = null;
      })
      .addCase(fetchUpdateUserInfo.fulfilled, (state, action) => {
        state.isFetchingUpdateUserInfo = false;
        state.fetchUpdateUserInfoMsg = MESSAGES.UPDATE_SUCCESS;
        state.userInfo = action.payload.userInfor;
      })

      // Handle fetch logout
      .addCase(fetchLogout.rejected, (state, action) => {
        state.isLoggingout = false;
      })
      .addCase(fetchLogout.pending, state => {
        state.isLoggingout = true;
      })
      .addCase(fetchLogout.fulfilled, (state, action) => {
        state.isLoggingout = false;
        state.isAuth = false;
        state.userInfo = {};
      });
  }
});

export const { logout, changeStateAlreadyLogin } = authenSlice.actions;

export const selectIsAuth = (state: RootState) => state.auth.isAuth;

export const selectUserInfo = (state: RootState) => state.auth.userInfo;

export const selectIsFetchingGetDeviceByID = (state: RootState) => {
  return state.auth.isFetchingLogin;
};

export default authenSlice.reducer;
