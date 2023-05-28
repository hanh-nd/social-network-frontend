<template>
    <div class="user-profile-action-wrapper">
        <el-button @click="subscribeOrUnsubscribe" :type="isSubscribing ? `default` : `primary`" v-if="!isSelf">{{
            isSubscribing ? `Hủy theo dõi` : isSentRequest ? `Hủy yêu cầu` : `Theo dõi`
        }}</el-button>
        <el-button v-if="!(isPrivate && !isSubscribing) && !isMobile">Nhắn tin</el-button>
        <BaseThreeDotMenu>
            <el-dropdown-item v-if="!(isPrivate && !isSubscribing) && isMobile">Nhắn tin</el-dropdown-item>
            <el-dropdown-item>Báo cáo</el-dropdown-item>
            <el-dropdown-item @click="block">Chặn</el-dropdown-item>
        </BaseThreeDotMenu>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import userApiService from '@/common/service/user.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import { profileModule } from '../store';

@Options({
    components: {},
})
export default class UserProfileAction extends GlobalMixin {
    get profileUser() {
        return profileModule.profileUser;
    }

    get isSelf() {
        return this.profileUser?.isSelf || false;
    }

    get isSubscribing() {
        return this.profileUser?.isSubscribing || false;
    }

    get isSentRequest() {
        return this.profileUser?.isSentRequest || false;
    }

    get isPrivate() {
        return this.profileUser?.private || true;
    }

    get isMobile() {
        return appModule.isMobile;
    }

    async subscribeOrUnsubscribe() {
        if (!this.profileUser) return;

        const response = await userApiService.subscribeOrUnsubscribe(this.profileUser._id);
        if (response?.success) {
            profileModule.getProfileUser(this.profileUser._id);
        } else {
            this.showErrorNotificationFunction(response?.message || 'Có lỗi xảy ra.');
        }
    }

    async block() {
        if (!this.profileUser) return;

        const response = await userApiService.blockUser(this.profileUser._id);
        if (response?.success) {
            profileModule.getProfileUser(this.profileUser._id);
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
