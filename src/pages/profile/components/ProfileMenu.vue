<template>
    <div class="profile-menu-wrapper">
        <el-menu
            :default-active="ProfileScreenTab.MAIN"
            class="profile-menu"
            mode="horizontal"
            @select="onSelectProfileScreen"
        >
            <el-menu-item :index="ProfileScreenTab.MAIN">Dòng thời gian</el-menu-item>
            <el-menu-item :index="ProfileScreenTab.DESCRIBE">Giới thiệu</el-menu-item>
            <el-menu-item :index="ProfileScreenTab.SUBSCRIBERS">Người theo dõi</el-menu-item>
            <el-menu-item :index="ProfileScreenTab.SUBSCRIBING">Đang theo dõi</el-menu-item>
        </el-menu>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
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

    :deep(.el-menu-item) {
        --el-menu-active-color: #79bf43;

        &.is-active {
            font-weight: 700;
        }
    }
}
</style>
