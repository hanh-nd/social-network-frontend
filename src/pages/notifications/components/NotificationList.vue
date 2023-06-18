<template>
    <div class="notification-list-wrapper" v-infinite-scroll="onLoadMoreDebounced">
        <div class="header">
            <div class="title">Thông báo</div>
            <div class="action">
                <BaseThreeDotMenu>
                    <el-dropdown-item @click="markAllAsRead"
                        ><el-icon :size="16"><Edit /></el-icon>Đánh dấu tất cả là đã đọc</el-dropdown-item
                    >
                </BaseThreeDotMenu>
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
        <div class="notification-list h-100" v-if="notificationList.length">
            <div class="notification-item" v-for="notification in notificationList" :key="notification._id">
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
import notificationApiService from '@/common/service/notification.api.service';
import { debounce } from 'lodash';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { notificationModule } from '../store';
import NotificationItem from './NotificationItem.vue';

@Options({
    components: {
        NotificationItem,
    },
})
export default class NotificationList extends GlobalMixin {
    @Prop({ default: false }) shouldLoadMore!: boolean;

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

    onLoadMoreDebounced = debounce(this.onLoadMore, 200, {
        leading: true,
    });

    async onLoadMore() {
        if (!this.shouldLoadMore) return;

        if (this.isFetchedAllNotification) return;

        notificationModule.setNotificationListQuery({
            page: this.currentPage + 1,
        });

        notificationModule.getNotifications({ append: true });
    }

    async markAllAsRead() {
        const response = await notificationApiService.markAllAsRead();
        if (response?.success) {
            this.notificationList.forEach((notification) => (notification.isRead = true));
        } else {
            this.showErrorNotificationFunction(response?.message || `Có lỗi xảy ra khi đánh dấu trạng thái thông báo`);
        }
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

    .notification-list {
        overflow: auto;
    }

    .group-action {
        display: flex;
        justify-content: center;
    }
}
</style>
