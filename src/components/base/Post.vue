<template>
    <div class="post-wrapper" v-if="isShowPost">
        <BasePostContent :post="post" />
        <BaseDivider />
        <div class="post-info">
            <div class="left-section">
                <div class="reaction-count" @click="openReactionListDialog">
                    <Icon icon="solar:like-bold" height="16" />
                    {{ post?.numberOfReacts }}
                </div>
            </div>
            <div class="right-section">
                <div class="comment-count">
                    <Icon icon="iconamoon:comment-fill" height="16" />
                    {{ post?.numberOfComments }}
                </div>
                <div class="share-count" @click="openShareListDialog">
                    <Icon icon="majesticons:share" height="16" />
                    {{ post?.numberOfShares }}
                </div>
            </div>
        </div>
        <BaseDivider />
        <div class="action-group">
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
import { getAvatarUrl } from '@/common/helpers';
import { IPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import postApiService from '@/common/service/post.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import { Icon } from '@iconify/vue';
import * as _ from 'lodash';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {
        Icon,
    },
})
export default class Post extends GlobalMixin {
    ReactionType = ReactionType;

    @Prop() post!: IPost;

    get authorAvatar() {
        return getAvatarUrl(this.post.author);
    }

    get isShowPost() {
        return _.isNil(this.post.deletedAt);
    }

    async onLike(type = ReactionType.LIKE) {
        this.post.isReacted = !this.post.isReacted;
        this.post.numberOfReacts += this.post.isReacted ? 1 : -1;
        this.post.reactionType = type;
        await postApiService.react(this.post._id, {
            type,
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

    openReactionListDialog() {
        appModule.setPostDetail(this.post);
        appModule.setIsShowReactionListDialog(true);
    }

    openShareListDialog() {
        appModule.setPostDetail(this.post);
        appModule.setIsShowShareListDialog(true);
    }
}
</script>

<style lang="scss" scoped>
.post-wrapper {
    display: flex;
    flex-direction: column;
    background: $color-white;
    border-radius: 6px;
    padding: 16px;

    .post-info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .left-section {
            .reaction-count {
                cursor: pointer;
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 4px;
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

    .action-group {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        :deep(.full-reaction-popover) {
            width: 300px !important;
            .full-reaction {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
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
