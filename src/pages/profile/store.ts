import { IGetPostListQuery, IPost, IUser, IUserDetail } from '@/common/interfaces';
import userApiService from '@/common/service/user.api.service';
import store from '@/plugins/vuex';
import { cloneDeep } from 'lodash';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { INIT_GET_POST_LIST_QUERY, ProfileScreenTab } from './constants';

@Module({
    name: 'profile',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class ProfileModule extends VuexModule {
    profileUser: IUser | null = null;
    profileDetail: IUserDetail = {} as IUserDetail;
    profilePostList: IPost[] = [];
    profilePostListQuery: IGetPostListQuery = cloneDeep(INIT_GET_POST_LIST_QUERY);
    isFetchedAllPostList = false;
    profileScreenTab = ProfileScreenTab.MAIN;
    subscriberList: IUser[] = [];
    subscribingList: IUser[] = [];

    @Action
    async getProfileUser(userId: string) {
        if (!userId) {
            this.SET_PROFILE_USER(null);
        }

        const response = await userApiService.getUserProfile(userId);
        if (response.success) {
            this.SET_PROFILE_USER(response?.data || null);
        } else {
            this.SET_PROFILE_USER(null);
        }
    }

    @Mutation
    SET_PROFILE_USER(user: IUser | null) {
        this.profileUser = user;
    }

    @Action
    async getProfilePostList({ id, append = false }: { id: string; append?: boolean }) {
        if (!id) return;

        const response = await userApiService.getUserPostList(id, this.profilePostListQuery);
        if (response?.success) {
            const data = response?.data || [];
            if (!data.length) {
                this.SET_IS_FETCHED_ALL_POST_LIST(true);
            }
            if (append) {
                this.APPEND_PROFILE_POST_LIST(data);
            } else {
                this.SET_PROFILE_POST_LIST(data);
            }
        } else {
            this.SET_IS_FETCHED_ALL_POST_LIST(true);
            if (append) {
                this.APPEND_PROFILE_POST_LIST([]);
            } else {
                this.SET_PROFILE_POST_LIST([]);
            }
        }
    }

    @Action
    resetProfilePostListQuery() {
        this.SET_PROFILE_POST_LIST_QUERY(cloneDeep(INIT_GET_POST_LIST_QUERY));
    }

    @Action
    setProfilePostListQuery(postListQuery: IGetPostListQuery) {
        this.SET_PROFILE_POST_LIST_QUERY(postListQuery);
    }

    @Mutation
    SET_PROFILE_POST_LIST_QUERY(postListQuery: IGetPostListQuery) {
        this.profilePostListQuery = {
            ...this.profilePostListQuery,
            ...postListQuery,
        };
    }

    @Mutation
    APPEND_PROFILE_POST_LIST(postList: IPost[]) {
        this.profilePostList.push(...postList);
    }

    @Mutation
    SET_PROFILE_POST_LIST(postList: IPost[]) {
        this.profilePostList = postList;
    }

    @Mutation
    SET_IS_FETCHED_ALL_POST_LIST(isFetchedAllPostList: boolean) {
        this.isFetchedAllPostList = isFetchedAllPostList;
    }

    @Action
    setProfileScreenTab(profileScreenTab: ProfileScreenTab) {
        this.SET_PROFILE_SCREEN_TAB(profileScreenTab);
    }

    @Mutation
    SET_PROFILE_SCREEN_TAB(profileScreenTab: ProfileScreenTab) {
        this.profileScreenTab = profileScreenTab;
    }

    @Action
    async getSubscriberList(userId?: string) {
        if (!userId) return;

        const response = await userApiService.getSubscriberList(userId);
        if (response?.success) {
            this.SET_SUBSCRIBER_LIST(response?.data || []);
        } else {
            this.SET_SUBSCRIBER_LIST([]);
        }
    }

    @Mutation
    SET_SUBSCRIBER_LIST(subscriberList: IUser[]) {
        this.subscriberList = subscriberList;
    }

    @Action
    async getSubscribingList(userId?: string) {
        if (!userId) return;

        const response = await userApiService.getSubscribingList(userId);
        if (response?.success) {
            this.SET_SUBSCRIBING_LIST(response?.data || []);
        } else {
            this.SET_SUBSCRIBING_LIST([]);
        }
    }

    @Mutation
    SET_SUBSCRIBING_LIST(subscribingList: IUser[]) {
        this.subscribingList = subscribingList;
    }

    @Action
    async getProfileDetail(userId?: string) {
        if (!userId) return;

        const response = await userApiService.getUserDetail(userId);
        if (response?.success) {
            this.SET_PROFILE_DETAIL(response?.data || {});
        } else {
            this.SET_PROFILE_DETAIL({} as IUserDetail);
        }
    }

    @Mutation
    SET_PROFILE_DETAIL(profileDetail: IUserDetail) {
        this.profileDetail = profileDetail;
    }
}

export const profileModule = getModule(ProfileModule);
