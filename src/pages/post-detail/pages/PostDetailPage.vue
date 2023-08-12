<template>
    <div class="post-detail-page-wrapper">
        <div class="post-detail-page-container mx-auto">
            <BasePost :post="postDetail" />
            <BaseDivider />
            <div class="create-comment">
                <BaseCreateCommentBar :postId="postDetail._id" @on-commented="onCommented" />
            </div>

            <div class="comment-list">
                <BaseCommentList :commentList="commentList" @on-load-more="onLoadMoreComments" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IComment } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { postDetailModule } from '../store';

@Options({})
export default class PostDetailPage extends GlobalMixin {
    get id() {
        return this.$route.params.id as string;
    }

    get postDetail() {
        return postDetailModule.postDetail;
    }

    get commentList() {
        return postDetailModule.commentList;
    }

    created(): void {
        this.loadData();
    }

    loadData() {
        postDetailModule.getPostDetail(this.id);
        postDetailModule.getCommentList(this.id);
    }

    onCommented(comment: IComment) {
        this.postDetail.numberOfComments = (this.postDetail?.numberOfComments || 0) + 1;
        this.commentList.unshift(comment);
    }

    onLoadMoreComments() {
        postDetailModule.getCommentList(this.id);
    }
}
</script>

<style lang="scss" scoped>
.post-detail-page-wrapper {
    width: 100%;
    background: $color-gray;
    min-height: calc(100vh - 50px);
    padding: $content-padding 0;

    .post-detail-page-container {
        width: 100%;
        max-width: 1120px;
        padding: $content-padding;
        margin: auto;
        background: $color-white;
        border-radius: 8px;

        :deep(.post-wrapper) {
            padding: 0;
        }

        .create-comment {
            margin-bottom: 16px;
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .post-detail-page-wrapper {
        padding: 8px;
    }
}
</style>
