import { ApiService } from '@/common/service/api';
import { IChat, ICreateChatBody, IGetMessageListQuery, IMessage, IUpdateChatBody } from '@/pages/chat/interfaces';
import axiosService from '@/plugins/axios';
import { IBodyResponse } from '../interfaces';
class ChatApiService extends ApiService {
    async createChat(body: ICreateChatBody): Promise<IBodyResponse<string>> {
        return await this.client.post(`${this.baseUrl}`, body);
    }

    async getUserChats(): Promise<IBodyResponse<IChat[]>> {
        return await this.client.get(`${this.baseUrl}`);
    }

    async updateChat(id: string, body: IUpdateChatBody): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${id}`, body);
    }

    async addOrRemoveMember(id: string, memberId: string): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${id}/members/${memberId}`);
    }

    async makeOrRemoveAdministrator(id: string, memberId: string): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${id}/members/${memberId}`);
    }

    async blockOrUnblockMember(id: string, memberId: string): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${id}/members/${memberId}`);
    }

    async deleteChat(id: string): Promise<IBodyResponse<boolean>> {
        return await this.client.delete(`${this.baseUrl}/${id}`);
    }

    async getMessages(id: string, query?: IGetMessageListQuery): Promise<IBodyResponse<IMessage[]>> {
        return await this.client.get(`${this.baseUrl}/${id}/messages`, {
            params: query,
        });
    }

    async deleteMessage(id: string, messageId: string): Promise<IBodyResponse<boolean>> {
        return await this.client.delete(`${this.baseUrl}/${id}/messages/${messageId}`);
    }

    async reportMessage(id: string, messageId: string): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${id}/messages/${messageId}`);
    }

    async getChatDetail(id: string): Promise<IBodyResponse<IChat>> {
        return await this.client.get(`${this.baseUrl}/${id}`);
    }

    async leaveChat(id: string): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}/${id}/leave`);
    }
}
const chatApiService = new ChatApiService({ baseUrl: '/chats' }, axiosService);

export default chatApiService;
