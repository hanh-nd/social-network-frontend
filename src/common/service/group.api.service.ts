import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
import {
    IBodyResponse,
    ICreateGroupBody,
    ICreatePostInGroupBody,
    IGetGroupListQuery,
    IGetGroupPostListQuery,
    IGetJoinRequestListQuery,
    IGroup,
    IGroupPost,
    IJoinRequest,
    IUpdateGroupBody,
    IUpdateGroupPostBody,
    IUpdateJoinRequestBody,
} from '../interfaces';
class GroupApiService extends ApiService {
    async createGroup(body: ICreateGroupBody): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/`, body);
    }

    async updateGroup(groupId: string, body: IUpdateGroupBody): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${groupId}`, body);
    }

    async blockOrUnblockUser(groupId: string, memberId: string): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${groupId}/members/${memberId}/block`);
    }

    async removeMember(groupId: string, memberId: string): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${groupId}/members/${memberId}/remove`);
    }

    async getJoinRequests(groupId: string, query?: IGetJoinRequestListQuery): Promise<IBodyResponse<IJoinRequest[]>> {
        return await this.client.get(`${this.baseUrl}/${groupId}/join-requests`, {
            params: query,
        });
    }

    async acceptOrRejectJoinRequest(
        groupId: string,
        requestId: string,
        body: IUpdateJoinRequestBody,
    ): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${groupId}/join-requests/${requestId}`, body);
    }

    async getPendingGroupPosts(groupId: string, query?: IGetGroupPostListQuery): Promise<IBodyResponse<IGroupPost[]>> {
        return await this.client.get(`${this.baseUrl}/${groupId}/group-posts/pending`, {
            params: query,
        });
    }

    async acceptOrRejectGroupPost(
        groupId: string,
        groupPostId: string,
        body: IUpdateGroupPostBody,
    ): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${groupId}/group-posts/pending/${groupPostId}`, body);
    }

    async pinOrUnpinGroupPost(groupId: string, groupPostId: string): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${groupId}/group-posts/${groupPostId}/pin`);
    }

    async getDetail(groupId: string): Promise<IBodyResponse<IGroup>> {
        return await this.client.get(`${this.baseUrl}/${groupId}`);
    }

    async getMembers(groupId: string): Promise<IBodyResponse<IGroup>> {
        return await this.client.get(`${this.baseUrl}/${groupId}/members`);
    }

    async requestToJoin(groupId: string): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${groupId}/join-requests`);
    }

    async leave(groupId: string): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${groupId}/leave`);
    }

    async getPosts(groupId: string, query?: IGetGroupPostListQuery): Promise<IBodyResponse<boolean>> {
        return await this.client.get(`${this.baseUrl}/${groupId}/group-posts`, {
            params: query,
        });
    }

    async createPost(groupId: string, body: ICreatePostInGroupBody): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${groupId}/group-posts`, body);
    }

    async deletePost(groupId: string, groupPostId: string): Promise<IBodyResponse<boolean>> {
        return await this.client.delete(`${this.baseUrl}/${groupId}/group-posts/${groupPostId}`);
    }

    async getUserCreatedGroups(query?: IGetGroupListQuery): Promise<IBodyResponse<IGroup[]>> {
        return await this.client.get(`${this.baseUrl}/my-groups`, {
            params: query,
        });
    }

    async getUserJoinedGroups(query?: IGetGroupListQuery): Promise<IBodyResponse<IGroup[]>> {
        return await this.client.get(`${this.baseUrl}`, {
            params: query,
        });
    }

    async getGroupFeed(query?: IGetGroupPostListQuery): Promise<IBodyResponse<IGroupPost[]>> {
        return await this.client.get(`${this.baseUrl}/group-posts`, {
            params: query,
        });
    }
}
const groupApiService = new GroupApiService({ baseUrl: '/groups' }, axiosService);

export default groupApiService;
