<template>
    <div class="feed-menu-wrapper">
        <el-menu :default-active="FeedScreenType.MAIN" @select="onSelect">
            <div class="title">Nhóm</div>

            <el-menu-item :index="FeedScreenType.MAIN">
                <el-icon><Menu /></el-icon>
                <template #title>Bảng tin của bạn</template>
            </el-menu-item>

            <div class="create-new-group">
                <el-button @click="openCreateGroupDialog">Tạo mới nhóm</el-button>
            </div>

            <BaseDivider />

            <div class="own-groups">
                <div class="header">
                    <div class="text">Nhóm bạn quản lý</div>
                    <div class="load-more" @click="onSelect(FeedScreenType.CREATED_GROUP_LIST)">Xem thêm</div>
                </div>
                <div class="group-card-list">
                    <div class="group-card" v-for="group in createdGroupList" :key="group._id">
                        <GroupCard :group="group" />
                    </div>
                </div>
            </div>

            <BaseDivider />

            <div class="your-groups">
                <div class="header">
                    <div class="text">Nhóm bạn tham gia</div>
                    <div class="load-more" @click="onSelect(FeedScreenType.JOINED_GROUP_LIST)">Xem thêm</div>
                </div>
                <div class="group-card-list">
                    <div class="group-card" v-for="group in joinedGroupList" :key="group._id">
                        <GroupCard :group="group" />
                    </div>
                </div>
            </div>
        </el-menu>
    </div>
</template>

<script lang="ts">
import { IGroup } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import { FeedScreenType } from '../constants';
import { groupModule } from '../store';
import GroupCard from './GroupCard.vue';

@Options({
    components: {
        GroupCard,
    },
})
export default class FeedMenu extends GlobalMixin {
    FeedScreenType = FeedScreenType;
    joinedGroups: IGroup[] = [];
    createdGroups: IGroup[] = [];

    get loginUser() {
        return appModule.loginUser;
    }

    onSelect(screen: FeedScreenType) {
        if (!Object.values(FeedScreenType).includes(screen)) return;
        groupModule.setFeedScreenType(screen);
    }

    get joinedGroupList() {
        return groupModule.joinedGroupList.slice(0, 3);
    }

    get createdGroupList() {
        return groupModule.createdGroupList.slice(0, 3);
    }

    openCreateGroupDialog() {
        groupModule.setIsShowCreateNewGroupDialog(true);
    }
}
</script>

<style lang="scss" scoped>
.feed-menu-wrapper {
    height: 100%;

    .title {
        padding: 8px 16px;
        font-size: 32px;
        font-weight: 700;
    }

    .create-new-group {
        padding: 16px;
        width: 100%;
        text-align: center;
    }
    .own-groups,
    .your-groups {
        display: flex;
        flex-direction: column;
        padding: 8px;

        .header {
            display: flex;
            flex-direction: row;
            align-items: baseline;
            padding: 8px 16px;
            justify-content: space-between;
            .load-more {
                font-size: 10px;
                color: $color-green;
                cursor: pointer;
            }
        }

        .group-card-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
    }

    :deep(.el-menu) {
        height: 100%;
        border-radius: 0 6px 0 0;
    }

    :deep(.el-menu-item) {
        --el-menu-active-color: #79bf43;
        --el-menu-hover-text-color: #79bf43;
        --el-menu-hover-bg-color: #effdfa;

        * {
            vertical-align: middle;
        }

        &.is-active {
            font-weight: 700;
        }

        .login-user {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;

            .name {
                font-size: 16px;
            }
        }
    }
}
</style>
