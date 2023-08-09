<template>
    <div class="group-table">
        <div class="action">
            <el-button>
                <el-icon :size="20" @click.prevent="bulkDeleteSelectedGroups()"><Delete /></el-icon>
            </el-button>
            <el-button :disabled="currentPage === 1" @click="onPrev">Trang trước</el-button>
            <el-button :disabled="isFetchedAllGroupList" @click="onNext">Trang sau</el-button>
        </div>
        <el-table
            :data="groupList"
            stripe
            style="width: 100%"
            ref="multipleTableRef"
            cell-class-name="cell-item"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" />

            <el-table-column prop="_id" label="Mã nhóm" width="150" />
            <el-table-column prop="name" label="Tên hội nhóm" width="150" />
            <el-table-column label="Người sáng lập" width="150">
                <template #default="scope">
                    {{ scope.row.administrators.find((admin) => admin.isOwner)?.user?.fullName }}
                </template>
            </el-table-column>
            <el-table-column prop="summary" label="Mô tả" width="150" />
            <el-table-column label="Thành viên" width="100">
                <template #default="scope">
                    {{ scope.row.memberIds.length }}
                </template>
            </el-table-column>
            <el-table-column label="Kiểm duyệt" min-width="100">
                <template #default="scope">
                    <el-tag type="default">{{ scope.row.deletedAt ? 'Có' : 'Không' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="Riêng tư" min-width="100">
                <template #default="scope">
                    <el-tag type="default">{{ scope.row.deletedAt ? 'Có' : 'Không' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="Thời gian tạo" width="150">
                <template #default="scope">
                    {{ parseDateTime(scope.row.createdAt, DateFormat.DD_vi_MM_YYYY_HH_mm) }}
                </template>
            </el-table-column>
            <el-table-column label="Trạng thái" min-width="150">
                <template #default="scope">
                    <el-tag :type="scope.row.deletedAt ? 'danger' : 'default'">{{
                        scope.row.deletedAt ? 'Đã xóa' : 'Hoạt động'
                    }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="Thao tác" width="120">
                <template #default="scope">
                    <el-tooltip content="Xóa bài viết" :hide-after="100">
                        <el-icon :size="20" style="cursor: pointer" @click.prevent="deleteGroup(scope.row)"
                            ><Delete
                        /></el-icon>
                    </el-tooltip>
                    <el-tooltip content="Xem chi tiết" :hide-after="100">
                        <el-icon :size="20" style="cursor: pointer" @click.prevent="getDetail(scope.row)"
                            ><Edit
                        /></el-icon>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { IGroup } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import adminGroupApiService from '@/common/service/admin.group.api.service';
import { Options } from 'vue-class-component';
import { adminGroupModule } from '../store';
@Options({
    components: {},
})
export default class GroupTable extends GlobalMixin {
    get groupList() {
        return adminGroupModule.groupList;
    }

    selectedGroups: IGroup[] = [];

    get currentPage() {
        return adminGroupModule.groupListQuery.page as number;
    }

    get isFetchedAllGroupList() {
        return adminGroupModule.isFetchedAllGroupList;
    }

    handleSelectionChange(groups: IGroup[]) {
        this.selectedGroups = groups;
    }

    async bulkDeleteSelectedGroups() {
        const response = await adminGroupApiService.bulkDeleteGroup({
            ids: this.selectedGroups.filter((p) => !p.deletedAt).map((p) => p._id),
        });
        if (response?.success) {
            for (const p of this.selectedGroups) {
                p.deletedAt = new Date();
            }
            (this.$refs.multipleTableRef as any).clearSelection();
        }
    }

    async deleteGroup(group: IGroup) {
        const response = await adminGroupApiService.bulkDeleteGroup({
            ids: [group._id],
        });
        if (response?.success) {
            group.deletedAt = new Date();
        }
    }

    onPrev() {
        if (this.currentPage > 1 && this.isFetchedAllGroupList) {
            adminGroupModule.setIsFetchedAllGroupList(false);
        }
        adminGroupModule.setGroupListQuery({
            page: this.currentPage - 1,
        });
        adminGroupModule.getGroupList();
    }

    onNext() {
        adminGroupModule.setGroupListQuery({
            page: this.currentPage + 1,
        });
        adminGroupModule.getGroupList();
    }

    getDetail(group: IGroup) {
        this.$router.push({
            name: this.PageName.GROUP_DETAIL_PAGE,
            params: {
                id: group._id,
            },
        });
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
