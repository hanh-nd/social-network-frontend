import { IGetGroupListQuery, IGetGroupPostListQuery, IGroup, IGroupPost } from '@/common/interfaces';
import groupApiService from '@/common/service/group.api.service';
import store from '@/plugins/vuex';
import { cloneDeep } from 'lodash';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { FeedScreenType, INIT_GET_GROUP_LIST_QUERY, INIT_GET_GROUP_POST_LIST_QUERY } from './constants';

@Module({
    name: 'group',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class GroupModule extends VuexModule {
    feedScreenType = FeedScreenType.MAIN;
    groupPostList: IGroupPost[] = [];
    groupPostListQuery: IGetGroupPostListQuery = cloneDeep(INIT_GET_GROUP_POST_LIST_QUERY);
    isFetchedAllGroupPostList = false;
    joinedGroupList: IGroup[] = [];
    joinedGroupListQuery: IGetGroupListQuery = cloneDeep(INIT_GET_GROUP_LIST_QUERY);
    isFetchedAllJoinedGroupList = false;
    createdGroupList: IGroup[] = [];
    createdGroupListQuery: IGetGroupListQuery = cloneDeep(INIT_GET_GROUP_LIST_QUERY);
    isFetchedAllCreatedGroupList = false;
    isShowCreateNewGroupDialog = false;

    @Action
    setFeedScreenType(feedScreenType: FeedScreenType) {
        this.SET_FEED_SCREEN_TYPE(feedScreenType);
    }

    @Mutation
    SET_FEED_SCREEN_TYPE(feedScreenType: FeedScreenType) {
        this.feedScreenType = feedScreenType;
    }

    @Action
    async getGroupFeed({ append = false }: { append?: boolean }) {
        const response = await groupApiService.getGroupFeed(this.groupPostListQuery);
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
    async getJoinedGroupList({ append = false }: { append?: boolean }) {
        const response = await groupApiService.getUserJoinedGroups(this.joinedGroupListQuery);
        if (response.success) {
            const data = response?.data || [];
            if (!data.length) {
                this.SET_IS_FETCHED_ALL_JOINED_GROUP_LIST(true);
            }
            if (append) {
                this.APPEND_JOINED_GROUP_LIST(data);
            } else {
                this.SET_JOINED_GROUP_LIST(data);
            }
        } else {
            if (append) {
                this.APPEND_JOINED_GROUP_LIST([]);
            } else {
                this.SET_JOINED_GROUP_LIST([]);
            }
            this.SET_IS_FETCHED_ALL_JOINED_GROUP_LIST(true);
        }
    }

    @Mutation
    APPEND_JOINED_GROUP_LIST(joinedGroupList: IGroup[]) {
        this.joinedGroupList.push(...joinedGroupList);
    }

    @Mutation
    SET_JOINED_GROUP_LIST(joinedGroupList: IGroup[]) {
        this.joinedGroupList = joinedGroupList;
    }

    @Mutation
    SET_IS_FETCHED_ALL_JOINED_GROUP_LIST(isFetchedAllJoinedGroupList: boolean) {
        this.isFetchedAllJoinedGroupList = isFetchedAllJoinedGroupList;
    }

    @Action
    resetJoinedGroupListQuery() {
        this.RESET_JOINED_GROUP_LIST_QUERY();
        this.SET_IS_FETCHED_ALL_JOINED_GROUP_LIST(false);
    }

    @Mutation
    RESET_JOINED_GROUP_LIST_QUERY() {
        this.joinedGroupListQuery = cloneDeep(INIT_GET_GROUP_LIST_QUERY);
    }

    @Action
    setJoinedGroupListQuery(joinedGroupListQuery: IGetGroupListQuery) {
        this.SET_JOINED_GROUP_LIST_QUERY(joinedGroupListQuery);
    }

    @Mutation
    SET_JOINED_GROUP_LIST_QUERY(joinedGroupListQuery: IGetGroupListQuery) {
        this.joinedGroupListQuery = {
            ...this.joinedGroupListQuery,
            ...joinedGroupListQuery,
        };
    }

    @Action
    async getCreatedGroupList({ append = false }: { append?: boolean }) {
        const response = await groupApiService.getUserCreatedGroups(this.createdGroupListQuery);
        if (response?.success) {
            const data = response?.data || [];
            if (!data.length) {
                this.SET_IS_FETCHED_ALL_CREATED_GROUP_LIST(true);
            }

            if (append) {
                this.APPEND_CREATED_GROUP_LIST(data);
            } else {
                this.SET_CREATED_GROUP_LIST(data);
            }
        } else {
            this.SET_IS_FETCHED_ALL_CREATED_GROUP_LIST(true);
            if (append) {
                this.APPEND_CREATED_GROUP_LIST([]);
            } else {
                this.SET_CREATED_GROUP_LIST([]);
            }
        }
    }

    @Mutation
    APPEND_CREATED_GROUP_LIST(createdGroupList: IGroup[]) {
        this.createdGroupList.push(...createdGroupList);
    }

    @Mutation
    SET_CREATED_GROUP_LIST(createdGroupList: IGroup[]) {
        this.createdGroupList = createdGroupList;
    }

    @Action
    resetCreatedGroupListQuery() {
        this.RESET_CREATED_GROUP_LIST_QUERY();
        this.SET_IS_FETCHED_ALL_CREATED_GROUP_LIST(false);
    }

    @Mutation
    RESET_CREATED_GROUP_LIST_QUERY() {
        this.createdGroupListQuery = cloneDeep(INIT_GET_GROUP_LIST_QUERY);
    }

    @Action
    setCreatedGroupListQuery(createdGroupListQuery: IGetGroupListQuery) {
        this.SET_CREATED_GROUP_LIST_QUERY(createdGroupListQuery);
    }

    @Mutation
    SET_CREATED_GROUP_LIST_QUERY(createdGroupListQuery: IGetGroupListQuery) {
        this.createdGroupListQuery = {
            ...this.createdGroupListQuery,
            ...createdGroupListQuery,
        };
    }

    @Mutation
    SET_IS_FETCHED_ALL_CREATED_GROUP_LIST(isFetchedAllCreatedGroupList: boolean) {
        this.isFetchedAllCreatedGroupList = isFetchedAllCreatedGroupList;
    }

    @Action
    setIsShowCreateNewGroupDialog(isShowCreateNewGroupDialog: boolean) {
        this.SET_IS_SHOW_CREATE_NEW_GROUP_DIALOG(isShowCreateNewGroupDialog);
    }

    @Mutation
    SET_IS_SHOW_CREATE_NEW_GROUP_DIALOG(isShowCreateNewGroupDialog: boolean) {
        this.isShowCreateNewGroupDialog = isShowCreateNewGroupDialog;
    }
}

export const groupModule = getModule(GroupModule);
