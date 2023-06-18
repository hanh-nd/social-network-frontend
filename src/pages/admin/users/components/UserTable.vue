<template>
    <div class="user-table">
        <div class="action">
            <el-button :disabled="currentPage === 1" @click="onPrev">Trang trước</el-button>
            <el-button :disabled="isFetchedAllUserList" @click="onNext">Trang sau</el-button>
        </div>
        <el-table :data="userList" stripe style="width: 100%" ref="multipleTableRef" cell-class-name="cell-item">
            <el-table-column prop="_id" label="ID người dùng" width="150" />
            <el-table-column prop="fullName" label="Tên người dùng" width="150" />
            <el-table-column prop="username" label="Mã người dùng" width="150" />
            <el-table-column prop="email" label="Email" width="200" />
            <el-table-column prop="phone" label="Số điện thoại" width="150" />
            <el-table-column prop="point" label="Điểm c.xúc" width="100" />
            <el-table-column label="Lần hoạt động cuối" width="150">
                <template #default="scope">
                    {{ parseDateTime(scope.row.lastOnlineAt, DateFormat.DD_vi_MM_YYYY_HH_mm) }}
                </template>
            </el-table-column>
            <el-table-column label="Thời gian tạo" width="150">
                <template #default="scope">
                    {{ parseDateTime(scope.row.createdAt, DateFormat.DD_vi_MM_YYYY_HH_mm) }}
                </template>
            </el-table-column>
            <el-table-column label="Trạng thái" min-width="150">
                <template #default="scope">
                    <el-tag :type="scope.row.active ? 'default' : 'danger'">{{
                        scope.row.active ? 'Hoạt động' : 'Ngừng hoạt động'
                    }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="Thao tác" width="120">
                <template #default="scope">
                    <el-icon :size="20" style="cursor: pointer" @click.prevent="activateOrDeactivate(scope.row)"
                        ><SwitchFilled
                    /></el-icon>
                    <el-icon :size="20" style="cursor: pointer" @click.prevent="getDetail(scope.row)"><Edit /></el-icon>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import adminUserApiService from '@/common/service/admin.user.api.service';
import { Options } from 'vue-class-component';
import { adminUserModule } from '../store';

@Options({
    components: {},
})
export default class UserTable extends GlobalMixin {
    get userList() {
        return adminUserModule.userList;
    }

    selectedUsers: IUser[] = [];

    get currentPage() {
        return adminUserModule.userListQuery.page as number;
    }

    get isFetchedAllUserList() {
        return adminUserModule.isFetchedAllUserList;
    }

    handleSelectionChange(users: IUser[]) {
        this.selectedUsers = users;
    }

    async activateOrDeactivate(user: IUser) {
        const response = await adminUserApiService.activateUser(user._id);
        if (response?.success) {
            user.active = !user.active;
        }
    }

    onPrev() {
        if (this.currentPage > 1 && this.isFetchedAllUserList) {
            adminUserModule.setIsFetchedAllUserList(false);
        }
        adminUserModule.setUserListQuery({
            page: this.currentPage - 1,
        });
        adminUserModule.getUserList();
    }

    onNext() {
        adminUserModule.setUserListQuery({
            page: this.currentPage + 1,
        });
        adminUserModule.getUserList();
    }

    getDetail(user: IUser) {
        adminUserModule.setSelectedUser(user);
        adminUserModule.setIsShowUpdateUserDialog(true);
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
