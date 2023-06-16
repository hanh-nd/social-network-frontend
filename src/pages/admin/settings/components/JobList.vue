<template>
    <div class="job-list-wrapper">
        <div class="job-item" v-for="job in jobList" :key="job.key">
            <JobItem :job="job" />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { adminSettingsModule } from '../store';
import JobItem from './JobItem.vue';

@Options({
    components: {
        JobItem,
    },
})
export default class JobList extends GlobalMixin {
    get jobList() {
        return adminSettingsModule.jobList;
    }
}
</script>

<style lang="scss" scoped>
.job-list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
