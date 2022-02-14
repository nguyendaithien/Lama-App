import { useAppSelector } from './reduxHooks';

export default function useCheckAppFirstLauch() {
  const isAppFirstLaunch = useAppSelector(state => state.app.isAppFirstLaunch);

  return !!isAppFirstLaunch;
}
