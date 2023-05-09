import { IBodyResponse, ILoginForm, ILoginResponse, IUser } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
class AppApiService extends ApiService {
    async login(data: ILoginForm): Promise<IBodyResponse<ILoginResponse>> {
        return await this.client.post('/login', data);
    }

    async getUserProfile(): Promise<IBodyResponse<IUser>> {
        return await this.client.get(`/users/me`);
    }
}
const appApiService = new AppApiService({ baseUrl: '/' }, axiosService);

export default appApiService;
