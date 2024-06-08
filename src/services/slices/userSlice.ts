import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TUser } from '@utils-types';
import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  registerUserApi
} from '@api';

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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (state) => state,
    selectIsAuth: (state) => state.isAuth
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
        state.user = action.payload.user;
        state.isAuth = true;
      });
  }
});

export const { selectIsAuth, selectUser } = userSlice.selectors;

export const userReducer = userSlice.reducer;
