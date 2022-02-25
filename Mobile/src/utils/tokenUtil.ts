import CookieManager from '@react-native-cookies/cookies';
import { API_ENDPOINT } from '@env';

export const getToken = async (): Promise<string> => {
  const rs = await CookieManager.get(API_ENDPOINT);
  return rs.token.value;
};

export const setToken = (token: string): void => {
  // set a cookie
  CookieManager.set(API_ENDPOINT, {
    name: 'token',
    value: token
  });
};

export const clearToken = (): void => {
  CookieManager.set(API_ENDPOINT, {
    name: 'token',
    value: ''
  });
};
