<template>
    <div class="time-spent-chart-wrapper w-100">
        <div class="bar-chart w-100">
            <Bar
                :data="{
                    labels: barLabels,
                    datasets: barDatasets,
                }"
                :options="options"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Bar } from 'vue-chartjs';
import { Options } from 'vue-class-component';
import { profileModule } from '../../store';

@Options({
    components: { Bar },
})
export default class TimeSpentChart extends GlobalMixin {
    get statistics() {
        return profileModule.userStatistics;
    }

    get barLabels() {
        return this.statistics.map((s) => s.date);
    }

    get barDatasets() {
        return [
            {
                label: 'Thời gian hoat động',
                data: this.statistics.map((s) => s.spentHour),
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
.time-spent-chart-wrapper {
    display: flex;
    flex-direction: row;
    gap: 16px;
}
</style>
