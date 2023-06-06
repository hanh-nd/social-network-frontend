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
                        {{ post?.author?.fullName || 'hihi' }}
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
                    {{ post?.content }}
                </div>
                <div class="images">
                    <el-carousel width="100%">
                        <el-carousel-item v-for="image in post.pictureIds" :key="image">
                            <img :src="getImageSourceById(image)" alt="" />
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>

            <BaseDivider />
            <div class="post-info">
                <div class="left-section">
                    <div class="reaction-count">
                        {{ post?.numberOfReacts }}
                    </div>
                </div>
                <div class="right-section">
                    <div class="comment-count">
                        {{ post?.numberOfComments }}
                    </div>
                    <div class="share-count">
                        {{ post?.numberOfShares }}
                    </div>
                </div>
            </div>
            <BaseDivider />
            <div class="action-group">
                <div class="btn react">
                    <el-button @click="onLike" :type="post.isReacted ? `primary` : undefined">Thích</el-button>
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
                <BaseCommentList :commentList="commentList" @on-load-more="onLoadMoreComments" />
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { ReactionType } from '@/common/constants';
import { IComment } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import commentApiService from '@/common/service/comment.api.service';
import postApiService from '@/common/service/post.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';

@Options({
    components: {},
    emits: [],
})
export default class PostDetailDialog extends GlobalMixin {
    commentList: IComment[] = [];

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
        this.commentList = [];
    }

    async loadData() {
        const response = await commentApiService.getComment(this.post._id);
        if (response.success) {
            this.commentList.push(...(response?.data || []));
        } else {
            this.commentList = [];
        }
    }

    async onLike() {
        this.post.isReacted = !this.post.isReacted;
        this.post.numberOfReacts += this.post.isReacted ? 1 : -1;
        await postApiService.react(this.post._id, {
            type: ReactionType.LIKE,
        });
    }

    onCommented() {
        this.post.numberOfComments++;
        this.loadData();
    }

    onLoadMoreComments() {
        this.loadData();
    }

    openSharePostDialog() {
        appModule.setPostDetail(this.post);
        appModule.setIsShowSharePostDialog(true);
    }
}
</script>

<style lang="scss" scoped>
:deep(.post-detail-dialog) {
    margin-top: 40px;
    height: 90%;
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
        .images {
            img {
                width: 100%;
                object-fit: cover;
            }
        }
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
