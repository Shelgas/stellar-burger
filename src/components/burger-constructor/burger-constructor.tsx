import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetBurgerIngredient,
  selectBurgerIngredients
} from '../../services/slices/burgerConstructorSlice';
import {
  createOrder,
  selectOrderModalData,
  selectOrderRequest,
  closeOrderModal as closeModal
} from '../../services/slices/ordersSlices';
import { AppDispatch } from '../../services/store';
import { getCookie } from '../../utils/cookie';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(selectBurgerIngredients);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!getCookie('accessToken')) return navigate('/login');
    if (!constructorItems.bun || orderRequest) return;
    dispatch(
      createOrder([
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((item) => item._id),
        constructorItems.bun._id
      ])
    );
  };
  const closeOrderModal = () => {
    dispatch(closeModal());
    dispatch(resetBurgerIngredient());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
