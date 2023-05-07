<template>
    <div class="main-feed-screen-wrapper">
        <div class="create-new-post-bar">
            <CreateNewPostBar />
        </div>

        <div class="news-feed">
            <BasePostList :postList="postList" @on-load-more="onLoadMorePost" />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { homeModule } from '../store';
import CreateNewPostBar from './CreateNewPostBar.vue';

@Options({
    components: {
        CreateNewPostBar,
    },
})
export default class MainFeedScreen extends GlobalMixin {
    get postList() {
        return homeModule.postList;
    }

    created(): void {
        this.loadData();
    }

    async loadData() {
        homeModule.getNewsFeed();
    }

    onLoadMorePost() {
        homeModule.getNewsFeed();
    }
}
</script>

<style lang="scss" scoped>
.main-feed-screen-wrapper {
    margin: auto;
    max-width: map-get($grid-breakpoints, sm);

    .create-new-post-bar {
        background: $color-white;
        border-radius: 6px;
    }
}
</style>
