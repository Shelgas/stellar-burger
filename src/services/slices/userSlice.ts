import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TUser } from '@utils-types';
import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi
} from '@api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

export interface TUserState {
  user: TUser;
  isAuth: boolean;
  isLoading: boolean;
  error?: string | null;
}

const initialState: TUserState = {
  user: {
    email: '',
    name: ''
  },
  isLoading: true,
  isAuth: false
};

export const getUser = createAsyncThunk(
  'user/getUser',
  async () => await getUserApi()
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => await loginUserApi(data)
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => await registerUserApi(data)
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async () => await logoutApi()
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuth: (state) => state.isAuth,
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.error?.message;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
      });
    builder
      .addCase(registerUser.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error?.message;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
      });
    builder
      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error?.message;
        state.isAuth = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
        state.user = action.payload.user;
        state.isAuth = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      });
  }
});

export const { selectIsAuth, selectUser, selectError } = userSlice.selectors;

export const userReducer = userSlice.reducer;
