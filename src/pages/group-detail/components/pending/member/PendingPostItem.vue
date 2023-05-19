<template>
    <div class="pending-post-item-wrapper">
        <div class="top-section">
            <div class="left-section">
                <div class="avatar">
                    <BaseRoundAvatar :user="sender" :size="42" />
                </div>
            </div>
            <div class="right-section">
                <div class="full-name" @click="goToUserDetailPage">{{ sender.fullName }}</div>
                <div class="describe">{{ sender.describe }}</div>
                <div class="created-at">Yêu cầu lúc: {{ parseDateTimeRelative(groupPost?.createdAt) }}</div>
            </div>
            <div class="menu">
                <BaseThreeDotMenu>
                    <el-dropdown-item @click="editPost"
                        ><el-icon :size="16"><Edit /></el-icon>Chỉnh sửa bài viết</el-dropdown-item
                    >
                    <el-dropdown-item @click="deletePost"
                        ><el-icon :size="16"><Delete /></el-icon>Xóa</el-dropdown-item
                    >
                </BaseThreeDotMenu>
            </div>
        </div>

        <div class="middle-section">
            <BasePostMainContent :post="post" />
        </div>

        <div class="bottom-section"></div>
    </div>
</template>

<script lang="ts">
import { SubscribeRequestStatus } from '@/common/constants';
import { IGroupPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import groupApiService from '@/common/service/group.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import { Options, Prop } from 'vue-property-decorator';

@Options({
    components: {},
    emits: ['on-accept', 'on-reject'],
})
export default class PendingPostItem extends GlobalMixin {
    @Prop() groupPost!: IGroupPost;

    get group() {
        return this.groupPost?.group || {};
    }

    get post() {
        return this.groupPost?.post || {};
    }

    get sender() {
        return this.post?.author || {};
    }

    async acceptRequest() {
        const response = await groupApiService.acceptOrRejectGroupPost(this.group._id, this.groupPost._id, {
            status: SubscribeRequestStatus.ACCEPTED,
        });
        if (response?.success) {
            this.$emit('on-accept', this.groupPost._id);
            this.showSuccessNotificationFunction(`Chấp nhận yêu cầu thành công.`);
        } else {
            this.showErrorNotificationFunction(response?.message || `Chấp nhận yêu cầu thất bại.`);
        }
    }

    async rejectRequest() {
        const response = await groupApiService.acceptOrRejectGroupPost(this.group._id, this.groupPost._id, {
            status: SubscribeRequestStatus.REJECTED,
        });
        if (response?.success) {
            this.$emit('on-accept', this.groupPost._id);
            this.showSuccessNotificationFunction(`Chấp nhận yêu cầu thành công.`);
        } else {
            this.showErrorNotificationFunction(response?.message || `Chấp nhận yêu cầu thất bại.`);
        }
    }

    async onBlockUser() {
        if (!this.sender?._id) return;

        const response = await groupApiService.blockOrUnblockUser(this.group._id, this.sender._id);
        if (response?.success) {
            this.showSuccessNotificationFunction(`Chặn người dùng khỏi nhóm thành công.`);
        } else {
            this.showErrorNotificationFunction(response?.message || `Chặn người dùng khỏi nhóm thất bại.`);
        }
    }

    goToUserDetailPage() {
        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: this.sender._id,
            },
        });
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
}
</script>

<style lang="scss" scoped>
.pending-post-item-wrapper {
    padding: 16px;
    background-color: $color-white;
    border-radius: 8px;
    width: 100%;

    .top-section {
        display: flex;
        flex-direction: row;
        gap: 8px;

        .right-section {
            flex: 1;

            .full-name {
                font-weight: 500;
                cursor: pointer;
            }

            :deep(.btn) {
                padding: 0;
                margin-right: 16px;
            }

            .action {
                margin-top: 8px;
            }
        }
    }
}
</style>
