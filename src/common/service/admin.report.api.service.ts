import { IBodyResponse, IGetReportListQuery, IReport, IUpdateReportBody } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
class AdminReportApiService extends ApiService {
    async getReportList(query?: IGetReportListQuery): Promise<IBodyResponse<IReport[]>> {
        return await this.client.get(`${this.baseUrl}`, {
            params: query,
        });
    }

    async acceptReport(id: string): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${id}/accept`);
    }

    async rejectReport(id: string): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${id}/reject`);
    }

    async updateReport(id: string, body: IUpdateReportBody): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${id}`, body);
    }
}
const adminReportApiService = new AdminReportApiService({ baseUrl: '/admin/reports' }, axiosService);

export default adminReportApiService;
