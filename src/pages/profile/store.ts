import { IPost, IUser } from '@/common/interfaces';
import userApiService from '@/common/service/user.api.service';
import store from '@/plugins/vuex';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';

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
}

export const profileModule = getModule(ProfileModule);
