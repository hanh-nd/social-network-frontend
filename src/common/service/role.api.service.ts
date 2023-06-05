import { IBodyResponse, IRole } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
class RoleApiService extends ApiService {
    async getRoles(): Promise<IBodyResponse<IRole[]>> {
        return await this.client.get(`${this.baseUrl}`);
    }
}
const roleApiService = new RoleApiService({ baseUrl: '/roles' }, axiosService);

export default roleApiService;
