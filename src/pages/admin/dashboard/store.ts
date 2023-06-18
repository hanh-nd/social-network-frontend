import { IGetStatisticQuery, IStatistic } from '@/common/interfaces';
import adminPostApiService from '@/common/service/admin.post.api.service';
import adminUserApiService from '@/common/service/admin.user.api.service';
import store from '@/plugins/vuex';
import { cloneDeep } from 'lodash';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { INIT_GET_STATISTIC_QUERY } from '../users/constants';
import { DEFAULT_STATISTIC } from './constants';

@Module({
    name: 'admin-dashboard',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class AdminDashboardModule extends VuexModule {
    userStatistic: IStatistic = cloneDeep(DEFAULT_STATISTIC);
    postStatistic: IStatistic = cloneDeep(DEFAULT_STATISTIC);
    statisticQuery: IGetStatisticQuery = cloneDeep(INIT_GET_STATISTIC_QUERY);

    @Action
    async getUserStatistic() {
        const response = await adminUserApiService.getUserStatistic(this.statisticQuery);
        if (response?.success) {
            this.SET_USER_STATISTIC(response?.data || cloneDeep(DEFAULT_STATISTIC));
        } else {
            this.SET_USER_STATISTIC(cloneDeep(DEFAULT_STATISTIC));
        }
    }

    @Mutation
    SET_USER_STATISTIC(userStatistic: IStatistic) {
        this.userStatistic = userStatistic;
    }

    @Action
    async getPostStatistic() {
        const response = await adminPostApiService.getPostStatistic(this.statisticQuery);
        if (response?.success) {
            this.SET_POST_STATISTIC(response?.data || cloneDeep(DEFAULT_STATISTIC));
        } else {
            this.SET_POST_STATISTIC(cloneDeep(DEFAULT_STATISTIC));
        }
    }

    @Mutation
    SET_POST_STATISTIC(postStatistic: IStatistic) {
        this.postStatistic = postStatistic;
    }
}
export const adminDashboardModule = getModule(AdminDashboardModule);
