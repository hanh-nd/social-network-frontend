<template>
    <div class="main-feed-screen-wrapper">
        <div class="news-feed">
            <GroupPostList :groupPostList="groupPostList" @on-load-more="onLoadMorePost" />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { groupModule } from '../store';
import GroupPostList from './GroupPostList.vue';

@Options({
    components: {
        GroupPostList,
    },
})
export default class MainFeedScreen extends GlobalMixin {
    get groupPostList() {
        return groupModule.groupPostList;
    }

    created(): void {
        this.loadData();
    }

    async loadData() {
        groupModule.getGroupFeed();
    }

    onLoadMorePost() {
        groupModule.getGroupFeed();
    }
}
</script>

<style lang="scss" scoped>
.main-feed-screen-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: auto;
    max-width: map-get($grid-breakpoints, sm);
}
</style>
