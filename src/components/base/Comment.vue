<template>
    <div class="comment-wrapper">
        <div class="avatar">
            <BaseRoundAvatar :user="comment?.author" />
        </div>
        <div class="body">
            <div class="body-content">
                <div class="author-name" @click="goToProfilePage">
                    {{ comment?.author?.fullName || comment?.author?.username }}
                </div>
                <div class="content">
                    {{ comment.content }}
                </div>
            </div>
            <div class="action-group">
                <div class="react">
                    <div>Thích</div>
                </div>
                <div class="created-at">
                    {{ parseDateTimeRelative(comment?.createdAt) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IComment } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
    emits: [],
})
export default class Comment extends GlobalMixin {
    @Prop() comment!: IComment;

    goToProfilePage() {
        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: this.comment?.author?._id,
            },
        });
    }
}
</script>

<style lang="scss" scoped>
.comment-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 8px;

    .body {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .body-content {
            padding: 8px;
            border-radius: 8px;
            background: $color-gray;

            .author-name {
                font-weight: 700;
                cursor: pointer;
            }
        }

        .action-group {
            display: flex;
            flex-direction: row;
            gap: 8px;
            align-items: center;
        }
    }
}
</style>
