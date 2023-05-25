<template>
    <div class="group-pending-post-container">
        <div class="group-pending-post-wrapper mx-auto">
            <div class="title">Yêu cầu phê duyệt bài viết</div>
            <div class="empty" v-if="!groupPendingPosts?.length">
                <el-empty description="Chưa có yêu cầu nào." />
            </div>
            <div class="group-pending-post-list" v-else>
                <div class="administrator" v-if="isAdministrator()">
                    <GroupPendingPostList @on-load-more="onLoadMorePendingPosts" />
                </div>
                <div class="member" v-else>
                    <MemberPendingPostList @on-load-more="onLoadMorePendingPosts" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import * as _ from 'lodash';
import { Options } from 'vue-class-component';
import GroupPendingPostList from '../components/pending/administrator/GroupPendingPostList.vue';
import MemberPendingPostList from '../components/pending/member/MemberPendingPostList.vue';
import { groupDetailModule } from '../store';

@Options({
    components: {
        GroupPendingPostList,
        MemberPendingPostList,
    },
})
export default class GroupPendingPostsPage extends GlobalMixin {
    get groupId() {
        return this.$route.params.id as string;
    }

    get groupPendingPosts() {
        return groupDetailModule.groupPendingPosts;
    }

    get group() {
        return groupDetailModule.groupDetail;
    }

    get administratorIds() {
        return this.group?.administrators?.map((admin) => `${admin.user?._id}`) || [];
    }

    get loginUser() {
        return appModule.loginUser;
    }

    isAdministrator() {
        return this.administratorIds.includes(`${this.loginUser?._id}`);
    }

    created(): void {
        this.loadData();
    }

    async loadData() {
        await groupDetailModule.getGroupDetail(this.groupId);
        groupDetailModule.resetGroupPendingPostListQuery();
        if (this.isAdministrator()) {
            groupDetailModule.getGroupPendingPosts({ id: this.groupId });
        } else {
            groupDetailModule.getMemberPendingPosts({ id: this.groupId });
        }
    }

    removePendingPost(requestId: string) {
        _.remove(groupDetailModule.groupPendingPosts, (request) => `${request._id}` == requestId);
    }

    get currentPage() {
        return groupDetailModule.groupPendingPostListQuery.page as number;
    }

    get isFetchedAllGroupPendingPostList() {
        return groupDetailModule.isFetchedAllGroupPendingPostList;
    }

    onLoadMorePendingPosts() {
        if (this.isFetchedAllGroupPendingPostList) return;

        groupDetailModule.setGroupPendingPostListQuery({
            page: this.currentPage + 1,
        });
        if (this.isAdministrator()) {
            groupDetailModule.getGroupPendingPosts({ id: this.groupId, append: true });
        } else {
            groupDetailModule.getMemberPendingPosts({ id: this.groupId, append: true });
        }
    }
}
</script>

<style lang="scss" scoped>
.group-pending-post-container {
    width: 100%;
    background: $color-gray;
    min-height: calc(100vh - 50px);
}

.group-pending-post-wrapper {
    width: 100%;
    margin: auto;
    max-width: map-get($grid-breakpoints, sm);

    display: flex;
    flex-direction: column;
    gap: 8px;

    .title {
        margin-top: 8px;
        font-weight: 500;
        font-size: 24px;
    }
}
</style>
