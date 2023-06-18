<template>
    <div class="group-detail-page-container">
        <div class="group-detail-page-wrapper mx-auto">
            <div class="group-menu">
                <GroupMenu />
            </div>

            <div class="feed-screen">
                <div class="header w-100">
                    <GroupDetailHeader />
                </div>

                <div class="body w-100">
                    <GroupFeedScreen v-if="groupDetailScreen === GroupDetailScreenTab.MAIN" />
                    <PinnedPostScreen v-if="groupDetailScreen === GroupDetailScreenTab.PINNED" />
                    <OverviewScreen v-if="groupDetailScreen === GroupDetailScreenTab.OVERVIEW" />
                    <MembersScreen v-if="groupDetailScreen === GroupDetailScreenTab.MEMBERS" />
                </div>
            </div>
        </div>
    </div>

    <!--Dialog-->
    <CreatePostDialog />
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import GroupDetailHeader from '../components/GroupDetailHeader.vue';
import GroupMenu from '../components/common/GroupMenu.vue';
import CreatePostDialog from '../components/group-feed/CreatePostDialog.vue';
import GroupFeedScreen from '../components/group-feed/GroupFeedScreen.vue';
import MembersScreen from '../components/members/MembersScreen.vue';
import OverviewScreen from '../components/overview/OverviewScreen.vue';
import PinnedPostScreen from '../components/pinned-posts/PinnedPostScreen.vue';
import { GroupDetailScreenTab } from '../constants';
import { groupDetailModule } from '../store';

@Options({
    components: {
        GroupDetailHeader,
        GroupFeedScreen,
        PinnedPostScreen,
        OverviewScreen,
        MembersScreen,
        CreatePostDialog,
        GroupMenu,
    },
})
export default class GroupDetailPage extends GlobalMixin {
    GroupDetailScreenTab = GroupDetailScreenTab;

    get groupId() {
        return this.$route.params.id as string;
    }

    get groupDetailScreen() {
        return groupDetailModule.groupDetailScreenTab;
    }

    created(): void {
        groupDetailModule.setGroupDetailScreenTab(GroupDetailScreenTab.MAIN);
        this.loadData();
    }

    async loadData() {
        groupDetailModule.getGroupDetail(this.groupId);
    }
}
</script>

<style lang="scss" scoped>
.group-detail-page-container {
    width: 100%;
    background: $color-gray;
    min-height: calc(100vh - 50px);
}

.group-detail-page-wrapper {
    width: 100%;
    display: flex;
    flex-direction: row;
    height: 100%;
    gap: 8px;

    .feed-screen {
        display: flex;
        flex-direction: column;
        flex: 1;
        max-width: map-get($grid-breakpoints, lg);
        margin: auto;
        gap: 8px;
    }

    .group-menu {
        position: sticky;
        top: 58px;
        height: calc(100vh - 60px);
        padding-top: 8px;
        width: 300px;
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, md)) {
    .group-detail-page-wrapper {
        flex-direction: column;

        .group-menu {
            display: none;
        }
    }
}
</style>
