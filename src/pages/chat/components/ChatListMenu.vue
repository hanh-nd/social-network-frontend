<template>
    <div class="chat-list-menu">
        <div class="header">
            <div class="top-section">
                <div class="title">Nhắn tin</div>
                <div class="create-chat">
                    <el-icon :size="20" @click="openCreateChatDialog"> <CirclePlus /></el-icon>
                </div>
            </div>
            <div class="search-bar">
                <BaseInputText v-model:value="keyword" placeholder="Tìm kiếm đoạn hội thoại" />
            </div>
        </div>
        <div class="chat-list">
            <ChatList :chatList="chatList" @on-click-chat-item="onClickChatItem" />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import * as _ from 'lodash';
import { Options } from 'vue-class-component';
import { ChatType } from '../constants';
import { IChat } from '../interfaces';
import { chatModule } from '../store';
import ChatList from './ChatList.vue';

@Options({
    components: {
        ChatList,
    },
    emits: [`on-click-chat-item`, 'on-open-create-chat-dialog'],
})
export default class ChatListMenu extends GlobalMixin {
    keyword = '';

    get chatList() {
        return _.isEmpty(this.keyword)
            ? chatModule.chatList
            : chatModule.chatList.filter((chat) => new RegExp(this.keyword, 'gi').test(this.getChatName(chat)));
    }

    get loginUser() {
        return appModule.loginUser;
    }

    getChatName(chat: IChat): string {
        const targetMember = _.first(chat.members.filter((mem) => mem._id !== this.loginUser?._id));
        if (!targetMember) return chat.name || '';

        return (chat.type === ChatType.PRIVATE ? targetMember.fullName : chat.name) || '';
    }

    onClickChatItem(chat: IChat) {
        this.$emit(`on-click-chat-item`, chat);
    }

    openCreateChatDialog() {
        this.$emit(`on-open-create-chat-dialog`);
    }
}
</script>

<style lang="scss" scoped>
.chat-list-menu {
    display: flex;
    flex-direction: column;
    padding: 8px;
    background: $color-white;
    border-radius: 8px;

    .header {
        .top-section {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            .title {
                font-size: 24px;
                font-weight: 700;
            }

            .create-chat {
                cursor: pointer;
            }
        }
    }
}
</style>
