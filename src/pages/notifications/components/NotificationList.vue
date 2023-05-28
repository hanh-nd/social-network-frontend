<template>
    <div class="notification-list-wrapper">
        <div class="header">
            <div class="title">Thông báo</div>
            <div class="action">
                <BaseThreeDotMenu></BaseThreeDotMenu>
            </div>
        </div>
        <BaseDivider />
        <div class="group-action">
            <el-radio-group v-model="groupType">
                <el-radio-button :label="GroupType.ALL">Tất cả</el-radio-button>
                <el-radio-button :label="GroupType.NOT_READ">Chưa đọc</el-radio-button>
            </el-radio-group>
        </div>
        <BaseDivider />
        <div class="notification-list" v-if="notificationList.length">
            <div
                class="notification-item"
                v-for="notification in notificationList"
                :key="notification._id"
                v-infinite-scroll="onLoadMore"
            >
                <NotificationItem :notification="notification" />
            </div>
        </div>
        <div class="empty-list" v-else>
            <el-empty description="Bạn chưa có thông báo nào." />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { notificationModule } from '../store';
import NotificationItem from './NotificationItem.vue';

@Options({
    components: {
        NotificationItem,
    },
})
export default class NotificationList extends GlobalMixin {
    GroupType = {
        ALL: 'ALL',
        NOT_READ: 'NOT_READ',
    };

    groupType = this.GroupType.ALL;

    get notificationList() {
        return this.groupType === this.GroupType.NOT_READ
            ? notificationModule.notificationList.filter((notification) => !notification.isRead)
            : notificationModule.notificationList;
    }

    get isFetchedAllNotification() {
        return notificationModule.isFetchedAllNotificationList;
    }

    get currentPage() {
        return notificationModule.notificationListQuery.page as number;
    }

    async onLoadMore() {
        if (this.isFetchedAllNotification) return;

        notificationModule.setNotificationListQuery({
            page: this.currentPage + 1,
        });

        notificationModule.getNotifications({ append: true });
    }
}
</script>

<style lang="scss" scoped>
.notification-list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .title {
            font-size: 24px;
            font-weight: 700;
        }
    }

    .group-action {
        display: flex;
        justify-content: center;
    }
}
</style>
