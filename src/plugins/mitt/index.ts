import { IPost } from '@/common/interfaces';
import { GroupDetailScreenTab } from '@/pages/group-detail/constants';
import { ProfileScreenTab } from '@/pages/profile/constants';
import mitt from 'mitt';

export enum EventName {
    CHANGE_PROFILE_SCREEN_TAB = 'CHANGE_PROFILE_SCREEN_TAB',
    CHANGE_GROUP_DETAIL_SCREEN_TAB = 'CHANGE_GROUP_DETAIL_SCREEN_TAB',
    USER_CHAT = 'USER_CHAT',
    POST_CREATED = 'POST_CREATED',
}

export type Events = {
    [EventName.CHANGE_PROFILE_SCREEN_TAB]: ProfileScreenTab;
    [EventName.CHANGE_GROUP_DETAIL_SCREEN_TAB]: GroupDetailScreenTab;
    [EventName.USER_CHAT]: void;
    [EventName.POST_CREATED]: IPost;
};

export const EventEmitter = mitt<Events>();
