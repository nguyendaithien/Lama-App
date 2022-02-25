import axios, { AxiosRequestConfig, Method } from 'axios';
import _ from 'lodash';

export const axiosRequest = (
  url: string,
  params: any = null,
  method: Method = 'GET',
  token: string = '',
  data: any = null
) => {
  const axiosConfig: AxiosRequestConfig = {
    url,
    params,
    method,
    data,
    headers: {}
  };
  if (token) {
    axiosConfig.headers!.Authorization = `Bearer ${token}`;
  }

  return axios(axiosConfig);
};

export const cleanObject = (keys: string[], data: any): any => {
  return _.pickBy(data, function (value, key) {
    return keys.includes(key);
  });
};
