<template>
    <div class="profile-menu-wrapper">
        <el-menu
            :default-active="ProfileScreenTab.MAIN"
            class="profile-menu"
            mode="horizontal"
            @select="onSelectProfileScreen"
        >
            <el-menu-item :index="ProfileScreenTab.MAIN"
                ><div :id="ProfileScreenTab.MAIN">Dòng thời gian</div></el-menu-item
            >
            <el-menu-item :index="ProfileScreenTab.DESCRIBE"
                ><div :id="ProfileScreenTab.DESCRIBE">Giới thiệu</div></el-menu-item
            >
            <el-menu-item :index="ProfileScreenTab.SUBSCRIBERS"
                ><div :id="ProfileScreenTab.SUBSCRIBERS">Người theo dõi</div></el-menu-item
            >
            <el-menu-item :index="ProfileScreenTab.SUBSCRIBING"
                ><div :id="ProfileScreenTab.SUBSCRIBING">Đang theo dõi</div></el-menu-item
            >
        </el-menu>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { Options } from 'vue-class-component';
import { ProfileScreenTab } from '../constants';
import { profileModule } from '../store';

@Options({
    components: {},
})
export default class ProfileMenu extends GlobalMixin {
    ProfileScreenTab = ProfileScreenTab;

    get currentScreen() {
        return profileModule.profileScreenTab;
    }

    mounted(): void {
        EventEmitter.on(EventName.CHANGE_PROFILE_SCREEN_TAB, (tab: ProfileScreenTab) => {
            (document.getElementById(tab) as HTMLDivElement)?.click();
        });
    }

    onSelectProfileScreen(screen: ProfileScreenTab) {
        profileModule.setProfileScreenTab(screen);
    }
}
</script>

<style lang="scss" scoped>
.profile-menu-wrapper {
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
