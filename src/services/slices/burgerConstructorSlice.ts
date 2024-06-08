import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { TIngredient, TOrder, TConstructorIngredient } from '@utils-types';

import {
  getIngredientsApi,
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '../../utils/burger-api';

interface IBurgerConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: IBurgerConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBurgerIngredient: (state, action) => {
      if (action.payload.type === 'bun') state.bun = action.payload;
      else state.ingredients.push(action.payload);
    },
    moveBurgerIngredient: (state, action) => {
      const { index, step } = action.payload;
      [state.ingredients[index], state.ingredients[index + step]] = [
        state.ingredients[index + step],
        state.ingredients[index]
      ];
    },
    removeBurgerIngredient: (state, action) => {
      state.ingredients.splice(action.payload, 1);
    }
  },
  selectors: {
    selectBurgerIngredients: (state) => state
  }
});

export const {
  addBurgerIngredient,
  moveBurgerIngredient,
  removeBurgerIngredient
} = burgerConstructorSlice.actions;

export const { selectBurgerIngredients } = burgerConstructorSlice.selectors;
export const burgerConstructorReducer = burgerConstructorSlice.reducer;
