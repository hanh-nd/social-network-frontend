import {
    IBodyResponse,
    IGetStatisticQuery,
    IGetUserListQuery,
    IStatistic,
    IUpdateProfileBody,
    IUser,
} from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
import { IUpdateUserRoleBody } from './../interfaces';
class AdminUserApiService extends ApiService {
    async getUserList(query?: IGetUserListQuery): Promise<IBodyResponse<IUser[]>> {
        return await this.client.get(`${this.baseUrl}`, {
            params: query,
        });
    }

    async getUserDetail(id: string): Promise<IBodyResponse<IUser>> {
        return await this.client.get(`${this.baseUrl}/${id}`);
    }

    async updateUser(id: string, body: IUpdateProfileBody): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${id}`, body);
    }

    async activateUser(id: string): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${id}/activate`);
    }

    async getUserStatistic(query?: IGetStatisticQuery): Promise<IBodyResponse<IStatistic>> {
        return await this.client.get(`${this.baseUrl}/statistic`, {
            params: query,
        });
    }

    async updateUserRole(id: string, body: IUpdateUserRoleBody): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${id}/roles`, body);
    }
}
const adminUserApiService = new AdminUserApiService({ baseUrl: '/admin/users' }, axiosService);

export default adminUserApiService;
