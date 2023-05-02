import { IBodyResponse, IUpdateProfileBody } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
class UserApiService extends ApiService {
    async updateProfile(body: IUpdateProfileBody): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/update-profile`, body);
    }
}
const userApiService = new UserApiService({ baseUrl: '/users' }, axiosService);

export default userApiService;
