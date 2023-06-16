import { IBodyResponse } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import { IJob, IUpdateJobBody } from '@/pages/admin/settings/settings.interfaces';
import axiosService from '@/plugins/axios';
class AdminSettingsApiService extends ApiService {
    async getJobList(): Promise<IBodyResponse<IJob[]>> {
        return await this.client.get(`${this.baseUrl}/jobs`);
    }

    async updateJob(key: string, body: IUpdateJobBody): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/jobs/${key}`, body);
    }
}
const adminSettingsApiService = new AdminSettingsApiService({ baseUrl: '/admin/core-settings' }, axiosService);

export default adminSettingsApiService;
