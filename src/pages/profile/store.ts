import { IPost, IUser } from '@/common/interfaces';
import userApiService from '@/common/service/user.api.service';
import store from '@/plugins/vuex';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { ProfileScreenTab } from './constants';

@Module({
    name: 'profile',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class ProfileModule extends VuexModule {
    profileUser: IUser | null = null;
    profilePostList: IPost[] = [];
    profileScreenTab = ProfileScreenTab.MAIN;
    subscriberList: IUser[] = [];
    subscribingList: IUser[] = [];

    @Action
    async getProfileUser(userId: string) {
        if (!userId) {
            this.SET_PROFILE_USER(null);
        }

        const response = await userApiService.getUserDetail(userId);
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
    async getProfilePostList(userId: string) {
        if (!userId) return;

        const response = await userApiService.getUserPostList(userId);
        if (response?.success) {
            this.SET_PROFILE_POST_LIST(response?.data || []);
        } else {
            this.SET_PROFILE_POST_LIST([]);
        }
    }

    @Mutation
    SET_PROFILE_POST_LIST(postList: IPost[]) {
        this.profilePostList.push(...postList);
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
}

export const profileModule = getModule(ProfileModule);
