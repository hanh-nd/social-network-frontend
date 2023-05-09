<template>
    <div class="feed-menu-wrapper">
        <el-menu :default-active="FeedScreenType.MAIN" :collapse="isCollapse" @select="onSelect">
            <el-menu-item :index="FeedScreenType.MAIN">
                <el-icon><Menu /></el-icon>
                <template #title>Trang chủ</template>
            </el-menu-item>
            <el-menu-item :index="FeedScreenType.EXPLORE">
                <el-icon><Notification /></el-icon>
                <template #title>Khám phá</template>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
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
        return appModule.screenWidth < 576;
    }

    onSelect(screen: FeedScreenType) {
        homeModule.setFeedScreenType(screen);
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

        &.is-active {
            font-weight: 700;
        }
    }
}
</style>
