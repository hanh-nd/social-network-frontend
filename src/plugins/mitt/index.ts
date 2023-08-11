import { IGroupPost, IPost } from '@/common/interfaces';
import { GroupDetailScreenTab } from '@/pages/group-detail/constants';
import { FeedScreenType } from '@/pages/home/constants';
import { ProfileScreenTab } from '@/pages/profile/constants';
import mitt from 'mitt';

export enum EventName {
    CHANGE_PROFILE_SCREEN_TAB = 'CHANGE_PROFILE_SCREEN_TAB',
    CHANGE_GROUP_DETAIL_SCREEN_TAB = 'CHANGE_GROUP_DETAIL_SCREEN_TAB',
    USER_CHAT = 'USER_CHAT',
    POST_CREATED = 'POST_CREATED',
    GROUP_POST_CREATED = 'GROUP_POST_CREATED',
    CHANGE_HOME_FEED_SCREEN_TAB = 'CHANGE_HOME_FEED_SCREEN_TAB',
}

export type Events = {
    [EventName.CHANGE_PROFILE_SCREEN_TAB]: ProfileScreenTab;
    [EventName.CHANGE_GROUP_DETAIL_SCREEN_TAB]: GroupDetailScreenTab;
    [EventName.USER_CHAT]: void;
    [EventName.POST_CREATED]: IPost;
    [EventName.GROUP_POST_CREATED]: IGroupPost;
    [EventName.CHANGE_HOME_FEED_SCREEN_TAB]: FeedScreenType;
};

export const EventEmitter = mitt<Events>();
