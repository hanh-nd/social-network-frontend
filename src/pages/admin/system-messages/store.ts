import { IGetSystemMessageListQuery, ISystemMessage } from '@/common/interfaces';
import adminSystemMessageApiService from '@/common/service/admin.system-messages.api.service';
import store from '@/plugins/vuex';
import { cloneDeep } from 'lodash';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { INIT_GET_SYSTEM_MESSAGES_LIST_QUERY } from './constants';

@Module({
    name: 'admin-system-messages',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class AdminSystemMessageModule extends VuexModule {
    systemMessageList: ISystemMessage[] = [];
    systemMessageListQuery: IGetSystemMessageListQuery = cloneDeep(INIT_GET_SYSTEM_MESSAGES_LIST_QUERY);
    isFetchedAllSystemMessageList = false;
    isShowCreateSystemMessageDialog = false;
    isShowUpdateSystemMessageDialog = false;
    selectedSystemMessage: ISystemMessage = {} as ISystemMessage;

    @Action
    async getSystemMessageList() {
        const response = await adminSystemMessageApiService.getSystemMessageList(this.systemMessageListQuery);
        if (response.success) {
            const data = response?.data || [];
            if (!data.length) {
                this.SET_IS_FETCHED_ALL_SYSTEM_MESSAGES_LIST(true);
            }
            this.SET_SYSTEM_MESSAGES_LIST(data);
        } else {
            this.SET_SYSTEM_MESSAGES_LIST([]);

            this.SET_IS_FETCHED_ALL_SYSTEM_MESSAGES_LIST(true);
        }
    }

    @Mutation
    SET_SYSTEM_MESSAGES_LIST(systemMessageList: ISystemMessage[]) {
        this.systemMessageList = systemMessageList;
    }

    @Action
    setIsFetchedAllSystemMessageList(isFetchedAllSystemMessageList: boolean) {
        this.SET_IS_FETCHED_ALL_SYSTEM_MESSAGES_LIST(isFetchedAllSystemMessageList);
    }

    @Mutation
    SET_IS_FETCHED_ALL_SYSTEM_MESSAGES_LIST(isFetchedAllSystemMessageList: boolean) {
        this.isFetchedAllSystemMessageList = isFetchedAllSystemMessageList;
    }

    @Action
    resetSystemMessageListQuery() {
        this.RESET_SYSTEM_MESSAGES_LIST_QUERY();
        this.SET_IS_FETCHED_ALL_SYSTEM_MESSAGES_LIST(false);
    }

    @Mutation
    RESET_SYSTEM_MESSAGES_LIST_QUERY() {
        this.systemMessageListQuery = cloneDeep(INIT_GET_SYSTEM_MESSAGES_LIST_QUERY);
    }

    @Action
    setSystemMessageListQuery(systemMessageListQuery: IGetSystemMessageListQuery) {
        this.SET_SYSTEM_MESSAGES_LIST_QUERY(systemMessageListQuery);
    }

    @Mutation
    SET_SYSTEM_MESSAGES_LIST_QUERY(systemMessageListQuery: IGetSystemMessageListQuery) {
        this.systemMessageListQuery = {
            ...this.systemMessageListQuery,
            ...systemMessageListQuery,
        };
    }

    @Action
    setIsShowCreateSystemMessageDialog(isShowCreateSystemMessageDialog: boolean) {
        this.SET_IS_SHOW_CREATE_SYSTEM_MESSAGES_DIALOG(isShowCreateSystemMessageDialog);
    }

    @Mutation
    SET_IS_SHOW_CREATE_SYSTEM_MESSAGES_DIALOG(isShowCreateSystemMessageDialog: boolean) {
        this.isShowCreateSystemMessageDialog = isShowCreateSystemMessageDialog;
    }

    @Action
    setIsShowUpdateSystemMessageDialog(isShowUpdateSystemMessageDialog: boolean) {
        this.SET_IS_SHOW_UPDATE_SYSTEM_MESSAGES_DIALOG(isShowUpdateSystemMessageDialog);
    }

    @Mutation
    SET_IS_SHOW_UPDATE_SYSTEM_MESSAGES_DIALOG(isShowUpdateSystemMessageDialog: boolean) {
        this.isShowUpdateSystemMessageDialog = isShowUpdateSystemMessageDialog;
    }

    @Action
    setSelectedSystemMessage(selectedSystemMessage: ISystemMessage) {
        this.SET_SELECTED_SYSTEM_MESSAGES(selectedSystemMessage);
    }

    @Mutation
    SET_SELECTED_SYSTEM_MESSAGES(selectedSystemMessage: ISystemMessage) {
        this.selectedSystemMessage = selectedSystemMessage;
    }
}
export const adminSystemMessageModule = getModule(AdminSystemMessageModule);
