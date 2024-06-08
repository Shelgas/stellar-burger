import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TOrder } from '@utils-types';

import { getOrdersApi, orderBurgerApi } from '@api';

export interface TOrdersState {
  orders: Array<TOrder>;
  isLoading: boolean;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error?: string | null;
}

const initialState: TOrdersState = {
  orders: [],
  isLoading: true,
  orderRequest: false,
  orderModalData: null
};

export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async () => await getOrdersApi()
);

export const createOrtder = createAsyncThunk(
  'order/createOrder',
  async (data: string[]) => await orderBurgerApi(data)
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
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrtder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrtder.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createOrtder.pending, (state) => {
        state.orderRequest = true;
      })
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
  }
});

export const { selectOrderRequest, selectOrderModalData } =
  orderSlice.selectors;

export const { closeOrderModal } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
