<template>
    <div class="chat-page-wrapper">
        <div class="chat-page-container mx-auto">
            <div class="chat-list-menu">
                <ChatListMenu
                    @on-click-chat-item="onClickChatItem"
                    @on-open-create-chat-dialog="openCreateChatDialog"
                />
            </div>
            <div class="chat-detail-screen">
                <ChatDetail />
            </div>
        </div>
    </div>
    <ChatInfoDrawer />
    <CreateChatDialog />
</template>

<script lang="ts">
import { SocketEvent } from '@/common/constants';
import { GlobalMixin } from '@/common/mixins';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { SocketProvider } from '@/plugins/socket.io';
import { cloneDeep, pick, remove } from 'lodash';
import moment from 'moment';
import { Options } from 'vue-class-component';
import ChatDetail from '../components/ChatDetail.vue';
import ChatInfoDrawer from '../components/ChatInfoDrawer.vue';
import ChatListMenu from '../components/ChatListMenu.vue';
import CreateChatDialog from '../components/CreateChatDialog.vue';
import { IChat } from '../interfaces';
import { chatModule } from '../store';

@Options({
    components: {
        ChatListMenu,
        ChatDetail,
        ChatInfoDrawer,
        CreateChatDialog,
    },
})
export default class ChatPage extends GlobalMixin {
    get chatId() {
        return this.$route.params.id as string;
    }

    get chatList() {
        return chatModule.chatList;
    }

    created(): void {
        this.loadData();
    }

    mounted(): void {
        this.registerUserChatEvent();
    }

    loadData() {
        if (!this.chatId) return;
        chatModule.getChatDetail(this.chatId);
    }

    onClickChatItem(chat: IChat) {
        this.$router.replace({
            name: this.PageName.CHAT_PAGE,
            params: {
                id: chat._id,
            },
        });
    }

    openCreateChatDialog() {
        chatModule.setIsShowCreateChatDialog(true);
    }

    registerUserChatEvent() {
        SocketProvider.socket.on(SocketEvent.USER_CHAT, ({ chat: _chat, message, userId }) => {
            const chat = this.chatList.find((chat) => chat._id == _chat._id);
            if (!chat) {
                _chat.lastMessage = message;
                _chat.lastMessageAt = moment().toISOString();
                _chat.readBy = [userId];
                this.chatList.unshift(_chat);
                return;
            }

            if (userId == this.loginUser._id) {
                if (!chat.readBy.includes(userId)) {
                    chatModule.incUnreadChatCount(-1);
                }
            } else {
                chatModule.incUnreadChatCount(1);
            }

            if (this.chatId === _chat._id) {
                chatModule.unshiftMessageList(message);
                EventEmitter.emit(EventName.USER_CHAT);
            }

            const clonedChat = cloneDeep(chat);
            clonedChat.lastMessage = message;
            clonedChat.lastMessageAt = moment().toISOString();
            clonedChat.readBy = [userId];

            remove(this.chatList, (chat) => chat._id == _chat._id);
            this.chatList.unshift(clonedChat);
        });

        SocketProvider.socket.on(SocketEvent.USER_RECALL, ({ chat, message: updatedMessage }) => {
            const message = chatModule.messageList.find((m) => m._id == updatedMessage._id);
            if (!message) return;

            Object.assign(message, pick(updatedMessage, 'isRecalled', 'content', 'mediaId'));
        });
    }

    unmounted(): void {
        SocketProvider.socket.off(SocketEvent.USER_CHAT);
        SocketProvider.socket.off(SocketEvent.USER_RECALL);
    }
}
</script>
<style lang="scss" scoped>
.chat-page-wrapper {
    background-color: $color-gray;

    .chat-page-container {
        display: flex;
        flex-direction: row;
        height: 100%;

        .chat-list-menu {
            position: sticky;
            top: 60px;
            height: calc(100vh - 60px);
            padding-top: 8px;
            width: 300px;
        }

        .chat-detail-screen {
            height: calc(100vh - 60px);
            width: 100%;
            padding-top: 8px;
            margin: 0 8px;
        }

        .right-contact {
            position: sticky;
            top: 60px;
            height: calc(100vh - 60px);
            padding-top: 8px;
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .chat-detail-screen {
        flex: 1;
    }
}
</style>
