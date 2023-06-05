<template>
    <div class="admin-menu-wrapper">
        <el-menu
            class="admin-menu"
            :collapse="isCollapse"
            @select="onSelectPage"
            :default-active="PageName.MANAGE_POST_PAGE"
        >
            <el-menu-item :index="PageName.DASHBOARD" v-if="isSystemAdmin"> Dashboard </el-menu-item>
            <el-menu-item :index="PageName.MANAGE_POST_PAGE"> Quản lý bài viết </el-menu-item>
            <el-menu-item :index="PageName.MANAGE_REPORT_PAGE"> Quản lý báo cáo </el-menu-item>
            <el-menu-item :index="PageName.MANAGE_USER_PAGE"> Quản lý người dùng </el-menu-item>
        </el-menu>
    </div>
</template>

<script lang="ts">
import { PageName } from '@/common/constants';
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';

@Options({})
export default class AdminMenu extends GlobalMixin {
    onSelectPage(page: PageName) {
        this.$router.push({
            name: page,
        });
    }

    get isCollapse() {
        return appModule.screenWidth < 768;
    }
}
</script>

<style lang="scss" scoped>
.admin-menu-wrapper {
    height: 100%;

    :deep(.el-menu) {
        height: 100%;
        border-radius: 0 6px 0 0;
    }

    :deep(.el-menu-item) {
        --el-menu-active-color: #79bf43;
        --el-menu-hover-text-color: #79bf43;
        --el-menu-hover-bg-color: #effdfa;

        * {
            vertical-align: middle;
        }

        &.is-active {
            font-weight: 700;
        }

        .login-user {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;

            .name {
                font-size: 16px;
            }
        }
    }
}
</style>
