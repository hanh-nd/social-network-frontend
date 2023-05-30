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

    async delete(id: string): Promise<IBodyResponse<boolean>> {
        return await this.client.delete(`${this.baseUrl}/${id}`);
    }
}
const notificationApiService = new NotificationApiService({ baseUrl: '/notifications' }, axiosService);

export default notificationApiService;
