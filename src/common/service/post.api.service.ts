import {
    IBodyResponse,
    ICreateNewPostBody,
    ICreateReactionBody,
    IPost,
    IReportPostBody,
    IUpdatePostBody,
} from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';

class PostApiService extends ApiService {
    async createPost(data: ICreateNewPostBody): Promise<IBodyResponse<IPost>> {
        return await this.client.post(`${this.baseUrl}/`, data);
    }

    async getNewsFeed(): Promise<IBodyResponse<IPost[]>> {
        return await this.client.get(`${this.baseUrl}/news-feed`);
    }

    async react(postId: string, body: ICreateReactionBody): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${postId}/react`, body);
    }

    async updatePost(id: string, data: IUpdatePostBody): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${id}`, data);
    }

    async deletePost(id: string): Promise<IBodyResponse<boolean>> {
        return await this.client.delete(`${this.baseUrl}/${id}`);
    }

    async reportPost(id: string, body: IReportPostBody): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${id}/report`, body);
    }
}
const postApiService = new PostApiService({ baseUrl: '/posts' }, axiosService);

export default postApiService;
