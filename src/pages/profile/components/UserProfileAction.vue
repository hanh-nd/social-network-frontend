<template>
    <div class="user-profile-action-wrapper">
        <el-button @click="subscribeOrUnsubscribe" :type="isSubscribing ? `default` : `primary`">{{
            isSubscribing ? `Hủy theo dõi` : `Theo dõi`
        }}</el-button>
        <el-button>Nhắn tin</el-button>
        <BaseThreeDotMenu>
            <el-dropdown-item>Báo cáo</el-dropdown-item>
            <el-dropdown-item>Chặn</el-dropdown-item>
        </BaseThreeDotMenu>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import userApiService from '@/common/service/user.api.service';
import { Options } from 'vue-class-component';
import { profileModule } from '../store';

@Options({
    components: {},
})
export default class UserProfileAction extends GlobalMixin {
    get profileUser() {
        return profileModule.profileUser;
    }

    get isSubscribing() {
        return this.profileUser?.isSubscribing || false;
    }

    async subscribeOrUnsubscribe() {
        if (!this.profileUser) return;

        const response = await userApiService.subscribeOrUnsubscribe(this.profileUser._id);
        if (response?.success) {
            //
        } else {
            this.showErrorNotificationFunction(response?.message || 'Có lỗi xảy ra.');
        }
    }
}
</script>

<style lang="scss" scoped>
.user-profile-action-wrapper {
    display: flex;
    flex-direction: row;
    gap: 8px;
}
</style>
