import { IGetUserListQuery, IUser } from '@/common/interfaces';
import adminUserApiService from '@/common/service/admin.user.api.service';
import store from '@/plugins/vuex';
import { cloneDeep } from 'lodash';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { INIT_GET_USER_LIST_QUERY } from './constants';

@Module({
    name: 'admin-users',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class AdminUserModule extends VuexModule {
    userList: IUser[] = [];
    userListQuery: IGetUserListQuery = cloneDeep(INIT_GET_USER_LIST_QUERY);
    isFetchedAllUserList = false;
    isShowUpdateUserDialog = false;
    selectedUser: IUser = {} as IUser;
    isShowUpdateUserRoleDialog = false;

    @Action
    async getUserList() {
        const response = await adminUserApiService.getUserList(this.userListQuery);
        if (response.success) {
            const data = response?.data || [];
            if (!data.length) {
                this.SET_IS_FETCHED_ALL_USER_LIST(true);
            }
            this.SET_USER_LIST(data);
        } else {
            this.SET_USER_LIST([]);

            this.SET_IS_FETCHED_ALL_USER_LIST(true);
        }
    }

    @Mutation
    SET_USER_LIST(userList: IUser[]) {
        this.userList = userList;
    }

    @Action
    setIsFetchedAllUserList(isFetchedAllUserList: boolean) {
        this.SET_IS_FETCHED_ALL_USER_LIST(isFetchedAllUserList);
    }

    @Mutation
    SET_IS_FETCHED_ALL_USER_LIST(isFetchedAllUserList: boolean) {
        this.isFetchedAllUserList = isFetchedAllUserList;
    }

    @Action
    resetUserListQuery() {
        this.RESET_USER_LIST_QUERY();
        this.SET_IS_FETCHED_ALL_USER_LIST(false);
    }

    @Mutation
    RESET_USER_LIST_QUERY() {
        this.userListQuery = cloneDeep(INIT_GET_USER_LIST_QUERY);
    }

    @Action
    setUserListQuery(userListQuery: IGetUserListQuery) {
        this.SET_USER_LIST_QUERY(userListQuery);
    }

    @Mutation
    SET_USER_LIST_QUERY(userListQuery: IGetUserListQuery) {
        this.userListQuery = {
            ...this.userListQuery,
            ...userListQuery,
        };
    }

    @Action
    setIsShowUpdateUserDialog(isShowUpdateUserDialog: boolean) {
        this.SET_IS_SHOW_UPDATE_USER_DIALOG(isShowUpdateUserDialog);
    }

    @Mutation
    SET_IS_SHOW_UPDATE_USER_DIALOG(isShowUpdateUserDialog: boolean) {
        this.isShowUpdateUserDialog = isShowUpdateUserDialog;
    }

    @Action
    setSelectedUser(user: IUser) {
        this.SET_SELECTED_USER(user);
    }

    @Mutation
    SET_SELECTED_USER(user: IUser) {
        this.selectedUser = user;
    }

    @Action
    setIsShowUpdateUserRoleDialog(isShowUpdateUserRoleDialog: boolean) {
        this.SET_IS_SHOW_UPDATE_USER_ROLE_DIALOG(isShowUpdateUserRoleDialog);
    }

    @Mutation
    SET_IS_SHOW_UPDATE_USER_ROLE_DIALOG(isShowUpdateUserRoleDialog: boolean) {
        this.isShowUpdateUserRoleDialog = isShowUpdateUserRoleDialog;
    }
}
export const adminUserModule = getModule(AdminUserModule);
