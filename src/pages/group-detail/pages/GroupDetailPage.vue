<template>
    <div class="group-detail-page-container">
        <div class="group-detail-page-wrapper mx-auto">
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
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import GroupDetailHeader from '../components/GroupDetailHeader.vue';
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
    max-width: $content-max-width + $content-padding * 2;
    padding: 0 $content-padding;

    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
