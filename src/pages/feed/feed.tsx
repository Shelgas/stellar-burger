import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllFeeds,
  selectOrdersFeeds
} from '../../services/slices/feedSlice';
import { AppDispatch } from '../../services/store';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(selectOrdersFeeds);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllFeeds());
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  function handleGetFeeds() {
    dispatch(getAllFeeds());
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(getAllFeeds())} />
  );
};
