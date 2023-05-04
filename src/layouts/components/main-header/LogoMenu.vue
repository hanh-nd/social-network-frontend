<template>
    <div class="logo-menu-wrapper">
        <div class="logo">
            <router-link to="/">
                <img src="@/assets/images/common/logo.svg" alt="" />
            </router-link>
        </div>
        <div class="search-bar">
            <el-input v-model="keyword" placeholder="Nhập từ khóa để tìm kiếm" />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';

@Options({
    components: {},
})
export default class LogoMenu extends GlobalMixin {
    keyword = '';
}
</script>

<style lang="scss" scoped>
.logo-menu-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 80%;
    gap: 8px;
    .logo {
        height: 100%;

        img {
            height: 100%;
        }
    }

    :deep(.search-bar) {
        .el-input__wrapper {
            box-shadow: none;
        }
    }
}
</style>
