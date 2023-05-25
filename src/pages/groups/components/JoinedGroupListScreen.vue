<template>
    <div class="joined-group-list-screen-wrapper">
        <div class="title">Nhóm bạn tham gia</div>
        <div class="group-list" v-infinite-scroll="onLoadMore">
            <GroupGridCard v-for="group in joinedGroupList" :key="group._id" :group="group" />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { groupModule } from '../store';
import GroupGridCard from './GroupGridCard.vue';

@Options({
    components: {
        GroupGridCard,
    },
})
export default class JoinedGroupListScreen extends GlobalMixin {
    get joinedGroupList() {
        return groupModule.joinedGroupList;
    }

    get currentPage() {
        return groupModule.joinedGroupListQuery.page as number;
    }

    get isFetchedAllJoinedGroupList() {
        return groupModule.isFetchedAllJoinedGroupList;
    }

    onLoadMore() {
        if (this.isFetchedAllJoinedGroupList) return;

        groupModule.setJoinedGroupListQuery({
            page: this.currentPage + 1,
        });
        groupModule.getJoinedGroupList({ append: true });
    }
}
</script>

<style lang="scss" scoped>
.joined-group-list-screen-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .title {
        font-weight: 700;
        font-size: 24px;
    }

    .group-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, xl)) {
    .joined-group-list-screen-wrapper {
        .group-list {
            grid-template-columns: repeat(3, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, lg)) {
    .joined-group-list-screen-wrapper {
        .group-list {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, md)) {
    .joined-group-list-screen-wrapper {
        .group-list {
            grid-template-columns: repeat(1, 1fr);
        }
    }
}
</style>
