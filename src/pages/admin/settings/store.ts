import adminSettingsApiService from '@/common/service/admin.settings.api.service';
import store from '@/plugins/vuex';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { IJob } from './settings.interfaces';

@Module({
    name: 'admin-settings',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class AdminSettingsModule extends VuexModule {
    jobList: IJob[] = [];

    @Action
    async getJobList() {
        const response = await adminSettingsApiService.getJobList();
        if (response?.success) {
            this.SET_JOB_LIST(response?.data || []);
        } else {
            this.SET_JOB_LIST([]);
        }
    }

    @Mutation
    SET_JOB_LIST(jobList: IJob[]) {
        this.jobList = jobList;
    }
}

export const adminSettingsModule = getModule(AdminSettingsModule);
