<template>
    <div class="three-dot-menu-wrapper">
        <el-dropdown placement="bottom-end" trigger="click">
            <el-icon :size="24">
                <More />
            </el-icon>
            <template #dropdown>
                <el-dropdown-menu>
                    <slot></slot>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';

@Options({
    components: {},
})
export default class ThreeDotMenu extends GlobalMixin {}
</script>

<style lang="scss" scoped></style>
