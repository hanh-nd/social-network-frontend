<template>
    <div class="notification-item-wrapper" :style="containerStyle" v-if="isShow">
        <div class="left-section">
            <BaseRoundAvatar :user="author" :size="32" />
        </div>

        <div class="mid-section" @click="onClickNotification">
            <div class="content">
                {{ content }}
            </div>
            <div class="time">
                {{ parseDateTimeRelative(notification.createdAt) }}
            </div>
        </div>

        <div class="right-section">
            <BaseThreeDotMenu>
                <el-dropdown-item @click="markAsRead"
                    ><el-icon :size="16"><Edit /></el-icon>Đánh dấu là đã đọc</el-dropdown-item
                >
                <el-dropdown-item @click="undoMarkAsRead"
                    ><el-icon :size="16"><Edit /></el-icon>Đánh dấu là chưa đọc</el-dropdown-item
                >
                <el-dropdown-item @click="deleteNotification"
                    ><el-icon :size="16"><Delete /></el-icon>Xóa</el-dropdown-item
                >
            </BaseThreeDotMenu>
        </div>
    </div>
</template>

<script lang="ts">
import { NotificationTargetType } from '@/common/constants';
import { generateNotificationMessageContent } from '@/common/helpers';
import { IComment, INotification, ISystemMessage } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import notificationApiService from '@/common/service/notification.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import { isNil } from 'lodash';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
})
export default class NotificationItem extends GlobalMixin {
    @Prop() notification!: INotification;

    get content() {
        return generateNotificationMessageContent(this.notification);
    }

    get author() {
        return this.notification.author;
    }

    get isShow() {
        return isNil(this.notification.deletedAt);
    }

    get containerStyle() {
        return this.notification.isRead
            ? undefined
            : {
                  background: `#d8f3c3`,
              };
    }

    onClickNotification() {
        this.markAsRead();

        switch (this.notification.targetType) {
            case NotificationTargetType.POST:
                return this.goToPostDetail();
            case NotificationTargetType.COMMENT:
                return this.goToPostCommentDetail();
            case NotificationTargetType.SYSTEM_MESSAGE:
                return this.openSystemMessageDialog();
        }
    }

    async markAsRead() {
        const response = await notificationApiService.markAsRead(this.notification._id);
        if (response?.success) {
            this.notification.isRead = true;
        } else {
            this.showErrorNotificationFunction(response?.message || `Có lỗi xảy ra khi đánh dấu trạng thái thông báo`);
        }
    }

    goToPostDetail() {
        const id = this.notification.target._id;
        this.$router.push({
            name: this.PageName.POST_DETAIL_PAGE,
            params: {
                id: id,
            },
        });
    }

    goToPostCommentDetail() {
        const comment = this.notification.target || ({} as IComment);
        const id = (comment._id || comment) as string;
        this.$router.push({
            name: this.PageName.POST_DETAIL_PAGE,
            params: {
                id: id,
            },
        });
    }

    openSystemMessageDialog() {
        appModule.setSystemMessageParameters(this.notification.additionalData || {});
        appModule.setSystemMessage(this.notification.target as ISystemMessage);
        appModule.setIsShowSystemMessageDialog(true);
    }

    async undoMarkAsRead() {
        const response = await notificationApiService.undoMarkAsRead(this.notification._id);
        if (response?.success) {
            this.notification.isRead = false;
        } else {
            this.showErrorNotificationFunction(response?.message || `Có lỗi xảy ra khi đánh dấu trạng thái thông báo`);
        }
    }

    async deleteNotification() {
        const response = await notificationApiService.delete(this.notification._id);
        if (response?.success) {
            this.notification.deletedAt = new Date();
        } else {
            this.showErrorNotificationFunction(response?.message || `Có lỗi xảy ra khi đánh dấu trạng thái thông báo`);
        }
    }
}
</script>

<style lang="scss" scoped>
.notification-item-wrapper {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    cursor: pointer;
    padding: 8px;
    margin-bottom: 8px;
    border-radius: 8px;
    word-break: break-word;

    .right-section {
        display: flex;
        flex-direction: column;
        align-self: flex-start;
    }
}
</style>