<template>
    <div class="settings-page-wrapper">
        <div class="settings-page-container mx-auto">
            <div class="job">
                <div class="title">Danh sách Job</div>
                <div class="list">
                    <JobList />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { adminSettingsModule } from '../store';
import JobList from '../components/JobList.vue';

@Options({
    components: {
        JobList,
    },
})
export default class SettingsPage extends GlobalMixin {
    created(): void {
        this.loadData();
    }

    loadData() {
        adminSettingsModule.getJobList();
    }
}
</script>
<style lang="scss" scoped>
.settings-page-wrapper {
    .settings-page-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 16px;

        .title {
            font-weight: 700;
            font-size: 24px;
        }
    }
}
</style>
