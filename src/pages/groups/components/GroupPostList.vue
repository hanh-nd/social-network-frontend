<template>
    <div class="group-post-list-wrapper" :style="style" v-infinite-scroll="onLoadMore">
        <div class="group-post-list" v-if="groupPostList.length">
            <div class="post" v-for="groupPost in groupPostList" :key="groupPost._id">
                <GroupPostItem :groupPost="groupPost" />
            </div>
        </div>

        <div class="empty" v-else>
            <el-empty description="Chưa có bài viết" />
        </div>
    </div>
</template>

<script lang="ts">
import { IGroupPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import GroupPostItem from './GroupPostItem.vue';

@Options({
    components: {
        GroupPostItem,
    },
    emits: ['on-load-more'],
})
export default class PostList extends GlobalMixin {
    @Prop() groupPostList!: IGroupPost[];
    @Prop({ default: 8 }) gap!: number;

    get style() {
        return {
            gap: this.gap,
        };
    }

    onLoadMore() {
        this.$emit('on-load-more');
    }
}
</script>

<style lang="scss" scoped>
.group-post-list-wrapper {
    .group-post-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
}
</style>
