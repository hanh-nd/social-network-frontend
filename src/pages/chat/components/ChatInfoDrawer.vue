<template>
    <el-drawer v-model="isShowChatInfoDrawer">
        <div class="chat-info-wrapper">HIHI</div>
    </el-drawer>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { chatModule } from '../store';

@Options({
    components: {},
})
export default class ChatInfoDrawer extends GlobalMixin {
    get chat() {
        return chatModule.chatDetail;
    }

    get isShowChatInfoDrawer() {
        return chatModule.isShowChatInfoDrawer;
    }

    set isShowChatInfoDrawer(value: boolean) {
        chatModule.setIsShowChatInfoDrawer(value);
    }
}
</script>

<style lang="scss" scoped>
.chat-info-wrapper {
}
</style>
