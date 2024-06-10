import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TOrder } from '@utils-types';

import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';

export interface TOrdersState {
  orders: Array<TOrder>;
  isLoading: boolean;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error?: string | null;
  totalToday: number;
}

const initialState: TOrdersState = {
  orders: [],
  isLoading: true,
  orderRequest: false,
  orderModalData: null,
  totalToday: 0
};

export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async () => await getOrdersApi()
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (data: string[]) => await orderBurgerApi(data)
);

export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (id: number) => await getOrderByNumberApi(id)
);

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      });
    builder
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.rejected, (state) => {
        state.isLoading = false;
      });
    builder
      .addCase(getOrderById.pending, (state) => {
        state.orderModalData = null;
        state.error = null;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.error = action.error?.message;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.orderModalData = action.payload.orders[0];
      });
  }
});

export const { selectOrderRequest, selectOrderModalData, selectOrders } =
  orderSlice.selectors;

export const { closeOrderModal } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
