import { IBodyResponse, IGetGroupListQuery, IGetStatisticQuery, IGroup, IPost, IStatistic } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
class AdminGroupApiService extends ApiService {
    async getGroupList(query?: IGetGroupListQuery): Promise<IBodyResponse<IGroup[]>> {
        return await this.client.get(`${this.baseUrl}`, {
            params: query,
        });
    }

    async getGroupDetail(id: string): Promise<IBodyResponse<IGroup>> {
        return await this.client.get(`${this.baseUrl}/${id}`);
    }

    async bulkDeleteGroup(body: { ids: string[] }): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/bulk-delete`, body);
    }

    async getGroupStatistic(query?: IGetStatisticQuery): Promise<IBodyResponse<IStatistic>> {
        return await this.client.get(`${this.baseUrl}/statistic`, {
            params: query,
        });
    }
}
const adminGroupApiService = new AdminGroupApiService({ baseUrl: '/admin/groups' }, axiosService);

export default adminGroupApiService;
