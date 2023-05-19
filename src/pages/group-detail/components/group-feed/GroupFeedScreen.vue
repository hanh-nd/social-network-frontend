<template>
    <div class="group-feed-screen-wrapper">
        <div class="group-post-list">
            <CreatePostBar />
            <GroupPostList :groupPostList="groupPostList" @on-load-more="onLoadMorePost" />
        </div>
        <div class="overview">
            <GroupOverview />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import GroupPostList from '../../../groups/components/GroupPostList.vue';
import { groupDetailModule } from '../../store';
import GroupOverview from '../common/GroupOverview.vue';
import CreatePostBar from './CreatePostBar.vue';

@Options({
    components: {
        CreatePostBar,
        GroupPostList,
        GroupOverview,
    },
})
export default class GroupFeedScreen extends GlobalMixin {
    get groupId() {
        return this.$route.params.id as string;
    }

    get groupPostList() {
        return groupDetailModule.groupPostList;
    }

    created(): void {
        this.loadData();
    }

    async loadData() {
        groupDetailModule.getGroupPosts(this.groupId);
    }

    onLoadMorePost() {
        groupDetailModule.getGroupPosts(this.groupId);
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
