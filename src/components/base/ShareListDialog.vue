<template>
    <div class="share-list-dialog-wrapper">
        <el-dialog
            custom-class="share-list-dialog"
            :model-value="isShowShareListDialog"
            @open="onOpen"
            @closed="onCloseDialog"
            title="Những người đã chia sẻ điều này"
            :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
            center
        >
            <div class="empty" v-if="!shareList.length">
                <el-empty description="Hãy làm người đầu tiên chia sẻ bài viết này nhé." />
            </div>
            <div class="share-list" v-else v-infinite-scroll="onLoadMore">
                <BaseShareItem :post="post" v-for="post of shareList" :key="post._id" />
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { IPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import postApiService from '@/common/service/post.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';

@Options({})
export default class ReactionListDialog extends GlobalMixin {
    shareList: IPost[] = [];

    get isShowShareListDialog() {
        return appModule.isShowShareListDialog;
    }

    get deviceType() {
        return appModule.deviceType;
    }

    get postDetail() {
        return appModule.postDetail;
    }

    async onOpen() {
        this.getPostShares();
    }

    async getPostShares() {
        const response = await postApiService.getPostShares(this.postDetail._id);
        if (response?.success) {
            this.shareList = response?.data || [];
        } else {
            this.shareList = [];
        }
    }

    onCloseDialog() {
        appModule.setIsShowShareListDialog(false);
    }

    onLoadMore() {
        //
    }
}
</script>

<style lang="scss" scoped>
:deep(.share-list-dialog) {
    margin-top: 40px;
    max-height: 90%;
    overflow: auto;
    .el-dialog__body {
        display: flex;
        flex-direction: column;
    }

    .share-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
}
</style>
