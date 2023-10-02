import axios, { AxiosResponse } from 'axios';
import https from 'https'

const baseUrl = process.env.NEXT_PUBLIC_BE_BASE_URL!;

const HTTP = axios.create({
  baseURL: baseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  httpsAgent: new https.Agent({
   rejectUnauthorized: false,
  }),
});
HTTP.interceptors.request.use(
  (config: any) => {
    return config;
  },
  async (error: any) => {
    console.log('HTTP.interceptors', error);
    Promise.reject(error);
  },
);

const responseBody = (response: AxiosResponse) => response.data;

export const getRequest = async (url: string, params: any = {}) => {
  try {
    let res = await HTTP.post(url,{ params });
    return responseBody(res);
  } catch (error) {
    console.error('getRequest', error);
    throw error;
  }
};

export const postRequest = async (url: string, body: {}) => {
  try {
    let res = await axios.post(`${baseUrl}${url}`, body);
    return responseBody(res);
  } catch (error) {
    console.error('postRequest', error);
    throw error;
  }
};
