<template>
    <div class="post-content-wrapper">
        <div class="header">
            <div class="left-section">
                <div class="avatar">
                    <BaseRoundAvatar :user="post?.author" :size="42" />
                </div>
                <div class="information">
                    <div class="name" @click="goToProfilePage">
                        {{ post?.author?.fullName || 'hihi' }}
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
    </div>
</template>

<script lang="ts">
import { IPost } from '@/common/interfaces';
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
    @Prop() post!: IPost;

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
}
</script>

<style lang="scss" scoped>
.post-content-wrapper {
    display: flex;
    flex-direction: column;

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

            .name {
                font-weight: 500;
                cursor: pointer;
            }

            .created-at {
                font-size: 12px;
                cursor: pointer;
            }
        }
    }
}
</style>
