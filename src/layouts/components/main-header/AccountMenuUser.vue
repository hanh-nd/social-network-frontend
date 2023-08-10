<template>
    <div class="account-menu-wrapper">
        <el-popover
            popper-class="notification-list-dialog"
            placement="bottom"
            :width="250"
            trigger="click"
            :teleported="false"
        >
            <div class="notification-list-menu">
                <NotificationList />
                <div class="see-more">
                    <el-button type="info" @click="goToNotificationPage">Xem tất cả</el-button>
                </div>
            </div>

            <template #reference>
                <el-icon :size="24" class="chat-btn me-2">
                    <el-badge :value="unreadNotificationCount" :hidden="!unreadNotificationCount">
                        <Bell />
                    </el-badge>
                </el-icon>
            </template>
        </el-popover>

        <el-popover popper-class="chat-list-dialog" placement="bottom" :width="250" trigger="click" :teleported="false">
            <div class="chat-list">
                <ChatListMenu
                    @on-click-chat-item="onClickChatItem"
                    @on-open-create-chat-dialog="openCreateChatDialog"
                />
                <div class="see-more">
                    <el-button type="info" @click="goToChatPage">Xem tất cả</el-button>
                </div>
            </div>

            <template #reference>
                <el-icon :size="24" class="chat-btn me-2">
                    <el-badge :value="unreadChatCount" :hidden="!unreadChatCount">
                        <ChatDotRound />
                    </el-badge>
                </el-icon>
            </template>
        </el-popover>

        <el-dropdown :hide-on-click="true" placement="top-start" ref="dropdown" trigger="click">
            <div class="d-flex user-info" :class="{ sticky: isSticky }">
                <BaseRoundAvatar :user="loginUser" :size="32" :onClick="() => {}" />
                <p class="text-truncate">{{ name }}</p>
            </div>

            <template #dropdown>
                <el-dropdown-menu>
                    <router-link class="router-link" :to="`/profile/${loginUser._id}`">
                        <el-dropdown-item class="dropdown-item">
                            <p>Trang cá nhân</p>
                        </el-dropdown-item>
                    </router-link>
                    <hr />
                    <hr />
                    <router-link class="router-link" :to="`/profile`">
                        <el-dropdown-item class="dropdown-item">
                            <p>Thiết lập tài khoản</p>
                        </el-dropdown-item>
                    </router-link>
                    <hr />
                    <hr />
                    <router-link class="router-link" :to="`/admin/posts`" v-if="isModerator">
                        <el-dropdown-item class="dropdown-item">
                            <p>Quản trị</p>
                        </el-dropdown-item>
                    </router-link>
                    <hr />
                    <hr />
                    <el-dropdown-item @click="logout" class="dropdown-item">
                        <p>Đăng xuất</p>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang="ts">
import localStorageAuthService from '@/common/authStorage';
import { HEIGHT_SHOW_STICKY_HEADER, NotificationTargetType, SocketEvent } from '@/common/constants';
import { generateNotificationMessageContent } from '@/common/helpers';
import { INotification, ISurvey, ISystemMessage, IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import appApiService from '@/common/service/app.api.service';
import ChatListMenu from '@/pages/chat/components/ChatListMenu.vue';
import { IChat } from '@/pages/chat/interfaces';
import { chatModule } from '@/pages/chat/store';
import NotificationList from '@/pages/notifications/components/NotificationList.vue';
import { notificationModule } from '@/pages/notifications/store';
import { SocketProvider } from '@/plugins/socket.io';
import { appModule } from '@/plugins/vuex/appModule';
import { ref } from 'vue';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

interface IDropdown {
    handleClose: () => void;
}

@Options({
    components: {
        NotificationList,
        ChatListMenu,
    },
})
export default class AccountMenuUser extends GlobalMixin {
    @Prop({ default: false }) readonly isSticky!: boolean;
    @Prop({ default: false }) readonly shouldRegisterSocket!: boolean;

    dropdown = ref();

    get name() {
        return appModule.loginUser?.fullName || appModule.loginUser?.email;
    }

    get avatar() {
        return appModule.loginUser?.avatarId
            ? `${process.env.VUE_APP_API_URL}/files/${appModule.loginUser.avatarId}`
            : require('@/assets/images/common/default-avatar.svg');
    }

    get loginUser() {
        return appModule.loginUser;
    }

    get unreadNotificationCount() {
        return notificationModule.unreadNotificationCount;
    }

    get unreadChatCount() {
        return chatModule.unreadChatCount;
    }

    mounted(): void {
        this.registerNotificationEvents();

        window.addEventListener('scroll', this.scrollHandler, {
            passive: true,
        });
        chatModule.getChatList();
        chatModule.getUnreadChatCount();
        notificationModule.getNotifications();
        notificationModule.getUnreadNotificationCount();
    }
    beforeDestroy(): void {
        window.removeEventListener('scroll', this.scrollHandler);
    }
    scrollHandler(): void {
        if (
            (window.pageYOffset > HEIGHT_SHOW_STICKY_HEADER && !this.isSticky) ||
            (window.pageYOffset < HEIGHT_SHOW_STICKY_HEADER && this.isSticky)
        ) {
            (this.$refs.dropdown as IDropdown)?.handleClose();
        }
    }
    async logout() {
        if (this.loginUser?._id) {
            await appApiService.logout();
            SocketProvider.logout(this.loginUser._id);
            appModule.setLoginUser({} as IUser);
            localStorageAuthService.resetAll();
        }
        this.$router.push('/login');
    }

    goToChatPage() {
        this.$router.push({
            name: this.PageName.EMPTY_CHAT_PAGE,
        });
    }

    onClickChatItem(chat: IChat) {
        this.$router.replace({
            name: this.PageName.CHAT_PAGE,
            params: {
                id: chat._id,
            },
        });
    }

    openCreateChatDialog() {
        chatModule.setIsShowCreateChatDialog(true);
    }

    goToNotificationPage() {
        this.$router.push({
            name: this.PageName.NOTIFICATION_PAGE,
        });
    }

    registerNotificationEvents() {
        if (!this.shouldRegisterSocket) return;
        SocketProvider.socket.on(SocketEvent.USER_NOTIFICATION, (notification: INotification) => {
            notificationModule.notificationList.unshift(notification);
            this.showSuccessNotificationFunction(generateNotificationMessageContent(notification));
            notificationModule.incUnreadNotificationCount(1);

            if (notification.urgent) {
                if (notification.targetType === NotificationTargetType.SYSTEM_MESSAGE) {
                    appModule.setSystemMessageParameters(notification.additionalData || {});
                    appModule.setSystemMessage(notification.target as ISystemMessage);
                    appModule.setIsShowSystemMessageDialog(true);
                } else if (notification.targetType === NotificationTargetType.SURVEY) {
                    appModule.setSurvey(notification.target as ISurvey);
                    appModule.setIsShowSurveyDialog(true);
                }
            }
        });
    }

    unmounted(): void {
        SocketProvider.socket.off(SocketEvent.USER_NOTIFICATION);
    }
}
</script>

<style lang="scss" scoped>
.account-menu-wrapper {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;

    .chat-btn {
        cursor: pointer;
    }

    :deep(.notification-list-dialog) {
        .notification-list-menu {
            .see-more {
                margin-top: 8px;
                .el-button {
                    width: 100%;
                }
            }

            .notification-list-wrapper {
                max-height: 500px;
                overflow: hidden;
            }
        }
    }

    :deep(.chat-list-dialog) {
        .chat-list {
            max-height: 500px;

            .see-more {
                margin-top: 8px;
                .el-button {
                    width: 100%;
                }
            }
        }
    }
}

p {
    margin-bottom: 0px;
}
hr {
    margin: 0;
    color: $color-black-3;
}
.router-link {
    text-decoration: none;
}
.user-info {
    justify-content: space-between;
    align-items: center;
    color: $color-black;
    gap: 8px;

    cursor: pointer;

    p {
        max-width: 150px;
        color: #1d1d1d;
    }
}
:deep(.dropdown-item) {
    border-radius: 12px;
}
:deep(.dropdown-item:hover) {
    font-weight: 700;
    background-color: $color-white !important;
    color: $color-green !important;
}
:deep(.dropdown-item:focus) {
    font-weight: 700;
    background-color: $color-white !important;
    color: $color-green !important;
}
:deep(.dropdown-item:active) {
    font-weight: 700;
    background-color: $color-white !important;
    color: $color-green !important;
}
ul {
    border-radius: 12px;
    width: 180px;
    padding: 0;
}
:deep(.el-dropdown-menu__item) {
    height: 36px;
    display: flex;
}
</style>
