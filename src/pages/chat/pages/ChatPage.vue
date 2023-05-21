<template>
    <div class="chat-page-wrapper">
        <div class="chat-page-container mx-auto">
            <div class="chat-list-menu col-sm-2">
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
import { SocketProvider } from '@/plugins/socket.io';
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
        chatModule.getMessageList(this.chatId);
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
            chatModule.appendMessage(message);
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
        }

        .chat-detail-screen {
            flex: 1;
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
