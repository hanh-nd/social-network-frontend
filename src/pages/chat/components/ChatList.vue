<template>
    <div class="chat-list-wrapper h-100">
        <div class="empty" v-if="!chatList.length">
            <el-empty description="Hãy bắt đầu một cuộc trò chuyện mới nhé."></el-empty>
        </div>
        <div class="chat-list h-100" v-else>
            <div class="chat-item" v-for="chat in chatList" :key="chat._id" @click="onClickChatItem(chat)">
                <ChatItem :chat="chat" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { IChat } from '../interfaces';
import ChatItem from './ChatItem.vue';

@Options({
    components: {
        ChatItem,
    },
    emits: ['on-click-chat-item'],
})
export default class ChatList extends GlobalMixin {
    @Prop({ default: [] }) chatList!: IChat[];

    onClickChatItem(chat: IChat) {
        this.$emit(`on-click-chat-item`, chat);
    }

    mounted(): void {
        EventEmitter.on(EventName.USER_CHAT, ({ chatId, message }) => {
            const chat = this.chatList.find((chat) => chat._id == chatId);
            if (!chat) return;

            chat.lastMessage = message;
        });
    }
}
</script>

<style lang="scss" scoped>
.chat-list-wrapper {
    .chat-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
}
</style>
