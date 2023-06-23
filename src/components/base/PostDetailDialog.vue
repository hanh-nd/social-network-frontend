<template>
    <div class="post-detail-dialog-wrapper">
        <el-dialog
            custom-class="post-detail-dialog"
            :model-value="isShowPostDetailDialog"
            title="Bài viết"
            @opened="onOpen"
            @closed="onClose"
            :width="deviceType === DeviceType.MOBILE ? `80%` : `50%`"
            center
        >
            <div class="header">
                <div class="avatar">
                    <BaseRoundAvatar :user="post?.author" :size="42" />
                </div>
                <div class="information">
                    <div class="name" @click="goToProfilePage">
                        {{ post?.author?.fullName }}
                    </div>
                    <div class="created-at">
                        <el-tooltip
                            :content="parseDateTime(post?.createdAt, DateFormat.DD_vi_MM_YYYY_HH_mm)"
                            :hide-after="100"
                        >
                            {{ parseDateTimeRelative(post?.createdAt) }}
                        </el-tooltip>
                    </div>
                </div>
                <div class="settings"></div>
            </div>

            <div class="main-content">
                <div class="content">
                    <BaseCensorableContent :target="post" />
                </div>
                <div class="images" v-if="post.medias.length">
                    <el-carousel class="carousel" :autoplay="false" width="100%">
                        <el-carousel-item v-for="media in post.medias" :key="media._id">
                            <BaseMedia :media="media" />
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>

            <BaseDivider />
            <div class="post-info">
                <div class="left-section">
                    <div class="reaction-count">
                        <Icon icon="solar:like-bold" height="16" />
                        {{ post?.numberOfReacts }}
                    </div>
                </div>
                <div class="right-section">
                    <div class="comment-count">
                        <Icon icon="iconamoon:comment-fill" height="16" />
                        {{ post?.numberOfComments }}
                    </div>
                    <div class="share-count">
                        <Icon icon="majesticons:share" height="16" />
                        {{ post?.numberOfShares }}
                    </div>
                </div>
            </div>
            <BaseDivider />
            <div class="action-group">
                <div class="btn react">
                    <BaseFullReactionBar :target="post" :onLike="onLike" />
                </div>
                <div class="btn share">
                    <el-button @click="openSharePostDialog">Chia sẻ</el-button>
                </div>
            </div>
            <BaseDivider />
            <div class="create-comment">
                <BaseCreateCommentBar :postId="post._id" @on-commented="onCommented" />
            </div>

            <div class="comment-list">
                <BaseCommentList :commentList="commentList" @on-load-more="onLoadMoreCommentDebounced" />
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { INIT_GET_COMMENT_LIST_QUERY, ReactionType } from '@/common/constants';
import { IComment, IGetCommentListQuery } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import commentApiService from '@/common/service/comment.api.service';
import postApiService from '@/common/service/post.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import { Icon } from '@iconify/vue';
import { cloneDeep, debounce } from 'lodash';
import { Options } from 'vue-class-component';

@Options({
    components: { Icon },
    emits: [],
})
export default class PostDetailDialog extends GlobalMixin {
    commentList: IComment[] = [];
    commentListQuery: IGetCommentListQuery = cloneDeep(INIT_GET_COMMENT_LIST_QUERY);
    isFetchedAllCommentList = false;

    get post() {
        return appModule.postDetail;
    }

    get isShowPostDetailDialog() {
        return appModule.isShowPostDetailDialog;
    }

    get deviceType() {
        return appModule.deviceType;
    }

    goToProfilePage() {
        this.onClose();

        if (!this.post?.author?._id) return;

        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: this.post?.author?._id,
            },
        });
    }

    onOpen() {
        this.loadData();
    }

    onClose() {
        appModule.setIsShowPostDetailDialog(false);
        this.commentListQuery = cloneDeep(INIT_GET_COMMENT_LIST_QUERY);
        this.isFetchedAllCommentList = false;
        this.commentList = [];
    }

    async loadData() {
        this.commentListQuery = cloneDeep(INIT_GET_COMMENT_LIST_QUERY);
        this.getCommentList();
    }

    async getCommentList(append = false) {
        const response = await commentApiService.getComment(this.post._id, this.commentListQuery);
        if (response.success) {
            const data = response?.data || [];
            if (!data.length) {
                this.isFetchedAllCommentList = true;
            }
            if (append) {
                this.commentList.push(...data);
            } else {
                this.commentList = data;
            }
        } else {
            this.isFetchedAllCommentList = true;
            if (append) {
                this.commentList.push();
            } else {
                this.commentList = [];
            }
        }
    }

    async onLike() {
        this.post.isReacted = !this.post.isReacted;
        this.post.numberOfReacts += this.post.isReacted ? 1 : -1;
        await postApiService.react(this.post._id, {
            type: ReactionType.LIKE,
        });
    }

    onCommented(comment: IComment) {
        this.post.numberOfComments++;
        this.commentList.unshift(comment);
    }

    onLoadMoreCommentDebounced = debounce(() => {
        if (this.isFetchedAllCommentList) return;
        this.commentListQuery = {
            ...this.commentListQuery,
            page: (this.commentListQuery.page || 1) + 1,
        };
        this.getCommentList(true);
    }, 50);

    openSharePostDialog() {
        appModule.setPostDetail(this.post);
        appModule.setIsShowSharePostDialog(true);
    }
}
</script>

<style lang="scss" scoped>
:deep(.post-detail-dialog) {
    margin-top: 40px;
    max-height: 90%;
    overflow: auto;
    .el-dialog__body {
        display: flex;
        flex-direction: column;
    }

    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;

        .information {
            display: flex;
            flex-direction: column;

            .name {
                font-weight: 500;
                cursor: pointer;
            }

            .created-at {
                font-size: 12px;
            }
        }
    }

    .main-content {
        min-height: 100px;
    }

    .post-info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .right-section {
            display: flex;
            flex-direction: row;
            gap: 16px;
        }
    }

    .action-group {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        :deep(.full-reaction-popover) {
            width: 300px !important;
            .full-reaction {
                display: flex;
                flex-direction: row;
            }
        }

        .btn {
            width: 100%;

            .el-button {
                width: 100%;
            }
        }
    }

    .create-comment {
        margin-bottom: 16px;
    }
}
</style>
