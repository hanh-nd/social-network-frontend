import { IBodyResponse, IGetSurveyListQuery, IUpdateSurveyBody } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
import { ICreateSurveyBody, ISurvey, ISurveyAnswer } from './../interfaces';

class AdminSurveyApiService extends ApiService {
    async getSurveyList(query?: IGetSurveyListQuery): Promise<IBodyResponse<ISurvey[]>> {
        return await this.client.get(`${this.baseUrl}`, {
            params: query,
        });
    }

    async createSurvey(body: ICreateSurveyBody): Promise<IBodyResponse<ISurvey>> {
        return await this.client.post(`${this.baseUrl}`, body);
    }

    async updateSurvey(id: string, body: IUpdateSurveyBody): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${id}`, body);
    }

    async deleteSurvey(id: string): Promise<IBodyResponse<boolean>> {
        return await this.client.delete(`${this.baseUrl}/${id}`);
    }

    async getAdminSurveyDetail(id: string): Promise<IBodyResponse<ISurvey>> {
        return await this.client.get(`${this.baseUrl}/${id}/admin`);
    }

    async getUserAnswers(id: string): Promise<IBodyResponse<ISurveyAnswer[]>> {
        return await this.client.get(`${this.baseUrl}/${id}/answers`);
    }
}
const adminSurveyApiService = new AdminSurveyApiService({ baseUrl: '/admin/surveys' }, axiosService);

export default adminSurveyApiService;
