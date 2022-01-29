import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@src/configs/redux/store';
export interface IAppState {
  isAppFirstLaunch: boolean;
  themeType: 'light' | 'dark';
  indexOfGatewayShowOnHomeScreen?: number;
  indexOfNodeShowOnHomeScreen: number;
  deviceShowOnHomeScreen: number;
}

const initialState: IAppState = {
  isAppFirstLaunch: true,
  themeType: 'light',
  indexOfGatewayShowOnHomeScreen: 0,
  indexOfNodeShowOnHomeScreen: 0,
  deviceShowOnHomeScreen: 0
};
export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,

  reducers: {
    passAppFirstLaunch(state) {
      state.isAppFirstLaunch = false;
    },
    toggleThemeType(state) {
      state.themeType = state.themeType === 'light' ? 'dark' : 'light';
    },
    //handle device show on home screen
    changeDeviceShowOnHomeCreen(state, action: PayloadAction<number>) {
      state.deviceShowOnHomeScreen = action.payload;
    },
    changeIndexOfNodeShowOnHomeScreen(state, action: PayloadAction<number>) {
      state.indexOfNodeShowOnHomeScreen = action.payload;
    },
    changeIndexOfGatewayShowOnHomeScreen(state, action: PayloadAction<number>) {
      state.indexOfGatewayShowOnHomeScreen = action.payload;
    }
  }
});

export const {
  passAppFirstLaunch,
  toggleThemeType,
  changeDeviceShowOnHomeCreen,
  changeIndexOfGatewayShowOnHomeScreen,
  changeIndexOfNodeShowOnHomeScreen
} = appSlice.actions;

export const selectThemeType = (state: RootState) => state.app.themeType;

export const selectIndexOfGatewayShowOnHomeScreen = (state: RootState) =>
  state.app.indexOfGatewayShowOnHomeScreen;

export const selectIndexOfNodeShowOnHomeScreen = (state: RootState) =>
  state.app.indexOfNodeShowOnHomeScreen;

export const selectIdDeviceShowOnHomeScreen = (state: RootState) =>
  state.app.deviceShowOnHomeScreen;

export default appSlice.reducer;
