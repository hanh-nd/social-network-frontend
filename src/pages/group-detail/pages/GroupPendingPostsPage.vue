<template>
    <div class="group-pending-post-container">
        <div class="group-pending-post-wrapper mx-auto">
            <div class="group-menu">
                <GroupMenu />
            </div>
            <div class="screen">
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
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import * as _ from 'lodash';
import { Options } from 'vue-class-component';
import GroupMenu from '../components/common/GroupMenu.vue';
import GroupPendingPostList from '../components/pending/administrator/GroupPendingPostList.vue';
import MemberPendingPostList from '../components/pending/member/MemberPendingPostList.vue';
import { groupDetailModule } from '../store';

@Options({
    components: {
        GroupPendingPostList,
        MemberPendingPostList,
        GroupMenu,
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
    display: flex;
    flex-direction: row;
    height: 100%;
    gap: 8px;

    .screen {
        display: flex;
        flex-direction: column;
        flex: 1;
        max-width: map-get($grid-breakpoints, lg);
        gap: 8px;
    }

    .group-menu {
        position: sticky;
        top: 58px;
        height: calc(100vh - 60px);
        padding-top: 8px;
        width: 300px;
    }

    .title {
        margin-top: 8px;
        font-weight: 500;
        font-size: 24px;
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, md)) {
    .group-pending-post-wrapper {
        flex-direction: column;

        .group-menu {
            display: none;
        }
    }
}
</style>
