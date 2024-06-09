import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, useLocation } from 'react-router-dom';
import { selectIsAuth } from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuth = useSelector(selectIsAuth);
  const location = useLocation();

  if (onlyUnAuth && isAuth) {
    return <Route>{children}</Route>;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuth) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }
  return children;
};
