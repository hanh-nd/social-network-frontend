<template>
    <div class="main-menu-header">
        <div class="menu-list"></div>
    </div>
</template>

<script lang="ts">
import { HEIGHT_SHOW_STICKY_HEADER } from '@/common/constants';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
})
export default class MainMenu extends Vue {
    @Prop({ default: false }) readonly isSticky!: boolean;

    mounted(): void {
        window.addEventListener('scroll', this.scrollHandler, {
            passive: true,
        });
    }
    beforeDestroy(): void {
        window.removeEventListener('scroll', this.scrollHandler);
    }
    scrollHandler(): void {
        if (
            (window.pageYOffset > HEIGHT_SHOW_STICKY_HEADER && !this.isSticky) ||
            (window.pageYOffset < HEIGHT_SHOW_STICKY_HEADER && this.isSticky)
        ) {
            // (this.$refs.dropdown as IDropdown)?.handleClose();
        }
    }
}
</script>

<style lang="scss" scoped>
.main-menu-header {
    display: inline-flex;
    justify-content: flex-start;
    a {
        text-decoration: none;
        color: $color-black;
        margin-right: 2vw;
    }
    .router-link-black:hover,
    .router-link:hover {
        color: $color-green !important;
    }
}
.router-link-black.router-link-exact-active {
    color: $color-black !important;
}

.router-link {
    text-transform: capitalize;
}

.router-link-exact-active {
    color: $color-green !important;
}
</style>
