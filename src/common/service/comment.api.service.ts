import { IBodyResponse, IComment, ICreateCommentBody, ICreateReactionBody } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';

class CommentApiService extends ApiService {
    async getComment(postId: string): Promise<IBodyResponse<IComment[]>> {
        return await this.client.get(`${this.baseUrl}/${postId}/comments`);
    }

    async createComment(postId: string, data: ICreateCommentBody): Promise<IBodyResponse<IComment>> {
        return await this.client.post(`${this.baseUrl}/${postId}/comments`, data);
    }

    async react(postId: string, commentId: string, body: ICreateReactionBody): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${postId}/comments/${commentId}/react`, body);
    }
}
const commentApiService = new CommentApiService({ baseUrl: '/posts' }, axiosService);

export default commentApiService;
