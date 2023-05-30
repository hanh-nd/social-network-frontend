<template>
    <div class="notification-item-wrapper">
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
import { generateNotificationMessageContent } from '@/common/helpers';
import { INotification } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
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
