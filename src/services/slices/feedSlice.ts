import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';

export interface TFeedsState {
  orders: Array<TOrder>;
  total: number;
  totalToday: number;
  isLoading: boolean;
  error?: string | null;
}

const initialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: undefined
};

export const getAllFeeds = createAsyncThunk(
  'orders/getAll',
  async () => await getFeedsApi()
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    selectOrdersFeeds: (state) => state.orders,
    selectTotalFeeds: (state) => state.total,
    selectTotalTodayFeeds: (state) => state.totalToday,
    selectIsLoadingFeeds: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllFeeds.rejected, (state, action) => {
        state = initialState;
        state.error = action.error.message;
      })
      .addCase(getAllFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getAllFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
      });
  }
});

export const feedsReducer = feedsSlice.reducer;

export const {
  selectOrdersFeeds,
  selectIsLoadingFeeds,
  selectTotalFeeds,
  selectTotalTodayFeeds
} = feedsSlice.selectors;
