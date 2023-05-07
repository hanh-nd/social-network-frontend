import { IPost } from '@/common/interfaces';
import postApiService from '@/common/service/post.api.service';
import store from '@/plugins/vuex';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { FeedScreenType } from './constants';

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
}

export const homeModule = getModule(HomeModule);
