import { IBodyResponse, IUser } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import { ILoginForm, ILoginResponse, IRegisterForm } from '@/pages/auth/interface';
import axiosService from '@/plugins/axios';
class AppApiService extends ApiService {
    async refreshToken(refreshToken: string): Promise<IBodyResponse<ILoginResponse>> {
        return await this.client.post('/refresh-token', undefined, {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        });
    }

    async login(data: ILoginForm): Promise<IBodyResponse<ILoginResponse>> {
        return await this.client.post('/login', data);
    }

    async logout(): Promise<IBodyResponse<boolean>> {
        return await this.client.post('/logout');
    }

    async register(data: IRegisterForm): Promise<IBodyResponse<ILoginResponse>> {
        return await this.client.post('/register', data);
    }

    async getUserProfile(): Promise<IBodyResponse<IUser>> {
        return await this.client.get(`/users/me`);
    }

    async ping(): Promise<IBodyResponse<void>> {
        return await this.client.get(`/ping`);
    }
}
const appApiService = new AppApiService({ baseUrl: '/' }, axiosService);

export default appApiService;
