<template>
    <div class="feed-screen-wrapper">
        <div class="main-screen" v-if="currentFeedScreenType === FeedScreenType.MAIN">
            <MainFeedScreen />
        </div>
        <div class="created-group-list-screen" v-if="currentFeedScreenType === FeedScreenType.CREATED_GROUP_LIST">
            <CreatedGroupListScreen />
        </div>
        <div class="joined-group-list-screen" v-if="currentFeedScreenType === FeedScreenType.JOINED_GROUP_LIST">
            <JoinedGroupListScreen />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { FeedScreenType } from '../constants';
import { groupModule } from '../store';
import CreatedGroupListScreen from './CreatedGroupListScreen.vue';
import JoinedGroupListScreen from './JoinedGroupListScreen.vue';
import MainFeedScreen from './MainFeedScreen.vue';

@Options({
    components: {
        MainFeedScreen,
        CreatedGroupListScreen,
        JoinedGroupListScreen,
    },
})
export default class FeedScreen extends GlobalMixin {
    FeedScreenType = FeedScreenType;

    get currentFeedScreenType() {
        return groupModule.feedScreenType;
    }
}
</script>

<style lang="scss" scoped>
.feed-menu-wrapper {
    height: 100%;
}
</style>
