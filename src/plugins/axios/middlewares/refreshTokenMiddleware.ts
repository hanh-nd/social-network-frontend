import { HttpStatus } from '@/common/constants';
import appApiService from '@/common/service/app.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import { AxiosError, AxiosInstance } from 'axios';
import localStorageAuthService from '../../../common/authStorage';
import { HttpMiddleware } from './httpMiddleware';

export default class RefreshTokenMiddleware extends HttpMiddleware {
    async onResponseError(err: AxiosError, http: AxiosInstance) {
        const response = err.response;
        if (!response?.status || +response.status !== HttpStatus.UNAUTHORIZED) {
            return Promise.reject(err);
        }
        return await this.refreshToken(err, http);
    }

    async refreshToken(err: AxiosError<any, any>, http: AxiosInstance) {
        try {
            const refreshToken = localStorageAuthService.getRefreshToken();
            if (!refreshToken) {
                localStorageAuthService.resetAll();
                return Promise.reject(err);
            }

            localStorageAuthService.setIsRefreshing(1);
            const response = await appApiService.refreshToken(refreshToken);
            if (response.data) {
                localStorageAuthService.setRefreshToken(response?.data?.refreshToken || '');
                localStorageAuthService.setAccessToken(response?.data?.accessToken || '');
                localStorageAuthService.setLoginUser(response?.data?.user || {});
                appModule.setLoginUser(response?.data?.user || {});

                delete err.config.headers!['Authorization'];
                const result = await http.request(err.config);
                return Promise.resolve({
                    data: result,
                });
            }
            return Promise.reject(err);
        } finally {
            localStorageAuthService.setIsRefreshing(0);
        }
    }
}
