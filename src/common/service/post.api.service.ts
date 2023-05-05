import { IBodyResponse, IPost } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import { ICreateNewPostBody } from '@/pages/home/interfaces';
import axiosService from '@/plugins/axios';

class PostApiService extends ApiService {
    async createPost(data: ICreateNewPostBody): Promise<IBodyResponse<IPost>> {
        return await this.client.post(`${this.baseUrl}/`, data);
    }
}
const postApiService = new PostApiService({ baseUrl: '/posts' }, axiosService);

export default postApiService;
