<template>
    <div class="notification-item-wrapper" @click="onClickNotification">
        <div class="left-section">
            <BaseRoundAvatar :user="author" :size="32" />
        </div>

        <div class="mid-section">
            <div class="content">
                {{ content }}
            </div>
            <div class="time">
                {{ parseDateTimeRelative(notification.createdAt) }}
            </div>
        </div>

        <div class="right-section">
            <BaseThreeDotMenu></BaseThreeDotMenu>
        </div>
    </div>
</template>

<script lang="ts">
import { NotificationTargetType } from '@/common/constants';
import { generateNotificationMessageContent } from '@/common/helpers';
import { IComment, INotification, ISystemMessage } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
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

    onClickNotification() {
        switch (this.notification.targetType) {
            case NotificationTargetType.POST:
                return this.goToPostDetail();
            case NotificationTargetType.COMMENT:
                return this.goToPostCommentDetail();
            case NotificationTargetType.SYSTEM_MESSAGE:
                return this.openSystemMessageDialog();
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
}
</script>

<style lang="scss" scoped>
.notification-item-wrapper {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;

    .right-section {
        display: flex;
        flex-direction: column;
    }
}
</style>
