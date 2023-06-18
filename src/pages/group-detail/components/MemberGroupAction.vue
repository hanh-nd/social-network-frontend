<template>
    <div class="member-group-action-wrapper">
        <BaseThreeDotMenu>
            <el-dropdown-item @click="goToPendingPostPage">Xem bài viết đang chờ duyệt</el-dropdown-item>
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
            groupDetailModule.getGroupMembers(this.group._id);
            this.showSuccessNotificationFunction(`Yêu cầu rời khỏi nhóm thành công.`);
        } else {
            this.showErrorNotificationFunction(response?.message || `Yêu cầu rời khỏi nhóm thất bại.`);
        }
    }

    goToPendingPostPage() {
        this.$router.push({
            name: this.PageName.PENDING_GROUP_POSTS_PAGE,
            params: {
                id: this.group._id,
            },
        });
    }
}
</script>

<style lang="scss" scoped>
.member-group-action-wrapper {
    display: flex;
    flex-direction: row;
}
</style>
