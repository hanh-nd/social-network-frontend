import { IBodyResponse, ITag } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
class TagApiService extends ApiService {
    async getTags(): Promise<IBodyResponse<ITag[]>> {
        return await this.client.get(`${this.baseUrl}`);
    }
}
const tagApiService = new TagApiService({ baseUrl: '/tags' }, axiosService);

export default tagApiService;
