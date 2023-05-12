import { IComment, IPost } from '@/common/interfaces';
import commentApiService from '@/common/service/comment.api.service';
import postApiService from '@/common/service/post.api.service';
import store from '@/plugins/vuex';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';

@Module({
    name: 'post-detail',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class PostDetailModule extends VuexModule {
    postDetail: Partial<IPost> = {};
    commentList: IComment[] = [];

    @Action
    async getPostDetail(id: string) {
        const response = await postApiService.getPostDetail(id);
        if (response?.success) {
            this.SET_POST_DETAIL(response?.data || {});
        } else {
            this.SET_POST_DETAIL({});
        }
    }

    @Mutation
    SET_POST_DETAIL(postDetail: Partial<IPost>) {
        this.postDetail = postDetail;
    }

    @Action
    async getCommentList(postId: string) {
        const response = await commentApiService.getComment(postId);
        if (response?.success) {
            this.SET_COMMENT_LIST(response?.data || []);
        } else {
            this.SET_COMMENT_LIST([]);
        }
    }

    @Mutation
    SET_COMMENT_LIST(commentList: IComment[]) {
        this.commentList = commentList;
    }
}

export const postDetailModule = getModule(PostDetailModule);
