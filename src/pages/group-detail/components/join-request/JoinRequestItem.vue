<template>
    <div class="join-request-wrapper">
        <div class="left-section">
            <div class="avatar">
                <BaseRoundAvatar :user="sender" :size="42" />
            </div>
        </div>
        <div class="right-section">
            <div class="full-name" @click="goToUserDetailPage">{{ sender.fullName }}</div>
            <div class="describe">{{ sender.describe }}</div>
            <div class="created-at">Yêu cầu tham gia lúc: {{ parseDateTimeRelative(joinRequest?.createdAt) }}</div>
            <div class="action">
                <div class="btn accept">
                    <el-button type="primary" @click="acceptRequest">Chấp nhận</el-button>
                </div>
                <div class="btn reject">
                    <el-button @click="rejectRequest">Từ chối</el-button>
                </div>
            </div>
        </div>
        <div class="menu">
            <BaseThreeDotMenu>
                <el-dropdown-item @click="onBlockUser">Chặn khỏi nhóm</el-dropdown-item>
            </BaseThreeDotMenu>
        </div>
    </div>
</template>

<script lang="ts">
import { SubscribeRequestStatus } from '@/common/constants';
import { IJoinRequest } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import groupApiService from '@/common/service/group.api.service';
import { Options, Prop } from 'vue-property-decorator';

@Options({
    components: {},
    emits: ['on-accept', 'on-reject'],
})
export default class JoinRequestItem extends GlobalMixin {
    @Prop() joinRequest!: IJoinRequest;

    get sender() {
        return this.joinRequest?.sender || {};
    }

    async acceptRequest() {
        const response = await groupApiService.acceptOrRejectJoinRequest(this.joinRequest.group, this.joinRequest._id, {
            status: SubscribeRequestStatus.ACCEPTED,
        });
        if (response?.success) {
            this.$emit('on-accept', this.joinRequest._id);
            this.showSuccessNotificationFunction(`Chấp nhận yêu cầu thành công.`);
        } else {
            this.showErrorNotificationFunction(response?.message || `Chấp nhận yêu cầu thất bại.`);
        }
    }

    async rejectRequest() {
        const response = await groupApiService.acceptOrRejectJoinRequest(this.joinRequest.group, this.joinRequest._id, {
            status: SubscribeRequestStatus.REJECTED,
        });
        if (response?.success) {
            this.$emit('on-reject', this.joinRequest._id);
            this.showSuccessNotificationFunction(`Từ chối yêu cầu thành công.`);
        } else {
            this.showErrorNotificationFunction(response?.message || `Từ chối yêu cầu thất bại.`);
        }
    }

    async onBlockUser() {
        const response = await groupApiService.blockOrUnblockUser(this.joinRequest.group, this.sender._id);
        if (response?.success) {
            this.showSuccessNotificationFunction(`Chặn người dùng khỏi nhóm thành công.`);
        } else {
            this.showErrorNotificationFunction(response?.message || `Chặn người dùng khỏi nhóm thất bại.`);
        }
    }

    goToUserDetailPage() {
        if (!this.sender?._id) return;

        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: this.sender._id,
            },
        });
    }
}
</script>

<style lang="scss" scoped>
.join-request-wrapper {
    display: flex;
    flex-direction: row;
    gap: 8px;
    padding: 16px;
    background-color: $color-white;
    border-radius: 8px;
    width: 100%;

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
</style>
