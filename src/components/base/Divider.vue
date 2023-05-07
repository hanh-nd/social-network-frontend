<template>
    <div class="divider-wrapper">
        <el-divider :direction="direction" :style="style" />
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
})
export default class Divider extends GlobalMixin {
    @Prop({ default: 'horizontal' }) direction!: string;
    @Prop({ default: 24 }) height!: number;

    get style() {
        return {
            height: this.height + 'px',
        };
    }
}
</script>

<style lang="scss" scoped>
.divider-wrapper {
    :deep(.el-divider) {
        margin: 8px 0;
        border-color: $color-gray-2;
    }
}
</style>
