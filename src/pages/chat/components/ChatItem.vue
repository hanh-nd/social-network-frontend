<template>
    <div class="chat-item-wrapper">
        <div class="left-section">
            <BaseRoundAvatar :fileId="avatarId" />
        </div>
        <div class="right-section">
            <div class="top-section">{{ name }} - {{ isRead ? 'Đã đọc' : 'Chưa đọc' }}</div>
            <div class="bottom-section">
                {{ lastMessage?.content }} - {{ parseDateTimeRelative(lastMessage?.createdAt) }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { IChat } from '../interfaces';
import { appModule } from '@/plugins/vuex/appModule';
import * as _ from 'lodash';
import { ChatType } from '../constants';

@Options({
    components: {},
})
export default class ChatItem extends GlobalMixin {
    @Prop() chat!: IChat;

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

    get lastMessage() {
        return this.chat.lastMessage;
    }

    get isRead() {
        return this.chat.readBy.includes(`${this.loginUser._id}`);
    }
}
</script>

<style lang="scss" scoped>
.chat-item-wrapper {
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    .right-section {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1;

        .top-section {
            font-weight: 500;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .bottom-section {
            font-size: 12px;
        }
    }
}
</style>
