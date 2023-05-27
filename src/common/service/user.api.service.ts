import {
    IBodyResponse,
    IGetPostListQuery,
    IGetUserListQuery,
    IPost,
    IUpdateProfileBody,
    IUser,
    IUserDetail,
} from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
class UserApiService extends ApiService {
    async updateProfile(body: IUpdateProfileBody): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/update-profile`, body);
    }

    async getUserProfile(userId: string): Promise<IBodyResponse<IUser>> {
        return await this.client.get(`${this.baseUrl}/${userId}`);
    }

    async getUserPostList(userId: string, query?: IGetPostListQuery): Promise<IBodyResponse<IPost[]>> {
        return await this.client.get(`${this.baseUrl}/${userId}/posts`, {
            params: query,
        });
    }

    async getSubscriberList(userId: string, query?: IGetUserListQuery): Promise<IBodyResponse<IUser[]>> {
        return await this.client.get(`${this.baseUrl}/${userId}/subscribers`, {
            params: query,
        });
    }

    async getSubscribingList(userId: string, query?: IGetUserListQuery): Promise<IBodyResponse<IUser[]>> {
        return await this.client.get(`${this.baseUrl}/${userId}/subscribing`, {
            params: query,
        });
    }

    async subscribeOrUnsubscribe(userId: string): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${userId}/subscribe`);
    }

    async blockUser(targetUserId: string): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${targetUserId}/block`);
    }

    async getUserDetail(targetUserId: string): Promise<IBodyResponse<IUserDetail>> {
        return await this.client.get(`${this.baseUrl}/${targetUserId}/details`);
    }
}
const userApiService = new UserApiService({ baseUrl: '/users' }, axiosService);

export default userApiService;
