<template>
    <div class="statistic-screen-container">
        <div class="statistic-screen-wrapper">
            <div class="header">
                <div class="left-section">
                    <div class="main">Thống kê thời gian sử dụng: {{ range }} ngày gần nhất</div>
                    <div class="sub" v-if="maxSpentHour?.date">
                        Ngày sử dụng nhiều nhất: {{ formatDateTime(maxSpentHour?.date, 'YYYYMMDD', 'DD-MM-YYYY') }} -
                        {{ maxSpentHour?.spentHour }} giờ
                    </div>
                    <div class="sub">Trung bình ngày: {{ avgHours }} giờ</div>
                </div>
                <BaseSingleSelect v-model:value="range" :options="rangeOptions" />
            </div>
            <BaseDivider />
            <div class="chart">
                <TimeSpentChart />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';
import TimeSpentChart from './TimeSpentChart.vue';
import { profileModule } from '../../store';
import { max, maxBy, round, sum } from 'lodash';
import { DatetimeFormat } from 'vue-i18n';

@Options({
    components: {
        TimeSpentChart,
    },
})
export default class StatisticScreen extends GlobalMixin {
    get rangeOptions() {
        return [3, 7, 14, 30, 60].map((range) => ({
            id: range,
            name: `${range} ngày`,
        }));
    }

    get loginUser() {
        return appModule.loginUser;
    }

    get range() {
        return profileModule.statisticsQuery.range as number;
    }

    set range(value: number) {
        profileModule.setStatisticsQuery({
            range: value,
        });
        profileModule.getUserStatistics();
    }

    get statistics() {
        return profileModule.userStatistics;
    }

    get avgHours() {
        return round(sum(this.statistics.map((s) => s.spentHour)) / this.range, 2);
    }

    get maxSpentHour() {
        return maxBy(this.statistics, 'spentHour');
    }

    mounted(): void {
        this.loadData();
    }

    loadData() {
        profileModule.getUserStatistics();
    }
}
</script>

<style lang="scss">
.statistic-screen-container {
    margin-bottom: 8px;
}
.statistic-screen-wrapper {
    background: $color-white;
    border-radius: 8px;
    padding: 16px;

    .header {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;

        .main {
            font-size: 24px;
            font-weight: 700;
        }

        .sub {
            font-size: 14px;
        }
    }

    .subscriber-list {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 60px;
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, lg)) {
    .statistic-screen-wrapper {
        .subscriber-list {
            grid-template-columns: repeat(4, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, md)) {
    .statistic-screen-wrapper {
        .subscriber-list {
            grid-template-columns: repeat(3, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .statistic-screen-wrapper {
        .subscriber-list {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, xs)) {
    .statistic-screen-wrapper {
        .subscriber-list {
            grid-template-columns: repeat(1, 1fr);
        }
    }
}
</style>
