<template>
    <div class="post-wrapper">
        <BasePostContent :post="post" />
        <BaseDivider />
        <div class="post-info">
            <div class="left-section">
                <div class="reaction-count">
                    {{ post?.numberOfReacts }}
                </div>
            </div>
            <div class="right-section">
                <div class="comment-count">
                    {{ post?.numberOfComments }}
                </div>
                <div class="share-count">
                    {{ post?.numberOfShares }}
                </div>
            </div>
        </div>
        <BaseDivider />
        <div class="action-group">
            <div class="btn react">
                <el-button @click="onLike" :type="post.isReacted ? `primary` : undefined">Thích</el-button>
            </div>
            <div class="btn comment">
                <el-button>Bình luận</el-button>
            </div>
            <div class="btn share">
                <el-button>Chia sẻ</el-button>
            </div>
        </div>
        <BaseDivider />
        <div class="comment-list">
            <BaseCommentList :commentList="commentList" />
        </div>
        <div class="create-comment">
            <BaseCreateCommentBar :postId="post._id" @on-commented="onCommented" />
        </div>
    </div>
</template>

<script lang="ts">
import { ReactionType } from '@/common/constants';
import { getAvatarUrl } from '@/common/helpers';
import { IComment, IPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import commentApiService from '@/common/service/comment.api.service';
import postApiService from '@/common/service/post.api.service';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
})
export default class Post extends GlobalMixin {
    @Prop() post!: IPost;

    commentList: IComment[] = [];

    get authorAvatar() {
        return getAvatarUrl(this.post.author);
    }

    created(): void {
        this.loadData();
    }

    async loadData() {
        const response = await commentApiService.getComment(this.post._id);
        if (response.success) {
            this.commentList = response?.data || [];
        } else {
            this.commentList = [];
        }
    }

    async onLike() {
        this.post.isReacted = !this.post.isReacted;
        this.post.numberOfReacts += this.post.isReacted ? 1 : -1;
        await postApiService.react(this.post._id, {
            type: ReactionType.LIKE,
        });
    }

    onCommented() {
        this.post.numberOfComments++;
        this.loadData();
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
    margin: 16px 0;

    .post-info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .right-section {
            display: flex;
            flex-direction: row;
            gap: 16px;
        }
    }

    .action-group {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .btn {
            width: 100%;

            .el-button {
                width: 100%;
            }
        }
    }
}
</style>