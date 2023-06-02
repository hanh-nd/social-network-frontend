import {
    IGetGroupPostListQuery,
    IGetJoinRequestListQuery,
    IGroup,
    IGroupPost,
    IJoinRequest,
    IUser,
} from '@/common/interfaces';
import groupApiService from '@/common/service/group.api.service';
import store from '@/plugins/vuex';
import { cloneDeep } from 'lodash';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { GroupDetailScreenTab, INIT_GET_GROUP_POST_LIST_QUERY, INIT_GET_JOINED_REQUEST_LIST_QUERY } from './constants';

@Module({
    name: 'group-detail',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class GroupDetailModule extends VuexModule {
    groupDetail: IGroup = {} as IGroup;
    groupDetailScreenTab = GroupDetailScreenTab.MAIN;
    groupPostList: IGroupPost[] = [];
    groupPostListQuery: IGetGroupPostListQuery = cloneDeep(INIT_GET_GROUP_POST_LIST_QUERY);
    isFetchedAllGroupPostList = false;
    joinRequestList: IJoinRequest[] = [];
    joinRequestListQuery: IGetJoinRequestListQuery = cloneDeep(INIT_GET_JOINED_REQUEST_LIST_QUERY);
    isFetchedAllJoinedRequestList = false;
    isShowCreatePostDialog = false;
    groupPendingPosts: IGroupPost[] = [];
    groupPendingPostListQuery: IGetGroupPostListQuery = cloneDeep(INIT_GET_GROUP_POST_LIST_QUERY);
    isFetchedAllGroupPendingPostList = false;
    groupMembers: IUser[] = [];

    @Action
    async getGroupDetail(id: string) {
        const response = await groupApiService.getDetail(id);
        if (response?.success) {
            this.SET_GROUP_DETAIL(response.data);
        } else {
            this.SET_GROUP_DETAIL({} as IGroup);
        }
    }

    @Mutation
    SET_GROUP_DETAIL(groupDetail: IGroup) {
        this.groupDetail = groupDetail;
    }

    @Action
    setGroupDetailScreenTab(groupDetailScreenTab: GroupDetailScreenTab) {
        this.SET_GROUP_DETAIL_SCREEN_TAB(groupDetailScreenTab);
    }

    @Mutation
    SET_GROUP_DETAIL_SCREEN_TAB(groupDetailScreenTab: GroupDetailScreenTab) {
        this.groupDetailScreenTab = groupDetailScreenTab;
    }

    @Action
    async getGroupPosts({ id, append = false }: { id: string; append?: boolean }) {
        const response = await groupApiService.getPosts(id, this.groupPostListQuery);
        if (response.success) {
            const data = response?.data || [];
            if (!data.length) {
                this.SET_IS_FETCHED_ALL_GROUP_POST_LIST(true);
            }
            if (append) {
                this.APPEND_GROUP_POST_LIST(data);
            } else {
                this.SET_GROUP_POST_LIST(data);
            }
        } else {
            if (append) {
                this.APPEND_GROUP_POST_LIST([]);
            } else {
                this.SET_GROUP_POST_LIST([]);
            }

            this.SET_IS_FETCHED_ALL_GROUP_POST_LIST(true);
        }
    }

    @Mutation
    APPEND_GROUP_POST_LIST(groupPostList: IGroupPost[]) {
        this.groupPostList.push(...groupPostList);
    }

    @Mutation
    SET_GROUP_POST_LIST(groupPostList: IGroupPost[]) {
        this.groupPostList = groupPostList;
    }

    @Mutation
    SET_IS_FETCHED_ALL_GROUP_POST_LIST(isFetchedAllGroupPostList: boolean) {
        this.isFetchedAllGroupPostList = isFetchedAllGroupPostList;
    }

    @Action
    resetGroupPostListQuery() {
        this.RESET_GROUP_POST_LIST_QUERY();
        this.SET_IS_FETCHED_ALL_GROUP_POST_LIST(false);
    }

    @Mutation
    RESET_GROUP_POST_LIST_QUERY() {
        this.groupPostListQuery = cloneDeep(INIT_GET_GROUP_POST_LIST_QUERY);
    }

    @Action
    setGroupPostListQuery(groupPostListQuery: IGetGroupPostListQuery) {
        this.SET_GROUP_POST_LIST_QUERY(groupPostListQuery);
    }

    @Mutation
    SET_GROUP_POST_LIST_QUERY(groupPostListQuery: IGetGroupPostListQuery) {
        this.groupPostListQuery = {
            ...this.groupPostListQuery,
            ...groupPostListQuery,
        };
    }

    @Action
    async getJoinRequestList({ id, append }: { id: string; append?: boolean }) {
        const response = await groupApiService.getJoinRequests(id, this.joinRequestListQuery);
        if (response.success) {
            const data = response?.data || [];
            if (!data.length) {
                this.SET_IS_FETCHED_ALL_JOIN_REQUEST_LIST(true);
            }
            if (append) {
                this.APPEND_JOIN_REQUEST_LIST(data);
            } else {
                this.SET_JOIN_REQUEST_LIST(data);
            }
        } else {
            if (append) {
                this.APPEND_JOIN_REQUEST_LIST([]);
            } else {
                this.SET_JOIN_REQUEST_LIST([]);
            }

            this.SET_IS_FETCHED_ALL_JOIN_REQUEST_LIST(true);
        }
    }

    @Mutation
    APPEND_JOIN_REQUEST_LIST(joinRequestList: IJoinRequest[]) {
        this.joinRequestList.push(...joinRequestList);
    }

    @Mutation
    SET_JOIN_REQUEST_LIST(joinRequestList: IJoinRequest[]) {
        this.joinRequestList = joinRequestList;
    }

    @Mutation
    SET_IS_FETCHED_ALL_JOIN_REQUEST_LIST(isFetchedAllJoinedRequestList: boolean) {
        this.isFetchedAllJoinedRequestList = isFetchedAllJoinedRequestList;
    }

    @Action
    resetJoinRequestListQuery() {
        this.RESET_JOIN_REQUEST_LIST_QUERY();
        this.SET_IS_FETCHED_ALL_JOIN_REQUEST_LIST(false);
    }

    @Mutation
    RESET_JOIN_REQUEST_LIST_QUERY() {
        this.joinRequestListQuery = cloneDeep(INIT_GET_JOINED_REQUEST_LIST_QUERY);
    }

    @Action
    setJoinRequestListQuery(joinRequestListQuery: IGetJoinRequestListQuery) {
        this.SET_GROUP_POST_LIST_QUERY(joinRequestListQuery);
    }

    @Mutation
    SET_JOIN_REQUEST_LIST_QUERY(joinRequestListQuery: IGetJoinRequestListQuery) {
        this.joinRequestListQuery = {
            ...this.joinRequestListQuery,
            ...joinRequestListQuery,
        };
    }

    @Action
    setIsShowCreatePostDialog(isShowCreatePostDialog: boolean) {
        this.SET_IS_SHOW_CREATE_POST_DIALOG(isShowCreatePostDialog);
    }

    @Mutation
    SET_IS_SHOW_CREATE_POST_DIALOG(isShowCreatePostDialog: boolean) {
        this.isShowCreatePostDialog = isShowCreatePostDialog;
    }

    @Action
    async getGroupPendingPosts({ id, append = false }: { id: string; append?: boolean }) {
        const response = await groupApiService.getPendingGroupPosts(id, this.groupPendingPostListQuery);
        if (response.success) {
            const data = response?.data || [];
            if (!data.length) {
                this.SET_IS_FETCHED_ALL_GROUP_PENDING_POST_LIST(true);
            }
            if (append) {
                this.APPEND_GROUP_PENDING_POST_LIST(data);
            } else {
                this.SET_GROUP_PENDING_POST_LIST(data);
            }
        } else {
            if (append) {
                this.APPEND_GROUP_PENDING_POST_LIST([]);
            } else {
                this.SET_GROUP_PENDING_POST_LIST([]);
            }

            this.SET_IS_FETCHED_ALL_GROUP_PENDING_POST_LIST(true);
        }
    }

    @Mutation
    APPEND_GROUP_PENDING_POST_LIST(groupPendingPosts: IGroupPost[]) {
        this.groupPendingPosts.push(...groupPendingPosts);
    }

    @Mutation
    SET_GROUP_PENDING_POST_LIST(groupPendingPosts: IGroupPost[]) {
        this.groupPendingPosts = groupPendingPosts;
    }

    @Mutation
    SET_IS_FETCHED_ALL_GROUP_PENDING_POST_LIST(isFetchedAllGroupPendingPostList: boolean) {
        this.isFetchedAllGroupPendingPostList = isFetchedAllGroupPendingPostList;
    }

    @Action
    resetGroupPendingPostListQuery() {
        this.RESET_GROUP_POST_LIST_QUERY();
        this.SET_IS_FETCHED_ALL_GROUP_PENDING_POST_LIST(false);
    }

    @Mutation
    RESET_GROUP_PENDING_POST_LIST_QUERY() {
        this.groupPendingPostListQuery = cloneDeep(INIT_GET_GROUP_POST_LIST_QUERY);
    }

    @Action
    setGroupPendingPostListQuery(groupPendingPostListQuery: IGetGroupPostListQuery) {
        this.SET_GROUP_POST_LIST_QUERY(groupPendingPostListQuery);
    }

    @Mutation
    SET_GROUP_PENDING_POST_LIST_QUERY(groupPendingPostListQuery: IGetGroupPostListQuery) {
        this.groupPendingPostListQuery = {
            ...this.groupPendingPostListQuery,
            ...groupPendingPostListQuery,
        };
    }

    @Action
    async getMemberPendingPosts({ id, append = false }: { id: string; append?: boolean }) {
        const response = await groupApiService.getUserPendingPost(id, this.groupPendingPostListQuery);
        if (response.success) {
            const data = response?.data || [];
            if (!data.length) {
                this.SET_IS_FETCHED_ALL_GROUP_PENDING_POST_LIST(true);
            }
            if (append) {
                this.APPEND_GROUP_PENDING_POST_LIST(data);
            } else {
                this.SET_GROUP_PENDING_POST_LIST(data);
            }
        } else {
            if (append) {
                this.APPEND_GROUP_PENDING_POST_LIST([]);
            } else {
                this.SET_GROUP_PENDING_POST_LIST([]);
            }

            this.SET_IS_FETCHED_ALL_GROUP_PENDING_POST_LIST(true);
        }
    }

    @Action
    async getGroupMembers(id: string) {
        const response = await groupApiService.getMembers(id);
        if (response?.success) {
            this.SET_GROUP_MEMBERS(response?.data || []);
        } else {
            this.SET_GROUP_MEMBERS([]);
        }
    }

    @Mutation
    SET_GROUP_MEMBERS(groupMembers: IUser[]) {
        this.groupMembers = groupMembers;
    }
}

export const groupDetailModule = getModule(GroupDetailModule);
