<template>
    <div class="system-message-table">
        <div class="action">
            <el-button @click="onCreateSystemMessage" type="primary">Thêm thông báo</el-button>
            <el-button :disabled="currentPage === 1" @click="onPrev">Trang trước</el-button>
            <el-button :disabled="isFetchedAllSystemMessageList" @click="onNext">Trang sau</el-button>
        </div>
        <el-table
            :data="systemMessageList"
            stripe
            style="width: 100%"
            ref="multipleTableRef"
            cell-class-name="cell-item"
        >
            <el-table-column prop="_id" label="ID thông báo" width="150" />
            <el-table-column prop="code" label="Mã thông báo" width="150" />
            <el-table-column prop="template" label="Template" width="300" />
            <el-table-column prop="fullTemplate" label="Template đầy đủ" width="500" />
            <el-table-column label="Loại thông báo" min-width="300">
                <template #default="scope">
                    {{ SystemMessageTypeName[scope.row.type] }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="Thao tác" width="120">
                <template #default="scope">
                    <el-tooltip content="Cập nhật thông báo" :hide-after="100">
                        <el-icon :size="20" style="cursor: pointer" @click.prevent="onUpdateSystemMessage(scope.row)"
                            ><Edit
                        /></el-icon>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { ISystemMessage } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { adminSystemMessageModule } from '../store';
import { SystemMessageTypeName } from '@/common/constants';

@Options({
    components: {},
})
export default class SystemMessageTable extends GlobalMixin {
    SystemMessageTypeName = SystemMessageTypeName;

    get systemMessageList() {
        return adminSystemMessageModule.systemMessageList;
    }

    selectedSystemMessages: ISystemMessage[] = [];

    get currentPage() {
        return adminSystemMessageModule.systemMessageListQuery.page as number;
    }

    get isFetchedAllSystemMessageList() {
        return adminSystemMessageModule.isFetchedAllSystemMessageList;
    }

    handleSelectionChange(systemMessages: ISystemMessage[]) {
        this.selectedSystemMessages = systemMessages;
    }

    onPrev() {
        if (this.currentPage > 1 && this.isFetchedAllSystemMessageList) {
            adminSystemMessageModule.setIsFetchedAllSystemMessageList(false);
        }
        adminSystemMessageModule.setSystemMessageListQuery({
            page: this.currentPage - 1,
        });
        adminSystemMessageModule.getSystemMessageList();
    }

    onNext() {
        adminSystemMessageModule.setSystemMessageListQuery({
            page: this.currentPage + 1,
        });
        adminSystemMessageModule.getSystemMessageList();
    }

    onCreateSystemMessage() {
        adminSystemMessageModule.setIsShowCreateSystemMessageDialog(true);
    }

    onUpdateSystemMessage(systemMessage: ISystemMessage) {
        adminSystemMessageModule.setSelectedSystemMessage(systemMessage);
        adminSystemMessageModule.setIsShowUpdateSystemMessageDialog(true);
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
