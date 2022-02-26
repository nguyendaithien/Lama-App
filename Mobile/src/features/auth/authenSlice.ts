import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@src/configs/redux/store';
import authenApi from './authenApi';
import { ILoginBody, IChangePasswordBody, IAuthRegister } from '@src/models/auth';
import { getToken, setToken, clearToken } from '@src/utils/tokenUtil';
import { IUser } from '@src/models/user';
import MESSAGES from '@src/configs/constant/messages';

export interface IAuthenState {
  isAuth: boolean;
  userInfo: IUser;
  isAlreadyLogin: boolean;

  isFetchingLogin: boolean;
  fetchLoginMsg: any;

  isFetchingRegister: boolean;
  fetchRegisterMsg: any;

  isFetchingChangePassword: boolean;
  fetchChangePasswordMsg: any;

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

  //logout
  isLoggingout: false,

  //register
  isFetchingRegister: false,
  fetchRegisterMsg: null
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

export const fetchRegister = createAsyncThunk(
  'auth/fetchRegister',
  async (payload: IAuthRegister, { rejectWithValue }) => {
    try {
      const response = await authenApi.register(payload);
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

      //handle register
      .addCase(fetchRegister.rejected, (state, action) => {
        state.isFetchingRegister = false;
        state.fetchRegisterMsg = action.payload || action.error.message;
      })
      .addCase(fetchRegister.pending, state => {
        state.isFetchingRegister = true;
        state.fetchRegisterMsg = null;
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.isFetchingRegister = false;
        state.fetchRegisterMsg = MESSAGES.REGISTER_SUCCESS;
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

export const selectIsFetchingGetDeviceByID = (state: RootState) => {
  return state.auth.isFetchingLogin;
};

export default authenSlice.reducer;
