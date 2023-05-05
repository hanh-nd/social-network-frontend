<template>
    <div class="left-navigation-wrapper">
        <div class="title">Danh bạ</div>
        <div class="contact-list"></div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';

@Options({
    components: {},
})
export default class RightContact extends GlobalMixin {}
</script>

<style lang="scss" scoped>
.left-navigation-wrapper {
    padding: 16px;
    height: 100%;
    background: $color-white;
    border-radius: 6px 0 0 0;
}
</style>
