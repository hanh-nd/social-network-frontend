import { IGetPostListQuery, IPost } from '@/common/interfaces';
import adminPostApiService from '@/common/service/admin.post.api.service';
import { INIT_GET_POST_LIST_QUERY } from '@/pages/profile/constants';
import store from '@/plugins/vuex';
import { cloneDeep } from 'lodash';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';

@Module({
    name: 'admin-posts',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class AdminPostModule extends VuexModule {
    postList: IPost[] = [];
    postListQuery: IGetPostListQuery = cloneDeep(INIT_GET_POST_LIST_QUERY);
    isFetchedAllPostList = false;

    @Action
    async getPostList() {
        const response = await adminPostApiService.getPostList(this.postListQuery);
        if (response.success) {
            const data = response?.data || [];
            if (!data.length) {
                this.SET_IS_FETCHED_ALL_POST_LIST(true);
            }
            this.SET_POST_LIST(data);
        } else {
            this.SET_POST_LIST([]);

            this.SET_IS_FETCHED_ALL_POST_LIST(true);
        }
    }

    @Mutation
    SET_POST_LIST(postList: IPost[]) {
        this.postList = postList;
    }

    @Action
    setIsFetchedAllPostList(isFetchedAllPostList: boolean) {
        this.SET_IS_FETCHED_ALL_POST_LIST(isFetchedAllPostList);
    }

    @Mutation
    SET_IS_FETCHED_ALL_POST_LIST(isFetchedAllPostList: boolean) {
        this.isFetchedAllPostList = isFetchedAllPostList;
    }

    @Action
    resetPostListQuery() {
        this.RESET_POST_LIST_QUERY();
        this.SET_IS_FETCHED_ALL_POST_LIST(false);
    }

    @Mutation
    RESET_POST_LIST_QUERY() {
        this.postListQuery = cloneDeep(INIT_GET_POST_LIST_QUERY);
    }

    @Action
    setPostListQuery(postListQuery: IGetPostListQuery) {
        this.SET_POST_LIST_QUERY(postListQuery);
    }

    @Mutation
    SET_POST_LIST_QUERY(postListQuery: IGetPostListQuery) {
        this.postListQuery = {
            ...this.postListQuery,
            ...postListQuery,
        };
    }
}
export const adminPostModule = getModule(AdminPostModule);
