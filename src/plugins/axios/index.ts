import axios, { AxiosRequestConfig } from 'axios';
import AuthMiddleware from './middlewares/authMiddleware';
import CommonMiddleware from './middlewares/commonMiddleware';
import RefreshTokenMiddleware from './middlewares/refreshTokenMiddleware';
import HttpMiddlewareService from './service';

const options: AxiosRequestConfig = {
    baseURL: process.env.VUE_APP_API_URL,
    responseType: 'json',
};

const axiosInstance = axios.create(options);

const axiosService = new HttpMiddlewareService(axiosInstance);
axiosService.register([new AuthMiddleware(), new RefreshTokenMiddleware(), new CommonMiddleware()]);

export default axiosInstance;
