<template>
    <div class="user-profile-action-wrapper">
        <el-button @click="subscribeOrUnsubscribe" :type="isSubscribing ? `default` : `primary`" v-if="!isSelf">{{
            isSubscribing ? `Hủy theo dõi` : isSentRequest ? `Hủy yêu cầu` : `Theo dõi`
        }}</el-button>
        <el-button v-if="!(isPrivate && !isSubscribing) && !isMobile">Nhắn tin</el-button>
        <BaseThreeDotMenu>
            <el-dropdown-item v-if="!(isPrivate && !isSubscribing) && isMobile" @click="goToChatPage"
                >Nhắn tin</el-dropdown-item
            >
            <el-dropdown-item @click="createAskUserQuestion">Đặt câu hỏi</el-dropdown-item>
            <el-dropdown-item @click="openReportUserDialog">Báo cáo</el-dropdown-item>
            <el-dropdown-item @click="block">Chặn</el-dropdown-item>
        </BaseThreeDotMenu>
    </div>
    <CreateQuestionDialog />
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import chatApiService from '@/common/service/chat.api.service';
import userApiService from '@/common/service/user.api.service';
import { ChatType } from '@/pages/chat/constants';
import { chatModule } from '@/pages/chat/store';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import { profileModule } from '../store';
import CreateQuestionDialog from './questions/CreateQuestionDialog.vue';

@Options({
    components: {
        CreateQuestionDialog,
    },
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

    get loginUser() {
        return appModule.loginUser;
    }

    async goToChatPage() {
        if (!this.profileUser?._id) return;

        const response = await chatApiService.createChat({
            members: [this.loginUser._id, this.profileUser._id],
            type: ChatType.PRIVATE,
        });

        if (response?.success) {
            chatModule.getChatList();
            this.$router.push({
                name: this.PageName.CHAT_PAGE,
                params: {
                    id: response?.data,
                },
            });
        } else {
            this.showErrorNotificationFunction(response?.message || `Có lỗi xảy ra, vui lòng thử lại.`);
        }
    }

    async createAskUserQuestion() {
        profileModule.setIsShowCreateQuestionDialog(true);
    }

    openReportUserDialog() {
        profileModule.setIsShowReportUserDialog(true);
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
