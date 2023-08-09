import { IGetGroupListQuery, IGroup } from '@/common/interfaces';
import adminGroupApiService from '@/common/service/admin.group.api.service';
import { INIT_GET_GROUP_LIST_QUERY } from '@/pages/groups/constants';
import store from '@/plugins/vuex';
import { cloneDeep } from 'lodash';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';

@Module({
    name: 'admin-groups',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class AdminGroupModule extends VuexModule {
    groupList: IGroup[] = [];
    groupListQuery: IGetGroupListQuery = cloneDeep(INIT_GET_GROUP_LIST_QUERY);
    isFetchedAllGroupList = false;

    @Action
    async getGroupList() {
        const response = await adminGroupApiService.getGroupList(this.groupListQuery);
        if (response.success) {
            const data = response?.data || [];
            if (!data.length) {
                this.SET_IS_FETCHED_ALL_GROUP_LIST(true);
            }
            this.SET_GROUP_LIST(data);
        } else {
            this.SET_GROUP_LIST([]);

            this.SET_IS_FETCHED_ALL_GROUP_LIST(true);
        }
    }

    @Mutation
    SET_GROUP_LIST(groupList: IGroup[]) {
        this.groupList = groupList;
    }

    @Action
    setIsFetchedAllGroupList(isFetchedAllGroupList: boolean) {
        this.SET_IS_FETCHED_ALL_GROUP_LIST(isFetchedAllGroupList);
    }

    @Mutation
    SET_IS_FETCHED_ALL_GROUP_LIST(isFetchedAllGroupList: boolean) {
        this.isFetchedAllGroupList = isFetchedAllGroupList;
    }

    @Action
    resetGroupListQuery() {
        this.RESET_GROUP_LIST_QUERY();
        this.SET_IS_FETCHED_ALL_GROUP_LIST(false);
    }

    @Mutation
    RESET_GROUP_LIST_QUERY() {
        this.groupListQuery = cloneDeep(INIT_GET_GROUP_LIST_QUERY);
    }

    @Action
    setGroupListQuery(groupListQuery: IGetGroupListQuery) {
        this.SET_GROUP_LIST_QUERY(groupListQuery);
    }

    @Mutation
    SET_GROUP_LIST_QUERY(groupListQuery: IGetGroupListQuery) {
        this.groupListQuery = {
            ...this.groupListQuery,
            ...groupListQuery,
        };
    }
}
export const adminGroupModule = getModule(AdminGroupModule);
