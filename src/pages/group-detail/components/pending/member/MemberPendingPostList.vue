<template>
    <div class="member-pending-post-list-wrapper">
        <PendingPostItem
            v-for="pendingGroupPost in groupPendingPosts"
            :key="pendingGroupPost._id"
            :groupPost="pendingGroupPost"
            @on-accept="removePendingPost"
            @on-reject="removePendingPost"
        />
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
})
export default class MemberPendingPostList extends GlobalMixin {
    get groupId() {
        return this.$route.params.id as string;
    }

    get groupPendingPosts() {
        return groupDetailModule.groupPendingPosts;
    }

    removePendingPost(requestId: string) {
        _.remove(groupDetailModule.groupPendingPosts, (request) => `${request._id}` == requestId);
    }
}
</script>

<style lang="scss" scoped>
.member-pending-post-list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
