<template>
    <div class="message-item-wrapper" :style="containerStyle">
        <el-tooltip
            :content="parseDateTime(message?.createdAt, DateFormat.DD_vi_MM_YYYY_HH_mm)"
            :placement="isAuthor ? 'right' : 'left'"
        >
            <div class="content" :style="style">
                {{ message.content }}
            </div>
        </el-tooltip>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { IMessage } from '../interfaces';
import { appModule } from '@/plugins/vuex/appModule';

@Options({
    components: {},
})
export default class MessageItem extends GlobalMixin {
    @Prop() message!: IMessage;

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
}
</script>

<style lang="scss" scoped>
.message-item-wrapper {
    display: flex;
    width: 100%;

    .content {
        padding: 6px;
        border-radius: 8px;
        width: fit-content;
        max-width: 60%;
    }
}
</style>
