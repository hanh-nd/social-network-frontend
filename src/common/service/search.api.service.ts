import { IBodyResponse, ISearchQuery, ISearchResults, IUser } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
class SearchApiService extends ApiService {
    async search(query: ISearchQuery): Promise<IBodyResponse<ISearchResults>> {
        return await this.client.get(`${this.baseUrl}`, {
            params: query,
        });
    }

    async searchUsers(query: ISearchQuery): Promise<IBodyResponse<IUser[]>> {
        return await this.client.get(`${this.baseUrl}/users`, {
            params: query,
        });
    }
}
const searchApiService = new SearchApiService({ baseUrl: '/search' }, axiosService);

export default searchApiService;
