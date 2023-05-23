<template>
    <div class="chat-page-wrapper">
        <div class="chat-page-container mx-auto">
            <div class="chat-list-menu">
                <ChatListMenu @on-click-chat-item="onClickChatItem" />
            </div>
            <div class="chat-detail-screen">
                <ChatDetail />
            </div>
        </div>
    </div>
    <ChatInfoDrawer />
</template>

<script lang="ts">
import { SocketEvent } from '@/common/constants';
import { GlobalMixin } from '@/common/mixins';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { SocketProvider } from '@/plugins/socket.io';
import { pick } from 'lodash';
import { Options } from 'vue-class-component';
import ChatDetail from '../components/ChatDetail.vue';
import ChatInfoDrawer from '../components/ChatInfoDrawer.vue';
import ChatListMenu from '../components/ChatListMenu.vue';
import { IChat } from '../interfaces';
import { chatModule } from '../store';

@Options({
    components: {
        ChatListMenu,
        ChatDetail,
        ChatInfoDrawer,
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
        this.registerUserChatEvent();
    }

    loadData() {
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

    registerUserChatEvent() {
        SocketProvider.socket.on(SocketEvent.USER_CHAT, ({ chatId, message }) => {
            chatModule.unshift(message);
            if (`${chatModule.chatDetail._id}` == chatId) {
                chatModule.chatDetail.lastMessage = message;
            }
            EventEmitter.emit(EventName.USER_CHAT, {
                chatId,
                message,
            });
        });

        SocketProvider.socket.on(SocketEvent.USER_RECALL, ({ chatId, message: updatedMessage }) => {
            const message = chatModule.messageList.find((m) => m._id == updatedMessage._id);
            if (!message) return;

            Object.assign(message, pick(updatedMessage, 'isRecalled', 'content', 'mediaId'));
        });
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
