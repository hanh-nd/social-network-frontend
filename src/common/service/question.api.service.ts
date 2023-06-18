import {
    IBodyResponse,
    ICreateQuestionBody,
    IGetQuestionListQuery,
    IQuestion,
    IUpdateQuestionBody,
} from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import axiosService from '@/plugins/axios';
class QuestionApiService extends ApiService {
    async createQuestion(body: ICreateQuestionBody): Promise<IBodyResponse<boolean>> {
        return await this.client.post(`${this.baseUrl}`, body);
    }

    async getQuestionList(query: IGetQuestionListQuery): Promise<IBodyResponse<IQuestion[]>> {
        return await this.client.get(`${this.baseUrl}`, {
            params: query,
        });
    }

    async updateQuestion(id: string, body: IUpdateQuestionBody): Promise<IBodyResponse<boolean>> {
        return await this.client.patch(`${this.baseUrl}/${id}`, body);
    }

    async deleteQuestion(id: string): Promise<IBodyResponse<boolean>> {
        return await this.client.delete(`${this.baseUrl}/${id}`);
    }
}
const questionApiService = new QuestionApiService({ baseUrl: '/questions' }, axiosService);

export default questionApiService;
