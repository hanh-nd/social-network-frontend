<template>
    <div class="profile-menu-wrapper"></div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';

@Options({
    components: {},
})
export default class ProfileMenu extends GlobalMixin {}
</script>

<style lang="scss" scoped></style>
