<template>
    <div class="account-menu-wrapper">
        <el-dropdown :hide-on-click="true" placement="top-start" ref="dropdown" trigger="click">
            <div class="d-flex user-info" :class="{ sticky: isSticky }">
                <img :src="avatar" alt="" class="avatar" />
                <p class="text-truncate">Guest</p>
            </div>
        </el-dropdown>
    </div>
</template>

<script lang="ts">
import { HEIGHT_SHOW_STICKY_HEADER } from '@/common/constants';
import { GlobalMixin } from '@/common/mixins';
import { ref } from 'vue';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

interface IDropdown {
    handleClose: () => void;
}

@Options({
    components: {},
})
export default class AccountMenuGuest extends GlobalMixin {
    @Prop({ default: false }) readonly isSticky!: boolean;
    dropdown = ref();

    get avatar() {
        return require('@/assets/images/common/default-avatar.svg');
    }

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
            (this.$refs.dropdown as IDropdown)?.handleClose();
        }
    }
}
</script>

<style lang="scss" scoped>
p {
    margin-bottom: 0px;
}
hr {
    margin: 0;
    color: $color-black-3;
}
.router-link {
    text-decoration: none;
}
.user-info {
    justify-content: space-between;
    align-items: center;
    color: $color-black;
    cursor: pointer;
    .avatar {
        vertical-align: middle;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-left: 35px;
        margin-right: 8px;
    }
    p {
        max-width: 150px;
        color: #1d1d1d;
    }
}
:deep(.dropdown-item) {
    border-radius: 12px;
}
:deep(.dropdown-item:hover) {
    font-weight: 700;
    background-color: $color-white !important;
    color: $color-green !important;
}
:deep(.dropdown-item:focus) {
    font-weight: 700;
    background-color: $color-white !important;
    color: $color-green !important;
}
:deep(.dropdown-item:active) {
    font-weight: 700;
    background-color: $color-white !important;
    color: $color-green !important;
}
ul {
    border-radius: 12px;
    width: 180px;
    padding: 0;
}
:deep(.el-dropdown-menu__item) {
    height: 36px;
    display: flex;
}
</style>
