<template>
    <div class="contact-item-wrapper" @click="goToChatPage">
        <div class="avatar">
            <BaseRoundAvatar :user="contact" />
        </div>
        <div class="name">{{ contact?.fullName }}</div>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import chatApiService from '@/common/service/chat.api.service';
import { ChatType } from '@/pages/chat/constants';
import { chatModule } from '@/pages/chat/store';
import { appModule } from '@/plugins/vuex/appModule';
import { Options, Prop } from 'vue-property-decorator';

@Options({})
export default class ContactItem extends GlobalMixin {
    @Prop() contact!: IUser;

    get loginUser() {
        return appModule.loginUser;
    }

    async goToChatPage() {
        const response = await chatApiService.createChat({
            members: [this.loginUser._id, this.contact._id],
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
}
</script>

<style lang="scss" scoped>
.contact-item-wrapper {
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
}
</style>
