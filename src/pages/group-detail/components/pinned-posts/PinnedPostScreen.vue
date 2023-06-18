<template>
    <div class="pinned-post-screen-wrapper">
        <div class="group-post-list">
            <GroupPostList :groupPostList="groupPostList" />
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

@Options({
    components: {
        GroupPostList,
        GroupOverview,
    },
})
export default class PinnedPostScreen extends GlobalMixin {
    get group() {
        return groupDetailModule.groupDetail;
    }

    get groupPostList() {
        return this.group?.pinnedPosts || [];
    }
}
</script>

<style lang="scss" scoped>
.pinned-post-screen-wrapper {
    display: flex;
    flex-direction: row;
    gap: 8px;

    .group-post-list {
        flex: 3;
    }

    .overview {
        flex: 2;
        position: sticky;
        top: 65px;
        height: calc(100vh - 60px);
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .pinned-post-screen-wrapper {
        .group-post-list {
            flex: 1;
        }
        .overview {
            display: none;
        }
    }
}
</style>
