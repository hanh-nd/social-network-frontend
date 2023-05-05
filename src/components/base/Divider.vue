<template>
    <div class="divider-wrapper">
        <el-divider />
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';

@Options({
    components: {},
})
export default class Divider extends GlobalMixin {}
</script>

<style lang="scss" scoped>
.divider-wrapper {
    :deep(.el-divider) {
        margin: 8px 0;
        border-color: $color-gray-2;
    }
}
</style>
