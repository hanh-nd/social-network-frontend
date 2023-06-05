<template>
    <div class="share-item">
        <div class="top-section">
            <BasePostContent :post="post" />
        </div>
        <BaseDivider />
        <div class="post-info">
            <div class="left-section">
                <div class="reaction-count">
                    <Icon icon="solar:like-bold" height="16" />
                    {{ post?.numberOfReacts }}
                </div>
            </div>
            <div class="right-section">
                <div class="comment-count">
                    <Icon icon="iconamoon:comment-fill" height="16" />
                    {{ post?.numberOfComments }}
                </div>
                <div class="share-count">
                    <Icon icon="majesticons:share" height="16" />
                    {{ post?.numberOfShares }}
                </div>
            </div>
        </div>
        <BaseDivider />
        <div class="bottom-section">
            <div class="btn react">
                <BaseFullReactionBar :target="post" :onLike="onLike" />
            </div>
            <div class="btn comment">
                <el-button @click="openPostDetailDialog">Bình luận</el-button>
            </div>
            <div class="btn share">
                <el-button @click="openSharePostDialog">Chia sẻ</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ReactionType } from '@/common/constants';
import { IPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import postApiService from '@/common/service/post.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Icon } from '@iconify/vue';

@Options({
    components: {
        Icon,
    },
})
export default class ShareItem extends GlobalMixin {
    @Prop() post!: IPost;

    onMessageOrSubscribe() {
        //
    }

    goToUserProfile() {
        appModule.setIsShowReactionListDialog(false);
        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: this.post?.author?._id,
            },
        });
    }

    async onLike() {
        this.post.isReacted = !this.post.isReacted;
        this.post.numberOfReacts += this.post.isReacted ? 1 : -1;
        await postApiService.react(this.post._id, {
            type: ReactionType.LIKE,
        });
    }

    openPostDetailDialog() {
        appModule.setPostDetail(this.post);
        appModule.setIsShowPostDetailDialog(true);
    }

    openSharePostDialog() {
        appModule.setPostDetail(this.post);
        appModule.setIsShowSharePostDialog(true);
    }
}
</script>

<style lang="scss" scoped>
.share-item {
    display: flex;
    flex-direction: column;
    padding: 8px;

    .top-section {
        display: flex;
        flex-direction: column;

        .name {
            cursor: pointer;
        }
    }

    .post-info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .left-section {
            .reaction-count {
                cursor: pointer;
            }
        }

        .right-section {
            display: flex;
            flex-direction: row;
            gap: 16px;

            .share-count {
                cursor: pointer;
            }
        }
    }

    .bottom-section {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        :deep(.full-reaction-popover) {
            width: 300px !important;
            .full-reaction {
                display: flex;
                flex-direction: row;
            }
        }

        .btn {
            width: 100%;

            .el-button {
                width: 100%;
            }
        }
    }
}
</style>
