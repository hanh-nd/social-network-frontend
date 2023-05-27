<template>
    <div class="hover-to-show-wrapper w-100 h-100" @mouseover="onHover" @mouseleave="onLeave" @click="onClick">
        <div class="hover-section w-100 h-100" v-show="isShowHoverSection">
            <slot name="hover"></slot>
        </div>
        <div class="content w-100 h-100">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';

@Options({
    emits: ['click'],
})
export default class HoverToShow extends GlobalMixin {
    isShowHoverSection = false;

    onHover() {
        this.isShowHoverSection = true;
    }

    onLeave() {
        this.isShowHoverSection = false;
    }

    onClick() {
        this.$emit(`click`);
    }
}
</script>

<style lang="scss" scoped>
.hover-to-show-wrapper {
    position: relative;
    cursor: pointer;

    .hover-section {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
}
</style>
