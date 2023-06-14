<template>
    <div class="created-group-list-screen-wrapper">
        <div class="title">Nhóm bạn quản lý</div>
        <div class="group-list" v-if="createdGroupList.length" v-infinite-scroll="onLoadMore">
            <GroupGridCard v-for="group in createdGroupList" :key="group._id" :group="group" />
        </div>
        <div class="empty" v-else>
            <el-empty description="Bạn chưa quản lý một nhóm nào." />
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
export default class CreatedGroupListScreen extends GlobalMixin {
    get createdGroupList() {
        return groupModule.createdGroupList;
    }

    onLoadMore() {
        console.log(`hihihi`);
    }
}
</script>

<style lang="scss" scoped>
.created-group-list-screen-wrapper {
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
    .created-group-list-screen-wrapper {
        .group-list {
            grid-template-columns: repeat(3, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, lg)) {
    .created-group-list-screen-wrapper {
        .group-list {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, md)) {
    .created-group-list-screen-wrapper {
        .group-list {
            grid-template-columns: repeat(1, 1fr);
        }
    }
}
</style>
