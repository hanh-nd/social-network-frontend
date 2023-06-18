<template>
    <div class="group-detail-menu-wrapper">
        <el-menu
            :default-active="GroupDetailScreenTab.MAIN"
            class="profile-menu"
            mode="horizontal"
            @select="onSelectProfileScreen"
        >
            <el-menu-item :index="GroupDetailScreenTab.MAIN"
                ><div :id="GroupDetailScreenTab.MAIN">Dòng thời gian</div></el-menu-item
            >
            <el-menu-item :index="GroupDetailScreenTab.PINNED"
                ><div :id="GroupDetailScreenTab.PINNED">Bài ghim</div></el-menu-item
            >
            <el-menu-item :index="GroupDetailScreenTab.OVERVIEW"
                ><div :id="GroupDetailScreenTab.OVERVIEW">Giới thiệu</div></el-menu-item
            >
            <el-menu-item :index="GroupDetailScreenTab.MEMBERS"
                ><div :id="GroupDetailScreenTab.MEMBERS">Thành viên</div></el-menu-item
            >
        </el-menu>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { Options } from 'vue-class-component';
import { GroupDetailScreenTab } from '../constants';
import { groupDetailModule } from '../store';

@Options({
    components: {},
})
export default class ProfileMenu extends GlobalMixin {
    GroupDetailScreenTab = GroupDetailScreenTab;

    get currentScreen() {
        return groupDetailModule.groupDetailScreenTab;
    }

    mounted(): void {
        EventEmitter.on(EventName.CHANGE_GROUP_DETAIL_SCREEN_TAB, (tab: GroupDetailScreenTab) => {
            (document.getElementById(tab) as HTMLDivElement)?.click();
        });
    }
    onSelectProfileScreen(screen: GroupDetailScreenTab) {
        groupDetailModule.setGroupDetailScreenTab(screen);
    }
}
</script>

<style lang="scss" scoped>
.group-detail-menu-wrapper {
    :deep(.el-menu) {
        height: 100%;
        border-radius: 0 6px 0 0;
    }

    :deep(.el-menu) {
        --el-menu-active-color: #79bf43;
        --el-menu-hover-text-color: #79bf43;
        --el-menu-hover-bg-color: #effdfa;
        --el-menu-active-color: #79bf43;
    }

    :deep(.el-menu-item) {
        &.is-active {
            font-weight: 700;
        }
    }
}
</style>
