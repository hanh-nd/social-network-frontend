import { IGetUserListQuery, IPost } from '@/common/interfaces';
import postApiService from '@/common/service/post.api.service';
import userApiService from '@/common/service/user.api.service';
import store from '@/plugins/vuex';
import { cloneDeep } from 'lodash';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { IUser } from './../../common/interfaces';
import { FeedScreenType, INIT_GET_USER_LIST_QUERY } from './constants';

@Module({
    name: 'home',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class HomeModule extends VuexModule {
    isShowCreatePostDialog = false;
    feedScreenType = FeedScreenType.MAIN;
    postList: IPost[] = [];
    contactList: IUser[] = [];
    contactListQuery: IGetUserListQuery = cloneDeep(INIT_GET_USER_LIST_QUERY);
    isFetchedAllContactList = false;

    @Action
    setIsShowCreatePostDialog(isShowCreatePostDialog: boolean) {
        this.SET_IS_SHOW_CREATE_POST_DIALOG(isShowCreatePostDialog);
    }

    @Mutation
    SET_IS_SHOW_CREATE_POST_DIALOG(isShowCreatePostDialog: boolean) {
        this.isShowCreatePostDialog = isShowCreatePostDialog;
    }

    @Action
    setFeedScreenType(feedScreenType: FeedScreenType) {
        this.SET_FEED_SCREEN_TYPE(feedScreenType);
    }

    @Mutation
    SET_FEED_SCREEN_TYPE(feedScreenType: FeedScreenType) {
        this.feedScreenType = feedScreenType;
    }

    @Action
    async getNewsFeed() {
        const response = await postApiService.getNewsFeed();
        if (response.success) {
            this.SET_POST_LIST(response.data);
        } else {
            this.SET_POST_LIST([]);
        }
    }

    @Mutation
    SET_POST_LIST(postList: IPost[]) {
        this.postList.push(...postList);
    }

    @Action
    async getSubscribing({ id, append = false }: { id: string; append?: boolean }) {
        const response = await userApiService.getSubscribingList(id, this.contactListQuery);
        if (response?.success) {
            const data = response?.data || [];
            if (!data.length) {
                this.SET_IS_FETCHED_ALL_CONTACT_LIST(true);
            }
            if (append) {
                this.APPEND_CONTACT_LIST(data);
            } else {
                this.SET_CONTACT_LIST(data);
            }
        } else {
            if (append) {
                this.APPEND_CONTACT_LIST([]);
            } else {
                this.SET_CONTACT_LIST([]);
            }
            this.SET_IS_FETCHED_ALL_CONTACT_LIST(true);
        }
    }

    @Mutation
    APPEND_CONTACT_LIST(contactList: IUser[]) {
        this.contactList.push(...contactList);
    }

    @Mutation
    SET_CONTACT_LIST(contactList: IUser[]) {
        this.contactList = contactList;
    }

    @Action
    resetContactListQuery() {
        this.SET_CONTACT_LIST_QUERY(INIT_GET_USER_LIST_QUERY);
    }

    @Action
    setContactListQuery(contactListQuery: IGetUserListQuery) {
        this.SET_CONTACT_LIST_QUERY(contactListQuery);
    }

    @Mutation
    SET_CONTACT_LIST_QUERY(contactListQuery: IGetUserListQuery) {
        this.contactListQuery = {
            ...this.contactListQuery,
            ...contactListQuery,
        };
    }

    @Mutation
    SET_IS_FETCHED_ALL_CONTACT_LIST(isFetchedAllContactList: boolean) {
        this.isFetchedAllContactList = isFetchedAllContactList;
    }
}

export const homeModule = getModule(HomeModule);
