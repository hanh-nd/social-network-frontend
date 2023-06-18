<template>
    <div class="survey-table">
        <div class="action">
            <el-button @click="onCreateSurvey" type="primary">Thêm khảo sát</el-button>
            <el-button :disabled="currentPage === 1" @click="onPrev">Trang trước</el-button>
            <el-button :disabled="isFetchedAllSurveyList" @click="onNext">Trang sau</el-button>
        </div>
        <el-table :data="surveyList" stripe style="width: 100%" ref="multipleTableRef" cell-class-name="cell-item">
            <el-table-column prop="_id" label="ID khảo sát" width="150" />
            <el-table-column prop="name" label="Tên khảo sát" width="150" />
            <el-table-column prop="description" label="Mô tả" width="150" />
            <el-table-column prop="type" label="Phân loại" width="150" />
            <el-table-column prop="question" label="Câu hỏi" width="300" />
            <el-table-column label="Thời gian gửi" width="150">
                <template #default="scope">
                    {{ parseDateTime(scope.row.askDate, DateFormat.DD_vi_MM_YYYY_HH_mm) }}
                </template>
            </el-table-column>
            <el-table-column label="Ngay lập tức" min-width="150">
                <template #default="scope">
                    {{ scope.row.urgent ? 'Có' : 'Không' }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="Thao tác" width="120">
                <template #default="scope">
                    <el-icon :size="20" style="cursor: pointer" @click.prevent="onUpdateSurvey(scope.row)"
                        ><Edit
                    /></el-icon>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { ISurvey } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { adminSurveyModule } from '../store';

@Options({
    components: {},
})
export default class SurveyTable extends GlobalMixin {
    get surveyList() {
        return adminSurveyModule.surveyList;
    }

    selectedSurveys: ISurvey[] = [];

    get currentPage() {
        return adminSurveyModule.surveyListQuery.page as number;
    }

    get isFetchedAllSurveyList() {
        return adminSurveyModule.isFetchedAllSurveyList;
    }

    handleSelectionChange(surveys: ISurvey[]) {
        this.selectedSurveys = surveys;
    }

    onPrev() {
        if (this.currentPage > 1 && this.isFetchedAllSurveyList) {
            adminSurveyModule.setIsFetchedAllSurveyList(false);
        }
        adminSurveyModule.setSurveyListQuery({
            page: this.currentPage - 1,
        });
        adminSurveyModule.getSurveyList();
    }

    onNext() {
        adminSurveyModule.setSurveyListQuery({
            page: this.currentPage + 1,
        });
        adminSurveyModule.getSurveyList();
    }

    onCreateSurvey() {
        adminSurveyModule.setIsShowCreateSurveyDialog(true);
    }

    onUpdateSurvey(survey: ISurvey) {
        adminSurveyModule.setSelectedSurvey(survey);
        adminSurveyModule.setIsShowUpdateSurveyDialog(true);
    }
}
</script>

<style lang="scss" scoped>
:deep(.el-table__row) {
    .cell-item {
        .cell {
            max-height: 60px;
            word-break: break-word;
        }
    }
}
</style>
