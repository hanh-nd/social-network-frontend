<template>
    <div class="sticky-wrapper">
        <slot :isVisible="isSticky"></slot>
    </div>
</template>
<script lang="ts">
import { HEIGHT_SHOW_STICKY_HEADER } from '@/common/constants';
import { Options, Vue } from 'vue-class-component';

const timeFadeStickyHeader = 300;

@Options({})
export default class StickyHeader extends Vue {
    isSticky = false;

    mounted(): void {
        window.addEventListener('scroll', this.scrollHandler, {
            passive: true,
        });
    }
    beforeDestroy(): void {
        window.removeEventListener('scroll', this.scrollHandler);
    }
    scrollHandler(): void {
        const stickyContent = this.$el.children[0];
        if (window.pageYOffset > HEIGHT_SHOW_STICKY_HEADER) {
            if (!this.isSticky || !stickyContent.classList.contains('fixed')) {
                stickyContent.classList.add('fixed');
                this.isSticky = true;
            }
        } else if (this.isSticky) {
            stickyContent.classList.add('fade');
            setTimeout(() => {
                stickyContent.classList.remove('fixed');
                stickyContent.classList.remove('fade');
            }, timeFadeStickyHeader - 1);
            this.isSticky = false;
        }
    }
}
</script>
<style scoped lang="scss">
/* Sticky Header */
@keyframes fixedHeaderShow {
    0% {
        transform: translateY(-60px);
    }
    100% {
        transform: translateY(0);
    }
}

@keyframes fixedHeaderFade {
    0% {
        transform: translateY(0px);
    }
    100% {
        transform: translateY(-60px);
    }
}

:deep(.sticky-header) {
    display: none;
}

:deep(.sticky-header.fixed) {
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1040;
    animation-name: fixedHeaderShow;
    animation-duration: 0.3s;
    box-shadow: 0 3px 6px rgba(51, 51, 51, 0.05);
    background-color: $color-green;
}

:deep(.sticky-header.fade) {
    display: block;
    animation-name: fixedHeaderFade;
    animation-duration: 0.3s;
}
</style>
