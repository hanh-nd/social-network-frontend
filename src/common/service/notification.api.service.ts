import { ApiService } from '@/common/service/api';
import { IGetNotificationListQuery } from '@/pages/notifications/interfaces';
import axiosService from '@/plugins/axios';
import { IBodyResponse, INotification } from '../interfaces';

class NotificationApiService extends ApiService {
    async getNotifications(query?: IGetNotificationListQuery): Promise<IBodyResponse<INotification[]>> {
        return await this.client.get(`${this.baseUrl}/`, {
            params: query,
        });
    }

    async markAsRead(id: string): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${id}/read`);
    }

    async undoMarkAsRead(id: string): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${id}/unread`);
    }

    async markAllAsRead(): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/markAllAsRead`);
    }

    async delete(id: string): Promise<IBodyResponse<boolean>> {
        return await this.client.delete(`${this.baseUrl}/${id}`);
    }

    async getUnreadNotificationCount(): Promise<IBodyResponse<number>> {
        return await this.client.get(`${this.baseUrl}/count`);
    }
}
const notificationApiService = new NotificationApiService({ baseUrl: '/notifications' }, axiosService);

export default notificationApiService;
