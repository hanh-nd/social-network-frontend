import {
    IBodyResponse,
    ICreateNewPostBody,
    ICreateReactionBody,
    IGetPostListQuery,
    IPost,
    IReaction,
    IReportPostBody,
    IUpdatePostBody,
} from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';

class PostApiService extends ApiService {
    async createPost(data: ICreateNewPostBody): Promise<IBodyResponse<IPost>> {
        return await this.client.post(`${this.baseUrl}/`, data);
    }

    async sharePost(id: string, data: ICreateNewPostBody): Promise<IBodyResponse<IPost>> {
        return await this.client.post(`${this.baseUrl}/${id}/share`, data);
    }

    async getNewsFeed(query?: IGetPostListQuery): Promise<IBodyResponse<IPost[]>> {
        return await this.client.get(`${this.baseUrl}/news-feed`, {
            params: query,
        });
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

    async getPostReactions(id: string): Promise<IBodyResponse<IReaction[]>> {
        return await this.client.get(`${this.baseUrl}/${id}/reactions`);
    }

    async getPostShares(id: string): Promise<IBodyResponse<IPost[]>> {
        return await this.client.get(`${this.baseUrl}/${id}/shares`);
    }

    async reactComment(postId: string, commentId: string, body: ICreateReactionBody): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${postId}/comments/${commentId}/react`, body);
    }

    async getPostDetail(postId: string): Promise<IBodyResponse<IPost>> {
        return await this.client.get(`${this.baseUrl}/${postId}`);
    }

    async getInterestedFeed(query?: IGetPostListQuery): Promise<IBodyResponse<IPost[]>> {
        return await this.client.get(`${this.baseUrl}/interested`, {
            params: query,
        });
    }
}
const postApiService = new PostApiService({ baseUrl: '/posts' }, axiosService);

export default postApiService;
