<template>
    <div
        class="message-item-wrapper"
        :style="containerStyle"
        @mouseover="setIsShowMenu(true)"
        @mouseleave="setIsShowMenu(false)"
    >
        <el-tooltip
            :content="parseDateTime(message?.createdAt, DateFormat.DD_vi_MM_YYYY_HH_mm)"
            :placement="isAuthor ? 'right' : 'left'"
        >
            <div class="message-item" :style="itemStyle">
                <div class="menu" v-if="isAuthor && (isOpenMenu || isShowMenu)">
                    <BaseThreeDotMenu @click="setIsOpenMenu(true)" v-click-away="onClickAway">
                        <el-dropdown-item @click="deleteMessage">Xóa tin nhắn</el-dropdown-item>
                        <el-dropdown-item @click="recallMessage">Thu hồi tin nhắn</el-dropdown-item>
                    </BaseThreeDotMenu>
                </div>

                <div class="content" :style="style">
                    {{ message.content }}
                </div>
            </div>
        </el-tooltip>
    </div>
</template>

<script lang="ts">
import { SocketEvent } from '@/common/constants';
import { GlobalMixin } from '@/common/mixins';
import chatApiService from '@/common/service/chat.api.service';
import { SocketProvider } from '@/plugins/socket.io';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { IMessage } from '../interfaces';

@Options({
    components: {},
    emits: ['on-delete-message'],
})
export default class MessageItem extends GlobalMixin {
    @Prop() message!: IMessage;
    isShowMenu = false;
    isOpenMenu = false;

    get loginUser() {
        return appModule.loginUser;
    }

    get author() {
        return this.message.author;
    }

    get isAuthor() {
        return `${this.loginUser._id}` === `${this.author._id}`;
    }

    get containerStyle() {
        return this.isAuthor
            ? {
                  justifyContent: `flex-end`,
              }
            : {
                  justifyContent: `flex-start`,
              };
    }

    get itemStyle() {
        return this.isAuthor
            ? {
                  flexDirection: `row`,
              }
            : {
                  flexDirection: `row-reverse`,
              };
    }

    get style() {
        return this.isAuthor
            ? {
                  background: `#79bf43`,
                  color: `#ffffff`,
              }
            : {
                  background: `#f3f3f3`,
              };
    }

    setIsShowMenu(isShowMenu: boolean) {
        this.isShowMenu = isShowMenu;
    }

    setIsOpenMenu(isOpenMenu: boolean) {
        this.isOpenMenu = isOpenMenu;
    }

    onClickAway() {
        this.setIsOpenMenu(false);
    }

    async deleteMessage() {
        const chatId = this.message.chat._id || (this.message.chat as string);
        if (!chatId) return;
        await chatApiService.deleteMessage(chatId, this.message._id);
        this.$emit(`on-delete-message`, this.message._id);
    }

    recallMessage() {
        SocketProvider.socket.emit(SocketEvent.USER_RECALL, {
            chatId: this.message.chat._id || this.message.chat,
            messageId: this.message._id,
        });
    }
}
</script>

<style lang="scss" scoped>
.message-item-wrapper {
    display: flex;
    width: 100%;

    .message-item {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 16px;
        max-width: 60%;

        .content {
            padding: 6px;
            border-radius: 8px;
            width: fit-content;
        }
    }
}
</style>
