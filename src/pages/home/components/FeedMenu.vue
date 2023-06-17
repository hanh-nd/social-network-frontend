<template>
    <div class="feed-menu-wrapper">
        <el-menu :default-active="FeedScreenType.MAIN" :collapse="isCollapse" @select="onSelect">
            <el-menu-item :index="1">
                <div class="login-user" @click="goToProfilePage">
                    <BaseRoundAvatar :user="loginUser" :size="36" />
                    <div class="name" v-if="!isCollapse">
                        {{ loginUser.fullName }}
                    </div>
                </div>
            </el-menu-item>
            <el-menu-item :index="FeedScreenType.MAIN" :id="FeedScreenType.MAIN">
                <el-icon><Menu /></el-icon>
                <template #title>Trang chủ</template>
            </el-menu-item>
            <el-menu-item :index="FeedScreenType.EXPLORE" :id="FeedScreenType.EXPLORE">
                <el-icon><Notification /></el-icon>
                <template #title>Dành cho bạn</template>
            </el-menu-item>
            <el-menu-item :index="2" @click="goToGroupPage">
                <el-icon><Connection /></el-icon>
                <template #title>Hội nhóm</template>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import { FeedScreenType } from '../constants';
import { homeModule } from '../store';

@Options({
    components: {},
})
export default class FeedMenu extends GlobalMixin {
    FeedScreenType = FeedScreenType;

    get isCollapse() {
        return appModule.screenWidth < 768;
    }

    get loginUser() {
        return appModule.loginUser;
    }

    onSelect(screen: FeedScreenType) {
        if (!Object.values(FeedScreenType).includes(screen)) return;
        homeModule.setFeedScreenType(screen);
    }

    goToProfilePage() {
        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: this.loginUser._id,
            },
        });
    }

    goToGroupPage() {
        this.$router.push({
            name: this.PageName.GROUP_PAGE,
        });
    }

    mounted(): void {
        EventEmitter.on(EventName.CHANGE_HOME_FEED_SCREEN_TAB, (type: FeedScreenType) => {
            document.getElementById(type)?.click();
            if (!Object.values(FeedScreenType).includes(type)) return;
            homeModule.setFeedScreenType(type);
        });
    }

    unmounted(): void {
        EventEmitter.off(EventName.CHANGE_HOME_FEED_SCREEN_TAB);
    }
}
</script>

<style lang="scss" scoped>
.feed-menu-wrapper {
    height: 100%;

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
