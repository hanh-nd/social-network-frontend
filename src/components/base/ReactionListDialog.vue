<template>
    <div class="reaction-list-dialog-wrapper">
        <el-dialog
            custom-class="reaction-list-dialog"
            :model-value="isShowReactListDialog"
            @open="onOpen"
            @closed="onCloseDialog"
            title="Danh sách tương tác"
            :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
            center
        >
            <div class="empty" v-if="!reactionList.length">
                <el-empty description="Hãy làm người đầu tiên tương tác bài viết này nhé." />
            </div>
            <div class="reaction-list" v-else v-infinite-scroll="onLoadMore">
                <BaseReactionItem :reaction="reaction" v-for="reaction of reactionList" :key="reaction._id" />
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { IReaction } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import postApiService from '@/common/service/post.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';

@Options({})
export default class ReactionListDialog extends GlobalMixin {
    reactionList: IReaction[] = [];

    get isShowReactListDialog() {
        return appModule.isShowReactionListDialog;
    }

    get deviceType() {
        return appModule.deviceType;
    }

    get postDetail() {
        return appModule.postDetail;
    }

    async onOpen() {
        this.getPostReactions();
    }

    async getPostReactions() {
        const response = await postApiService.getPostReactions(this.postDetail._id);
        if (response?.success) {
            this.reactionList = response?.data || [];
        } else {
            this.reactionList = [];
        }
    }

    onCloseDialog() {
        appModule.setIsShowReactionListDialog(false);
    }

    onLoadMore() {
        //
    }
}
</script>

<style lang="scss" scoped>
:deep(.reaction-list-dialog) {
    margin-top: 40px;
    max-height: 90%;
    overflow: auto;
    .el-dialog__body {
        display: flex;
        flex-direction: column;
    }

    .reaction-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
}
</style>
