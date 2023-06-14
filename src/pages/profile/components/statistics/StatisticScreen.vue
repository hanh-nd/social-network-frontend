<template>
    <div class="statistic-screen-container">
        <div class="statistic-screen-wrapper">
            <div class="header">
                <div class="main">Thống kê thời gian sử dụng: {{ range }} ngày gần nhất</div>
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

@Options({
    components: {
        TimeSpentChart,
    },
})
export default class StatisticScreen extends GlobalMixin {
    get loginUser() {
        return appModule.loginUser;
    }

    get range() {
        return profileModule.statisticsQuery.range as number;
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
