<template>
    <div class="group-feed-screen-wrapper">
        <div class="group-post-list">
            <CreatePostBar />
            <GroupPendingMemberBar />
            <GroupPendingPostBar />
            <GroupPostList :groupPostList="groupPostList" @on-load-more="onLoadMorePost" />
            <div class="reload" v-if="isFetchedAllGroupPostList">Bạn đã đọc hết tin.</div>
        </div>
        <div class="overview">
            <GroupOverview />
        </div>
    </div>
</template>

<script lang="ts">
import { IGroupPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { Options } from 'vue-class-component';
import GroupPostList from '../../../groups/components/GroupPostList.vue';
import { groupDetailModule } from '../../store';
import GroupOverview from '../common/GroupOverview.vue';
import CreatePostBar from './CreatePostBar.vue';
import { SubscribeRequestStatus } from '@/common/constants';
import GroupPendingPostBar from '../common/GroupPendingPostBar.vue';
import GroupPendingMemberBar from '../common/GroupPendingMemberBar.vue';

@Options({
    components: {
        CreatePostBar,
        GroupPostList,
        GroupOverview,
        GroupPendingMemberBar,
        GroupPendingPostBar,
    },
})
export default class GroupFeedScreen extends GlobalMixin {
    get groupId() {
        return this.$route.params.id as string;
    }

    get groupPostList() {
        return groupDetailModule.groupPostList;
    }

    get group() {
        return groupDetailModule.groupDetail;
    }

    created(): void {
        this.loadData();
        EventEmitter.on(EventName.GROUP_POST_CREATED, this.postCreatedHandler);
    }

    unmounted(): void {
        EventEmitter.off(EventName.GROUP_POST_CREATED, this.postCreatedHandler);
    }

    postCreatedHandler(groupPost: IGroupPost) {
        if (groupPost.group._id === this.groupId || groupPost.group === (this.groupId as any)) {
            if (groupPost.status === SubscribeRequestStatus.ACCEPTED) {
                this.groupPostList.unshift(groupPost);
            } else if (groupPost.status === SubscribeRequestStatus.PENDING) {
                this.groupPendingPosts.push(groupPost);
            }
        }
    }

    get groupPendingPosts() {
        return groupDetailModule.groupPendingPosts;
    }

    get currentPage() {
        return groupDetailModule.groupPostListQuery.page as number;
    }

    get isFetchedAllGroupPostList() {
        return groupDetailModule.isFetchedAllGroupPostList;
    }

    isAdministrator() {
        return !!this.group?.administrators?.find((admin) => admin.user._id == this.loginUser._id);
    }

    async loadData() {
        await groupDetailModule.getGroupDetail(this.groupId);
        groupDetailModule.resetGroupPostListQuery();
        groupDetailModule.getGroupPosts({ id: this.groupId });
        groupDetailModule.resetGroupPendingPostListQuery();
        groupDetailModule.resetJoinRequestListQuery();
        if (this.isAdministrator()) {
            groupDetailModule.getGroupPendingPosts({ id: this.groupId });
            groupDetailModule.getJoinRequestList({ id: this.groupId });
        } else {
            groupDetailModule.getMemberPendingPosts({ id: this.groupId });
        }
    }

    onLoadMorePost() {
        if (this.isFetchedAllGroupPostList) return;

        groupDetailModule.setGroupPostListQuery({
            page: this.currentPage + 1,
        });
        groupDetailModule.getGroupPosts({ id: this.groupId, append: true });
    }
}
</script>

<style lang="scss" scoped>
.group-feed-screen-wrapper {
    display: flex;
    flex-direction: row;
    gap: 8px;

    .group-post-list {
        display: flex;
        flex-direction: column;
        flex: 3;
        gap: 8px;

        .reload {
            text-align: center;
            margin: 16px 0;
        }
    }

    .overview {
        flex: 2;
        position: sticky;
        top: 65px;
        height: calc(100vh - 60px);
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .group-feed-screen-wrapper {
        .group-post-list {
            flex: 1;
        }
        .overview {
            display: none;
        }
    }
}
</style>
