<template>
    <div class="chat-detail-wrapper h-100">
        <div class="header">
            <div class="left-section" @click="goToProfilePage">
                <div class="avatar">
                    <BaseRoundAvatar :fileId="avatarId" :size="40" />
                </div>
                <div class="name">{{ name }}</div>
                {{ (targetMember as any)?.isOnline ? ' | Đang hoạt động' : '' }}
            </div>
            <div class="right-section" @click="showChatInfo">
                <el-icon :size="24"><InfoFilled /></el-icon>
            </div>
        </div>

        <div class="message-list">
            <MessageList ref="messageList" />
        </div>

        <div class="blocked" v-if="isBlocked">Bạn đã bị chặn khỏi cuộc trò chuyện này</div>
        <div class="send-message" v-else>
            <CreateMessageForm :chatId="chat._id" />
        </div>
    </div>
</template>

<script lang="ts">
import { SocketEvent } from '@/common/constants';
import { GlobalMixin } from '@/common/mixins';
import { SocketProvider } from '@/plugins/socket.io';
import { appModule } from '@/plugins/vuex/appModule';
import _ from 'lodash';
import { Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { ChatType } from '../constants';
import { chatModule } from '../store';
import CreateMessageForm from './CreateMessageForm.vue';
import MessageList from './MessageList.vue';
import chatApiService from '@/common/service/chat.api.service';

@Options({
    components: {
        MessageList,
        CreateMessageForm,
    },
})
export default class ChatDetail extends GlobalMixin {
    get chat() {
        return chatModule.chatDetail;
    }

    get loginUser() {
        return appModule.loginUser;
    }

    get targetMember() {
        return _.first(this.chat?.members?.filter((mem) => mem._id !== this.loginUser?._id));
    }

    get avatarId() {
        return this.chat.type === ChatType.PRIVATE ? this.targetMember?.avatarId : this.chat.avatarId;
    }

    get name() {
        return this.chat.type === ChatType.PRIVATE ? this.targetMember?.fullName : this.chat.name;
    }

    get isBlocked() {
        return this.chat?.blockedIds?.includes(`${this.loginUser._id}`);
    }

    @Watch('chat', { immediate: true })
    async onChatChanged() {
        if (!this.chat?._id) return;

        if (!this.chat.readBy.includes(`${this.loginUser._id}`)) {
            await chatApiService.markRead(this.chat._id);
            chatModule.incUnreadChatCount(-1);
            const chat = chatModule.chatList.find((c) => c._id == this.chat._id);
            if (chat) {
                chat.readBy.push(`${this.loginUser._id}`);
            }
        }
    }

    @Watch('targetMember', { immediate: true })
    onTargetMemberChanged(): void {
        if (this.chat.type === ChatType.GROUP) return;
        if (!this.targetMember?._id) return;

        SocketProvider.socket.emit(SocketEvent.CHECK_ONLINE, {
            userId: this.targetMember?._id,
        });
    }

    mounted(): void {
        SocketProvider.socket.on(SocketEvent.CHECK_ONLINE, ({ userId }) => {
            if (!this.targetMember) return;
            if (userId == this.targetMember?._id) {
                Object.assign(this.targetMember, {
                    isOnline: true,
                });
            } else {
                Object.assign(this.targetMember, {
                    isOnline: false,
                });
            }
        });
    }

    unmounted(): void {
        SocketProvider.socket.off(SocketEvent.CHECK_ONLINE);
    }

    showChatInfo() {
        chatModule.setIsShowChatInfoDrawer(true);
    }

    goToProfilePage() {
        if (!this.targetMember?._id) return;

        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: this.targetMember?._id,
            },
        });
    }
}
</script>

<style lang="scss" scoped>
.chat-detail-wrapper {
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 8px;
    background: $color-white;
    border-radius: 8px;

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .left-section {
            display: flex;
            flex-direction: row;
            gap: 8px;
            align-items: center;
            cursor: pointer;
        }

        .right-section {
            cursor: pointer;
        }
    }

    .message-list {
        flex: 1;
        overflow: hidden;
    }
}
</style>
