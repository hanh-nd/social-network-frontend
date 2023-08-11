<template>
    <div class="group-pending-member-bar-wrapper" v-if="isAdmin && joinRequestList.length">
        <div class="message" @click="openGroupPendingMemberPage">
            Bạn có
            <span class="pending-number">
                {{ joinRequestList.length }}
            </span>
            yêu cầu tham gia cần phê duyệt.
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { groupDetailModule } from '../../store';
import { appModule } from '@/plugins/vuex/appModule';

export default class GroupPendingMemberBar extends GlobalMixin {
    get group() {
        return groupDetailModule.groupDetail;
    }

    get loginUser() {
        return appModule.loginUser;
    }

    get isAdmin() {
        return !!this.group.administrators?.find((admin) => admin.user._id == this.loginUser._id);
    }

    get joinRequestList() {
        return groupDetailModule.joinRequestList;
    }

    openGroupPendingMemberPage() {
        this.$router.push({
            name: this.PageName.JOIN_GROUP_REQUEST_PAGE,
            params: {
                id: this.group._id,
            },
        });
    }
}
</script>

<style lang="scss">
.group-pending-member-bar-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: $color-white;
    border-radius: 8px;

    .pending-number {
        font-weight: 700;
    }

    .message {
        cursor: pointer;
    }
}
</style>
