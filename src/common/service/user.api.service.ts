import { IBodyResponse, IPost, IUpdateProfileBody, IUser } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
class UserApiService extends ApiService {
    async updateProfile(body: IUpdateProfileBody): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/update-profile`, body);
    }

    async getUserDetail(userId: string): Promise<IBodyResponse<IUser>> {
        return await this.client.get(`${this.baseUrl}/${userId}`);
    }

    async getUserPostList(userId: string): Promise<IBodyResponse<IPost[]>> {
        return await this.client.get(`${this.baseUrl}/${userId}/posts`);
    }

    async getSubscriberList(userId: string): Promise<IBodyResponse<IUser[]>> {
        return await this.client.get(`${this.baseUrl}/${userId}/subscribers`);
    }

    async getSubscribingList(userId: string): Promise<IBodyResponse<IUser[]>> {
        return await this.client.get(`${this.baseUrl}/${userId}/subscribing`);
    }

    async subscribeOrUnsubscribe(userId: string): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${userId}/subscribe`);
    }
}
const userApiService = new UserApiService({ baseUrl: '/users' }, axiosService);

export default userApiService;
