<template>
    <div class="user-chart-wrapper">
        <div class="pie-chart">
            <Pie
                :data="{
                    labels: pieLabels,
                    datasets: pieDatasets,
                }"
                :options="options"
            />
        </div>
        <div class="line-chart">
            <Line
                :data="{
                    labels: lineLabels,
                    datasets: lineDatasets,
                }"
                :options="options"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Line, Pie } from 'vue-chartjs';
import { Options } from 'vue-class-component';
import { adminDashboardModule } from '../store';

@Options({
    components: { Pie, Line },
})
export default class UserChart extends GlobalMixin {
    get groupCount() {
        return adminDashboardModule.userStatistic.group;
    }

    get totalActive() {
        return adminDashboardModule.userStatistic.totalActive;
    }

    get totalDeactivated() {
        return adminDashboardModule.userStatistic.totalDeactivated;
    }

    get pieLabels() {
        return ['Hoạt động', 'Ngừng hoạt động'];
    }

    get pieDatasets() {
        return [
            {
                label: 'Số lượng người đăng ký',
                data: [this.totalActive, this.totalDeactivated],
                backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
                hoverOffset: 4,
            },
        ];
    }

    get lineLabels() {
        return this.groupCount.map((s) => s._id);
    }

    get lineDatasets() {
        return [
            {
                label: 'Số lượng người đăng ký',
                data: this.groupCount.map((s) => s.count),
                fill: false,
                borderColor: '#79bf43',
                tension: 0.1,
            },
        ];
    }

    get options() {
        return {
            responsive: true,
        };
    }
}
</script>

<style lang="scss" scoped>
.user-chart-wrapper {
    display: flex;
    flex-direction: row;
    gap: 16px;
    .pie-chart {
        flex: 1;
    }
    .line-chart {
        flex: 2;
    }
}
</style>
