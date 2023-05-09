<template>
    <div class="header-wrapper">
        <div class="header-container mx-auto" :class="{ sticky: isSticky, ontop: !isSticky }">
            <!-- Main Menu -->
            <MainMenu class="main-menu"></MainMenu>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import MainMenu from './MainMenu.vue';

@Options({
    components: {
        MainMenu,
    },
})
export default class MenuHeader extends GlobalMixin {
    @Prop({ default: false }) readonly isSticky!: boolean;
    @Prop({ default: false }) isVisible!: boolean;

    get currentPage() {
        return this.$route.name || '';
    }
}
</script>

<style lang="scss" scoped>
.header-wrapper {
    background-color: $color-pink-light;
}

.header-container {
    max-width: $content-max-width + $content-padding * 2;
    padding: 0 $content-padding;
    font-family: 'Roboto';
    height: 56px;
    font-size: 15px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1000;
}
</style>
