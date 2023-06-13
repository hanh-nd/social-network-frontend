<template>
    <div class="group-menu-wrapper">
        <div class="header">
            <div class="info">
                <GroupCard :group="group" />
            </div>
        </div>
        <BaseDivider />
        <div class="action">
            <el-dropdown placement="bottom" trigger="click">
                <el-button type="primary">Đã tham gia</el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="leave" v-if="group?.isMember"> Rời khỏi nhóm </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <BaseDivider />
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import groupApiService from '@/common/service/group.api.service';
import GroupCard from '@/pages/groups/components/GroupCard.vue';
import { Options } from 'vue-class-component';
import { groupDetailModule } from '../../store';

@Options({
    components: {
        GroupCard,
    },
})
export default class GroupMenu extends GlobalMixin {
    get group() {
        return groupDetailModule.groupDetail;
    }

    async leave() {
        const response = await groupApiService.leave(this.group._id);
        if (response?.success) {
            groupDetailModule.getGroupDetail(this.group._id);
            groupDetailModule.getGroupMembers(this.group._id);
            this.showSuccessNotificationFunction(`Yêu cầu rời khỏi nhóm thành công.`);
        } else {
            this.showErrorNotificationFunction(response?.message || `Yêu cầu rời khỏi nhóm thất bại.`);
        }
    }
}
</script>

<style lang="scss" scoped>
.group-menu-wrapper {
    height: 100%;
    background: $color-white;
    border-radius: 8px;
    padding: 16px;

    .action {
        :deep(.el-dropdown) {
            width: 100%;
            .el-button {
                width: 100%;
            }
        }
    }
}
</style>
