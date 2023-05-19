import { IGroup, IGroupPost, IJoinRequest, IUser } from '@/common/interfaces';
import groupApiService from '@/common/service/group.api.service';
import store from '@/plugins/vuex';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { GroupDetailScreenTab } from './constants';

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
    joinRequestList: IJoinRequest[] = [];
    isShowCreatePostDialog = false;
    groupPendingPosts: IGroupPost[] = [];
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
    async getGroupPosts(id: string) {
        const response = await groupApiService.getPosts(id);
        if (response.success) {
            this.SET_GROUP_POST_LIST(response.data);
        } else {
            this.SET_GROUP_POST_LIST([]);
        }
    }

    @Mutation
    SET_GROUP_POST_LIST(groupPostList: IGroupPost[]) {
        this.groupPostList.push(...groupPostList);
    }

    @Action
    async getJoinRequestList(id: string) {
        const response = await groupApiService.getJoinRequests(id);
        if (response?.success) {
            this.SET_JOIN_REQUEST_LIST(response?.data || []);
        } else {
            this.SET_JOIN_REQUEST_LIST([]);
        }
    }

    @Mutation
    SET_JOIN_REQUEST_LIST(joinRequestList: IJoinRequest[]) {
        this.joinRequestList = joinRequestList;
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
    async getGroupPendingPosts(id: string) {
        const response = await groupApiService.getPendingGroupPosts(id);
        if (response?.success) {
            this.SET_GROUP_PENDING_POSTS(response?.data || []);
        } else {
            this.SET_GROUP_PENDING_POSTS([]);
        }
    }

    @Mutation
    SET_GROUP_PENDING_POSTS(groupPendingPosts: IGroupPost[]) {
        this.groupPendingPosts = groupPendingPosts;
    }

    @Action
    async getMemberPendingPosts(id: string) {
        const response = await groupApiService.getUserPendingPost(id);
        if (response?.success) {
            this.SET_GROUP_PENDING_POSTS(response?.data || []);
        } else {
            this.SET_GROUP_PENDING_POSTS([]);
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
