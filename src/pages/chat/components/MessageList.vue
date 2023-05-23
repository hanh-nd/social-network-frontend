<template>
    <div class="message-list-wrapper h-100">
        <div class="empty h-100" v-if="!messageList.length">
            <el-empty description="Nhắn bắt đầu cuộc hội thoại này." />
        </div>
        <div class="message-list-container h-100" ref="scrollContainer" v-else>
            <div class="sentinel" ref="sentinel"></div>
            <div class="message-list" ref="listContainer">
                <div class="message-item" v-for="message in messageList" :key="message._id">
                    <MessageItem :message="message" @on-delete-message="onDeleteMessage" />
                </div>
            </div>

            <div class="scroll-to-bottom" v-if="isShowScrollToBottomButton">
                <el-button @click="scrollToBottom">SCROLL</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { remove } from 'lodash';
import { Options } from 'vue-class-component';
import { chatModule } from '../store';
import MessageItem from './MessageItem.vue';

@Options({
    components: {
        MessageItem,
    },
})
export default class MessageList extends GlobalMixin {
    listEndObserver!: IntersectionObserver;
    previousScrollHeightMinusScrollTop = 0;
    intersectionObserverInitialized = false;
    isFetchedAllMessages = false;
    isFetchingMessages = false;
    isShowScrollToBottomButton = false;

    get chatId() {
        return this.$route.params.id as string;
    }

    get messageList() {
        return chatModule.messageList;
    }

    get currentPage() {
        return chatModule.messageListQuery.page!;
    }

    created() {
        this.loadData();
    }

    async loadData() {
        chatModule.resetMessageListQuery();
        await chatModule.getMessageList({ id: this.chatId });

        if (this.intersectionObserverInitialized) {
            return;
        }

        if (this.messageList.length) {
            this.$nextTick(() => {
                const node = this.$refs['scrollContainer'] as HTMLDivElement;
                if (node) {
                    this.setUpInterSectionObserver();
                    this.setupScrollListener();
                    node.scrollTop = node.scrollHeight;
                }
            });
        }
    }

    destroyed() {
        if (this.listEndObserver) {
            this.listEndObserver.disconnect();
        }
    }

    recordScrollPosition() {
        const node = this.$refs['scrollContainer'] as HTMLDivElement;
        if (!node) return;

        this.previousScrollHeightMinusScrollTop = node.scrollHeight - node.scrollTop;
    }

    restoreScrollPosition() {
        const node = this.$refs['scrollContainer'] as HTMLDivElement;
        if (!node) return;

        node.scrollTop = node.scrollHeight - this.previousScrollHeightMinusScrollTop;
    }

    setUpInterSectionObserver() {
        this.intersectionObserverInitialized = true;

        let options = {
            root: this.$refs['scrollContainer'] as HTMLDivElement,
            margin: '10px',
        };
        this.listEndObserver = new IntersectionObserver(this.handleIntersection, options);

        this.listEndObserver.observe(this.$refs['sentinel'] as HTMLDivElement);
    }

    async handleIntersection([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) {
        if (entry.isIntersecting && !this.isFetchingMessages && !this.isFetchedAllMessages) {
            this.recordScrollPosition();
            this.isFetchingMessages = true;
            chatModule.setMessageListQuery({
                page: this.currentPage + 1,
            });
            const data = await chatModule.getMessageList({ id: this.chatId, append: true });
            if (!data.filter((e) => e).flat().length) {
                this.isFetchedAllMessages = true;
            }
            this.isFetchingMessages = false;
            this.restoreScrollPosition();
        }
    }

    setupScrollListener() {
        EventEmitter.on(EventName.USER_CHAT, ({ chatId, message }) => {
            if (!this.isShowScrollToBottomButton) {
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
            }
        });

        const scrollContainer = this.$refs['scrollContainer'] as HTMLDivElement;
        scrollContainer.onscroll = () => {
            const { scrollTop, scrollHeight, offsetHeight } = scrollContainer;
            if (scrollHeight - offsetHeight - 50 > scrollTop) {
                this.isShowScrollToBottomButton = true;
            } else {
                this.isShowScrollToBottomButton = false;
            }
        };
    }

    scrollToBottom() {
        const scrollContainer = this.$refs['scrollContainer'] as HTMLDivElement;
        if (!scrollContainer) return;
        const { scrollTop, scrollHeight, offsetHeight } = scrollContainer;

        scrollContainer.scrollTop = scrollHeight - offsetHeight;
    }

    onDeleteMessage(messageId: string) {
        remove(this.messageList, (message) => message._id == messageId);
    }
}
</script>
<style lang="scss" scoped>
.message-list-wrapper {
    .message-list-container {
        overflow-y: scroll;

        .message-list {
            display: flex;
            flex-direction: column-reverse;
            gap: 2px;
            justify-content: flex-start;
        }

        .scroll-to-bottom {
            position: absolute;
            bottom: 70px;
            left: 0;
            right: 0;

            display: flex;
            justify-content: center;
        }
    }
}
</style>
