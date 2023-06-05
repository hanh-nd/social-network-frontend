import { IBodyResponse, IGetPostListQuery, IGetStatisticQuery, IPost, IStatistic } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
class AdminPostApiService extends ApiService {
    async getPostList(query?: IGetPostListQuery): Promise<IBodyResponse<IPost[]>> {
        return await this.client.get(`${this.baseUrl}`, {
            params: query,
        });
    }

    async getPostDetail(id: string): Promise<IBodyResponse<IPost>> {
        return await this.client.get(`${this.baseUrl}/${id}`);
    }

    async bulkDeletePost(body: { ids: string[] }): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/bulk-delete`, body);
    }

    async getPostStatistic(query?: IGetStatisticQuery): Promise<IBodyResponse<IStatistic>> {
        return await this.client.get(`${this.baseUrl}/statistic`, {
            params: query,
        });
    }
}
const adminPostApiService = new AdminPostApiService({ baseUrl: '/admin/posts' }, axiosService);

export default adminPostApiService;
