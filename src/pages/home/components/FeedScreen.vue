<template>
    <div class="feed-screen-wrapper">
        <div class="main-screen" v-if="currentFeedScreenType === FeedScreenType.MAIN">
            <MainFeedScreen />
        </div>

        <div class="explore-screen" v-if="currentFeedScreenType === FeedScreenType.EXPLORE">
            <ExploreFeedScreen />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { FeedScreenType } from '../constants';
import { homeModule } from '../store';
import ExploreFeedScreen from './ExploreFeedScreen.vue';
import MainFeedScreen from './MainFeedScreen.vue';

@Options({
    components: {
        MainFeedScreen,
        ExploreFeedScreen,
    },
})
export default class FeedScreen extends GlobalMixin {
    FeedScreenType = FeedScreenType;

    get currentFeedScreenType() {
        return homeModule.feedScreenType;
    }
}
</script>

<style lang="scss" scoped>
.feed-menu-wrapper {
    height: 100%;
}
</style>
