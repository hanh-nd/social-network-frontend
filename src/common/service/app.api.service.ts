import { IBodyResponse, ICustomer } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
class AppApiService extends ApiService {
    async getCustomerProfile(): Promise<IBodyResponse<ICustomer>> {
        return await this.client.get(`/users/me`);
    }
}
const appApiService = new AppApiService({ baseUrl: '/' }, axiosService);

export default appApiService;
