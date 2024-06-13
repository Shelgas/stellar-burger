import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { selectUser, selectUserName } from '../../services/slices/userSlice';

export const AppHeader: FC = () => {
  const name = useSelector(selectUserName);
  return <AppHeaderUI userName={name} />;
};
