import { IBodyResponse } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
import { IAnswerSurveyBody, ISurvey, ISurveyAnswer } from './../interfaces';

class SurveyApiService extends ApiService {
    async getUserSurveyDetail(id: string): Promise<IBodyResponse<ISurvey>> {
        return await this.client.get(`${this.baseUrl}/${id}`);
    }

    async answerSurvey(id: string, body: IAnswerSurveyBody): Promise<IBodyResponse<ISurveyAnswer>> {
        return await this.client.post(`${this.baseUrl}/${id}/answers`, body);
    }
}
const surveyApiService = new SurveyApiService({ baseUrl: '/surveys' }, axiosService);

export default surveyApiService;
