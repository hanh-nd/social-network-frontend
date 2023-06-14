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
            <el-menu-item :index="ProfileScreenTab.SUBSCRIBERS" v-if="isUser || !(isPrivate && !isSubscribing)"
                ><div :id="ProfileScreenTab.SUBSCRIBERS">Người theo dõi</div></el-menu-item
            >
            <el-menu-item :index="ProfileScreenTab.SUBSCRIBING" v-if="isUser || !(isPrivate && !isSubscribing)"
                ><div :id="ProfileScreenTab.SUBSCRIBING">Đang theo dõi</div></el-menu-item
            >
            <el-menu-item :index="ProfileScreenTab.REQUEST" v-if="isUser"
                ><div :id="ProfileScreenTab.REQUEST">Yêu cầu theo dõi</div></el-menu-item
            >
            <el-menu-item :index="ProfileScreenTab.BLOCKS" v-if="isUser"
                ><div :id="ProfileScreenTab.BLOCKS">Đã chặn</div></el-menu-item
            >
            <el-menu-item :index="ProfileScreenTab.QUESTIONS" v-if="isUser"
                ><div :id="ProfileScreenTab.QUESTIONS">Câu hỏi dành cho tôi</div></el-menu-item
            >
            <el-menu-item :index="ProfileScreenTab.STATISTICS" v-if="isUser"
                ><div :id="ProfileScreenTab.STATISTICS">Thống kê</div></el-menu-item
            >
        </el-menu>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { appModule } from '@/plugins/vuex/appModule';
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

    get userId() {
        return this.$route.params.id as string;
    }

    get isUser() {
        return this.userId == this.loginUser._id;
    }

    get user() {
        return profileModule.profileUser || ({} as IUser);
    }

    get loginUser() {
        return appModule.loginUser;
    }

    get isSubscribing() {
        return this.user?.isSubscribing || false;
    }

    get isPrivate() {
        return this.user?.private || true;
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
