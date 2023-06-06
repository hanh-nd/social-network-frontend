<template>
    <div class="user-profile-action-wrapper">
        <el-button @click="subscribeOrUnsubscribe" :type="isSubscribing ? `default` : `primary`">{{
            isSubscribing ? `Hủy theo dõi` : `Theo dõi`
        }}</el-button>
        <el-button v-if="!isMobile">Nhắn tin</el-button>
        <BaseThreeDotMenu>
            <el-dropdown-item v-if="isMobile">Nhắn tin</el-dropdown-item>
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
import { appModule } from '@/plugins/vuex/appModule';

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
}
</script>

<style lang="scss" scoped>
.user-profile-action-wrapper {
    display: flex;
    flex-direction: row;
    gap: 8px;
}
</style>
