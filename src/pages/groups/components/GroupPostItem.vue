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
                <div class="admin-settings" v-if="isAdministrator">
                    <BaseThreeDotMenu>
                        <el-dropdown-item @click="pinPost"
                            ><el-icon :size="16"><Edit /></el-icon
                            >{{ isPostPinned ? `Bỏ ghim bài viết` : `Ghim bài viết` }}</el-dropdown-item
                        >
                        <el-dropdown-item @click="deletePost"
                            ><el-icon :size="16"><Delete /></el-icon>Xóa</el-dropdown-item
                        >
                    </BaseThreeDotMenu>
                </div>
                <div class="author-settings" v-else-if="isAuthor()">
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
                <div class="share-count" @click="openShareListDialog" v-if="!group.private">
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
            <div class="btn share" v-if="!group.private">
                <el-button @click="openSharePostDialog">Chia sẻ</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ReactionType } from '@/common/constants';
import { IGroupPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import groupApiService from '@/common/service/group.api.service';
import postApiService from '@/common/service/post.api.service';
import userApiService from '@/common/service/user.api.service';
import { groupDetailModule } from '@/pages/group-detail/store';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Options({
    components: {},
    emits: [],
})
export default class PostContent extends GlobalMixin {
    @Prop() groupPost!: IGroupPost;
    isPostPinned = false;

    mounted() {
        this.isPostPinned = this.group.pinnedPosts?.includes(`${this.groupPost._id}` as unknown as IGroupPost);
    }

    @Watch('group')
    setIsPinnedPost() {
        this.isPostPinned = this.group.pinnedPosts.includes(`${this.groupPost._id}` as unknown as IGroupPost);
    }

    get post() {
        return this.groupPost.post;
    }

    get group() {
        return this.groupPost.group;
    }

    get administratorIds() {
        return this.group?.administrators?.map((admin) => `${admin.user}`) || [];
    }

    get loginUser() {
        return appModule.loginUser;
    }

    get isAdministrator() {
        return this.administratorIds.includes(`${this.loginUser?._id}`);
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

    async pinPost() {
        const response = await groupApiService.pinOrUnpinGroupPost(this.group._id, this.groupPost._id);
        if (response?.success) {
            this.showSuccessNotificationFunction(`${this.isPostPinned ? `Bỏ ghim` : `Ghim`} bài viết thành công.`);
            groupDetailModule.getGroupDetail(this.group._id);
            this.isPostPinned = !this.isPostPinned;
        } else {
            this.showErrorNotificationFunction(response?.message || `Ghim bài viết thất bại.`);
        }
    }

    editPost() {
        appModule.setPostDetail(this.post);
        appModule.setIsShowEditPostDialog(true);
    }

    async deletePost() {
        const response = await groupApiService.deletePost(this.group._id, this.groupPost._id);
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
