import { IBodyResponse, IGetStatisticQuery, ITag } from '@/common/interfaces';
import { ApiService } from '@/common/service/api';
import { IUserStatistic } from '@/pages/profile/interfaces';
import axiosService from '@/plugins/axios';
class StatisticApiService extends ApiService {
    async getUserStatistics(query?: IGetStatisticQuery): Promise<IBodyResponse<IUserStatistic[]>> {
        return await this.client.get(`${this.baseUrl}/users`, {
            params: query,
        });
    }
}
const statisticApiService = new StatisticApiService({ baseUrl: '/statistics' }, axiosService);

export default statisticApiService;
