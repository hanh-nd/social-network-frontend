import {
    IBodyResponse,
    IComment,
    ICreateCommentBody,
    ICreateReactionBody,
    IEditCommentBody,
    IGetCommentListQuery,
    IReportPostBody,
} from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';

class CommentApiService extends ApiService {
    async getComment(postId: string, query?: IGetCommentListQuery): Promise<IBodyResponse<IComment[]>> {
        return await this.client.get(`${this.baseUrl}/${postId}/comments`, {
            params: query,
        });
    }

    async createComment(postId: string, data: ICreateCommentBody): Promise<IBodyResponse<IComment>> {
        return await this.client.post(`${this.baseUrl}/${postId}/comments`, data);
    }

    async react(postId: string, commentId: string, body: ICreateReactionBody): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${postId}/comments/${commentId}/react`, body);
    }

    async deleteComment(postId: string, commentId: string): Promise<IBodyResponse<boolean>> {
        return await this.client.delete(`${this.baseUrl}/${postId}/comments/${commentId}`);
    }

    async editComment(postId: string, commentId: string, body: IEditCommentBody): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${postId}/comments/${commentId}`, body);
    }

    async reportComment(postId: string, commentId: string, body: IReportPostBody): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${postId}/comments/${commentId}/report`, body);
    }
}

const commentApiService = new CommentApiService({ baseUrl: '/posts' }, axiosService);

export default commentApiService;
