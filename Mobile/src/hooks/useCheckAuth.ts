import { selectIsAuth } from '@src/features/auth/authenSlice';
import { useAppSelector } from './reduxHooks';

export default function useCheckAuth() {
  const isAuth = useAppSelector(selectIsAuth);

  return !!isAuth;
}
