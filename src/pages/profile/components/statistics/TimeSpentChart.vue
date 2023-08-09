<template>
    <div class="time-spent-chart-wrapper w-100">
        <div class="bar-chart w-100">
            <Line
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
import { Line } from 'vue-chartjs';
import { Options } from 'vue-class-component';
import { profileModule } from '../../store';
import moment from 'moment';
import { keyBy } from 'lodash';

@Options({
    components: { Line },
})
export default class TimeSpentChart extends GlobalMixin {
    get statistics() {
        return keyBy(profileModule.userStatistics, 'date');
    }

    get range() {
        return profileModule.statisticsQuery.range as number;
    }

    get barLabels() {
        return Array.from(Array(this.range).keys()).map((num) =>
            moment()
                .subtract(this.range - num - 1, 'day')
                .format(`YYYYMMDD`),
        );
    }

    get barDatasets() {
        return [
            {
                label: 'Thời gian hoat động',
                data: this.barLabels.map((label) => this.statistics[label]?.spentHour ?? 0),
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
