<template>
    <div class="member-group-action-wrapper">
        <BaseThreeDotMenu>
            <el-dropdown-item>Xem bài viết đang chờ duyệt</el-dropdown-item>
            <el-dropdown-item @click="leave">Rời khỏi nhóm</el-dropdown-item>
        </BaseThreeDotMenu>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import groupApiService from '@/common/service/group.api.service';
import { Options } from 'vue-class-component';
import { groupDetailModule } from '../store';

@Options({
    components: {},
})
export default class MemberGroupAction extends GlobalMixin {
    get group() {
        return groupDetailModule.groupDetail;
    }

    async leave() {
        const response = await groupApiService.leave(this.group._id);
        if (response?.success) {
            await groupDetailModule.getGroupDetail(this.group._id);
            this.showSuccessNotificationFunction(`Yêu cầu rời khỏi nhóm thành công.`);
        } else {
            this.showErrorNotificationFunction(response?.message || `Yêu cầu rời khỏi nhóm thất bại.`);
        }
    }
}
</script>

<style lang="scss" scoped>
.member-group-action-wrapper {
    display: flex;
    flex-direction: row;
}
</style>
