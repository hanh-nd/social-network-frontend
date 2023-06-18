<template>
    <div class="manage-survey-page-wrapper">
        <div class="manage-survey-page-container mx-auto">
            <div class="search">
                <BaseInputText @on-enter="onEnter" v-model:value="keyword" placeholder="Nhập để tìm kiếm" />
            </div>
            <div class="table">
                <SurveyTable />
            </div>
        </div>
    </div>
    <CreateSurveyDialog />
    <UpdateSurveyDialog />
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import SurveyTable from '../components/SurveyTable.vue';
import { adminSurveyModule } from '../store';
import CreateSurveyDialog from '../components/CreateSurveyDialog.vue';
import UpdateSurveyDialog from '../components/UpdateSurveyDialog.vue';

@Options({
    components: {
        SurveyTable,
        CreateSurveyDialog,
        UpdateSurveyDialog,
    },
})
export default class ManageSurveyPage extends GlobalMixin {
    keyword = '';

    onEnter() {
        adminSurveyModule.resetSurveyListQuery();
        adminSurveyModule.setSurveyListQuery({
            keyword: this.keyword,
        });
        adminSurveyModule.getSurveyList();
    }

    created(): void {
        this.loadData();
    }

    loadData() {
        adminSurveyModule.getSurveyList();
    }
}
</script>
<style lang="scss" scoped>
.manage-survey-page-wrapper {
    .manage-survey-page-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 16px;
    }
}
</style>
