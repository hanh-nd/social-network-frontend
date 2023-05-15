<template>
    <div class="group-post-item">
        <div class="header">
            <div class="left-section">
                <div class="avatar">
                    <BaseRoundAvatar :user="post?.author" :size="42" />
                </div>
                <div class="information">
                    <div class="top-section">
                        {{ group?.name }}
                    </div>
                    <div class="bottom-section">
                        <div class="author-name">
                            {{ post?.author?.fullName }}
                        </div>
                        <div class="created-at" @click="goToPostDetailPage">
                            <el-tooltip
                                :content="parseDateTime(post?.createdAt, DateFormat.DD_vi_MM_YYYY_HH_mm)"
                                :hide-after="100"
                            >
                                {{ parseDateTimeRelative(post?.createdAt) }}
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-section">
                <div class="author-settings" v-if="isAuthor()">
                    <BaseThreeDotMenu>
                        <el-dropdown-item @click="editPost"
                            ><el-icon :size="16"><Edit /></el-icon>Chỉnh sửa bài viết</el-dropdown-item
                        >
                        <el-dropdown-item @click="deletePost"
                            ><el-icon :size="16"><Delete /></el-icon>Xóa</el-dropdown-item
                        >
                    </BaseThreeDotMenu>
                </div>
                <div class="guest-settings" v-else>
                    <BaseThreeDotMenu>
                        <el-dropdown-item @click="reportPost"
                            ><el-icon :size="16"><Service /></el-icon>Báo cáo bài viết</el-dropdown-item
                        >
                        <el-dropdown-item @click="blockUser"
                            ><el-icon :size="16"><Remove /></el-icon>Chặn người dùng này</el-dropdown-item
                        >
                    </BaseThreeDotMenu>
                </div>
            </div>
        </div>

        <div class="main-content">
            <BasePostMainContent :post="post" />
        </div>

        <BaseDivider />
        <div class="post-info">
            <div class="left-section">
                <div class="reaction-count" @click="openReactionListDialog">
                    {{ post?.numberOfReacts }}
                </div>
            </div>
            <div class="right-section">
                <div class="comment-count">
                    {{ post?.numberOfComments }}
                </div>
                <div class="share-count" @click="openShareListDialog">
                    {{ post?.numberOfShares }}
                </div>
            </div>
        </div>
        <BaseDivider />
        <div class="action-group">
            <div class="btn react">
                <el-button @click="onLike" :type="post.isReacted ? `primary` : undefined">Thích</el-button>
            </div>
            <div class="btn comment">
                <el-button @click="openPostDetailDialog">Bình luận</el-button>
            </div>
            <div class="btn share">
                <el-button @click="openSharePostDialog">Chia sẻ</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ReactionType } from '@/common/constants';
import { IGroupPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import postApiService from '@/common/service/post.api.service';
import userApiService from '@/common/service/user.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
    emits: [],
})
export default class PostContent extends GlobalMixin {
    @Prop() groupPost!: IGroupPost;

    get post() {
        return this.groupPost.post;
    }

    get group() {
        return this.groupPost.group;
    }

    goToProfilePage() {
        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: this.post?.author?._id,
            },
        });
    }

    openPostDetailDialog() {
        appModule.setPostDetail(this.post);
        appModule.setIsShowPostDetailDialog(true);
    }

    isAuthor() {
        return appModule.loginUser?._id === this.post?.author?._id;
    }

    editPost() {
        appModule.setPostDetail(this.post);
        appModule.setIsShowEditPostDialog(true);
    }

    async deletePost() {
        const response = await postApiService.deletePost(this.post._id);
        if (response?.success) {
            this.showSuccessNotificationFunction(`Xóa bài viết thành công`);
            Object.assign(this.post, {
                deletedAt: new Date(),
            });
        } else {
            this.showErrorNotificationFunction(`Xóa bài viết thất bại`);
        }
    }

    async reportPost() {
        appModule.setPostDetail(this.post);
        appModule.setIsShowReportPostDialog(true);
    }

    async blockUser() {
        if (!this.post?.author?._id) return;
        const response = await userApiService.blockUser(this.post?.author?._id);
        if (response?.success) {
            this.showSuccessNotificationFunction(`Chặn người dùng thành công`);
        } else {
            this.showErrorNotificationFunction(`Chặn người dùng thất bại`);
        }
    }

    goToPostDetailPage() {
        this.$router.push({
            name: this.PageName.POST_DETAIL_PAGE,
            params: {
                id: this.post._id,
            },
        });
    }

    async onLike() {
        this.post.isReacted = !this.post.isReacted;
        this.post.numberOfReacts += this.post.isReacted ? 1 : -1;
        await postApiService.react(this.post._id, {
            type: ReactionType.LIKE,
        });
    }

    openSharePostDialog() {
        appModule.setPostDetail(this.post);
        appModule.setIsShowSharePostDialog(true);
    }

    openReactionListDialog() {
        appModule.setPostDetail(this.post);
        appModule.setIsShowReactionListDialog(true);
    }

    openShareListDialog() {
        appModule.setPostDetail(this.post);
        appModule.setIsShowShareListDialog(true);
    }
}
</script>

<style lang="scss" scoped>
.group-post-item {
    display: flex;
    flex-direction: column;
    background: $color-white;
    border-radius: 6px;
    padding: 16px;

    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;

        .left-section {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 8px;
        }

        .information {
            display: flex;
            flex-direction: column;

            .top-section {
                font-weight: 500;
                cursor: pointer;
            }

            .bottom-section {
                display: flex;
                flex-direction: row;
                gap: 8px;

                .created-at {
                    font-size: 12px;
                    cursor: pointer;
                }
            }
        }
    }

    .post-info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .left-section {
            .reaction-count {
                cursor: pointer;
            }
        }

        .right-section {
            display: flex;
            flex-direction: row;
            gap: 16px;

            .share-count {
                cursor: pointer;
            }
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
}
</style>
