import {
    IBodyResponse,
    ICreateSystemMessageBody,
    IGetSystemMessageListQuery,
    ISystemMessage,
    IUpdateSystemMessageBody,
} from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';

class AdminSystemMessageApiService extends ApiService {
    async getSystemMessageList(query?: IGetSystemMessageListQuery): Promise<IBodyResponse<ISystemMessage[]>> {
        return await this.client.get(`${this.baseUrl}`, {
            params: query,
        });
    }

    async createSystemMessage(body: ICreateSystemMessageBody): Promise<IBodyResponse<ISystemMessage>> {
        return await this.client.post(`${this.baseUrl}`, body);
    }

    async updateSystemMessage(id: string, body: IUpdateSystemMessageBody): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${id}`, body);
    }

    async deleteSystemMessage(id: string): Promise<IBodyResponse<boolean>> {
        return await this.client.delete(`${this.baseUrl}/${id}`);
    }
}
const adminSystemMessageApiService = new AdminSystemMessageApiService(
    { baseUrl: '/admin/system-messages' },
    axiosService,
);

export default adminSystemMessageApiService;
