<template>
    <div class="admin-dashboard-page-wrapper">
        <div class="admin-dashboard-page-container mx-auto">
            <div class="statistic-container"></div>
            <div class="chart-container">
                <div class="chart user">
                    <div>
                        Thống kê người dùng: <span style="font-weight: 700">{{ totalUsers }}</span> người dùng
                    </div>
                    <UserChart />
                </div>
                <div class="chart post">
                    <div>
                        Thống kê bài viết: <span style="font-weight: 700">{{ totalPosts }}</span> bài viết
                    </div>
                    <PostChart />
                </div>
                <div class="chart group">
                    <div>
                        Thống kê hội nhóm: <span style="font-weight: 700">{{ totalGroups }}</span> nhóm
                    </div>
                    <PostChart />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import PostChart from '../components/PostChart.vue';
import UserChart from '../components/UserChart.vue';
import { adminDashboardModule } from '../store';
import GroupChart from '../components/GroupChart.vue';

@Options({
    components: {
        UserChart,
        PostChart,
        GroupChart,
    },
})
export default class AdminDashboardPage extends GlobalMixin {
    created(): void {
        this.loadData();
    }

    get totalUsers() {
        return adminDashboardModule.userStatistic.total;
    }

    get totalPosts() {
        return adminDashboardModule.postStatistic.total;
    }

    get totalGroups() {
        return adminDashboardModule.groupStatistic.total;
    }

    async loadData() {
        adminDashboardModule.getUserStatistic();
        adminDashboardModule.getPostStatistic();
        adminDashboardModule.getGroupStatistic();
    }
}
</script>
<style lang="scss" scoped>
.admin-dashboard-page-wrapper {
    .admin-dashboard-page-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 16px;

        .chart-container {
            display: flex;
            flex-direction: column;
            gap: 16px;

            .chart {
                flex: 1;
            }
        }
    }
}
</style>
