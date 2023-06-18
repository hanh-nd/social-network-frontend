<template>
    <div class="group-pending-post-list-wrapper" v-infinite-scroll="onLoadMore">
        <PendingPostItem
            v-for="pendingGroupPost in groupPendingPosts"
            :key="pendingGroupPost._id"
            :groupPost="pendingGroupPost"
            @on-accept="removePendingPost"
            @on-reject="removePendingPost"
        />
        <div class="reload" v-if="isFetchedAllGroupPendingPostList">Bạn đã đọc hết tin.</div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { groupDetailModule } from '@/pages/group-detail/store';
import _ from 'lodash';
import { Options } from 'vue-class-component';
import PendingPostItem from './PendingPostItem.vue';

@Options({
    components: {
        PendingPostItem,
    },
    emits: [`on-load-more`],
})
export default class GroupPendingPostList extends GlobalMixin {
    get groupId() {
        return this.$route.params.id as string;
    }

    get groupPendingPosts() {
        return groupDetailModule.groupPendingPosts;
    }

    get isFetchedAllGroupPendingPostList() {
        return groupDetailModule.isFetchedAllGroupPendingPostList;
    }

    removePendingPost(requestId: string) {
        _.remove(groupDetailModule.groupPendingPosts, (request) => `${request._id}` == requestId);
    }

    onLoadMore() {
        this.$emit(`on-load-more`);
    }
}
</script>

<style lang="scss" scoped>
.group-pending-post-list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .reload {
        text-align: center;
        margin: 16px 0;
    }
}
</style>
