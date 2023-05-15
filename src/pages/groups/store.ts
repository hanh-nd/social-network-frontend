import { IGroup, IGroupPost } from '@/common/interfaces';
import groupApiService from '@/common/service/group.api.service';
import store from '@/plugins/vuex';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { FeedScreenType } from './constants';

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
    joinedGroupList: IGroup[] = [];
    createdGroupList: IGroup[] = [];
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
    async getGroupFeed() {
        const response = await groupApiService.getGroupFeed();
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
    async getJoinedGroupList() {
        const response = await groupApiService.getUserJoinedGroups();
        if (response?.success) {
            this.SET_JOINED_GROUP_LIST(response?.data || []);
        } else {
            this.SET_JOINED_GROUP_LIST([]);
        }
    }

    @Mutation
    SET_JOINED_GROUP_LIST(joinedGroupList: IGroup[]) {
        this.joinedGroupList = joinedGroupList;
    }

    @Action
    async getCreatedGroupList() {
        const response = await groupApiService.getUserCreatedGroups();
        if (response?.success) {
            this.SET_CREATED_GROUP_LIST(response?.data || []);
        } else {
            this.SET_CREATED_GROUP_LIST([]);
        }
    }

    @Mutation
    SET_CREATED_GROUP_LIST(createdGroupList: IGroup[]) {
        this.createdGroupList = createdGroupList;
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
