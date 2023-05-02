import { AxiosRequestConfig } from 'axios';
import tokenService from '../../../common/authStorage';
import { HttpMiddleware } from './httpMiddleware';

export default class AuthMiddleware extends HttpMiddleware {
    async onRequest(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
        config.headers = {
            Authorization: `Bearer ${tokenService.getAccessToken()}`,
            ...config.headers,
        };

        return config;
    }
}
