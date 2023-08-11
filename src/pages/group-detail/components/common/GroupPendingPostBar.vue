<template>
    <div class="group-pending-post-bar-wrapper" v-if="groupPendingPosts.length">
        <div class="message" @click="openGroupPendingPostPage">
            Bạn có
            <span class="pending-number">
                {{ groupPendingPosts.length }}
            </span>
            bài viết {{ isAdmin ? 'cần phê duyệt.' : 'đang chờ phê duyệt.' }}
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { groupDetailModule } from '../../store';
import { appModule } from '@/plugins/vuex/appModule';

export default class GroupPendingPostBar extends GlobalMixin {
    get group() {
        return groupDetailModule.groupDetail;
    }

    get loginUser() {
        return appModule.loginUser;
    }

    get isAdmin() {
        return !!this.group.administrators?.find((admin) => admin.user._id == this.loginUser._id);
    }

    get groupPendingPosts() {
        return groupDetailModule.groupPendingPosts;
    }

    openGroupPendingPostPage() {
        this.$router.push({
            name: this.PageName.PENDING_GROUP_POSTS_PAGE,
            params: {
                id: this.group._id,
            },
        });
    }
}
</script>

<style lang="scss">
.group-pending-post-bar-wrapper {
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
