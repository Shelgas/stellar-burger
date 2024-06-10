import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { selectUser } from '../../services/slices/userSlice';

export const AppHeader: FC = () => {
  const name = useSelector(selectUser).name;
  return <AppHeaderUI userName={name} />;
};
