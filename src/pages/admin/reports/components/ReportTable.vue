<template>
    <div class="report-table">
        <div class="filter">
            <el-radio-group v-model="groupType">
                <el-radio-button :label="GroupType.ALL">Tất cả</el-radio-button>
                <el-radio-button :label="GroupType.USER">Người dùng</el-radio-button>
                <el-radio-button :label="GroupType.POST">Bài viết</el-radio-button>
                <el-radio-button :label="GroupType.COMMENT">Bình luận</el-radio-button>
            </el-radio-group>
        </div>
        <div class="action">
            <el-button :disabled="currentPage === 1" @click="onPrev">Trang trước</el-button>
            <el-button :disabled="isFetchedAllReportList" @click="onNext">Trang sau</el-button>
        </div>
        <el-table :data="reportList" stripe style="width: 100%" ref="multipleTableRef" cell-class-name="cell-item">
            <el-table-column prop="_id" label="Mã báo cáo" width="150" />
            <el-table-column prop="author.fullName" label="Người báo cáo" width="150" />
            <el-table-column prop="author.username" label="Mã người báo cáo" width="150" />
            <el-table-column prop="systemReporter" label="Hệ thống" width="150" />
            <el-table-column prop="reportReason" label="Lý do" width="150" />
            <el-table-column label="Nội dung" width="150">
                <template #default="scope">
                    {{ parseReportContent(scope.row) }}
                </template>
            </el-table-column>
            <el-table-column label="Thời gian tạo" width="150">
                <template #default="scope">
                    {{ parseDateTime(scope.row.createdAt, DateFormat.DD_vi_MM_YYYY_HH_mm) }}
                </template>
            </el-table-column>
            <el-table-column label="Trạng thái" width="150">
                <template #default="scope">
                    <el-tag :type="parseAction(scope.row)?.type">{{ parseAction(scope.row)?.message }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="Note vận hành" min-width="150">
                <template #default="scope">
                    <ReportNoteForm :report="scope.row" />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="Thao tác" width="120">
                <template #default="scope">
                    <el-tooltip content="Chấp nhận báo cáo" :hide-after="100">
                        <el-icon :size="20" style="cursor: pointer" @click.prevent="acceptReport(scope.row)"
                            ><Delete
                        /></el-icon>
                    </el-tooltip>
                    <el-tooltip content="Từ chối báo cáo" :hide-after="100">
                        <el-icon :size="20" style="cursor: pointer" @click.prevent="rejectReport(scope.row)"
                            ><CircleClose
                        /></el-icon>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { ReportAction, ReportTargetType } from '@/common/constants';
import { IComment, IPost, IReport, IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import adminReportApiService from '@/common/service/admin.report.api.service';
import { Options } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { adminReportModule } from '../store';
import ReportNoteForm from './ReportNoteForm.vue';

@Options({
    components: {
        ReportNoteForm,
    },
})
export default class ReportTable extends GlobalMixin {
    GroupType = {
        ALL: 'ALL',
        USER: ReportTargetType.USER,
        POST: ReportTargetType.POST,
        COMMENT: ReportTargetType.COMMENT,
    };

    groupType = this.GroupType.ALL;

    @Watch('groupType')
    onGroupTypeChange() {
        adminReportModule.resetReportListQuery();
        const targetType = this.groupType === this.GroupType.ALL ? undefined : this.groupType;
        adminReportModule.setReportListQuery({
            targetType: targetType as ReportTargetType,
        });
        adminReportModule.getReportList();
    }

    get reportList() {
        return adminReportModule.reportList;
    }

    selectedReports: IReport[] = [];

    get currentPage() {
        return adminReportModule.reportListQuery.page as number;
    }

    get isFetchedAllReportList() {
        return adminReportModule.isFetchedAllReportList;
    }

    onPrev() {
        if (this.currentPage > 1 && this.isFetchedAllReportList) {
            adminReportModule.setIsFetchedAllReportList(false);
        }
        adminReportModule.setReportListQuery({
            page: this.currentPage - 1,
        });
        adminReportModule.getReportList();
    }

    onNext() {
        adminReportModule.setReportListQuery({
            page: this.currentPage + 1,
        });
        adminReportModule.getReportList();
    }

    getDetail(report: IReport) {
        this.$router.push({
            name: this.PageName.POST_DETAIL_PAGE,
            params: {
                id: report._id,
            },
        });
    }

    async acceptReport(report: IReport) {
        const response = await adminReportApiService.acceptReport(report._id);
        if (response?.success) {
            report.action = ReportAction.RESOLVED;
            this.showSuccessNotificationFunction('Xử lý yêu cầu thành công');
        } else {
            this.showErrorNotificationFunction(response?.message || `Có lỗi xảy ra trong quá trình xử lý.`);
        }
    }

    async rejectReport(report: IReport) {
        const response = await adminReportApiService.rejectReport(report._id);
        if (response?.success) {
            report.action = ReportAction.REJECTED;
            this.showSuccessNotificationFunction('Xử lý yêu cầu thành công');
        } else {
            this.showErrorNotificationFunction(response?.message || `Có lỗi xảy ra trong quá trình xử lý.`);
        }
    }

    parseAction(report: IReport) {
        if (report.action === ReportAction.PENDING) {
            return {
                type: `default`,
                message: `Đang chờ xử lý`,
            };
        }

        if (report.action === ReportAction.REJECTED) {
            return {
                type: `danger`,
                message: `Đã từ chối`,
            };
        }

        if (report.action === ReportAction.RESOLVED) {
            return {
                type: `success`,
                message: `Đã xử lý`,
            };
        }
    }

    parseReportContent(report: IReport) {
        if (report.targetType === ReportTargetType.USER) {
            const target = report.target as IUser;
            return target.fullName;
        }

        if (report.targetType === ReportTargetType.POST) {
            const target = report.target as IPost;
            return target.content;
        }

        if (report.targetType === ReportTargetType.COMMENT) {
            const target = report.target as IComment;
            return target.content;
        }
    }
}
</script>

<style lang="scss" scoped>
:deep(.el-table__row) {
    .cell-item {
        .cell {
            word-break: break-word;
            max-height: 60px;
        }
    }
}

:deep(.filter) {
    margin-bottom: 8px;
    .el-radio-group {
        padding: 0;
    }
}
</style>
