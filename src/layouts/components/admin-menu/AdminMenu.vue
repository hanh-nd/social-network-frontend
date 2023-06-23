<template>
    <div class="admin-menu-wrapper">
        <el-menu class="admin-menu" :collapse="isCollapse" @select="onSelectPage" v-model="page">
            <el-menu-item :index="PageName.DASHBOARD" v-if="isSystemAdmin">
                <div :id="PageName.DASHBOARD">Dashboard</div>
            </el-menu-item>
            <el-menu-item :index="PageName.MANAGE_POST_PAGE">
                <div :id="PageName.MANAGE_POST_PAGE">Quản lý bài viết</div>
            </el-menu-item>
            <el-menu-item :index="PageName.MANAGE_REPORT_PAGE">
                <div :id="PageName.MANAGE_REPORT_PAGE">Quản lý báo cáo</div>
            </el-menu-item>
            <el-menu-item :index="PageName.MANAGE_USER_PAGE">
                <div :id="PageName.MANAGE_USER_PAGE">Quản lý người dùng</div>
            </el-menu-item>
            <el-menu-item :index="PageName.MANAGE_SURVEY_PAGE">
                <div :id="PageName.MANAGE_SURVEY_PAGE">Quản lý khảo sát</div>
            </el-menu-item>

            <el-menu-item :index="PageName.SETTINGS_PAGE">
                <div :id="PageName.SETTINGS_PAGE">Cài đặt hệ thống</div>
            </el-menu-item>
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
    page = PageName.MANAGE_POST_PAGE;

    onSelectPage(page: PageName) {
        this.$router.push({
            name: page,
        });
    }

    get isCollapse() {
        return appModule.screenWidth < 768;
    }

    mounted(): void {
        this.setCurrentTab();
    }

    setCurrentTab() {
        const route = this.$route.name as string;
        if (!route) return;
        (document.getElementById(route) as HTMLDivElement)?.click();
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
