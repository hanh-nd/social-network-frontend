<template>
    <div class="chat-detail-wrapper h-100">
        <div class="header">
            <div class="left-section">
                <div class="avatar">
                    <BaseRoundAvatar :fileId="avatarId" :size="40" />
                </div>
                <div class="name">{{ name }}</div>
            </div>
            <div class="right-section" @click="showChatInfo">
                <el-icon :size="24"><InfoFilled /></el-icon>
            </div>
        </div>

        <div class="message-list">
            <MessageList />
        </div>

        <div class="send-message">
            <CreateMessageForm :chatId="chat._id" />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import _ from 'lodash';
import { Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { ChatType } from '../constants';
import { chatModule } from '../store';
import MessageList from './MessageList.vue';
import CreateMessageForm from './CreateMessageForm.vue';

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

    get messageList() {
        return chatModule.messageList;
    }

    get loginUser() {
        return appModule.loginUser;
    }

    get targetMember() {
        return _.first(this.chat.members.filter((mem) => mem._id !== this.loginUser?._id));
    }

    get avatarId() {
        return this.chat.type === ChatType.PRIVATE ? this.targetMember?.avatarId : this.chat.avatarId;
    }

    get name() {
        return this.chat.type === ChatType.PRIVATE ? this.targetMember?.fullName : this.chat.name;
    }

    @Watch('chat', {
        immediate: true,
    })
    onUpdateChatDetail() {
        chatModule.getMessageList(this.chat._id);
    }

    showChatInfo() {
        chatModule.setIsShowChatInfoDrawer(true);
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
        }

        .right-section {
            cursor: pointer;
        }
    }

    .message-list {
        flex: 1;
    }
}
</style>
