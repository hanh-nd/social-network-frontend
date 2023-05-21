<template>
    <div class="message-list-wrapper h-100">
        <div class="empty h-100" v-if="!messageList.length">
            <el-empty description="Nhắn bắt đầu cuộc hội thoại này." />
        </div>
        <div class="message-list h-100" v-else>
            <div class="message-item" v-for="message in messageList" :key="message._id">
                <MessageItem :message="message" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { chatModule } from '../store';
import MessageItem from './MessageItem.vue';

@Options({
    components: {
        MessageItem,
    },
})
export default class MessageList extends GlobalMixin {
    get messageList() {
        return chatModule.messageList;
    }
}
</script>
<style lang="scss" scoped>
.message-list-wrapper {
    .message-list {
        display: flex;
        flex-direction: column-reverse;
        gap: 2px;
        justify-content: flex-start;
    }
}
</style>
