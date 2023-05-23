import { IMessage } from '@/pages/chat/interfaces';
import { GroupDetailScreenTab } from '@/pages/group-detail/constants';
import { ProfileScreenTab } from '@/pages/profile/constants';
import mitt from 'mitt';

export enum EventName {
    CHANGE_PROFILE_SCREEN_TAB = 'CHANGE_PROFILE_SCREEN_TAB',
    CHANGE_GROUP_DETAIL_SCREEN_TAB = 'CHANGE_GROUP_DETAIL_SCREEN_TAB',
    USER_CHAT = 'USER_CHAT',
}

export type Events = {
    [EventName.CHANGE_PROFILE_SCREEN_TAB]: ProfileScreenTab;
    [EventName.CHANGE_GROUP_DETAIL_SCREEN_TAB]: GroupDetailScreenTab;
    [EventName.USER_CHAT]: {
        chatId: string;
        message: IMessage;
    };
};

export const EventEmitter = mitt<Events>();
