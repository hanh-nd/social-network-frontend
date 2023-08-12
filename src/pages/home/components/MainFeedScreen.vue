<template>
    <div class="main-feed-screen-wrapper">
        <div class="create-new-post-bar">
            <BaseCreateNewPostBar />
        </div>

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
import { SocketEvent } from '@/common/constants';
import { IPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { SocketProvider } from '@/plugins/socket.io';
import { debounce } from 'lodash';
import { Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { FeedScreenType } from '../constants';
import { homeModule } from '../store';

@Options({
    components: {},
})
export default class MainFeedScreen extends GlobalMixin {
    get postList() {
        return homeModule.postList;
    }

    created(): void {
        this.loadData();
    }

    async loadData() {
        homeModule.resetPostListQuery();
        homeModule.getNewsFeed({});
    }

    get screenType() {
        return homeModule.feedScreenType;
    }

    @Watch('screenType', { immediate: true })
    onScreenTypeChange() {
        if (this.screenType !== FeedScreenType.EXPLORE) return;

        this.loadData();
    }

    mounted(): void {
        EventEmitter.on(EventName.POST_CREATED, this.postCreatedHandler);
        SocketProvider.socket.on(SocketEvent.POST_UPDATE, ({ postId, ...rest }) => {
            this.postUpdateHandler(postId, rest);
        });
    }

    unmounted(): void {
        EventEmitter.off(EventName.POST_CREATED, this.postCreatedHandler);
        SocketProvider.socket.off(SocketEvent.POST_UPDATE);
    }

    postCreatedHandler(post: IPost) {
        this.postList.unshift(post);
    }

    postUpdateHandler(postId: string, rest: Partial<IPost>) {
        const post = this.postList.find((p) => p._id === postId);
        if (!post) return;

        Object.assign(post, rest);
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
        homeModule.getNewsFeed({ append: true });
    }, 100);

    reload() {
        this.loadData();
        window.scrollTo(0, 0);
    }
}
</script>

<style lang="scss" scoped>
.main-feed-screen-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: auto;
    max-width: 1120px;

    .create-new-post-bar {
        background: $color-white;
        border-radius: 6px;
    }

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
