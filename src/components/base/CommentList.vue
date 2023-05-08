<template>
    <div class="comment-list-wrapper" v-infinite-scroll="onLoadMore">
        <div class="comment" v-for="comment in commentList" :key="comment._id">
            <Comment :comment="comment" />
        </div>
    </div>
</template>

<script lang="ts">
import { IComment } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Comment from './Comment.vue';

@Options({
    components: {
        Comment,
    },
})
export default class CommentList extends GlobalMixin {
    @Prop() commentList!: IComment[];

    onLoadMore() {
        this.$emit('on-load-more');
    }
}
</script>

<style lang="scss" scoped>
.comment-list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
