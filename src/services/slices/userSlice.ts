import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TUser } from '@utils-types';
import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

export interface TUserState {
  user: TUser;
  isAuth: boolean;
  isLoading: boolean;
  error?: string | null;
  isAuthChecked: boolean;
}

const initialState: TUserState = {
  user: {
    email: '',
    name: ''
  },
  isLoading: true,
  isAuth: false,
  isAuthChecked: false
};

export const getUser = createAsyncThunk(
  'user/getUser',
  async () => await getUserApi()
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => await registerUserApi(data)
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  const response = await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
  return response;
});

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (data: Partial<TRegisterData>) => await updateUserApi(data)
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuth: (state) => state.isAuth,
    selectError: (state) => state.error,
    selectUserName: (state) => state.user.name,
    selectIsAuthChecked: (state) => state.isAuthChecked
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.error = null;
        state.isLoading = true;
        state.isAuthChecked = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.error?.message;
        state.isAuthChecked = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isLoading = false;
      });
    builder
      .addCase(registerUser.pending, (state) => {
        state.error = null;
        state.isLoading = true;
        state.isAuthChecked = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error?.message;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
        state.isAuthChecked = true;
      });
    builder
      .addCase(loginUser.pending, (state) => {
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error?.message;
        state.isAuth = false;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isAuth = true;
      });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = { email: '', name: '' };
      state.isAuthChecked = true;
      state.isAuth = false;
    });
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.error = null;
        state.isLoading = true;
        state.isAuthChecked = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.error?.message;
        state.isAuthChecked = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
        state.isAuthChecked = true;
      });
  }
});

export const {
  selectIsAuth,
  selectUser,
  selectError,
  selectUserName,
  selectIsAuthChecked
} = userSlice.selectors;

export const userReducer = userSlice.reducer;
