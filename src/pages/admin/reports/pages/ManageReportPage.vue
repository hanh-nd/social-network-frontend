<template>
    <div class="manage-report-page-wrapper">
        <div class="manage-report-page-container mx-auto">
            <div class="search">
                <BaseInputText @on-enter="onEnter" v-model:value="keyword" placeholder="Nhập để tìm kiếm" />
            </div>
            <div class="table">
                <ReportTable />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import ReportTable from '../components/ReportTable.vue';
import { adminReportModule } from '../store';

@Options({
    components: {
        ReportTable,
    },
})
export default class ManageReportPage extends GlobalMixin {
    keyword = '';

    onEnter() {
        adminReportModule.resetReportListQuery();
        adminReportModule.setReportListQuery({
            keyword: this.keyword,
        });
        adminReportModule.getReportList();
    }

    created(): void {
        this.loadData();
    }

    loadData() {
        adminReportModule.getReportList();
    }
}
</script>
<style lang="scss" scoped>
.manage-report-page-wrapper {
    .manage-report-page-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 16px;
    }
}
</style>
