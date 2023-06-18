<template>
    <el-drawer v-model="isShowChatInfoDrawer">
        <template #header="{ titleId, titleClass }">
            <div
                :id="titleId"
                :class="titleClass"
                :style="{ flex: 1, fontWeight: 700, fontSize: `20px`, color: `#000000` }"
            >
                Chi tiết
            </div>
        </template>
        <div class="chat-info-wrapper">
            <BaseDivider />
            <div class="chat-members">
                <div class="header">
                    <div class="title">Thành viên đoạn chat</div>
                    <div class="add-more" v-if="type === ChatType.GROUP">
                        <el-button type="info">Thêm người</el-button>
                    </div>
                </div>
                <div class="member" v-for="member in members" :key="member._id">
                    <div class="left-section">
                        <BaseRoundAvatar :user="member" />
                        {{ member.fullName }}
                    </div>
                    <div class="right-section"></div>
                </div>
            </div>
            <BaseDivider />
            <div class="action">
                <div class="group-action" v-if="type === ChatType.GROUP">
                    <div class="leave-chat">
                        <el-button type="info" @click="leaveChat">Rời khỏi nhóm</el-button>
                    </div>
                    <div class="delete-chat">
                        <el-button type="info" @click="deleteChat">Xóa cuộc trò chuyện</el-button>
                    </div>
                </div>
                <div class="private-action" v-if="type === ChatType.PRIVATE">
                    <div class="block">
                        <el-button type="info">Chặn người dùng</el-button>
                    </div>
                    <div class="delete-chat">
                        <el-button type="info" @click="deleteChat">Xóa cuộc trò chuyện</el-button>
                    </div>
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import chatApiService from '@/common/service/chat.api.service';
import { remove } from 'lodash';
import { Options } from 'vue-class-component';
import { ChatType } from '../constants';
import { chatModule } from '../store';

@Options({
    components: {},
})
export default class ChatInfoDrawer extends GlobalMixin {
    ChatType = ChatType;

    get chat() {
        return chatModule.chatDetail;
    }

    get chatList() {
        return chatModule.chatList;
    }

    get members() {
        return this.chat.members;
    }

    get type() {
        return this.chat.type;
    }

    get isShowChatInfoDrawer() {
        return chatModule.isShowChatInfoDrawer;
    }

    set isShowChatInfoDrawer(value: boolean) {
        chatModule.setIsShowChatInfoDrawer(value);
    }

    async deleteChat() {
        const chatId = this.chat._id;
        await chatApiService.deleteChat(chatId);
        remove(this.chatList, (chat) => chat._id == chatId);
        chatModule.setChatDetail(this.chatList?.[0] || {});
        chatModule.setIsShowChatInfoDrawer(false);
    }

    async leaveChat() {
        const chatId = this.chat._id;
        await chatApiService.leaveChat(chatId);
        remove(this.chatList, (chat) => chat._id == chatId);
        chatModule.setChatDetail(this.chatList?.[0] || {});
        chatModule.setIsShowChatInfoDrawer(false);
    }
}
</script>

<style lang="scss" scoped>
:deep(.el-drawer__header) {
    display: flex;
    justify-content: space-between;
}
.chat-info-wrapper {
    .chat-members {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            font-size: 18px;
            font-weight: 500;
        }

        .member {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            .left-section {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 8px;
            }
        }
    }
}
</style>
