import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { TIngredient, TOrder, TConstructorIngredient } from '@utils-types';

import {
  getIngredientsApi,
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../../utils/burger-api';

interface IBurgerState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: IBurgerState = {
  bun: null,
  ingredients: []
};

const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {},
  selectors: {},
  extraReducers: (builder) => {}
});
