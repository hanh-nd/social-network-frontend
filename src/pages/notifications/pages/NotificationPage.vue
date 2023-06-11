<template>
    <div class="notification-page-wrapper">
        <div class="notification-page-container mx-auto">
            <NotificationList :shouldLoadMore="true" />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import NotificationList from '../components/NotificationList.vue';
import { notificationModule } from '../store';

@Options({
    components: {
        NotificationList,
    },
})
export default class NotificationPage extends GlobalMixin {
    created(): void {
        this.loadData();
    }

    loadData() {
        notificationModule.resetNotificationListQuery();
        notificationModule.getNotifications();
    }
}
</script>

<style lang="scss" scoped>
.notification-page-wrapper {
    width: 100%;
    background: $color-gray;
    min-height: calc(100vh - 50px);
    padding: $content-padding 0;

    .notification-page-container {
        height: 100%;
        width: 100%;
        max-width: 575px;
        padding: $content-padding;
        margin: auto;
        background: $color-white;
        border-radius: 8px;
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .notification-page-wrapper {
        padding: 8px;
    }
}
</style>
