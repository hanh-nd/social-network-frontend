import { IGetReportListQuery, IReport } from '@/common/interfaces';
import adminReportApiService from '@/common/service/admin.report.api.service';
import store from '@/plugins/vuex';
import { cloneDeep } from 'lodash';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { INIT_GET_REPORT_LIST_QUERY } from './constants';

@Module({
    name: 'admin-reports',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class AdminReportModule extends VuexModule {
    reportList: IReport[] = [];
    reportListQuery: IGetReportListQuery = cloneDeep(INIT_GET_REPORT_LIST_QUERY);
    isFetchedAllReportList = false;

    @Action
    async getReportList() {
        const response = await adminReportApiService.getReportList(this.reportListQuery);
        if (response.success) {
            const data = response?.data || [];
            if (!data.length) {
                this.SET_IS_FETCHED_ALL_REPORT_LIST(true);
            }
            this.SET_REPORT_LIST(data);
        } else {
            this.SET_REPORT_LIST([]);

            this.SET_IS_FETCHED_ALL_REPORT_LIST(true);
        }
    }

    @Mutation
    SET_REPORT_LIST(reportList: IReport[]) {
        this.reportList = reportList;
    }

    @Action
    setIsFetchedAllReportList(isFetchedAllReportList: boolean) {
        this.SET_IS_FETCHED_ALL_REPORT_LIST(isFetchedAllReportList);
    }

    @Mutation
    SET_IS_FETCHED_ALL_REPORT_LIST(isFetchedAllReportList: boolean) {
        this.isFetchedAllReportList = isFetchedAllReportList;
    }

    @Action
    resetReportListQuery() {
        this.RESET_REPORT_LIST_QUERY();
        this.SET_IS_FETCHED_ALL_REPORT_LIST(false);
    }

    @Mutation
    RESET_REPORT_LIST_QUERY() {
        this.reportListQuery = cloneDeep(INIT_GET_REPORT_LIST_QUERY);
    }

    @Action
    setReportListQuery(reportListQuery: IGetReportListQuery) {
        this.SET_REPORT_LIST_QUERY(reportListQuery);
    }

    @Mutation
    SET_REPORT_LIST_QUERY(reportListQuery: IGetReportListQuery) {
        this.reportListQuery = {
            ...this.reportListQuery,
            ...reportListQuery,
        };
    }
}
export const adminReportModule = getModule(AdminReportModule);
