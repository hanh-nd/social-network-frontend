<template>
    <div class="group-page-wrapper">
        <div class="group-page-container mx-auto">
            <div class="feed-menu">
                <FeedMenu />
            </div>
            <div class="feed-screen">
                <FeedScreen />
            </div>
        </div>
    </div>

    <!--Dialog-->
    <CreateNewGroupDialog />
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import CreateNewGroupDialog from '../components/CreateNewGroupDialog.vue';
import FeedMenu from '../components/FeedMenu.vue';
import FeedScreen from '../components/FeedScreen.vue';
import { groupModule } from '../store';

@Options({
    components: {
        FeedMenu,
        FeedScreen,
        CreateNewGroupDialog,
    },
})
export default class GroupPage extends GlobalMixin {
    created(): void {
        this.loadData();
    }

    async loadData() {
        groupModule.resetJoinedGroupListQuery();
        groupModule.resetCreatedGroupListQuery();
        groupModule.getJoinedGroupList({ append: false });
        groupModule.getCreatedGroupList({ append: false });
    }
}
</script>

<style lang="scss" scoped>
.group-page-wrapper {
    background-color: $color-gray;

    .group-page-container {
        display: flex;
        flex-direction: row;
        height: 100%;

        .feed-menu {
            position: sticky;
            top: 58px;
            height: calc(100vh - 60px);
            padding-top: 8px;
            width: 300px;
        }

        .feed-screen {
            flex: 1;
            padding-top: 8px;
            margin: 0 8px;
        }
    }

    @media only screen and (max-width: map-get($grid-breakpoints, sm)) {
        .group-page-container {
            flex-direction: column;

            .feed-menu {
                position: static;
                height: 100%;
                width: 100%;
                margin: 8px;
            }
        }
    }
}
</style>
