<template>
    <div class="header-wrapper">
        <div class="header-container mx-auto" :class="{ sticky: isSticky, ontop: !isSticky }">
            <!-- Logo -->
            <LogoMenu class="logo-menu"></LogoMenu>
            <!-- Main Menu -->
            <MainMenu class="main-menu"></MainMenu>
            <!-- Account -->
            <AccountMenu class="account-menu"></AccountMenu>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import LogoMenu from './LogoMenu.vue';
import MainMenu from './MainMenu.vue';
import AccountMenu from './AccountMenu.vue';

@Options({
    components: {
        LogoMenu,
        MainMenu,
        AccountMenu,
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
    background-color: $color-white;
    box-shadow: 0px 2px $color-black-opacity-3;
    margin-bottom: 2px;
}

.header-container {
    max-width: $content-max-width + $content-padding * 2;
    padding: 0 $content-padding;
    font-family: 'Roboto';
    height: 56px;
    font-size: 15px;
    font-weight: 500;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    z-index: 1000;

    .logo-menu {
        display: flex;
        justify-content: flex-start;
        width: 25%;
    }

    .main-menu {
        justify-content: center;
    }

    .account-menu {
        display: flex;
        justify-content: flex-end;
        width: 25%;
    }
}
</style>
