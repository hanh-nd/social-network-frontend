<template>
    <div class="explore-feed-screen-wrapper">
        <div class="news-feed">
            <BasePostList :postList="postList" @on-load-more="onLoadMorePostDebounced" />
        </div>

        <div class="reload">
            Bạn đã xem hết tin.
            <div class="reload-button" @click="reload">Tải lại trang</div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { debounce } from 'lodash';
import { Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { FeedScreenType } from '../constants';
import { homeModule } from '../store';

@Options({
    components: {},
})
export default class ExploreFeedScreen extends GlobalMixin {
    get postList() {
        return homeModule.postList;
    }

    get screenType() {
        return homeModule.feedScreenType;
    }

    @Watch('screenType', { immediate: true })
    onScreenTypeChange() {
        if (this.screenType !== FeedScreenType.EXPLORE) return;

        this.loadData();
    }

    async loadData() {
        homeModule.resetPostListQuery();
        homeModule.getInterestedFeed({});
    }

    get currentPage() {
        return homeModule.postListQuery.page as number;
    }

    get isFetchedAllPostList() {
        return homeModule.isFetchedAllPostList;
    }

    onLoadMorePostDebounced = debounce(() => {
        if (this.isFetchedAllPostList) return;
        homeModule.setPostListQuery({
            page: this.currentPage + 1,
        });
        homeModule.getInterestedFeed({ append: true });
    }, 100);

    reload() {
        this.loadData();
        window.scrollTo(0, 0);
    }
}
</script>

<style lang="scss" scoped>
.explore-feed-screen-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: auto;
    max-width: map-get($grid-breakpoints, sm);

    .reload {
        display: flex;
        flex-direction: row;
        align-self: center;
        gap: 4px;
        margin: 16px 0;

        .reload-button {
            color: $color-green;
            font-weight: 700;
            cursor: pointer;
        }
    }
}
</style>
