import { INotification } from '@/common/interfaces';
import notificationApiService from '@/common/service/notification.api.service';
import store from '@/plugins/vuex';
import { cloneDeep } from 'lodash';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { INIT_GET_NOTIFICATION_LIST_QUERY } from './constants';
import { IGetNotificationListQuery } from './interfaces';

@Module({
    name: 'notification',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class NotificationModule extends VuexModule {
    notificationList: INotification[] = [];
    notificationListQuery: IGetNotificationListQuery = cloneDeep(INIT_GET_NOTIFICATION_LIST_QUERY);
    isFetchedAllNotificationList = false;

    @Action
    async getNotifications({ append = false }: { append?: boolean } = { append: false }) {
        const response = await notificationApiService.getNotifications(this.notificationListQuery);
        if (response?.success) {
            const data = response?.data || [];
            if (!data.length) {
                this.SET_IS_FETCHED_ALL_NOTIFICATION_LIST(true);
            }
            if (append) {
                this.APPEND_NOTIFICATIONS(data);
            } else {
                this.SET_NOTIFICATIONS(data);
            }
        } else {
            this.SET_IS_FETCHED_ALL_NOTIFICATION_LIST(true);
            if (append) {
                this.APPEND_NOTIFICATIONS([]);
            } else {
                this.SET_NOTIFICATIONS([]);
            }
        }
    }

    @Mutation
    APPEND_NOTIFICATIONS(notificationList: INotification[]) {
        this.notificationList.push(...notificationList);
    }

    @Mutation
    SET_NOTIFICATIONS(notificationList: INotification[]) {
        this.notificationList = notificationList;
    }

    @Action
    setIsFetchedAllNotificationList(isFetchedAllNotificationList: boolean) {
        this.SET_IS_FETCHED_ALL_NOTIFICATION_LIST(isFetchedAllNotificationList);
    }

    @Mutation
    SET_IS_FETCHED_ALL_NOTIFICATION_LIST(isFetchedAllNotificationList: boolean) {
        this.isFetchedAllNotificationList = isFetchedAllNotificationList;
    }

    @Action
    setNotificationListQuery(notificationListQuery: IGetNotificationListQuery) {
        this.SET_NOTIFICATION_LIST_QUERY(notificationListQuery);
    }

    @Action
    resetNotificationListQuery() {
        this.SET_NOTIFICATION_LIST_QUERY(cloneDeep(INIT_GET_NOTIFICATION_LIST_QUERY));
    }

    @Mutation
    SET_NOTIFICATION_LIST_QUERY(notificationListQuery: IGetNotificationListQuery) {
        this.notificationListQuery = {
            ...this.notificationListQuery,
            ...notificationListQuery,
        };
    }
}

export const notificationModule = getModule(NotificationModule);
