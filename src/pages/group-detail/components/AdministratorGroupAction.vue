<template>
    <div class="administrator-group-action-wrapper">
        <BaseThreeDotMenu>
            <el-dropdown-item @click="openJoinRequestPage">Yêu cầu tham gia</el-dropdown-item>
            <el-dropdown-item @click="openGroupPendingPostPage">Bài viết đang chờ được duyệt</el-dropdown-item>
            <el-dropdown-item @click="openOverviewScreen">Chỉnh sửa thông tin nhóm</el-dropdown-item>
        </BaseThreeDotMenu>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { EventEmitter, EventName } from '@/plugins/mitt';
import { Options } from 'vue-class-component';
import { GroupDetailScreenTab } from '../constants';

@Options({
    components: {},
})
export default class AdministratorGroupAction extends GlobalMixin {
    get groupId() {
        return this.$route.params.id as string;
    }

    openOverviewScreen() {
        EventEmitter.emit(EventName.CHANGE_GROUP_DETAIL_SCREEN_TAB, GroupDetailScreenTab.OVERVIEW);
    }

    openJoinRequestPage() {
        this.$router.push({
            name: this.PageName.JOIN_GROUP_REQUEST_PAGE,
            params: {
                id: this.groupId,
            },
        });
    }

    openGroupPendingPostPage() {
        this.$router.push({
            name: this.PageName.PENDING_GROUP_POSTS_PAGE,
            params: {
                id: this.groupId,
            },
        });
    }
}
</script>

<style lang="scss" scoped>
.administrator-group-action-wrapper {
    display: flex;
    flex-direction: row;
}
</style>
