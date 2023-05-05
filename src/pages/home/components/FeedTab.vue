<template>
    <div class="feed-tab-wrapper">
        <el-tabs tab-position="left">
            <el-tab-pane label="Trang chủ"><MainTabPane /></el-tab-pane>
            <el-tab-pane label="Khám phá"><MainTabPane /></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import MainTabPane from './MainTabPane.vue';

@Options({
    components: {
        MainTabPane,
    },
})
export default class FeedTab extends GlobalMixin {}
</script>

<style lang="scss" scoped>
.feed-tab-wrapper {
    height: 100%;

    :deep(.el-tabs) {
        height: 100%;
    }
    :deep(.el-tabs__header) {
        background: $color-white;
        border-radius: 0 6px 0 0;
        width: 100%;
        max-width: 250px;
    }

    :deep(.el-tabs__nav-wrap) {
        border-radius: 0 6px 0 0;
    }

    :deep(.el-tabs__nav) {
        width: 100%;
    }

    :deep(.el-tabs__item) {
        justify-content: flex-start;
        width: 100%;
    }
}
</style>
